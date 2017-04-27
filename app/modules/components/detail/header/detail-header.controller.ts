/*
 * Copyright (C) 2014-2015 Taiga Agile LLC <taiga@taiga.io>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * File: story-header.controller.coffee
 */

import * as angular from "angular";
import * as _ from "lodash";

export class StoryHeaderController {
    rootScope: angular.IScope;
    confirm: any;
    modelTransform: any;
    navUrls: any;
    window: any;
    editMode: any;
    loadingSubject: any;
    originalSubject: any;
    item: any;
    project: any;
    previousUrl: any;
    nextUrl: any;
    permissions: any;
    requiredPerm: any;

    static initClass() {
        this.$inject = [
            "$rootScope",
            "$tgConfirm",
            "$tgQueueModelTransformation",
            "$tgNavUrls",
            "$window",
        ];
    }

    constructor(rootScope, confirm, modelTransform, navUrls, window) {
        this.rootScope = rootScope;
        this.confirm = confirm;
        this.modelTransform = modelTransform;
        this.navUrls = navUrls;
        this.window = window;
        this.editMode = false;
        this.loadingSubject = false;
        this.originalSubject = this.item.subject;
    }

    _checkNav() {
        let ctx;
        if ((this.item.neighbors.previous != null ? this.item.neighbors.previous.ref : undefined) != null) {
            ctx = {
                project: this.project.slug,
                ref: this.item.neighbors.previous.ref,
            };
            this.previousUrl = this.navUrls.resolve(`project-${this.item._name}-detail`, ctx);
        }

        if ((this.item.neighbors.next != null ? this.item.neighbors.next.ref : undefined) != null) {
            ctx = {
                project: this.project.slug,
                ref: this.item.neighbors.next.ref,
            };
            return this.nextUrl = this.navUrls.resolve(`project-${this.item._name}-detail`, ctx);
        }
    }

    _checkPermissions() {
        return this.permissions = {
            canEdit: _.includes(this.project.my_permissions, this.requiredPerm),
        };
    }

    editSubject(value) {
        const selection = this.window.getSelection();
        if (selection.type !== "Range") {
            if (value) {
                this.editMode = true;
            }
            if (!value) {
                return this.editMode = false;
            }
        }
    }

    onKeyDown(event) {
        if (event.which === 13) {
            this.saveSubject();
        }

        if (event.which === 27) {
            this.item.subject = this.originalSubject;
            return this.editSubject(false);
        }
    }

    saveSubject() {
        const onEditSubjectSuccess = () => {
            this.loadingSubject = false;
            this.rootScope.$broadcast("object:updated");
            this.confirm.notify("success");
            return this.originalSubject = this.item.subject;
        };

        const onEditSubjectError = () => {
            this.loadingSubject = false;
            return this.confirm.notify("error");
        };

        this.editMode = false;
        this.loadingSubject = true;
        const { item } = this;
        const transform = this.modelTransform.save((item) => item);
        return transform.then(onEditSubjectSuccess, onEditSubjectError);
    }
}
StoryHeaderController.initClass();

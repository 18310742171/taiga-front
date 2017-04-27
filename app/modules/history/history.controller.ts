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
 * File: history.controller.coffee
 */

import * as angular from "angular";
import * as _ from "lodash";

export class HistorySectionController {
    rs: any;
    repo: any;
    storage: any;
    projectService: any;
    editing: any;
    deleting: any;
    editMode: any;
    viewComments: any;
    reverse: any;
    name: any;
    id: any;
    type: any;
    comments: any;
    commentsNum: any;
    activities: any;
    activitiesNum: any;

    static initClass() {
        this.$inject = [
            "$tgResources",
            "$tgRepo",
            "$tgStorage",
            "tgProjectService",
        ];
    }

    constructor(rs, repo, storage, projectService) {
        this.rs = rs;
        this.repo = repo;
        this.storage = storage;
        this.projectService = projectService;
        this.editing = null;
        this.deleting = null;
        this.editMode = {};
        this.viewComments = true;
        this.reverse = this.storage.get("orderComments");
        this._loadHistory();
    }

    _loadHistory() {
        return this.rs.history.get(this.name, this.id).then((history) => {
            this._getComments(history);
            return this._getActivities(history);
        });
    }

    _getComments(comments) {
        this.comments = _.filter(comments, (item: any) => item.comment !== "");
        if (this.reverse) {
            this.comments = _.reverse(this.comments);
        }
        return this.commentsNum = this.comments.length;
    }

    _getActivities(activities) {
        this.activities =  _.filter(activities, (item: any) => Object.keys(item.values_diff).length > 0);
        return this.activitiesNum = this.activities.length;
    }

    showHistorySection() {
        return this.showCommentTab() || this.showActivityTab();
    }

    showCommentTab() {
        return (this.commentsNum > 0) || this.projectService.hasPermission(`comment_${this.name}`);
    }

    showActivityTab() {
        return this.activitiesNum > 0;
    }

    toggleEditMode(commentId) {
        return this.editMode[commentId] = !this.editMode[commentId];
    }

    onActiveHistoryTab(active) {
        return this.viewComments = active;
    }

    deleteComment(commentId) {
        const type = this.name;
        const objectId = this.id;
        const activityId = commentId;
        this.deleting = commentId;
        return this.rs.history.deleteComment(type, objectId, activityId).then(() => {
            this._loadHistory();
            return this.deleting = null;
        });
    }

    editComment(commentId, comment) {
        const type = this.name;
        const objectId = this.id;
        const activityId = commentId;
        this.editing = commentId;
        return this.rs.history.editComment(type, objectId, activityId, comment).then(() => {
            this._loadHistory();
            this.toggleEditMode(commentId);
            return this.editing = null;
        });
    }

    restoreDeletedComment(commentId) {
        const type = this.name;
        const objectId = this.id;
        const activityId = commentId;
        this.editing = commentId;
        return this.rs.history.undeleteComment(type, objectId, activityId).then(() => {
            this._loadHistory();
            return this.editing = null;
        });
    }

    addComment(cb) {
        return this.repo.save(this.type).then(() => {
            this._loadHistory();
            return cb();
        });
    }

    onOrderComments() {
        this.reverse = !this.reverse;
        this.storage.set("orderComments", this.reverse);
        return this._loadHistory();
    }
}
HistorySectionController.initClass();

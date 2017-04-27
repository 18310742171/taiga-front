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
 * File: attchment.controller.spec.coffee
 */

declare var angular: any;
const module = angular.mock.module;
declare var describe: any;
declare var it: any;
declare var beforeEach: any;
declare var inject: any;
declare var expect: any;
declare var sinon: any;
// declare var sinon:any;
import * as Immutable from "immutable";

describe("AttachmentController", function() {
    let $provide = null;
    let $controller = null;
    let scope = null;
    const mocks: any = {};

    const _mockAttachmentsService = function() {
        mocks.attachmentsService = {};

        return $provide.value("tgAttachmentsService", mocks.attachmentsService);
    };

    const _mockTranslate = function() {
        mocks.translate = {
            instant: sinon.stub(),
        };

        return $provide.value("$translate", mocks.translate);
    };

    const _mocks = () =>
        module(function(_$provide_) {
            $provide = _$provide_;

            _mockAttachmentsService();
            _mockTranslate();

            return null;
        })
    ;

    const _inject = () =>
        inject(function(_$controller_, $rootScope) {
            $controller = _$controller_;
            return scope = $rootScope.$new();
        })
    ;

    const _setup = function() {
        _mocks();
        return _inject();
    };

    beforeEach(function() {
        module("taigaComponents");

        return _setup();
    });

    it("change edit mode", function() {
        const attachment = Immutable.fromJS({
            file: {
                description: "desc",
                is_deprecated: false,
            },
        });

        const ctrl = $controller("Attachment", {
            $scope: scope,
        }, {
            attachment,
        });

        ctrl.onUpdate = sinon.spy();

        const onUpdate = sinon.match(function(value) {
            value = value.attachment.toJS();

            return value.editable;
        }

        , "onUpdate");

        ctrl.editMode(true);

        return expect(ctrl.onUpdate).to.be.calledWith(onUpdate);
    });

    it("delete", function() {
        const attachment = Immutable.fromJS({
            file: {
                description: "desc",
                is_deprecated: false,
            },
        });

        const ctrl = $controller("Attachment", {
            $scope: scope,
        }, {
            attachment,
        });

        ctrl.onDelete = sinon.spy();

        const onDelete = sinon.match((value) => value.attachment === attachment
        , "onDelete");

        ctrl.delete();

        return expect(ctrl.onDelete).to.be.calledWith(onDelete);
    });

    return it("save", function() {
        let attachment = Immutable.fromJS({
            file: {
                description: "desc",
                is_deprecated: false,
            },
            loading: false,
            editable: false,
        });

        const ctrl = $controller("Attachment", {
            $scope: scope,
        }, {
            attachment,
        });

        ctrl.onUpdate = sinon.spy();

        const onUpdateLoading = sinon.match(function(value) {
            value = value.attachment.toJS();

            return value.loading;
        }
        , "onUpdateLoading");

        const onUpdate = sinon.match(function(value) {
            value = value.attachment.toJS();

            return (
                (value.file.description === "ok") &&
                value.file.is_deprecated
            );
        }
        , "onUpdate");

        ctrl.form = {
            description: "ok",
            is_deprecated: true,
        };

        ctrl.save();

        attachment = ctrl.attachment.toJS();

        expect(ctrl.onUpdate).to.be.calledWith(onUpdateLoading);
        return expect(ctrl.onUpdate).to.be.calledWith(onUpdate);
    });
});

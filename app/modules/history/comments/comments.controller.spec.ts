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
 * File: comments.controller.spec.coffee
 */

declare var describe: any;
declare var angular: any;
const module = angular.mock.module;
declare var inject: any;
declare var it: any;
declare var expect: any;
declare var beforeEach: any;
import * as Immutable from "immutable";
declare var sinon: any;

describe("CommentsController", function() {
    let provide = null;
    let controller = null;
    const mocks: any = {};

    const _mocks = () =>
        module(function($provide) {
            provide = $provide;
            return null;
        })
    ;

    beforeEach(function() {
        module("taigaHistory");
        _mocks();

        return inject(($controller) => controller = $controller);
    });

    return it("set can add comment permission", function() {
        const commentsCtrl = controller("CommentsCtrl");
        commentsCtrl.name = "us";
        commentsCtrl.initializePermissions();
        return expect(commentsCtrl.canAddCommentPermission).to.be.equal("comment_us");
    });
});

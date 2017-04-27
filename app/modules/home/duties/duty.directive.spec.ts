/*
 * Copyright (C) 2014-2017 Taiga Agile LLC <taiga@taiga.io>
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
 * File: duty.directive.spec.coffee
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

describe("dutyDirective", function() {
    let compile, provide;
    let scope = (compile = (provide = null));
    let mockTgProjectsService = null;
    let mockTgNavUrls = null;
    let mockTranslate = null;
    const template = "<div tg-duty='duty'></div>";

    const createDirective = function() {
        const elm = compile(template)(scope);
        return elm;
    };

    const _mockTgNavUrls = function() {
        mockTgNavUrls = {
            resolve: sinon.stub(),
        };
        return provide.value("$tgNavUrls", mockTgNavUrls);
    };

    const _mockTranslateFilter = function() {
        const mockTranslateFilter = (value) => value;
        return provide.value("translateFilter", mockTranslateFilter);
    };

    const _mockTgProjectsService = function() {
        mockTgProjectsService = {
            projectsById: {
                get: sinon.stub(),
            },
        };
        return provide.value("tgProjectsService", mockTgProjectsService);
    };

    const _mockTranslate = function() {
        mockTranslate = {
            instant: sinon.stub(),
        };
        return provide.value("$translate", mockTranslate);
    };

    const _mocks = () =>
        module(function($provide) {
            provide = $provide;
            _mockTgNavUrls();
            _mockTgProjectsService();
            _mockTranslate();
            _mockTranslateFilter();
            return null;
        })
    ;

    beforeEach(function() {
        module("templates");
        module("taigaHome");

        _mocks();

        return inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            return compile = $compile;
        });
    });

    return it("duty directive scope content", function() {
        scope.duty = Immutable.fromJS({
            project: 1,
            ref: 1,
            _name: "userstories",
            assigned_to_extra_info: {
                photo: "http://jstesting.taiga.io/photo",
                full_name_display: "Taiga testing js",
            },
        });

        mockTgProjectsService.projectsById.get
            .withArgs("1")
            .returns({slug: "project-slug", name: "testing js project"});

        mockTgNavUrls.resolve
            .withArgs("project-userstories-detail", {project: "project-slug", ref: 1})
            .returns("http://jstesting.taiga.io");

        mockTranslate.instant
            .withArgs("COMMON.USER_STORY")
            .returns("User story translated");

        const elm = createDirective();
        scope.$apply();

        return expect(elm.isolateScope().vm.getDutyType()).to.be.equal("User story translated");
    });
});

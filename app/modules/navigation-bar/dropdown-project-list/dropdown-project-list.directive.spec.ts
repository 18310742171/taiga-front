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
 * File: dropdown-project-list.directive.spec.coffee
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

describe("dropdownProjectListDirective", function() {
    let compile, provide;
    let scope = (compile = (provide = null));
    const mocks: any = {};
    const template = "<div tg-dropdown-project-list></div>";
    const recents = [];

    const projects = Immutable.fromJS({
        recents: [
            {id: 1},
            {id: 2},
            {id: 3},
        ],
    });

    const _mockTranslateFilter = function() {
        const mockTranslateFilter = (value) => value;
        return provide.value("translateFilter", mockTranslateFilter);
    };

    const createDirective = function() {
        const elm = compile(template)(scope);
        return elm;
    };

    const _mockTgProjectsService = function() {
        mocks.projectsService = {
            newProject: sinon.stub(),
        };
        return provide.value("tgProjectsService", mocks.projectsService);
    };

    const _mockTgCurrentUserService = function() {
        mocks.currentUserService = {
            projects,
        };
        return provide.value("tgCurrentUserService", mocks.currentUserService);
    };

    const _mocks = () =>
        module(function($provide) {
            provide = $provide;
            _mockTgProjectsService();
            _mockTgCurrentUserService();
            _mockTranslateFilter();

            return null;
        })
    ;

    beforeEach(function() {
        module("templates");
        module("taigaNavigationBar");

        _mocks();

        return inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            return compile = $compile;
        });
    });

    return it("dropdown project list directive scope content", function() {
        const elm = createDirective();
        scope.$apply();
        return expect(elm.isolateScope().vm.projects.size).to.be.equal(3);
    });
});

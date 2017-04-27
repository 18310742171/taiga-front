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
 * File: profile-hints.controller.spec.coffee
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

describe("ProfileHints", function() {
    let $controller = null;
    let $provide = null;

    const mocks: any = {};

    const _mockTranslate = function() {
        mocks.translateService = {};
        mocks.translateService.instant = sinon.stub();

        return $provide.value("$translate", mocks.translateService);
    };

    const _mocks = () =>
        module(function(_$provide_) {
            $provide = _$provide_;
            _mockTranslate();

            return null;
        })
    ;

    beforeEach(function() {
        module("taigaProfile");
        _mocks();

        return inject((_$controller_) => $controller = _$controller_);
    });

    return it("random hint generator", function(done) {
        mocks.translateService.instant.returns("fill");

        const ctrl = $controller("ProfileHints");

        return setTimeout(( function() {
                expect(ctrl.hint.title).to.be.equal("fill");
                expect(ctrl.hint.text).to.be.equal("fill");
                expect(ctrl.hint.linkText).to.have.length.above(1);
                return done();
        }),
        );
    });
});

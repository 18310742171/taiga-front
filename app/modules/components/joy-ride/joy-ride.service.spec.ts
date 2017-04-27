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
 * File: joy-ride.service.spec.coffee
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

describe("tgJoyRideService", function() {
    let provide;
    let joyRideService = (provide = null);
    const mocks: any = {};

    const _mockTranslate = function() {
        mocks.translate = {
            instant: sinon.stub(),
        };

        return provide.value("$translate", mocks.translate);
    };

    const _mockCheckPermissionsService = function() {
        mocks.checkPermissionsService = {
            check: sinon.stub(),
        };

        mocks.checkPermissionsService.check.returns(true);

        return provide.value("tgCheckPermissionsService", mocks.checkPermissionsService);
    };

    const _inject = (callback= null) =>
        inject(function(_tgJoyRideService_) {
            joyRideService = _tgJoyRideService_;
            if (callback) { return callback(); }
        })
    ;

    const _mocks = () =>
        module(function($provide) {
            provide = $provide;
            _mockTranslate();
            _mockCheckPermissionsService();
            return null;
        })
    ;

    const _setup = () => _mocks();

    beforeEach(function() {
        module("taigaComponents");
        _setup();
        return _inject();
    });

    return it("get joyride by category", function() {
        const example = {
            element: ".project-list > section:not(.ng-hide)",
            position: "left",
            joyride: {
                title: "test",
                text: "test",
            },
            intro: "<h3>test</h3><p>test</p>",
        };

        mocks.translate.instant.returns("test");

        const joyRide = joyRideService.get("dashboard");

        expect(joyRide).to.have.length(4);
        return expect(joyRide[0]).to.be.eql(example);
    });
});

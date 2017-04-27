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
 * File: external-app.service.spec.coffee
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

describe("tgExternalAppsService", function() {
    let provide;
    let externalAppsService = (provide = null);
    const mocks: any = {};

    const _mockTgResources = function() {
        mocks.tgResources = {
            externalapps: {
                getApplicationToken: sinon.stub(),
                authorizeApplicationToken: sinon.stub(),
            },
        };

        return provide.value("tgResources", mocks.tgResources);
    };

    const _inject = (callback= null) =>
        inject(function(_tgExternalAppsService_) {
            externalAppsService = _tgExternalAppsService_;
            if (callback) { return callback(); }
        })
    ;

    const _mocks = () =>
        module(function($provide) {
            provide = $provide;
            _mockTgResources();
            return null;
        })
    ;

    const _setup = () => _mocks();

    beforeEach(function() {
        module("taigaExternalApps");
        _setup();
        return _inject();
    });

    it("getApplicationToken", function() {
        expect(mocks.tgResources.externalapps.getApplicationToken.callCount).to.be.equal(0);
        externalAppsService.getApplicationToken(6, "testing-state");
        expect(mocks.tgResources.externalapps.getApplicationToken.callCount).to.be.equal(1);
        return expect(mocks.tgResources.externalapps.getApplicationToken.calledWith(6, "testing-state")).to.be.true;
    });

    return it("authorizeApplicationToken", function() {
        expect(mocks.tgResources.externalapps.authorizeApplicationToken.callCount).to.be.equal(0);
        externalAppsService.authorizeApplicationToken(6, "testing-state");
        expect(mocks.tgResources.externalapps.authorizeApplicationToken.callCount).to.be.equal(1);
        return expect(mocks.tgResources.externalapps.authorizeApplicationToken.calledWith(6, "testing-state")).to.be.true;
    });
});

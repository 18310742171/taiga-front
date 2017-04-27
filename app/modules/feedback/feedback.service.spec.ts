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
 * File: feedback.service.spec.coffee
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

describe("tgFeedbackService", function() {
    let provide;
    let feedbackService = (provide = null);
    const mocks: any = {};

    const _mockTgLightboxFactory = function() {
        mocks.tgLightboxFactory = {
            create: sinon.stub(),
        };

        return provide.value("tgLightboxFactory", mocks.tgLightboxFactory);
    };

    const _inject = (callback= null) =>
        inject(function(_tgFeedbackService_) {
            feedbackService = _tgFeedbackService_;
            if (callback) { return callback(); }
        })
    ;

    const _mocks = () =>
        module(function($provide) {
            provide = $provide;
            _mockTgLightboxFactory();
            return null;
        })
    ;

    const _setup = () => _mocks();

    beforeEach(function() {
        module("taigaFeedback");
        _setup();
        return _inject();
    });

    return it("work in progress filled", function() {
        expect(mocks.tgLightboxFactory.create.callCount).to.be.equal(0);
        feedbackService.sendFeedback();
        expect(mocks.tgLightboxFactory.create.callCount).to.be.equal(1);
        const params = {
            class: "lightbox lightbox-feedback lightbox-generic-form",
        };
        return expect(mocks.tgLightboxFactory.create.calledWith("tg-lb-feedback", params)).to.be.true;
    });
});

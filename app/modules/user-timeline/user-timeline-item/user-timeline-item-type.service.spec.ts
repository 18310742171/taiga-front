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
 * File: user-timeline-item-type.service.spec.coffee
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

describe("tgUserTimelineItemType", function() {
    let mySvc = null;

    const _provide = (callback) =>
        module(function($provide) {
            callback($provide);
            return null;
        })
    ;

    const _inject = () =>
        inject((_tgUserTimelineItemType_) => mySvc = _tgUserTimelineItemType_)
    ;

    const _setup = () => _inject();

    beforeEach(function() {
        module("taigaUserTimeline");
        return _setup();
    });

    return it("get the timeline type", function() {
        const timeline = {
            data: {},
        };

        const event = {
            obj: "membership",
        };

        const type = mySvc.getType(timeline, event);

        return expect(type.key).to.be.equal("TIMELINE.NEW_MEMBER");
    });
});

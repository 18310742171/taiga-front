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
 * File: user-timeline-pagination-sequence.service.spec.coffee
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

describe("tgUserTimelinePaginationSequenceService", function() {
    let userTimelinePaginationSequenceService = null;

    const _inject = () =>
        inject((_tgUserTimelinePaginationSequenceService_) => userTimelinePaginationSequenceService = _tgUserTimelinePaginationSequenceService_)
    ;

    beforeEach(function() {
        module("taigaUserTimeline");
        return _inject();
    });

    it("get remote items to reach the min", function(done) {
        const config: any = {};

        const page1 = Immutable.Map({
            next: true,
            data: [1, 2, 3],
        });
        const page2 = Immutable.Map({
            next: true,
            data: [4, 5],
        });
        const page3 = Immutable.Map({
            next: true,
            data: [6, 7, 8, 9, 10, 11],
        });

        const promise = sinon.stub();
        (promise.withArgs(1) as any).promise().resolve(page1);
        (promise.withArgs(2) as any).promise().resolve(page2);
        (promise.withArgs(3) as any).promise().resolve(page3);

        config.fetch = (page) => promise(page);

        config.minItems = 10;

        const seq = userTimelinePaginationSequenceService.generate(config);

        return seq.next().then(function(result) {
            result = result.toJS();

            expect(result.items).to.have.length(11);
            expect(result.next).to.be.true;

            return done();
        });
    });

    it("get items until the last page", function(done) {
        const config: any = {};

        const page1 = Immutable.Map({
            next: true,
            data: [1, 2, 3],
        });
        const page2 = Immutable.Map({
            next: false,
            data: [4, 5],
        });

        const promise = sinon.stub();
        (promise.withArgs(1) as any).promise().resolve(page1);
        (promise.withArgs(2) as any).promise().resolve(page2);

        config.fetch = (page) => promise(page);

        config.minItems = 10;

        const seq = userTimelinePaginationSequenceService.generate(config);

        return seq.next().then(function(result) {
            result = result.toJS();

            expect(result.items).to.have.length(5);
            expect(result.next).to.be.false;

            return done();
        });
    });

    it("increase pagination every page call", function(done) {
        const config: any = {};

        const page1 = Immutable.Map({
            next: true,
            data: [1, 2, 3],
        });
        const page2 = Immutable.Map({
            next: true,
            data: [4, 5],
        });

        const promise = sinon.stub();
        (promise.withArgs(1) as any).promise().resolve(page1);
        (promise.withArgs(2) as any).promise().resolve(page2);

        config.fetch = (page) => promise(page);

        config.minItems = 2;

        const seq = userTimelinePaginationSequenceService.generate(config);

        return seq.next().then(() =>
            seq.next().then(function(result) {
                result = result.toJS();

                expect(result.items).to.have.length(2);
                expect(result.next).to.be.true;

                return done();
            }),
        );
    });

    return it("map items", function(done) {
        const config: any = {};

        const page1 = Immutable.Map({
            next: false,
            data: [1, 2, 3],
        });

        const promise = sinon.stub();
        (promise.withArgs(1) as any).promise().resolve(page1);

        config.fetch = (page) => promise(page);

        config.minItems = 1;

        config.map = (item) => item + 1;

        const seq = userTimelinePaginationSequenceService.generate(config);

        return seq.next().then(function(result) {
            result = result.toJS();

            expect(result.items).to.be.eql([2, 3, 4]);

            return done();
        });
    });
});

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
 * File: wiki-history.service.spec.coffee
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

describe("tgWikiHistoryService", function() {
    let $provide = null;
    let wikiHistoryService = null;
    const mocks: any = {};

    const _mockTgResources = function() {
        mocks.tgResources = {
            wikiHistory: {
                getWikiHistory: sinon.stub(),
            },
        };
        return $provide.value("tgResources", mocks.tgResources);
    };

    const _mockXhrErrorService = function() {
        mocks.xhrErrorService = {
            response: sinon.stub(),
        };

        return $provide.value("tgXhrErrorService", mocks.xhrErrorService);
    };

    const _mocks = () =>
        module(function(_$provide_) {
            $provide = _$provide_;

            _mockTgResources();
            _mockXhrErrorService();

            return null;
        })
    ;

    const _inject = () =>
        inject((_tgWikiHistoryService_) => wikiHistoryService = _tgWikiHistoryService_)
    ;

    const _setup = function() {
        _mocks();
        return _inject();
    };

    beforeEach(function() {
        module("taigaWikiHistory");

        return _setup();
    });

    it("populate history entries", function(done) {
        const wikiId = 42;
        const historyEntries = Immutable.List([
            {id: 1, name: "history entrie 1"},
            {id: 2, name: "history entrie 2"},
            {id: 3, name: "history entrie 3"},
        ]);

        mocks.tgResources.wikiHistory.getWikiHistory.withArgs(wikiId).promise().resolve(historyEntries);

        wikiHistoryService.setWikiId(wikiId);
        expect(wikiHistoryService.wikiId).to.be.equal(wikiId);

        expect(wikiHistoryService.historyEntries.size).to.be.equal(0);
        return wikiHistoryService.loadHistoryEntries().then(function() {
            expect(wikiHistoryService.historyEntries.size).to.be.equal(3);
            return done();
        });
    });

    return it("reset history entries if wikiId change", function() {
        const wikiId = 42;

        wikiHistoryService._historyEntries = Immutable.List([
            {id: 1, name: "history entrie 1"},
            {id: 2, name: "history entrie 2"},
            {id: 3, name: "history entrie 3"},
        ]);

        expect(wikiHistoryService.historyEntries.size).to.be.equal(3);
        wikiHistoryService.setWikiId(wikiId);
        return expect(wikiHistoryService.historyEntries.size).to.be.equal(0);
    });
});

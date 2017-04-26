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
 * File: filter.controller.coffee
 */

import * as _ from "lodash";
import {Component, Output, EventEmitter, Input} from "@angular/core";
import {Store} from "@ngrx/store";
import {IState} from "../../../app.store";

@Component({
    selector: "tg-filter",
    template: require("./filter.jade")(),
})
export class Filter {
    @Input() appliedFilters: any;
    @Input() section: string;
    @Input() filters: any;
    @Output() filter: EventEmitter<any>;

    constructor(private store: Store<IState>) {
        this.filter = new EventEmitter();
    }

    changeQ(q) {
        console.log(q);
    }

    // toggleFilterCategory(filterName) {
    //     if (this.opened === filterName) {
    //         return this.opened = null;
    //     } else {
    //         return this.opened = filterName;
    //     }
    // }
    //
    // saveCustomFilter() {
    //     this.onSaveCustomFilter({name: this.customFilterName});
    //     this.customFilterForm = false;
    //     this.opened = 'custom-filter';
    //     return this.customFilterName = '';
    // }
    //
    // changeQ() {
    //     return this.onChangeQ({q: this.q});
    // }
    //
    // unselectFilter(filter) {
    //     return this.onRemoveFilter({filter});
    // }
    //
    //
    // selectFilter(filterCategory, filter) {
    //     filter = {
    //         category: filterCategory,
    //         filter
    //     };
    //
    //     return this.onAddFilter({filter});
    // }
    //
    // removeCustomFilter(filter) {
    //     return this.onRemoveCustomFilter({filter});
    // }
    //
    // selectCustomFilter(filter) {
    //     return this.onSelectCustomFilter({filter});
    // }
    //
    // isFilterSelected(filterCategory, filter) {
    //     return !!_.find(this.selectedFilters, (it:any) => (filter.id === it.id) && (filterCategory.dataType === it.dataType));
    // }
}

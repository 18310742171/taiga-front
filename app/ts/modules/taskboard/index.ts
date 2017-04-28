/*
 * Copyright (C) 2014-2017 Andrey Antukh <niwi@niwi.nz>
 * Copyright (C) 2014-2017 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014-2017 David Barragán Merino <bameda@dbarragan.com>
 * Copyright (C) 2014-2017 Alejandro Alonso <alejandro.alonso@kaleidos.net>
 * Copyright (C) 2014-2017 Juan Francisco Alcántara <juanfran.alcantara@kaleidos.net>
 * Copyright (C) 2014-2017 Xavi Julian <xavier.julian@kaleidos.net>
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
 * File: modules/taskboard.coffee
 */

import * as angular from "angular";
import {SprintGraphDirective} from "./charts";
import * as lightboxes from "./lightboxes";
import * as main from "./main";
import {TaskboardSortableDirective} from "./sortable";
import {TaskboardTasksService} from "./taskboard-tasks";

const module = angular.module("taigaTaskboard", []);
module.controller("TaskboardController", main.TaskboardController);
module.directive("tgTaskboard", ["$rootScope", main.TaskboardDirective]);
module.directive("tgTaskboardSquishColumn", ["$tgResources", main.TaskboardSquishColumnDirective]);
module.directive("tgSprintGraph", ["$translate", SprintGraphDirective]);

module.directive("tgLbCreateEditTask", ["$tgRepo", "$tgModel", "$tgResources", "$rootScope", "$tgLoading", "lightboxService", "$translate", "$q", "tgAttachmentsService", lightboxes.CreateEditTaskDirective]);
module.directive("tgLbCreateBulkTasks", ["$tgRepo", "$tgResources", "$rootScope", "$tgLoading", "lightboxService", "$tgModel", lightboxes.CreateBulkTasksDirective]);
module.directive("tgTaskboardSortable", ["$tgRepo", "$tgResources", "$rootScope", "$translate", "$tgConfirm", TaskboardSortableDirective]);
module.service("tgTaskboardTasks", TaskboardTasksService);

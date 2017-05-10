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
 * File: modules/taskboard/charts.coffee
 */

import * as angular from "angular";
import * as _ from "lodash";
import * as moment from "moment";
import {timeout} from "../../libs/utils";

//############################################################################
//# Sprint burndown graph directive
//############################################################################

export let SprintGraphDirective = function($translate){
    const redrawChart = function(element, dataToDraw) {
        const width = element.width();
        element.height(240);

        const days = _.map(dataToDraw, (x: any) => moment(new Date(x.day).getTime()));

        const data = [];
        data.unshift({
            data: _.zip(days, _.map(dataToDraw, (d: any) => d.optimal_points)),
            lines: {
                fillColor : "rgba(120,120,120,0.2)",
            },
        });
        data.unshift({
            data: _.zip(days, _.map(dataToDraw, (d: any) => d.open_points)),
            lines: {
                fillColor : "rgba(102,153,51,0.3)",
            },
        });

        const options = {
            grid: {
                borderWidth: { top: 0, right: 1, left: 0, bottom: 0 },
                borderColor: "#ccc",
                hoverable: true,
            },
            xaxis: {
                tickSize: [1, "day"],
                min: days[0],
                max: _.last(days),
                mode: "time",
                daysNames: days,
                axisLabel: $translate.instant("TASKBOARD.CHARTS.XAXIS_LABEL"),
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
                axisLabelPadding: 5,
            },
            yaxis: {
                min: 0,
                axisLabel: $translate.instant("TASKBOARD.CHARTS.YAXIS_LABEL"),
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: "Verdana, Arial, Helvetica, Tahoma, sans-serif",
                axisLabelPadding: 5,
            },
            series: {
                shadowSize: 0,
                lines: {
                    show: true,
                    fill: true,
                },
                points: {
                    show: true,
                    fill: true,
                    radius: 4,
                    lineWidth: 2,
                },
            },
            colors: ["rgba(102,153,51,1)", "rgba(120,120,120,0.2)"],
            tooltip: true,
            tooltipOpts: {
                content(label, xval, yval, flotItem) {
                    const formattedDate = moment(xval).format($translate.instant("TASKBOARD.CHARTS.DATE"));
                    const roundedValue = Math.round(yval);

                    if (flotItem.seriesIndex === 1) {
                        return $translate.instant("TASKBOARD.CHARTS.OPTIMAL", {
                            formattedDate,
                            roundedValue,
                        });

                    } else {
                        return $translate.instant("TASKBOARD.CHARTS.REAL", {
                            formattedDate,
                            roundedValue,
                        });
                    }
                },
            },
        };

        element.empty();
        return element.plot(data, options).data("plot");
    };

    const link = function($scope, $el, $attrs) {
        const element = angular.element($el);

        $scope.$on("resize", function() {
            if ($scope.stats) { return redrawChart(element, $scope.stats.days); }
        });

        $scope.$on("taskboard:graph:toggle-visibility", function() {
            $el.parent().toggleClass("open");

            // fix chart overflow
            return timeout(100, function() {
                if ($scope.stats) { return redrawChart(element, $scope.stats.days); }
            });
        });

        $scope.$watch("stats", function(value) {
            if (($scope.stats == null)) {
                return;
            }
            return redrawChart(element, $scope.stats.days);
        });

        return $scope.$on("$destroy", () => $el.off());
    };

    return {link};
};

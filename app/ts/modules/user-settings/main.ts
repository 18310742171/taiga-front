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
 * File: modules/user-settings/main.coffee
 */

import * as angular from "angular";
import {debounce, sizeFormat} from "../../libs/utils";
import {PageMixin} from "../controllerMixins";

//############################################################################
//# User settings Controller
//############################################################################

export class UserSettingsController extends PageMixin {
    scope: angular.IScope;
    rootscope: angular.IScope;
    config: any;
    repo: any;
    confirm: any;
    rs: any;
    params: any;
    q: any;
    location: any;
    navUrls: any;
    auth: any;
    translate: any;
    errorHandlingService: any;

    static initClass() {
        this.$inject = [
            "$scope",
            "$rootScope",
            "$tgConfig",
            "$tgRepo",
            "$tgConfirm",
            "$tgResources",
            "$routeParams",
            "$q",
            "$tgLocation",
            "$tgNavUrls",
            "$tgAuth",
            "$translate",
            "tgErrorHandlingService",
        ];
    }

    constructor(scope, rootscope, config, repo, confirm, rs, params, q, location, navUrls,
                auth, translate, errorHandlingService) {
        super();
        this.scope = scope;
        this.rootscope = rootscope;
        this.config = config;
        this.repo = repo;
        this.confirm = confirm;
        this.rs = rs;
        this.params = params;
        this.q = q;
        this.location = location;
        this.navUrls = navUrls;
        this.auth = auth;
        this.translate = translate;
        this.errorHandlingService = errorHandlingService;
        this.scope.sectionName = "USER_SETTINGS.MENU.SECTION_TITLE";

        this.scope.project = {};
        this.scope.user = this.auth.getUser();

        if (!this.scope.user) {
            this.errorHandlingService.permissionDenied();
        }

        this.scope.lang = this.getLan();
        this.scope.theme = this.getTheme();

        const maxFileSize = this.config.get("maxUploadFileSize", null);
        if (maxFileSize) {
            const text = this.translate.instant("USER_SETTINGS.AVATAR_MAX_SIZE", {maxFileSize: sizeFormat(maxFileSize)});
            this.scope.maxFileSizeMsg = text;
        }

        const promise = this.loadInitialData();

        promise.then(null, this.onInitialDataError.bind(this));
    }

    loadInitialData() {
        this.scope.availableThemes = this.config.get("themes", []);

        return this.rs.locales.list().then((locales) => {
            this.scope.locales = locales;
            return locales;
        });
    }

    openDeleteLightbox() {
        return this.rootscope.$broadcast("deletelightbox:new", this.scope.user);
    }

    getLan() {
        return this.scope.user.lang ||
               this.translate.preferredLanguage();
    }

    getTheme() {
        return this.scope.user.theme ||
               this.config.get("defaultTheme") ||
               "taiga";
    }
}
UserSettingsController.initClass();

//############################################################################
//# User Profile Directive
//############################################################################

export let UserProfileDirective = function($confirm, $auth, $repo, $translate) {
    const link = function($scope, $el, $attrs) {
        const submit = debounce(2000, (event) => {
            event.preventDefault();

            const form = $el.find("form").checksley();
            if (!form.validate()) { return; }

            const changeEmail = $scope.user.isAttributeModified("email");
            $scope.user.lang = $scope.lang;
            $scope.user.theme = $scope.theme;

            const onSuccess = (data) => {
                $auth.setUser(data);

                if (changeEmail) {
                    const text = $translate.instant("USER_PROFILE.CHANGE_EMAIL_SUCCESS");
                    return $confirm.success(text);
                } else {
                    return $confirm.notify("success");
                }
            };

            const onError = (data) => {
                form.setErrors(data);
                return $confirm.notify("error", data._error_message);
            };

            return $repo.save($scope.user).then(onSuccess, onError);
        });

        $el.on("submit", "form", submit);

        return $scope.$on("$destroy", () => $el.off());
    };

    return {link};
};

//############################################################################
//# User Avatar Directive
//############################################################################

export let UserAvatarDirective = function($auth, $model, $rs, $confirm) {
    const link = function($scope, $el, $attrs) {
        const showSizeInfo = () => $el.find(".size-info").removeClass("hidden");

        const onSuccess = function(response) {
            const user = $model.make_model("users", response.data);
            $auth.setUser(user);
            $scope.user = user;

            $el.find(".loading-overlay").removeClass("active");
            return $confirm.notify("success");
        };

        const onError = function(response) {
            if (response.status === 413) { showSizeInfo(); }
            $el.find(".loading-overlay").removeClass("active");
            return $confirm.notify("error", response.data._error_message);
        };

        // Change photo
        $el.on("click", ".js-change-avatar", () => $el.find("#avatar-field").click());

        $el.on("change", "#avatar-field", function(event) {
            if ($scope.avatarAttachment) {
                $el.find(".loading-overlay").addClass("active");
                return $rs.userSettings.changeAvatar($scope.avatarAttachment).then(onSuccess, onError);
            }
        });

        // Use gravatar photo
        $el.on("click", "a.js-use-gravatar", function(event) {
            $el.find(".loading-overlay").addClass("active");
            return $rs.userSettings.removeAvatar().then(onSuccess, onError);
        });

        return $scope.$on("$destroy", () => $el.off());
    };

    return {link};
};

//############################################################################
//# User Avatar Model Directive
//############################################################################

export let TaigaAvatarModelDirective = function($parse) {
    const link = function($scope, $el, $attrs) {
        const model = $parse($attrs.tgAvatarModel);
        const modelSetter = model.assign;

        return $el.bind("change", () =>
            $scope.$apply(() => modelSetter($scope, $el[0].files[0])),
        );
    };

    return {link};
};

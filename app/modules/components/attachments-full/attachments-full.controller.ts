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
 * File: attchments-full.controller.coffee
 */

import * as angular from "angular";
import * as _ from "lodash";
import {defineImmutableProperty, sizeFormat} from "../../../libs/utils";

export class AttachmentsFullController {
    translate: any;
    confirm: any;
    config: any;
    storage: any;
    attachmentsFullService: any;
    projectService: any;
    attachmentsPreviewService: any;
    mode: any;
    maxFileSize: any;
    maxFileSizeMsg: any;
    projectId: any;
    objId: any;
    type: any;
    editPermission: any;

    static initClass() {
        this.$inject = [
            "$translate",
            "$tgConfirm",
            "$tgConfig",
            "$tgStorage",
            "tgAttachmentsFullService",
            "tgProjectService",
            "tgAttachmentsPreviewService",
        ];
    }

    constructor(translate, confirm, config, storage, attachmentsFullService, projectService, attachmentsPreviewService) {
        this.translate = translate;
        this.confirm = confirm;
        this.config = config;
        this.storage = storage;
        this.attachmentsFullService = attachmentsFullService;
        this.projectService = projectService;
        this.attachmentsPreviewService = attachmentsPreviewService;
        this.mode = this.storage.get("attachment-mode", "list");

        this.maxFileSize = this.config.get("maxUploadFileSize", null);
        if (this.maxFileSize) { this.maxFileSize = sizeFormat(this.maxFileSize); }
        this.maxFileSizeMsg = this.maxFileSize ? this.translate.instant("ATTACHMENT.MAX_UPLOAD_SIZE", {maxFileSize: this.maxFileSize}) : "";

        defineImmutableProperty(this, "attachments", () => this.attachmentsFullService.attachments);
        defineImmutableProperty(this, "deprecatedsCount", () => this.attachmentsFullService.deprecatedsCount);
        defineImmutableProperty(this, "attachmentsVisible", () => this.attachmentsFullService.attachmentsVisible);
        defineImmutableProperty(this, "deprecatedsVisible", () => this.attachmentsFullService.deprecatedsVisible);
    }

    uploadingAttachments() {
        return this.attachmentsFullService.uploadingAttachments;
    }

    addAttachment(file) {
        const editable = (this.mode === "list");

        return this.attachmentsFullService.addAttachment(this.projectId, this.objId, this.type, file, editable);
    }

    setMode(mode) {
        this.mode = mode;

        return this.storage.set("attachment-mode", mode);
    }

    toggleDeprecatedsVisible() {
        return this.attachmentsFullService.toggleDeprecatedsVisible();
    }

    addAttachments(files) {
        return _.forEach(files, (file) => this.addAttachment(file));
    }

    loadAttachments() {
        return this.attachmentsFullService.loadAttachments(this.type, this.objId, this.projectId);
    }

    deleteAttachment(toDeleteAttachment) {
        this.attachmentsPreviewService.fileId = null;

        const title = this.translate.instant("ATTACHMENT.TITLE_LIGHTBOX_DELETE_ATTACHMENT");
        let message = this.translate.instant("ATTACHMENT.MSG_LIGHTBOX_DELETE_ATTACHMENT", {
            fileName: toDeleteAttachment.getIn(["file", "name"]),
        });

        return this.confirm.askOnDelete(title, message)
            .then((askResponse) => {
                const onError = () => {
                    message = this.translate.instant("ATTACHMENT.ERROR_DELETE_ATTACHMENT", {errorMessage: message});
                    this.confirm.notify("error", null, message);
                    return askResponse.finish(false);
                };

                const onSuccess = () => askResponse.finish();

                return this.attachmentsFullService.deleteAttachment(toDeleteAttachment, this.type).then(onSuccess, onError);
        });
    }

    reorderAttachment(attachment, newIndex) {
        return this.attachmentsFullService.reorderAttachment(this.type, attachment, newIndex);
    }

    updateAttachment(toUpdateAttachment) {
        return this.attachmentsFullService.updateAttachment(toUpdateAttachment, this.type);
    }

    _isEditable() {
        if (this.projectService.project) {
            return this.projectService.hasPermission(this.editPermission);
        }
        return false;
    }

    showAttachments() {
        return this._isEditable() || this.attachmentsFullService.attachments.size;
    }
}
AttachmentsFullController.initClass();

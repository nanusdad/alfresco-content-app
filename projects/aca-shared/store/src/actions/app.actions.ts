/*!
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Alfresco Example Content Application
 *
 * This file is part of the Alfresco Example Content Application.
 * If the software was purchased under a paid Alfresco license, the terms of
 * the paid license agreement will prevail. Otherwise, the software is
 * provided under the following open source license terms:
 *
 * The Alfresco Example Content Application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Alfresco Example Content Application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * from Hyland Software. If not, see <http://www.gnu.org/licenses/>.
 */

import { Action } from '@ngrx/store';
import { Node, Person, Group, RepositoryInfo, VersionEntry } from '@alfresco/js-api';
import { AppState } from '../states/app.state';
import { AppActionTypes } from './app-action-types';

export class SetSettingsParameterAction implements Action {
  readonly type = AppActionTypes.SetSettingsParameter;

  constructor(public payload: { name: string; value: any }) {}
}

export class SetInitialStateAction implements Action {
  readonly type = AppActionTypes.SetInitialState;

  constructor(public payload: AppState) {}
}

export class SetCurrentFolderAction implements Action {
  readonly type = AppActionTypes.SetCurrentFolder;

  constructor(public payload: Node) {}
}

export class SetCurrentNodeVersionAction implements Action {
  readonly type = AppActionTypes.SetCurrentVersion;

  constructor(public payload: VersionEntry) {}
}

export class SetCurrentUrlAction implements Action {
  readonly type = AppActionTypes.SetCurrentUrl;

  constructor(public payload: string) {}
}

export class SetUserProfileAction implements Action {
  readonly type = AppActionTypes.SetUserProfile;

  constructor(public payload: { person: Person; groups: Group[] }) {}
}

export class ToggleInfoDrawerAction implements Action {
  readonly type = AppActionTypes.ToggleInfoDrawer;
}

export class ToggleDocumentDisplayMode implements Action {
  readonly type = AppActionTypes.ToggleDocumentDisplayMode;
}

export class LogoutAction implements Action {
  readonly type = AppActionTypes.Logout;
}

export class ReloadDocumentListAction implements Action {
  readonly type = AppActionTypes.ReloadDocumentList;

  constructor(public payload?: any) {}
}

export class ResetSelectionAction implements Action {
  readonly type = AppActionTypes.ResetSelection;

  constructor(public payload?: any) {}
}

export class SetInfoDrawerStateAction implements Action {
  readonly type = AppActionTypes.SetInfoDrawerState;

  constructor(public payload: boolean) {}
}

export class CloseModalDialogsAction implements Action {
  readonly type = AppActionTypes.CloseModalDialogs;
}

export class SetRepositoryInfoAction implements Action {
  readonly type = AppActionTypes.SetRepositoryInfo;

  constructor(public payload: RepositoryInfo) {}
}

export class SetFileUploadingDialogAction implements Action {
  readonly type = AppActionTypes.SetFileUploadingDialog;

  constructor(public payload: boolean) {}
}

export class ShowInfoDrawerPreviewAction implements Action {
  readonly type = AppActionTypes.ShowInfoDrawerPreview;
}

export class SetInfoDrawerPreviewStateAction implements Action {
  readonly type = AppActionTypes.SetInfoDrawerPreviewState;

  constructor(public payload: boolean) {}
}

export class ShowLoaderAction implements Action {
  readonly type = AppActionTypes.ShowLoaderAction;

  constructor(public payload: boolean) {}
}

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

import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { AppStore, getAppName, getLogoPath } from '@alfresco/aca-shared/store';
import { AppConfigService } from '@alfresco/adf-core';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { AppExtensionService, ToolbarActionComponent } from '@alfresco/aca-shared';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule, ToolbarActionComponent],
  selector: 'app-sidenav-header',
  templateUrl: `./sidenav-header.component.html`,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-sidenav-header' }
})
export class SidenavHeaderComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<boolean>();

  appName$: Observable<string>;
  logo$: Observable<string>;
  landingPage: string;
  actions: Array<ContentActionRef> = [];

  @Output()
  toggleNavBar = new EventEmitter();

  constructor(public store: Store<AppStore>, private appConfigService: AppConfigService, private appExtensions: AppExtensionService) {
    this.appName$ = store.select(getAppName);
    this.logo$ = store.select(getLogoPath);
    this.landingPage = this.appConfigService.get('landingPage', '/personal-files');
  }

  ngOnInit() {
    this.appExtensions
      .getHeaderActions()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((actions) => {
        this.actions = actions;
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  trackByActionId(_: number, action: ContentActionRef) {
    return action.id;
  }
}

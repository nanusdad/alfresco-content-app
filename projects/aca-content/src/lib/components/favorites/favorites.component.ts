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

import {
  ContentApiService,
  ContextActionsDirective,
  InfoDrawerComponent,
  PageComponent,
  PageLayoutComponent,
  PageLayoutContentComponent,
  PageLayoutHeaderComponent,
  PaginationDirective,
  ToolbarActionComponent
} from '@alfresco/aca-shared';
import { MinimalNodeEntity, MinimalNodeEntryEntity, PathElementEntity, PathInfo } from '@alfresco/js-api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { debounceTime, map } from 'rxjs/operators';
import { DocumentListPresetRef, ExtensionsModule } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule, DocumentListModule } from '@alfresco/adf-content-services';
import { DataTableModule, PaginationModule, TemplateModule, ToolbarModule } from '@alfresco/adf-core';
import { DocumentListDirective } from '../../directives/document-list.directive';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbModule,
    ToolbarModule,
    DocumentListModule,
    DocumentListDirective,
    ContextActionsDirective,
    TemplateModule,
    DataTableModule,
    ExtensionsModule,
    PaginationModule,
    PaginationDirective,
    InfoDrawerComponent,
    ToolbarActionComponent,
    PageLayoutContentComponent,
    PageLayoutHeaderComponent,
    PageLayoutComponent
  ],
  templateUrl: './favorites.component.html',
  encapsulation: ViewEncapsulation.None
})
export class FavoritesComponent extends PageComponent implements OnInit {
  columns: DocumentListPresetRef[] = [];

  constructor(private contentApi: ContentApiService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.subscriptions = this.subscriptions.concat([
      this.uploadService.fileUploadComplete.pipe(debounceTime(300)).subscribe(() => this.reload()),
      this.uploadService.fileUploadDeleted.pipe(debounceTime(300)).subscribe(() => this.reload())
    ]);

    this.columns = this.extensions.documentListPresets.favorites;
  }

  navigate(favorite: MinimalNodeEntryEntity) {
    const { isFolder, id } = favorite;

    // TODO: rework as it will fail on non-English setups
    const isSitePath = (path: PathInfo): boolean => path && path.elements && path.elements.some(({ name }: PathElementEntity) => name === 'Sites');

    if (isFolder) {
      this.contentApi
        .getNode(id)
        .pipe(map((node) => node.entry))
        .subscribe(({ path }: MinimalNodeEntryEntity) => {
          const routeUrl = isSitePath(path) ? '/libraries' : '/personal-files';
          this.router.navigate([routeUrl, id]);
        });
    }
  }

  onNodeDoubleClick(node: MinimalNodeEntity) {
    if (node && node.entry) {
      if (node.entry.isFolder) {
        this.navigate(node.entry);
      }

      if (node.entry.isFile) {
        this.showPreview(node, { location: this.router.url });
      }
    }
  }

  handleNodeClick(event: Event) {
    this.onNodeDoubleClick((event as CustomEvent).detail?.node);
  }
}

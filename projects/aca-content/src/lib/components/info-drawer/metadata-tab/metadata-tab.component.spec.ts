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

import { MetadataTabComponent } from './metadata-tab.component';
import { MinimalNodeEntryEntity, Node } from '@alfresco/js-api';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../testing/app-testing.module';
import { AppConfigService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { AppState, SetInfoDrawerMetadataAspectAction } from '@alfresco/aca-shared/store';
import { By } from '@angular/platform-browser';
import { AppExtensionService, NodePermissionService } from '@alfresco/aca-shared';

describe('MetadataTabComponent', () => {
  let fixture: ComponentFixture<MetadataTabComponent>;
  let component: MetadataTabComponent;
  let store: Store<AppState>;
  let appConfig: AppConfigService;
  let extensions: AppExtensionService;
  let nodePermissionService: NodePermissionService;

  const presets = {
    default: {
      includeAll: true
    },
    custom: []
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, MetadataTabComponent]
    });
    nodePermissionService = TestBed.inject(NodePermissionService);
    spyOn(nodePermissionService, 'check').and.callFake((source: MinimalNodeEntryEntity, permissions: string[]) => {
      return permissions.some((permission) => source.allowableOperations.includes(permission));
    });
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('content-metadata configuration', () => {
    beforeEach(() => {
      appConfig = TestBed.inject(AppConfigService);
      extensions = TestBed.inject(AppExtensionService);
      appConfig.config['content-metadata'] = { presets };
    });

    it('should remain unchanged when metadata extension is missing', () => {
      extensions.contentMetadata = null;

      fixture = TestBed.createComponent(MetadataTabComponent);

      expect(appConfig.config['content-metadata'].presets).toEqual(presets);
    });

    it('should be overwritten by the one from extension', () => {
      extensions.contentMetadata = { presets: [{ 'new config': true }] };

      fixture = TestBed.createComponent(MetadataTabComponent);

      expect(appConfig.config['content-metadata'].presets).not.toEqual(presets);
      expect(appConfig.config['content-metadata'].presets).toEqual(extensions.contentMetadata.presets);
    });
  });

  describe('canUpdateNode()', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(MetadataTabComponent);
      component = fixture.componentInstance;
    });

    it('should return true if node is not locked and has update permission', async () => {
      component.node = {
        isLocked: false,
        allowableOperations: ['update']
      } as Node;
      component.ngOnInit();
      expect(component.canUpdateNode).toBe(true);
    });

    it('should return false if node is locked', () => {
      component.node = {
        isLocked: true,
        allowableOperations: ['update']
      } as Node;
      component.ngOnInit();
      expect(component.canUpdateNode).toBe(false);
    });

    it('should return false if node has no update permission', () => {
      component.node = {
        isLocked: false,
        allowableOperations: ['other']
      } as Node;
      component.ngOnInit();
      expect(component.canUpdateNode).toBe(false);
    });

    it('should return false if node has read only property', () => {
      component.node = {
        isLocked: false,
        allowableOperations: ['update'],
        properties: {
          'cm:lockType': 'WRITE_LOCK'
        }
      } as Node;
      component.ngOnInit();
      expect(component.canUpdateNode).toBe(false);
    });
  });

  describe('displayAspect', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(MetadataTabComponent);
      store = TestBed.inject(Store);
      component = fixture.componentInstance;
    });

    it('show pass empty when store is in initial state', () => {
      const initialState = fixture.debugElement.query(By.css('adf-content-metadata-card'));
      expect(initialState.componentInstance.displayAspect).toBeFalsy();
    });

    it('should update the exif if store got updated', () => {
      store.dispatch(new SetInfoDrawerMetadataAspectAction('EXIF'));
      component.displayAspect$.subscribe((aspect) => {
        expect(aspect).toBe('EXIF');
      });
      fixture.detectChanges();
      const initialState = fixture.debugElement.query(By.css('adf-content-metadata-card'));
      expect(initialState.componentInstance.displayAspect).toBe('EXIF');
    });
  });
});

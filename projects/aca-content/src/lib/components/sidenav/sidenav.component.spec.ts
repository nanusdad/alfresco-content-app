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

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SidenavComponent } from './sidenav.component';
import { AppTestingModule } from '../../testing/app-testing.module';
import { AppExtensionService, AppService } from '@alfresco/aca-shared';
import { BehaviorSubject, Subject } from 'rxjs';

describe('SidenavComponent', () => {
  let fixture: ComponentFixture<SidenavComponent>;
  let component: SidenavComponent;
  let extensionService: AppExtensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule, SidenavComponent],
      providers: [
        {
          provide: AppService,
          useValue: {
            appNavNarMode$: new BehaviorSubject('expanded'),
            toggleAppNavBar$: new Subject()
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    extensionService = TestBed.inject(AppExtensionService);
    extensionService.navbar = [
      {
        id: 'route',
        items: [
          {
            id: 'item-1',
            icon: 'item',
            route: 'route',
            title: 'item-1'
          }
        ]
      }
    ];
  });

  it('should set the sidenav data', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.groups.length).toBe(1);
    expect(component.groups[0].items.length).toBe(1);
    expect(component.groups[0].items[0]).toEqual({
      id: 'item-1',
      icon: 'item',
      url: '/route',
      route: 'route',
      title: 'item-1'
    });
  });
});

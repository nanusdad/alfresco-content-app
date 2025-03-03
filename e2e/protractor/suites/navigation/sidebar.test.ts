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

import { browser } from 'protractor';
import { APP_ROUTES, SIDEBAR_LABELS, LoginPage, BrowsingPage, SearchResultsPage, Utils } from '@alfresco/aca-testing-shared';

describe('Sidebar', () => {
  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { sidenav, toolbar } = page;
  const searchResultsPage = new SearchResultsPage();
  const { searchInput } = searchResultsPage.pageLayoutHeader;

  beforeAll(async () => {
    await loginPage.loginWithAdmin();
  });

  beforeEach(async () => {
    await Utils.pressEscape();
    await sidenav.expandSideNav();
  });

  afterEach(async () => {
    await Utils.pressEscape();
    await page.clickPersonalFiles();
  });

  it('[C217149] has "Personal Files" as default', async () => {
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.PERSONAL_FILES)).toBe(true, 'Default active link');
  });

  it('[C289902] navigate to Favorite Libraries', async () => {
    await page.goToFavoriteLibraries();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.FAVORITE_LIBRARIES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.FAVORITE_LIBRARIES)).toBe(true, 'Favorite Libraries link not active');
  });

  it('[C289901] navigate to My Libraries', async () => {
    await page.goToMyLibraries();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.MY_LIBRARIES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.MY_LIBRARIES)).toBe(true, 'My Libraries link not active');
  });

  it('[C213110] navigates to "Shared Files"', async () => {
    await page.clickSharedFiles();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.SHARED_FILES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.SHARED_FILES)).toBe(true, 'Shared Files link not active');
  });

  it('[C213166] navigates to "Recent Files"', async () => {
    await page.clickRecentFiles();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.RECENT_FILES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.RECENT_FILES)).toBe(true, 'Recent Files link not active');
  });

  it('[C213225] navigates to "Favorites"', async () => {
    await page.clickFavorites();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.FAVORITES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.FAVORITES)).toBe(true, 'Favorites link not active');
  });

  it('[C213216] navigates to "Trash"', async () => {
    await page.clickTrash();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.TRASHCAN);
    expect(await sidenav.isActive(SIDEBAR_LABELS.TRASH)).toBe(true, 'Trash link not active');
  });

  it('[C280409] navigates to "Personal Files"', async () => {
    await page.clickPersonalFiles();
    expect(await browser.getCurrentUrl()).toContain(APP_ROUTES.PERSONAL_FILES);
    expect(await sidenav.isActive(SIDEBAR_LABELS.PERSONAL_FILES)).toBe(true, 'Personal Files link not active');
  });

  it('[C217151] Personal Files tooltip', async () => {
    await page.clickPersonalFiles();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.PERSONAL_FILES)).toContain('View your Personal Files');
  });

  it('[C213111] Shared Files tooltip', async () => {
    await page.clickSharedFiles();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.SHARED_FILES)).toContain('View files that have been shared');
  });

  it('[C213167] Recent Files tooltip', async () => {
    await page.clickRecentFiles();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.RECENT_FILES)).toContain('View files you recently edited');
  });

  it('[C217153] Favorites tooltip', async () => {
    await page.clickFavorites();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITES)).toContain('View your favorite files and folders');
  });

  it('[C217154] Trash tooltip', async () => {
    await page.clickTrash();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.TRASH)).toContain('View deleted files in the trash');
  });

  it('[C289916] My Libraries tooltip', async () => {
    await page.goToMyLibraries();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.MY_LIBRARIES)).toContain('Access my libraries');
  });

  it('[C289917] Favorite Libraries tooltip', async () => {
    await page.goToFavoriteLibraries();
    expect(await sidenav.getLinkTooltip(SIDEBAR_LABELS.FAVORITE_LIBRARIES)).toContain('Access my favorite libraries');
  });

  it('[C269095] default state is expanded', async () => {
    expect(await sidenav.isSidenavExpanded()).toBe(true, 'Sidebar not expanded');
  });

  it('[C269096] sidebar toggle', async () => {
    await sidenav.collapseSideNav();
    expect(await sidenav.isSidenavExpanded()).toBe(false, 'Sidebar not collapsed');

    await sidenav.expandSideNav();
    expect(await sidenav.isSidenavExpanded()).toBe(true, 'Sidebar not expanded');
  });

  it('[C269100] sidebar state is preserved on page refresh', async () => {
    expect(await sidenav.isSidenavExpanded()).toBe(true, 'Sidebar not expanded');
    await page.refresh();
    expect(await sidenav.isSidenavExpanded()).toBe(true, 'Sidebar not expanded');

    await sidenav.collapseSideNav();
    expect(await sidenav.isSidenavExpanded()).toBe(false, 'Sidebar not collapsed');
    await page.refresh();
    expect(await sidenav.isSidenavExpanded()).toBe(false, 'Sidebar not collapsed');
  });

  it('[C269102] sidebar state is preserved after logout / login', async () => {
    await sidenav.collapseSideNav();
    await page.signOut();
    await loginPage.loginWithAdmin();

    expect(await sidenav.isSidenavExpanded()).toBe(false, 'Sidebar not collapsed');
  });

  it('[C277223] sidebar is collapsed automatically when Search Results opens', async () => {
    await toolbar.clickSearchIconButton();
    await searchInput.clickSearchButton();
    /* cspell:disable-next-line */
    await searchInput.searchFor('qwertyuiop');
    await searchResultsPage.waitForResults();

    expect(await sidenav.isSidenavExpanded()).toBe(false, 'Sidebar not collapsed');
  });

  it('[C277224] sidenav returns to the default state when navigating away from the Search Results page', async () => {
    await toolbar.clickSearchIconButton();
    await searchInput.clickSearchButton();
    /* cspell:disable-next-line */
    await searchInput.searchFor('qwertyuiop');
    await searchResultsPage.waitForResults();
    await page.clickFavorites();

    expect(await sidenav.isSidenavExpanded()).toBe(true, 'Sidebar not expanded');
  });

  it('[C277230] sidenav can be expanded when search results page is displayed', async () => {
    await toolbar.clickSearchIconButton();
    await searchInput.clickSearchButton();
    /* cspell:disable-next-line */
    await searchInput.searchFor('qwertyuiop');
    await searchResultsPage.waitForResults();
    await sidenav.expandSideNav();

    expect(await sidenav.isSidenavExpanded()).toBe(true, 'Sidebar not expanded');
  });
});

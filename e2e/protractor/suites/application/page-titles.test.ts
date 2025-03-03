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
import { LoginPage, BrowsingPage, RepoClient, Utils, AdminActions } from '@alfresco/aca-testing-shared';

const PAGE_TITLES = {
  PERSONAL_FILES: 'Personal Files',
  MY_LIBRARIES: 'My Libraries',
  FAVORITE_LIBRARIES: 'Favorite Libraries',
  SHARED_FILES: 'Shared',
  RECENT_FILES: 'Recent Files',
  FAVORITES: 'Favorites',
  TRASH: 'Trash',
  VIEWER: 'Preview',
  SEARCH: 'Search Results'
};

describe('Page titles', () => {
  const loginPage = new LoginPage();
  const page = new BrowsingPage();
  const { toolbar } = page;
  const username = `user-${Utils.random()}`;
  const apis = new RepoClient(username, username);
  const adminApiActions = new AdminActions();
  const file = `file-${Utils.random()}.txt`;
  let fileId: string;
  const { searchInput } = page.pageLayoutHeader;

  beforeAll(async () => {
    await adminApiActions.createUser({ username });
  });

  describe('on Login / Logout pages', () => {
    it('[C217155] on Login page', async () => {
      await loginPage.load();
      expect(await browser.getTitle()).toContain('Sign in');
    });

    it('[C217156] after logout', async () => {
      await loginPage.loginWith(username);
      await page.signOut();
      expect(await browser.getTitle()).toContain('Sign in');
    });

    it('[C280414] when pressing Back after Logout', async () => {
      await loginPage.loginWith(username);
      await page.signOut();
      await browser.navigate().back();
      expect(await browser.getTitle()).toContain('Sign in');
    });
  });

  describe('on app pages', () => {
    beforeAll(async () => {
      await loginPage.loginWith(username);
      fileId = (await apis.nodes.createFile(file)).entry.id;
    });

    afterAll(async () => {
      await apis.nodes.deleteNodeById(fileId);
    });

    it('[C217157] Personal Files page', async () => {
      await page.clickPersonalFiles();
      expect(await browser.getTitle()).toContain(PAGE_TITLES.PERSONAL_FILES);
    });

    it('[C217158] My Libraries page', async () => {
      await page.goToMyLibraries();
      expect(await browser.getTitle()).toContain(PAGE_TITLES.MY_LIBRARIES);
    });

    it('[C289907] Favorite Libraries page', async () => {
      await page.goToFavoriteLibraries();
      expect(await browser.getTitle()).toContain(PAGE_TITLES.FAVORITE_LIBRARIES);
    });

    it('[C217159] Shared Files page', async () => {
      await page.clickSharedFiles();
      expect(await browser.getTitle()).toContain(PAGE_TITLES.SHARED_FILES);
    });

    it('[C217160] Recent Files page', async () => {
      await page.clickRecentFiles();
      expect(await browser.getTitle()).toContain(PAGE_TITLES.RECENT_FILES);
    });

    it('[C217161] Favorites page', async () => {
      await page.clickFavorites();
      expect(await browser.getTitle()).toContain(PAGE_TITLES.FAVORITES);
    });

    it('[C217162] Trash page', async () => {
      await page.clickTrash();
      expect(await browser.getTitle()).toContain(PAGE_TITLES.TRASH);
    });

    it('[C280415] File Preview page', async () => {
      await page.clickPersonalFilesAndWait();
      await page.dataTable.doubleClickOnRowByName(file);
      expect(await browser.getTitle()).toContain(PAGE_TITLES.VIEWER);
      await Utils.pressEscape();
    });

    it('[C280413] Search Results page', async () => {
      await toolbar.clickSearchIconButton();
      await searchInput.clickSearchButton();
      await searchInput.searchFor(file);
      expect(await browser.getTitle()).toContain(PAGE_TITLES.SEARCH);
    });
  });
});

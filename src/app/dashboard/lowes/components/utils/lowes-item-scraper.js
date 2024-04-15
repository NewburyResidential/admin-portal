'use server';

import { firefox } from 'playwright';
import updateCatalogItem from 'src/utils/services/supply-stores/updateCatalogItem';

export default async function lowesItemScraper(items) {
  const browser = await firefox.launch({ headless: false });
  const page = await browser.newPage();
  const results = [];

  // Set Store
  await page.goto('https://www.lowes.com/store/');
  await page.fill('.input--search', '49202');
  await page.press('.input--search', 'Enter');
  await page.click('button[data-storenumber="0146"]');
  await page.waitForTimeout(4000);

  for (const item of items) {
    try {
      const sku = item.sku;
      await page.goto(`https://www.lowes.com/search?searchTerm=${sku}`, { waitUntil: 'load' });
      await page.waitForSelector('.js-the-game-is-up');
      const bodyText = await page.evaluate(() => document.body.innerText);
      const searchScreen = bodyText.includes('Home/Search');
      const itemScreen = bodyText.includes('Item #');

      if (itemScreen) {
        await extractItemDetails(item, page, sku, results);
      } else if (searchScreen) {
        await navigateAndExtractFromSearchResults(item, page, sku, results);
      } else {
        pushEmptyResult(item);
      }
    } catch (error) {
      console.error('Error processing query:', error);
      pushEmptyResult(item);
    }
  }

  await browser.close();
  return results;
}

async function extractItemDetails(item, page, sku, results) {
  await page.waitForSelector('.screen-reader');

  const itemNumber = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const match = /Item\s*#(\d+)/g.exec(bodyText);
    return match ? match[1] : null;
  });
  if (itemNumber && itemNumber.includes(sku)) {
    const { label, price, category, subCategory, imageUrl } = await extractProductDetails(page);
    console.log({ sku, skuDescription: item.skuDescription, price, category, subCategory, label, imageUrl });
    results.push({ sku, skuDescription: item.skuDescription, price, category, subCategory, label, imageUrl });
    await updateCatalogItem({ pk: sku, skuDescription: item.skuDescription, price, category, subCategory, label, imageUrl });
  } else {
    pushEmptyResult(item, { sku });
  }
}

async function navigateAndExtractFromSearchResults(item, page, sku, results) {
  const hrefs = await page.$$eval('h3 > a', (links) => links.map((a) => a.getAttribute('href')));
  await page.goto(`https://www.lowes.com${hrefs[0]}`, { waitUntil: 'load' });
  await extractItemDetails(item, page, sku, results);
}

async function extractProductDetails(page) {
  const label = await safePageEval(page, 'h1', (el) => el.textContent.trim());
  const price = await safePageEval(page, '.screen-reader', (el) => el.textContent.trim());
  const category = await safePageEval(page, 'ol li:first-child a', (el) => el.textContent.trim());
  const subCategory = await safePageEval(page, 'ol li:nth-child(2) a', (el) => el.textContent.trim());
  const imageUrl = await page.getAttribute('.tile-img', 'src');
  return { label, price, category, subCategory, imageUrl };
}

async function safePageEval(page, selector, callback) {
  return await page.$eval(selector, callback).catch(() => null);
}

async function pushEmptyResult(item) {
  await updateCatalogItem({
    pk: item.sku,
    skuDescription: item.skuDescription,
    price: null,
    category: null,
    subCategory: null,
    label: null,
    imageUrl: null,
  });
}

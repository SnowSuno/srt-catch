import { Page } from "puppeteer";

export const authenticate = async (page: Page, username: string, password: string) => {
  await page.goto("https://srtplay.com/user/idCheck");

  await page.focus("#input-email");
  await page.keyboard.type(username);

  await submit(page);

  await page.waitForNavigation();
  await page.focus("#input-pw");
  await page.keyboard.type(password);

  await submit(page);

  await page.waitForNavigation();
};

const submit = async (page: Page) => {
  const button = await page.waitForSelector(
    "button[type=submit].btn-type1.st1"
  );
  if (!button) throw new Error("No submit button found");
  await button.click();
};


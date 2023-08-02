import puppeteer, { Page } from "puppeteer";

const submit = async (page: Page) => {
  const button = await page.waitForSelector(
    "button[type=submit].btn-type1.st1"
  );
  if (!button) throw new Error("No submit button found");
  await button.click();
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const stations = [
  { code: "0551", name: "수서" },
  { code: "0552", name: "동탄" },
  { code: "0553", name: "평택지제" },
  { code: "0502", name: "천안아산" },
  { code: "0297", name: "오송" },
  { code: "0010", name: "대전" },
  { code: "0514", name: "공주" },
  { code: "0507", name: "김천(구미)" },
  { code: "0506", name: "서대구" },
  { code: "0015", name: "동대구" },
  { code: "0508", name: "신경주" },
  { code: "0509", name: "울산(통도사)" },
  { code: "0020", name: "부산" },
  { code: "0030", name: "익산" },
  { code: "0033", name: "정읍" },
  { code: "0036", name: "광주송정" },
  { code: "0037", name: "나주" },
  { code: "0041", name: "목포" },
] as const;

const ticket = async (username: string, password: string) => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  page.once("dialog", async dialog => {
    if (dialog.message() !== "좌석이 부족합니다. 처음화면으로 이동합니다.") {
      throw new Error("Unexpected dialog message");
    }
    await dialog.dismiss();
    console.log("dialog dismissed");
    await page.goto("https://srtplay.com/ticket/reservation/schedule");
  });

  await page.goto("https://srtplay.com/user/idCheck");

  await page.focus("#input-email");
  await page.keyboard.type(username);

  await submit(page);

  await page.waitForNavigation();
  await page.focus("#input-pw");
  await page.keyboard.type(password);

  await submit(page);

  await page.waitForNavigation();
  await page.goto("https://srtplay.com/ticket/reservation");

  await page.evaluate(`
    calendarSelected(this, 2023, 8, 1);
    setCalendar();
    setStationPos('start');
    setStationCode('0010','대전');
    setStation();
    setStationPos('arrive');
    setStationCode('0551','수서');
    setStation();
    document.getElementById("inputPassenger1").value = '3';
    setPassengerValue();
    next();
  `);

  // await page.waitForResponse(
  //   "https://srtplay.com/ticket/reservation/schedule/proc");
  await page.waitForSelector("#scheduleDiv");
  await page.waitForSelector(".loading", { hidden: true });
  const button = await page.waitForSelector(
    ".time-list > li:nth-child(4) .general > a.btn",
    { visible: true }
  );
  if (!button) throw new Error("No submit button found");

  // await button.click();
  const href = await button.getProperty("href");
  const js = await href.jsonValue();

  await page.evaluate(js.slice(11));

  await page.evaluate("javascript:goSeat('Y');");

  await page.waitForNavigation();

  // await page.reload();
  // await page.evaluate("goNextStepForSeatSelect();");

  // for (let i = 0; i < 10; i++) {
  //   await delay(3000);
  //   await page.reload();
  // }
  // await page.goto("https://srtplay.com/ticket/reservation/schedule");
  // await page.waitForNavigation();
  // await browser.close();
};


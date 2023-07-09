const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page1 = await browser.newPage();
  const page2 = await browser.newPage();

  let roomId = 1; // Initialize roomId

  // Generate a random string
  const randomString1 = Math.random().toString(36).substring(7);
  const randomString2 = Math.random().toString(36).substring(7);

  // Open localhost:3000 in both tabs
  await page1.goto('http://localhost:3000');
  await page2.goto('http://localhost:3000');

  // Input random string and roomId in both tabs
  await page1.type('#username', randomString1);
  await page1.type('#roomId', roomId.toString());
  await page2.type('#username', randomString2);
  await page2.type('#roomId', roomId.toString()); // Increment roomId for second tab

  // Click submit button in both tabs
  await Promise.all([
    page1.click('#play'),
    page2.click('#play')
  ]);

  // Increment roomId for next run
  roomId += 1;

})();

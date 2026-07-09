const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const port = 3000;

app.use('/password_generator', express.static(path.join(__dirname, 'frontend/dist/frontend/browser')));

const server = app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  await page.goto('http://localhost:3000/password_generator/', { waitUntil: 'networkidle0' });
  
  const html = await page.content();
  console.log('HTML contains app-root content:', html.includes('Password Generator'));
  
  await browser.close();
  server.close();
});

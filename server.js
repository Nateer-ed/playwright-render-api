import express from "express";
import { chromium } from "playwright";

const app = express();
app.use(express.json());

let browser;

// Launch browser ONCE
(async () => {
  browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });
})();

app.post("/render", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

  const html = await page.content();
  await page.close();

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

app.get("/", (_, res) => {
  res.send("Playwright Render API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

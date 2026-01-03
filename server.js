import express from "express";
import { chromium } from "playwright";

const app = express();
app.use(express.json());

let browser;

// Launch browser once at startup with error handling
async function initBrowser() {
  try {
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-software-rasterizer",
      ],
    });
    console.log("Browser launched successfully");
  } catch (error) {
    console.error("Failed to launch browser:", error);
    // Retry after delay
    setTimeout(initBrowser, 5000);
  }
}

initBrowser();

app.post("/render", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });
  
  if (!browser) {
    return res.status(503).json({ error: "Browser not ready yet" });
  }

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    const html = await page.content();
    await page.close();
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.error("Render error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (_, res) => {
  res.send("Playwright Render API is running");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
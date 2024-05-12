import { NextResponse } from "next/server";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds (update by 2024-05-10)
export const dynamic = "force-dynamic";
const fs = require('fs');
const path = require('path');
const localExecutablePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
      ? "/usr/bin/google-chrome"
      : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar";

const isDev = process.env.NODE_ENV === "development";
let userAgent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36";

export async function GET(request) {
  const url = new URL(request.url);
  const urlStr = url.searchParams.get("url");
  if (!urlStr) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 }
    );
  }
  let browser = null;
  try {
    const chromium = require("@sparticuz/chromium-min");
    const puppeteer = require("puppeteer-core");

    browser = await puppeteer.launch({
      ignoreDefaultArgs: ["--enable-automation"],
      args: isDev ? [] : [...chromium.args, "--disable-blink-features=AutomationControlled"],
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: isDev
        ? localExecutablePath
        : await chromium.executablePath(remoteExecutablePath),
      headless: "new",
    });
    browser.on("targetcreated", async (target) => {
      const _page = await target.page();
      try {
        await _page.setUserAgent(userAgent);
        await _page.setViewport({
          width: 1920,
          height: 1080,
        });
        const preloadFile = fs.readFileSync(path.join(process.cwd(), '/src/utils/preload.js'), 'utf8');
        await _page.evaluateOnNewDocument(preloadFile);
      } catch (err) {
        // console.log(err.message);
      }
    });

    const pages = await browser.pages();
    const page = pages[0];
    await page.setUserAgent(userAgent);
    await page.setViewport({
      width: 1920,
      height: 1080,
    });
    const preloadFile = fs.readFileSync(path.join(process.cwd(), '/src/utils/preload.js'), 'utf8');
    await page.evaluateOnNewDocument(preloadFile);
    await page.goto("https://nopecha.com/demo/cloudflare", {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector('.link_row', {
      timeout: 60000
    });
    console.log("page title", await page.title());
    const blob = await page.screenshot({ type: "png" });

    const headers = new Headers();

    headers.set("Content-Type", "image/png");
    headers.set("Content-Length", blob.length.toString());

    // or just use new Response ❗️
    return new NextResponse(blob, { status: 200, statusText: "OK", headers });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await browser.close();
  }
}

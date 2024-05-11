import { NextResponse } from "next/server";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds (update by 2024-05-10)
export const dynamic = "force-dynamic";

const localExecutablePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar";

const isDev = process.env.NODE_ENV === "development";

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
      args: isDev ? [] : chromium.args,
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: isDev
        ? localExecutablePath
        : await chromium.executablePath(remoteExecutablePath),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(urlStr, {
      waitUntil: "networkidle0",
      timeout: 100000,
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

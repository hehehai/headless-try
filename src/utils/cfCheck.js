async function cfCheck(page) {
    await page.waitForFunction('window._cf_chl_opt===undefined');
    const frames = await page.frames();

    for (const frame of frames) {
        const frameUrl = frame.url();
        try {
            const domain = new URL(frameUrl).hostname;
            console.log(domain);
            if (domain === "challenges.cloudflare.com") {
                const id = await frame.evaluate(() => window._cf_chl_opt.chlApiWidgetId);
                await page.waitForFunction(`document.getElementById("cf-chl-widget-${id}_response").value!==''`);
                console.log(await page.evaluate(() => document.getElementById(`cf-chl-widget-${id}_response`).value))

                console.log("CF is loaded.");
            }
        } catch (error) {

        }

    }
}
module.exports = cfCheck;  
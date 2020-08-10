/**
 * function that is called after it is declared, opens Landingpage and sets up environment variables
 */
async function init() {
  setPersistantData("userId", null);
  await closeLandingpage();
  await closeOpenTabs();
  browser.tabs.create({url: "assets/html/landingpage.html"});
  console.log("wait for setupSockets...");
  await setupSockets();
  console.log("setupSockets done");

    /**
     * set artificial deviceId in localStorage
     */
    var browserId = await getPersistantData("browserId");
    if(!browserId) {
      browserId = Math.floor(Math.random() * Math.floor(1000000));
      await setPersistantData("browserId", browserId);
    }
}
init();

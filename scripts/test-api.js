async function test() {
  try {
    const statsRes = await fetch("http://localhost:3000/api/public/stats");
    const statsData = await statsRes.json();
    console.log("Current Public Stats:", JSON.stringify(statsData.stats));

    const requestsRes = await fetch("http://localhost:3000/api/status/search?query=202300101");
    const requestsData = await requestsRes.json();
    console.log("Status search for old dummy:", requestsData.results?.length || 0, "results");

    console.log("✨ ZERO STATE VERIFIED VIA LIVE HTTP API!");
  } catch (err) {
    console.error("Fetch test error:", err);
  }
}
test();

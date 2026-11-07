// 8th Workshop: JS FetchAPI - Bangkok O'clock Widget
// Fetch the current date and time for Bangkok, Thailand.
(() => {
  const cityElement = document.getElementById("bangkok-clock-city");
  const timeElement = document.getElementById("bangkok-clock-time");
  const dateElement = document.getElementById("bangkok-clock-date");
  const statusElement = document.getElementById("bangkok-clock-status");

  if (!cityElement || !timeElement || !dateElement || !statusElement) return;

  const apiUrl = "https://timeapi.io/api/Time/current/zone?timeZone=Asia%2FBangkok";
  const bangkokTimeZone = "Asia/Bangkok";
  let fetchedTime = null;
  let fetchedAt = null;

  function renderClock(date) {
    timeElement.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: bangkokTimeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(date);

    dateElement.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: bangkokTimeZone,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  async function fetchBangkokTime() {
    statusElement.textContent = "Fetching current time from the API...";

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Accept": "application/json" },
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Time API returned HTTP " + response.status);
      }

      const data = await response.json();

      if (!data.dateTime) {
        throw new Error("The API response does not contain dateTime.");
      }

      // TimeAPI.io returns Bangkok local dateTime without an offset.
      // Bangkok uses UTC+07:00 and does not observe daylight saving time.
      const apiDate = new Date(data.dateTime + "+07:00");

      if (Number.isNaN(apiDate.getTime())) {
        throw new Error("The API returned an invalid dateTime value.");
      }

      fetchedTime = apiDate.getTime();
      fetchedAt = Date.now();

      cityElement.textContent = "Bangkok, Thailand";
      renderClock(new Date(fetchedTime));
      statusElement.textContent = "Updated from FetchAPI • Asia/Bangkok";
    } catch (error) {
      console.error("Unable to fetch Bangkok time:", error);
      statusElement.textContent = "FetchAPI error: " + error.message;
      if (!fetchedTime) {
        timeElement.textContent = "--:--:--";
        dateElement.textContent = "Time is currently unavailable.";
      }
    }
  }

  // Fetch the official time once, then update the displayed clock locally.
  fetchBangkokTime();

  window.setInterval(() => {
    if (fetchedTime !== null && fetchedAt !== null) {
      const elapsed = Date.now() - fetchedAt;
      renderClock(new Date(fetchedTime + elapsed));
    }
  }, 1000);

  // Refresh from the API every five minutes to keep the clock accurate.
  window.setInterval(fetchBangkokTime, 5 * 60 * 1000);
})();

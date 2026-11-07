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
  let currentBangkokTime = null;

  function renderClock() {
    if (!currentBangkokTime) return;

    timeElement.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: bangkokTimeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(currentBangkokTime);

    dateElement.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: bangkokTimeZone,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(currentBangkokTime);
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

      // Parse the API's Bangkok local dateTime as UTC+07:00.
      const dateTimeValue = data.dateTime;
      const hasOffset = /(?:Z|[+-]\\d{2}:?\\d{2})$/i.test(dateTimeValue);
      const apiDate = new Date(hasOffset ? dateTimeValue : dateTimeValue + "+07:00");

      if (Number.isNaN(apiDate.getTime())) {
        throw new Error("The API returned an invalid dateTime value.");
      }

      currentBangkokTime = apiDate;
      cityElement.textContent = "Bangkok, Thailand";
      renderClock();
      statusElement.textContent = "Updated from FetchAPI • Asia/Bangkok";
    } catch (error) {
      console.error("Unable to fetch Bangkok time:", error);
      statusElement.textContent = "FetchAPI error: " + error.message;

      if (!currentBangkokTime) {
        timeElement.textContent = "--:--:--";
        dateElement.textContent = "Time is currently unavailable.";
      }
    }
  }

  // Fetch the time from the API when the page opens.
  fetchBangkokTime();

  // Advance the fetched time by one second without reloading the page.
  window.setInterval(() => {
    if (currentBangkokTime) {
      currentBangkokTime.setSeconds(currentBangkokTime.getSeconds() + 1);
      renderClock();
    }
  }, 1000);

  // Synchronize with the time API again every five minutes.
  window.setInterval(fetchBangkokTime, 5 * 60 * 1000);
})();

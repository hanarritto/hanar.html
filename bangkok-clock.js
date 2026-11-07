// 8th Workshop: JS FetchAPI - Bangkok O'clock Widget
// Fetch the current date and time for Bangkok, Thailand.
(() => {
  const cityElement = document.getElementById("bangkok-clock-city");
  const timeElement = document.getElementById("bangkok-clock-time");
  const dateElement = document.getElementById("bangkok-clock-date");
  const statusElement = document.getElementById("bangkok-clock-status");

  if (!cityElement || !timeElement || !dateElement || !statusElement) return;

  const apiUrl = "https://worldtime.timezone.io/api/timezone/Asia/Bangkok";

  function displayBangkokTime(isoDateTime) {
    const currentDate = new Date(isoDateTime);

    if (Number.isNaN(currentDate.getTime())) {
      throw new Error("The API returned an invalid date and time.");
    }

    timeElement.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(currentDate);

    dateElement.textContent = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Bangkok",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(currentDate);
  }

  async function fetchBangkokTime() {
    statusElement.textContent = "Fetching current time from the API...";

    try {
      const response = await fetch(apiUrl, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Time API request failed: HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.datetime) {
        throw new Error("The API response does not contain datetime.");
      }

      cityElement.textContent = "Bangkok, Thailand";
      displayBangkokTime(data.datetime);
      statusElement.textContent = "Updated from FetchAPI • Asia/Bangkok";
    } catch (error) {
      console.error("Unable to fetch Bangkok time:", error);
      timeElement.textContent = "--:--:--";
      dateElement.textContent = "Time is currently unavailable.";
      statusElement.textContent = "Could not load time from the API. Please refresh the page.";
    }
  }

  fetchBangkokTime();
})();

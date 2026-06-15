// test_dates.js
function getSecondSunday(year, monthIndex) {
  // monthIndex: 0 for Jan, 11 for Dec
  let date = new Date(year, monthIndex, 1);
  let dayOfWeek = date.getDay(); // 0 is Sunday
  // Find first Sunday
  let daysToFirstSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  date.setDate(1 + daysToFirstSunday);
  // Add 7 days to get second Sunday
  date.setDate(date.getDate() + 7);
  return date;
}

function toLocalISOString(date) {
  const pad = n => n < 10 ? '0' + n : n;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function calculateCardTimeline(baseDate) {
  const d = new Date(baseDate);
  let year = d.getFullYear();
  let month = d.getMonth();

  // Calculate the 2nd Sunday of the current month
  let currentMonth2ndSunday = getSecondSunday(year, month);
  let startOfCurrentMonthCard = new Date(currentMonth2ndSunday);
  startOfCurrentMonthCard.setDate(startOfCurrentMonthCard.getDate() + 1); // Monday after 2nd Sunday

  let startMonth, startYear;

  if (d < startOfCurrentMonthCard) {
    if (month === 0) {
      startMonth = 11;
      startYear = year - 1;
    } else {
      startMonth = month - 1;
      startYear = year;
    }
  } else {
    startMonth = month;
    startYear = year;
  }

  const startCard2ndSunday = getSecondSunday(startYear, startMonth);
  const cardStart = new Date(startCard2ndSunday);
  cardStart.setDate(cardStart.getDate() + 1); // Monday

  let endMonth = startMonth === 11 ? 0 : startMonth + 1;
  let endYear = startMonth === 11 ? startYear + 1 : startYear;
  
  const cardEnd = getSecondSunday(endYear, endMonth); // 2nd Sunday of next month

  const diffTime = Math.abs(cardEnd - cardStart);
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const totalWeeks = diffDays / 7;

  return {
    startStr: toLocalISOString(cardStart),
    endStr: toLocalISOString(cardEnd),
    totalDays: diffDays,
    totalWeeks: totalWeeks
  };
}

// Tests
console.log("Testing Jan 5, 2026 (Before Jan 2nd Sunday):", calculateCardTimeline('2026-01-05'));
console.log("Testing Jan 15, 2026 (After Jan 2nd Sunday):", calculateCardTimeline('2026-01-15'));
console.log("Testing May 15, 2026 (May -> June):", calculateCardTimeline('2026-05-15'));

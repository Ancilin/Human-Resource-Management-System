// Format a time value (HH:MM:SS or ISO timestamp) as IST 12-hour AM/PM
export const formatTimeIST = (timeStr) => {
  if (!timeStr || timeStr === '--:--') return '--:--';
  try {
    let hours, minutes, seconds;

    if (timeStr.includes('T') || timeStr.includes('Z')) {
      // Full ISO timestamp e.g. "2026-07-25T07:41:16.000Z"
      const date = new Date(timeStr);
      // Convert to IST by getting IST locale parts
      const istStr = date.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
      const parts = istStr.split(':');
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10);
      seconds = parseInt(parts[2], 10);
    } else {
      // Plain time string e.g. "13:11:16" — stored already in IST
      const parts = timeStr.split(':');
      hours = parseInt(parts[0], 10);
      minutes = parseInt(parts[1], 10);
      seconds = parts[2] !== undefined ? parseInt(parts[2], 10) : undefined;
    }

    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 === 0 ? 12 : hours % 12;
    const mm = String(minutes).padStart(2, '0');
    const ss = seconds !== undefined && !isNaN(seconds) ? `:${String(seconds).padStart(2, '0')}` : '';
    return `${h12}:${mm}${ss} ${ampm}`;
  } catch {
    return timeStr;
  }
};

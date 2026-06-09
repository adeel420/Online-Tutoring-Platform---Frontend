const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const APP_TIME_ZONE = import.meta.env.VITE_APP_TIME_ZONE || "Asia/Karachi";

export const getTodayDate = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const value = (type) => parts.find((part) => part.type === type)?.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
};

export const getDayFromDate = (date = "") => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) return "";
  const [year, month, day] = String(date).split("-").map(Number);
  return DAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
};

export const formatDateLabel = (date = "") => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) return date;
  const [year, month, day] = String(date).split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

export const toMinutes = (time = "") => {
  const [hours, minutes] = String(time).split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
};

export const formatTime12 = (time = "") => {
  const minutesFromMidnight = toMinutes(time);
  if (minutesFromMidnight === null) return time;

  const hours24 = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
};

export const formatTimeRange12 = (from, to, fallback = "") => {
  if (!from || !to) return fallback;
  return `${formatTime12(from)} - ${formatTime12(to)}`;
};

const getZonedNow = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIME_ZONE,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).formatToParts(now);

  const value = (type) => parts.find((part) => part.type === type)?.value;

  return {
    day: value("weekday"),
    minutes: Number(value("hour")) * 60 + Number(value("minute")),
    seconds: Number(value("second")) || 0,
  };
};

export const getSessionWindow = (booking, now = new Date()) => {
  const startMinutes = toMinutes(booking?.from);
  const endMinutes = toMinutes(booking?.to);

  if (startMinutes === null || endMinutes === null) {
    return { state: "invalid", label: "Invalid time" };
  }

  const zonedNow = getZonedNow(now);
  const currentDay = zonedNow.day || DAYS[now.getDay()];
  if (booking.date && /^\d{4}-\d{2}-\d{2}$/.test(String(booking.date))) {
    const today = getTodayDate(now);
    if (booking.date !== today) {
      return {
        state: booking.date < today ? "expired" : "early",
        label: `Opens ${formatDateLabel(booking.date)} at ${formatTime12(booking.from)}`,
      };
    }
  } else if (booking.day !== currentDay && booking.date !== currentDay) {
    return {
      state: "early",
      label: `Opens ${booking.day || booking.date} at ${formatTime12(booking.from)}`,
    };
  }

  const currentMinutes = zonedNow.minutes;
  if (currentMinutes < startMinutes) {
    return { state: "early", label: `Opens at ${formatTime12(booking.from)}` };
  }
  if (currentMinutes >= endMinutes) {
    return { state: "expired", label: "Time ended" };
  }

  return {
    state: "open",
    label: "Join now",
    remainingMs: (endMinutes - currentMinutes) * 60 * 1000 - zonedNow.seconds * 1000,
  };
};

export const toTime24 = ({ hour, minute, period }) => {
  const hourNumber = Number(hour);
  const hours24 =
    period === "PM" ? (hourNumber % 12) + 12 : hourNumber === 12 ? 0 : hourNumber;
  return `${String(hours24).padStart(2, "0")}:${minute}`;
};

export const fromTime24 = (time = "09:00") => {
  const minutesFromMidnight = toMinutes(time) ?? 9 * 60;
  const hours24 = Math.floor(minutesFromMidnight / 60);
  return {
    hour: String(hours24 % 12 || 12),
    minute: String(minutesFromMidnight % 60).padStart(2, "0"),
    period: hours24 >= 12 ? "PM" : "AM",
  };
};

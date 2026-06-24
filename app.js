const app = document.querySelector("#app");
const homeScreen = document.querySelector("#homeScreen");
const form = document.querySelector("#birthForm");
const submitButton = document.querySelector("#submitButton");
const buttonLabel = document.querySelector(".button-label");
const statusLine = document.querySelector("#locationStatus");
const ambientCanvas = document.querySelector("#ambientCanvas");
const ambientCtx = ambientCanvas.getContext("2d");
const storyScreen = document.querySelector("#storyScreen");
const storyCanvas = document.querySelector("#storyCanvas");
const storyCtx = storyCanvas.getContext("2d");
const editButton = document.querySelector("#editButton");
const downloadButton = document.querySelector("#downloadButton");
const birthDateInput = document.querySelector("#birthDate");
const birthDatePicker = document.querySelector("#birthDatePicker");
const birthPeriodSelect = document.querySelector("#birthPeriod");
const birthTimeInput = document.querySelector("#birthTime");

const zodiac = [
  { ko: "양자리", element: "불", word: "개척자", style: "먼저 불을 붙이는 사람" },
  { ko: "황소자리", element: "흙", word: "수집가", style: "감각을 오래 간직하는 사람" },
  { ko: "쌍둥이자리", element: "공기", word: "메신저", style: "말과 연결로 장면을 바꾸는 사람" },
  { ko: "게자리", element: "물", word: "보호자", style: "분위기와 기억을 품는 사람" },
  { ko: "사자자리", element: "불", word: "태양", style: "자기 빛으로 온도를 만드는 사람" },
  { ko: "처녀자리", element: "흙", word: "정리자", style: "흐트러진 것을 쓸모 있게 다듬는 사람" },
  { ko: "천칭자리", element: "공기", word: "조율자", style: "관계의 균형을 감각적으로 맞추는 사람" },
  { ko: "전갈자리", element: "물", word: "심연", style: "겉보다 깊은 진심을 읽는 사람" },
  { ko: "사수자리", element: "불", word: "탐험가", style: "큰 방향과 가능성을 보는 사람" },
  { ko: "염소자리", element: "흙", word: "건축가", style: "시간을 견디는 구조를 만드는 사람" },
  { ko: "물병자리", element: "공기", word: "발명가", style: "새로운 규칙을 상상하는 사람" },
  { ko: "물고기자리", element: "물", word: "몽상가", style: "보이지 않는 감정의 결을 감지하는 사람" },
];

const weatherCodeMap = {
  0: { label: "맑음", sky: "clear", mood: "투명한", icon: "SUN" },
  1: { label: "대체로 맑음", sky: "partly", mood: "은은한", icon: "SUN" },
  2: { label: "부분적으로 흐림", sky: "partly", mood: "겹을 가진", icon: "CLOUD" },
  3: { label: "흐림", sky: "cloudy", mood: "차분한", icon: "CLOUD" },
  45: { label: "안개", sky: "fog", mood: "몽환적인", icon: "FOG" },
  48: { label: "서리 안개", sky: "fog", mood: "희미한", icon: "FOG" },
  51: { label: "약한 이슬비", sky: "rain", mood: "촉촉한", icon: "RAIN" },
  53: { label: "이슬비", sky: "rain", mood: "스며드는", icon: "RAIN" },
  55: { label: "강한 이슬비", sky: "rain", mood: "깊게 젖은", icon: "RAIN" },
  56: { label: "약한 어는 이슬비", sky: "rain", mood: "차가운", icon: "RAIN" },
  57: { label: "강한 어는 이슬비", sky: "rain", mood: "서늘한", icon: "RAIN" },
  61: { label: "약한 비", sky: "rain", mood: "정화하는", icon: "RAIN" },
  63: { label: "비", sky: "rain", mood: "감정적인", icon: "RAIN" },
  65: { label: "강한 비", sky: "rain", mood: "몰입하는", icon: "RAIN" },
  66: { label: "약한 어는 비", sky: "rain", mood: "투명하게 차가운", icon: "RAIN" },
  67: { label: "강한 어는 비", sky: "rain", mood: "단단한", icon: "RAIN" },
  71: { label: "약한 눈", sky: "snow", mood: "조용한", icon: "SNOW" },
  73: { label: "눈", sky: "snow", mood: "고요한", icon: "SNOW" },
  75: { label: "강한 눈", sky: "snow", mood: "새로 덮는", icon: "SNOW" },
  77: { label: "싸락눈", sky: "snow", mood: "반짝이는", icon: "SNOW" },
  80: { label: "약한 소나기", sky: "rain", mood: "순간적인", icon: "RAIN" },
  81: { label: "소나기", sky: "rain", mood: "빠르게 쏟아지는", icon: "RAIN" },
  82: { label: "강한 소나기", sky: "storm", mood: "강렬한", icon: "STORM" },
  85: { label: "약한 눈 소나기", sky: "snow", mood: "가볍게 흩날리는", icon: "SNOW" },
  86: { label: "강한 눈 소나기", sky: "snow", mood: "거세게 하얀", icon: "SNOW" },
  95: { label: "뇌우", sky: "storm", mood: "번개 같은", icon: "STORM" },
  96: { label: "우박 동반 뇌우", sky: "storm", mood: "격렬한", icon: "STORM" },
  99: { label: "강한 우박 동반 뇌우", sky: "storm", mood: "드문", icon: "STORM" },
};

const fallbackWeather = {
  label: "기록 없음",
  sky: "clear",
  mood: "기록되지 않은",
  icon: "SKY",
  temperature: null,
  humidity: null,
  cloudCover: 22,
  windSpeed: 4,
  precipitation: 0,
  units: {},
};

let latestResult = null;
let storyScene = null;
let storyStartedAt = performance.now();
let ambientScene = seedScene(540, 960, fallbackWeather, { key: "night", isNight: true });

const storyTiming = {
  skyOpen: 2200,
  title: 2520,
  subtitle: 3060,
  sections: 4200,
  footer: 7200,
  duration: 10000,
};

const elementVoice = {
  불: {
    tone: "점화형",
    drive: "먼저 켜고 빠르게 밀어붙입니다",
    feeling: "감정도 솔직하고 뜨겁게 올라옵니다",
    face: "첫인상은 밝고 선명합니다",
  },
  흙: {
    tone: "축적형",
    drive: "오래 보고 확실한 것을 쌓습니다",
    feeling: "감정은 천천히, 오래 남는 쪽입니다",
    face: "첫인상은 안정적이고 믿음직합니다",
  },
  공기: {
    tone: "연결형",
    drive: "말과 연결 속에서 방향을 찾습니다",
    feeling: "생각으로 감정을 정리하려 합니다",
    face: "첫인상은 가볍고 빠르게 열립니다",
  },
  물: {
    tone: "감응형",
    drive: "분위기를 읽고 깊게 반응합니다",
    feeling: "작은 기류에도 마음이 섬세하게 움직입니다",
    face: "첫인상은 부드럽고 깊게 남습니다",
  },
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = readPayload();
  syncNormalizedInputs(payload);

  if (!payload.rawDate || !payload.rawTime || !payload.place) {
    setStatus("출생일, 시간, 장소를 입력해 주세요.", "error");
    return;
  }
  if (!payload.date || !isValidDateString(payload.date)) {
    setStatus("출생일은 930408, 19930408, 1993-04-08 중 편한 방식으로 입력해 주세요.", "error");
    return;
  }
  if (!payload.time || !isValidTimeString(payload.time)) {
    setStatus("시간은 오전/오후 선택 후 1100 또는 11:00 형식으로 입력해 주세요.", "error");
    return;
  }

  setLoading(true);
  setStatus("첫 하늘을 복원하는 중입니다.", "busy");

  try {
    const location = await resolveLocation(payload);
    const utcDate = makeDateInTimeZone(payload.date, payload.time, location.timezone);
    const placements = calculatePlacements(utcDate, location.latitude, location.longitude);
    const weather = await fetchBirthWeather(payload.date, payload.time, location).catch(() => fallbackWeather);
    const phase = getTimePhase(payload.time, weather);
    const profile = buildShareProfile(payload, location, placements, weather, phase);

    latestResult = { payload, location, placements, weather, phase, profile };
    storyScene = seedScene(storyCanvas.width, storyCanvas.height, weather, phase);
    storyStartedAt = performance.now();
    setStatus("스토리가 완성됐습니다.", "ok");
    showStory();
  } catch (error) {
    setStatus(error.message || "첫 하늘을 불러오지 못했습니다.", "error");
  } finally {
    setLoading(false);
  }
});

birthDatePicker.addEventListener("change", () => {
  if (!birthDatePicker.value) return;
  birthDateInput.value = birthDatePicker.value;
});

birthDateInput.addEventListener("blur", () => {
  const normalized = normalizeDateInput(birthDateInput.value);
  if (!normalized) return;
  birthDateInput.value = normalized;
  birthDatePicker.value = normalized;
});

birthTimeInput.addEventListener("blur", () => {
  const normalized = normalizeTimeInput(birthTimeInput.value, birthPeriodSelect.value);
  if (!normalized) return;
  birthPeriodSelect.value = periodFrom24HourTime(normalized);
  birthTimeInput.value = formatTimeFor12HourInput(normalized);
});

editButton.addEventListener("click", () => {
  storyScreen.classList.remove("is-active");
  storyScreen.setAttribute("aria-hidden", "true");
  document.body.classList.remove("story-mode");
});

downloadButton.addEventListener("click", async () => {
  if (!latestResult) return;
  downloadButton.disabled = true;
  downloadButton.textContent = "저장 중";
  try {
    await downloadStoryVideo(latestResult);
  } catch (error) {
    setStatus(error.message || "영상 저장에 실패했습니다.", "error");
  } finally {
    downloadButton.textContent = "영상 저장";
    downloadButton.disabled = false;
  }
});

window.addEventListener("resize", () => {
  resizeAmbient();
  ambientScene = seedScene(ambientCanvas.width, ambientCanvas.height, fallbackWeather, { key: "night", isNight: true });
});

resizeAmbient();
requestAnimationFrame(drawAmbient);
requestAnimationFrame(drawStoryLoop);

function readPayload() {
  const data = new FormData(form);
  const rawDate = String(data.get("birthDate") || "").trim();
  const rawTime = String(data.get("birthTime") || "").trim();
  const period = String(data.get("birthPeriod") || "AM");
  const date = normalizeDateInput(rawDate);
  const time = normalizeTimeInput(rawTime, period);

  return {
    name: String(data.get("personName") || "").trim(),
    rawDate,
    rawTime,
    period,
    date,
    time,
    place: String(data.get("birthPlace") || "").trim(),
    latitude: parseOptionalNumber(data.get("latitude")),
    longitude: parseOptionalNumber(data.get("longitude")),
    timezone: String(data.get("timezone") || "").trim(),
  };
}

function syncNormalizedInputs(payload) {
  if (payload.date) {
    birthDateInput.value = payload.date;
    birthDatePicker.value = payload.date;
  }
  if (payload.time) {
    birthPeriodSelect.value = periodFrom24HourTime(payload.time);
    birthTimeInput.value = formatTimeFor12HourInput(payload.time);
  }
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.classList.toggle("is-loading", isLoading);
  buttonLabel.textContent = isLoading ? "복원 중" : "내 첫 하늘 보기";
}

function setStatus(message, type = "ok") {
  statusLine.textContent = message;
  statusLine.dataset.type = type;
}

function showStory() {
  storyScreen.classList.add("is-active");
  storyScreen.setAttribute("aria-hidden", "false");
  document.body.classList.add("story-mode");
}

function parseOptionalNumber(value) {
  if (value === null || String(value).trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeDateInput(value) {
  const digits = String(value || "").replace(/\D/g, "");
  let year;
  let month;
  let day;

  if (digits.length === 6) {
    const shortYear = Number(digits.slice(0, 2));
    const currentShortYear = new Date().getFullYear() % 100;
    year = shortYear <= currentShortYear ? 2000 + shortYear : 1900 + shortYear;
    month = Number(digits.slice(2, 4));
    day = Number(digits.slice(4, 6));
  } else if (digits.length === 8) {
    year = Number(digits.slice(0, 4));
    month = Number(digits.slice(4, 6));
    day = Number(digits.slice(6, 8));
  } else {
    return null;
  }

  const normalized = `${year}-${pad2(month)}-${pad2(day)}`;
  return isValidDateString(normalized) ? normalized : null;
}

function normalizeTimeInput(value, period = "AM") {
  const text = String(value || "").trim();
  if (!text) return null;

  let hour;
  let minute;
  const colonMatch = text.match(/^(\d{1,2})\s*:\s*(\d{1,2})$/);

  if (colonMatch) {
    hour = Number(colonMatch[1]);
    minute = Number(colonMatch[2]);
  } else {
    const digits = text.replace(/\D/g, "");
    if (!digits || digits.length > 4) return null;
    if (digits.length <= 2) {
      hour = Number(digits);
      minute = 0;
    } else if (digits.length === 3) {
      hour = Number(digits.slice(0, 1));
      minute = Number(digits.slice(1));
    } else {
      hour = Number(digits.slice(0, 2));
      minute = Number(digits.slice(2));
    }
  }

  if (!Number.isInteger(hour) || !Number.isInteger(minute) || minute < 0 || minute > 59) return null;
  if (hour < 0 || hour > 23) return null;

  if (hour === 0 || hour > 12) return `${pad2(hour)}:${pad2(minute)}`;

  const normalizedPeriod = period === "PM" ? "PM" : "AM";
  const normalizedHour = normalizedPeriod === "PM"
    ? (hour === 12 ? 12 : hour + 12)
    : (hour === 12 ? 0 : hour);

  return `${pad2(normalizedHour)}:${pad2(minute)}`;
}

function periodFrom24HourTime(value) {
  const hour = Number(String(value).split(":")[0]);
  return hour >= 12 ? "PM" : "AM";
}

function formatTimeFor12HourInput(value) {
  const [hour, minute] = String(value).split(":").map(Number);
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${pad2(minute)}`;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function isValidDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function isValidTimeString(value) {
  if (!/^\d{2}:\d{2}$/.test(value)) return false;
  const [hour, minute] = value.split(":").map(Number);
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

async function resolveLocation(payload) {
  if ((payload.latitude === null) !== (payload.longitude === null)) {
    throw new Error("좌표는 위도와 경도를 함께 입력해 주세요.");
  }

  if (payload.latitude !== null && payload.longitude !== null) {
    const timezone = payload.timezone || "UTC";
    if (!isValidTimeZone(timezone)) {
      throw new Error("시간대는 Asia/Seoul 형식으로 입력해 주세요.");
    }
    return { name: payload.place, country: "", admin1: "", latitude: payload.latitude, longitude: payload.longitude, timezone };
  }

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", payload.place);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "ko");
  url.searchParams.set("format", "json");

  const response = await fetch(url);
  if (!response.ok) throw new Error("장소 검색에 실패했습니다.");
  const data = await response.json();
  const result = data.results?.[0];
  if (!result) throw new Error("장소를 찾지 못했습니다.");

  return {
    name: result.name,
    country: result.country || "",
    admin1: result.admin1 || "",
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone || "UTC",
  };
}

function isValidTimeZone(timeZone) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

async function fetchBirthWeather(date, time, location) {
  const url = new URL("https://archive-api.open-meteo.com/v1/archive");
  url.searchParams.set("latitude", String(location.latitude));
  url.searchParams.set("longitude", String(location.longitude));
  url.searchParams.set("start_date", date);
  url.searchParams.set("end_date", date);
  url.searchParams.set("hourly", "temperature_2m,relative_humidity_2m,precipitation,weather_code,cloud_cover,wind_speed_10m");
  url.searchParams.set("timezone", location.timezone || "auto");

  const response = await fetch(url);
  if (!response.ok) return fallbackWeather;
  const data = await response.json();
  const hourly = data.hourly;
  if (!hourly?.time?.length) return fallbackWeather;

  const index = findClosestHourIndex(hourly.time, date, time);
  const code = hourly.weather_code?.[index];
  const base = weatherCodeMap[code] || fallbackWeather;

  return {
    ...base,
    code,
    temperature: hourly.temperature_2m?.[index] ?? null,
    humidity: hourly.relative_humidity_2m?.[index] ?? null,
    cloudCover: hourly.cloud_cover?.[index] ?? null,
    windSpeed: hourly.wind_speed_10m?.[index] ?? null,
    precipitation: hourly.precipitation?.[index] ?? null,
    units: data.hourly_units || {},
  };
}

function findClosestHourIndex(times, date, time) {
  const [hour, minute] = time.split(":").map(Number);
  const target = hour * 60 + minute;
  let bestIndex = 0;
  let bestDelta = Infinity;

  times.forEach((value, index) => {
    if (!value.startsWith(date)) return;
    const [, timePart] = value.split("T");
    const [h, m] = timePart.split(":").map(Number);
    const delta = Math.abs(h * 60 + m - target);
    if (delta < bestDelta) {
      bestIndex = index;
      bestDelta = delta;
    }
  });

  return bestIndex;
}

function calculatePlacements(date, latitude, longitude) {
  const jd = toJulianDate(date);
  const sunAnomaly = 357.528 + 0.9856003 * (jd - 2451545.0);
  const sunLon = normalizeDegrees(
    280.46 +
      0.9856474 * (jd - 2451545.0) +
      1.915 * sinDeg(sunAnomaly) +
      0.02 * sinDeg(2 * sunAnomaly)
  );
  const moonLon = calculateMoonLongitude(jd);
  const ascLon = calculateAscendant(jd, latitude, longitude);
  return {
    sun: placementFromLongitude(sunLon),
    moon: placementFromLongitude(moonLon),
    ascendant: placementFromLongitude(ascLon),
  };
}

function calculateMoonLongitude(jd) {
  const d = jd - 2451545.0;
  const l0 = 218.316 + 13.176396 * d;
  const moonAnomaly = 134.963 + 13.064993 * d;
  const sunAnomaly = 357.529 + 0.98560028 * d;
  const elongation = 297.85 + 12.190749 * d;
  const latitudeArg = 93.272 + 13.22935 * d;
  return normalizeDegrees(
    l0 +
      6.289 * sinDeg(moonAnomaly) +
      1.274 * sinDeg(2 * elongation - moonAnomaly) +
      0.658 * sinDeg(2 * elongation) +
      0.214 * sinDeg(2 * moonAnomaly) -
      0.186 * sinDeg(sunAnomaly) -
      0.114 * sinDeg(2 * latitudeArg)
  );
}

function calculateAscendant(jd, latitude, longitude) {
  const t = (jd - 2451545.0) / 36525;
  const gmst = normalizeDegrees(
    280.46061837 +
      360.98564736629 * (jd - 2451545.0) +
      0.000387933 * t * t -
      (t * t * t) / 38710000
  );
  const lst = normalizeDegrees(gmst + longitude);
  const obliquity = 23.439291 - 0.0130042 * t;
  const theta = degToRad(lst);
  const epsilon = degToRad(obliquity);
  const phi = degToRad(latitude);
  const asc = radToDeg(
    Math.atan2(
      -Math.cos(theta),
      Math.sin(theta) * Math.cos(epsilon) + Math.tan(phi) * Math.sin(epsilon)
    )
  );
  return normalizeDegrees(asc);
}

function placementFromLongitude(longitude) {
  const normalized = normalizeDegrees(longitude);
  const index = Math.floor(normalized / 30);
  const degree = Math.floor(normalized % 30);
  return { ...zodiac[index], degree, formatted: `${zodiac[index].ko} ${degree}°` };
}

function getTimePhase(time) {
  const hour = Number(time.split(":")[0]);
  if (hour >= 4 && hour < 7) return { key: "dawn", label: "새벽", isNight: false, sun: 0.22, tone: "새벽" };
  if (hour >= 7 && hour < 11) return { key: "morning", label: "아침", isNight: false, sun: 0.36, tone: "아침" };
  if (hour >= 11 && hour < 17) return { key: "day", label: "낮", isNight: false, sun: 0.68, tone: "한낮" };
  if (hour >= 17 && hour < 20) return { key: "dusk", label: "해질녘", isNight: false, sun: 0.84, tone: "해질녘" };
  if (hour >= 20 && hour < 24) return { key: "night", label: "밤", isNight: true, sun: 0.74, tone: "밤" };
  return { key: "deep-night", label: "심야", isNight: true, sun: 0.12, tone: "심야" };
}

function buildShareProfile(payload, location, placements, weather, phase) {
  const name = payload.name || "나";
  const elementTone = elementVoice[placements.sun.element].tone;
  const typeName = placements.sun.word === placements.moon.word
    ? `${placements.sun.word}형`
    : `${placements.sun.word}형 ${placements.moon.word}`;
  const typeCode = `${placements.sun.ko} · ${placements.moon.ko} · ${placements.ascendant.ko}`;
  const place = formatLocationName(location);
  const tags = [`#${placements.sun.word}형`, `#${placements.moon.word}감정`, `#${placements.ascendant.word}첫인상`];
  const signature = `${placements.sun.word}로 움직이고 ${placements.moon.word}로 느끼며 ${placements.ascendant.word}로 보이는 사람`;
  const weatherNote = `${phase.label} 하늘 · ${weather.label}`;

  return {
    name,
    typeName,
    typeCode,
    tags,
    dateLine: `${payload.date} ${payload.time} · ${place}`,
    signature,
    weatherNote,
    placements: [
      `태양 ${placements.sun.ko}`,
      `달 ${placements.moon.ko}`,
      `상승 ${placements.ascendant.ko}`,
    ],
    sections: buildAstroSections(placements),
    elementTone,
    weatherLine: [
      weather.temperature !== null ? `${round(weather.temperature)}°C` : null,
      weather.cloudCover !== null ? `구름 ${round(weather.cloudCover)}%` : null,
      weather.windSpeed !== null ? `바람 ${round(weather.windSpeed)}km/h` : null,
    ].filter(Boolean).join(" · "),
  };
}

function buildAstroSections(placements) {
  const sunVoice = elementVoice[placements.sun.element];
  const moonVoice = elementVoice[placements.moon.element];
  const ascVoice = elementVoice[placements.ascendant.element];

  return [
    {
      label: "태양",
      role: "움직이는 방식",
      sign: placements.sun.ko,
      title: `${placements.sun.ko} · ${placements.sun.word}`,
      body: `${sunVoice.drive}.`,
    },
    {
      label: "달",
      role: "느끼는 방식",
      sign: placements.moon.ko,
      title: `${placements.moon.ko} · ${placements.moon.word}`,
      body: `${moonVoice.feeling}.`,
    },
    {
      label: "상승",
      role: "보이는 인상",
      sign: placements.ascendant.ko,
      title: `${placements.ascendant.ko} · ${placements.ascendant.word}`,
      body: `${ascVoice.face}.`,
    },
  ];
}

function formatLocationName(location) {
  return [location.name, location.admin1, location.country].filter(Boolean).join(", ");
}

function makeDateInTimeZone(date, time, timeZone) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  let utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  for (let index = 0; index < 3; index += 1) {
    const offset = getTimeZoneOffset(utcDate, timeZone);
    utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0) - offset);
  }
  return utcDate;
}

function getTimeZoneOffset(date, timeZone) {
  if (!timeZone || timeZone === "UTC") return 0;
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = formatter.formatToParts(date).reduce((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {});
  return Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  ) - date.getTime();
}

function toJulianDate(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360;
}

function sinDeg(value) {
  return Math.sin(degToRad(value));
}

function degToRad(value) {
  return (value * Math.PI) / 180;
}

function radToDeg(value) {
  return (value * 180) / Math.PI;
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function resizeAmbient() {
  const ratio = window.devicePixelRatio || 1;
  ambientCanvas.width = Math.floor(window.innerWidth * ratio);
  ambientCanvas.height = Math.floor(window.innerHeight * ratio);
  ambientCanvas.style.width = `${window.innerWidth}px`;
  ambientCanvas.style.height = `${window.innerHeight}px`;
  ambientCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function seedScene(width, height, weather, phase) {
  const sky = weather.sky || "clear";
  const cloudCover = weather.cloudCover ?? (sky === "cloudy" ? 86 : 24);
  const wind = weather.windSpeed ?? 4;
  return {
    stars: Array.from({ length: phase.isNight ? 160 : 48 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.62,
      r: 0.8 + Math.random() * 2.8,
      a: 0.2 + Math.random() * 0.65,
      phase: Math.random() * Math.PI * 2,
    })),
    clouds: Array.from({ length: Math.max(3, Math.round(cloudCover / 18)) }, () => ({
      x: Math.random() * width,
      y: height * (0.12 + Math.random() * 0.38),
      s: width * (0.2 + Math.random() * 0.24),
      speed: 0.18 + Math.random() * 0.32 + wind * 0.018,
      a: sky === "fog" ? 0.48 : sky === "cloudy" ? 0.34 + Math.random() * 0.2 : 0.2 + Math.random() * 0.22,
    })),
    rain: Array.from({ length: sky === "storm" ? 240 : sky === "rain" ? 180 : 0 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      l: 32 + Math.random() * 44,
      speed: 15 + Math.random() * 20 + wind * 0.2,
      a: 0.26 + Math.random() * 0.34,
    })),
    snow: Array.from({ length: sky === "snow" ? 170 : 0 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 2 + Math.random() * 5,
      speed: 0.8 + Math.random() * 2.4,
      drift: 0.8 + Math.random() * 2,
      a: 0.36 + Math.random() * 0.44,
    })),
    motes: Array.from({ length: sky === "fog" ? 160 : 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 4,
      speed: 0.15 + Math.random() * 0.45,
      a: 0.05 + Math.random() * 0.12,
    })),
  };
}

function drawAmbient(now) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const result = {
    phase: { key: "night", isNight: true, sun: 0.74 },
    weather: fallbackWeather,
    profile: {
      typeName: "첫 하늘",
      typeCode: "FIRST SKY",
      temp: "--",
      tags: ["#birth", "#sky", "#weather"],
      lines: ["태어난 순간의 하늘을 복원합니다."],
      dateLine: "",
      placements: [],
      weatherLine: "",
    },
  };
  renderSkyFrame(ambientCtx, width, height, now, result, ambientScene, { text: false, soft: true });
  requestAnimationFrame(drawAmbient);
}

function drawStoryLoop(now) {
  if (latestResult && storyScreen.classList.contains("is-active")) {
    renderSkyFrame(storyCtx, storyCanvas.width, storyCanvas.height, now - storyStartedAt, latestResult, storyScene, { text: true });
  }
  requestAnimationFrame(drawStoryLoop);
}

function renderSkyFrame(targetCtx, width, height, elapsed, result, scene, options = {}) {
  drawBackground(targetCtx, width, height, result.phase, result.weather);
  drawLightRibbons(targetCtx, width, height, elapsed, result);
  drawAstro(targetCtx, width, height, elapsed, options.soft);
  drawOrb(targetCtx, width, height, elapsed, result.phase);
  drawStars(targetCtx, elapsed, result, scene);
  drawClouds(targetCtx, width, height, scene, result.weather);
  drawWeather(targetCtx, width, height, elapsed, result, scene);
  drawHorizon(targetCtx, width, height, elapsed);
  if (options.opening !== false) drawOpeningVeil(targetCtx, width, height, elapsed, result);
  if (options.text) drawStoryText(targetCtx, width, height, elapsed, result);
}

function drawBackground(targetCtx, width, height, phase, weather) {
  const palettes = {
    "deep-night": ["#02060b", "#0a1723", "#17353b"],
    dawn: ["#17233a", "#658e99", "#df9d72"],
    morning: ["#72bacb", "#b6ddc0", "#efbd76"],
    day: ["#6dbed2", "#a6d8c6", "#eab76f"],
    dusk: ["#35445e", "#b57970", "#de9a61"],
    night: ["#061018", "#143144", "#455d68"],
  };
  const colors = palettes[phase.key] || palettes.night;
  const gradient = targetCtx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(0.48, ["rain", "storm"].includes(weather.sky) ? shadeColor(colors[1], -24) : colors[1]);
  gradient.addColorStop(1, weather.sky === "fog" ? "#b7ad99" : colors[2]);
  targetCtx.fillStyle = gradient;
  targetCtx.fillRect(0, 0, width, height);

  const glow = targetCtx.createRadialGradient(width * 0.68, height * 0.25, 20, width * 0.68, height * 0.25, width * 0.72);
  glow.addColorStop(0, phase.isNight ? "rgba(245, 236, 210, 0.2)" : "rgba(255, 224, 140, 0.36)");
  glow.addColorStop(1, "rgba(255, 224, 140, 0)");
  targetCtx.fillStyle = glow;
  targetCtx.fillRect(0, 0, width, height);
}

function drawLightRibbons(targetCtx, width, height, elapsed, result) {
  targetCtx.save();
  targetCtx.globalAlpha = result.weather.sky === "fog" ? 0.2 : 0.14;
  targetCtx.strokeStyle = result.phase.isNight ? "#afe7dc" : "#fff0bf";
  targetCtx.lineWidth = width > 800 ? 3 : 1.6;
  for (let i = 0; i < 8; i += 1) {
    const y = height * (0.12 + i * 0.075);
    const drift = Math.sin(elapsed / 1500 + i) * width * 0.06;
    targetCtx.beginPath();
    targetCtx.moveTo(-width * 0.12, y);
    targetCtx.bezierCurveTo(width * 0.25 + drift, y - height * 0.035, width * 0.7 - drift, y + height * 0.045, width * 1.12, y - height * 0.01);
    targetCtx.stroke();
  }
  targetCtx.restore();
}

function drawAstro(targetCtx, width, height, elapsed, soft = false) {
  const cx = width * 0.54;
  const cy = height * 0.34;
  const radius = width * 0.38;
  targetCtx.save();
  targetCtx.translate(cx, cy);
  targetCtx.rotate(elapsed / 52000);
  targetCtx.strokeStyle = soft ? "rgba(255,248,236,0.08)" : "rgba(255,248,236,0.16)";
  targetCtx.lineWidth = width > 800 ? 2 : 1;
  for (let i = 0; i < 4; i += 1) {
    targetCtx.beginPath();
    targetCtx.arc(0, 0, radius * (0.42 + i * 0.17), 0, Math.PI * 2);
    targetCtx.stroke();
  }
  for (let i = 0; i < 12; i += 1) {
    const angle = (Math.PI * 2 * i) / 12;
    targetCtx.beginPath();
    targetCtx.moveTo(Math.cos(angle) * radius * 0.42, Math.sin(angle) * radius * 0.42);
    targetCtx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    targetCtx.stroke();
  }
  targetCtx.restore();
}

function drawOrb(targetCtx, width, height, elapsed, phase) {
  const orbit = phase.sun ?? 0.7;
  const x = width * (0.14 + orbit * 0.72);
  const arc = Math.sin(Math.PI * Math.min(0.96, Math.max(0.04, orbit)));
  const y = height * (0.56 - arc * 0.38);
  const radius = width * 0.085;
  targetCtx.save();
  if (phase.isNight) {
    const glow = targetCtx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 4.2);
    glow.addColorStop(0, "rgba(255,248,222,0.62)");
    glow.addColorStop(1, "rgba(255,248,222,0)");
    targetCtx.fillStyle = glow;
    targetCtx.beginPath();
    targetCtx.arc(x, y, radius * 4.2, 0, Math.PI * 2);
    targetCtx.fill();
    targetCtx.fillStyle = "#f5ecd8";
    targetCtx.beginPath();
    targetCtx.arc(x, y, radius, 0, Math.PI * 2);
    targetCtx.fill();
    targetCtx.globalCompositeOperation = "destination-out";
    targetCtx.beginPath();
    targetCtx.arc(x + radius * 0.38, y - radius * 0.08, radius * 0.86, 0, Math.PI * 2);
    targetCtx.fill();
  } else {
    const pulse = 1 + Math.sin(elapsed / 950) * 0.03;
    const glow = targetCtx.createRadialGradient(x, y, radius * 0.1, x, y, radius * 4.8);
    glow.addColorStop(0, "rgba(255,233,158,0.95)");
    glow.addColorStop(0.35, "rgba(241,191,119,0.44)");
    glow.addColorStop(1, "rgba(241,191,119,0)");
    targetCtx.fillStyle = glow;
    targetCtx.beginPath();
    targetCtx.arc(x, y, radius * 4.8 * pulse, 0, Math.PI * 2);
    targetCtx.fill();
  }
  targetCtx.restore();
}

function drawStars(targetCtx, elapsed, result, scene) {
  targetCtx.save();
  scene.stars.forEach((star) => {
    const alpha = (star.a + Math.sin(elapsed / 620 + star.phase) * 0.22) * (result.phase.isNight ? 1 : 0.25);
    targetCtx.globalAlpha = Math.max(0.05, alpha);
    targetCtx.fillStyle = "#fff7d6";
    targetCtx.beginPath();
    targetCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    targetCtx.fill();
  });
  targetCtx.restore();
}

function drawClouds(targetCtx, width, height, scene, weather) {
  if (!["partly", "cloudy", "rain", "snow", "fog", "storm"].includes(weather.sky)) return;
  targetCtx.save();
  scene.clouds.forEach((cloud) => {
    cloud.x += cloud.speed;
    if (cloud.x - cloud.s > width) cloud.x = -cloud.s * 1.5;
    targetCtx.globalAlpha = cloud.a;
    drawSoftCloud(targetCtx, cloud.x, cloud.y, cloud.s);
  });
  targetCtx.restore();
}

function drawSoftCloud(targetCtx, x, y, size) {
  const gradient = targetCtx.createLinearGradient(x - size * 0.4, y - size * 0.22, x + size, y + size * 0.24);
  gradient.addColorStop(0, "rgba(255,248,230,0)");
  gradient.addColorStop(0.35, "rgba(255,248,230,0.78)");
  gradient.addColorStop(1, "rgba(255,248,230,0.18)");
  targetCtx.fillStyle = gradient;
  targetCtx.beginPath();
  targetCtx.ellipse(x, y, size * 0.48, size * 0.22, 0, 0, Math.PI * 2);
  targetCtx.ellipse(x + size * 0.34, y - size * 0.08, size * 0.42, size * 0.2, 0, 0, Math.PI * 2);
  targetCtx.ellipse(x + size * 0.72, y + size * 0.02, size * 0.38, size * 0.18, 0, 0, Math.PI * 2);
  targetCtx.fill();

  targetCtx.fillStyle = "rgba(255,248,230,0.16)";
  targetCtx.beginPath();
  targetCtx.ellipse(x + size * 0.2, y + size * 0.12, size * 0.72, size * 0.12, 0, 0, Math.PI * 2);
  targetCtx.fill();
}

function drawWeather(targetCtx, width, height, elapsed, result, scene) {
  const sky = result.weather.sky;
  const wind = result.weather.windSpeed ?? 4;
  if (wind > 7 || ["rain", "snow", "storm"].includes(sky)) drawWind(targetCtx, width, height, elapsed, wind, result.phase);
  if (sky === "rain" || sky === "storm") drawRain(targetCtx, width, height, scene);
  if (sky === "snow") drawSnow(targetCtx, width, height, elapsed, scene);
  if (sky === "fog") drawFog(targetCtx, width, height, elapsed);
  if (sky === "storm") drawLightning(targetCtx, width, height, elapsed);
  drawMotes(targetCtx, width, height, elapsed, result, scene);
}

function drawWind(targetCtx, width, height, elapsed, wind, phase) {
  targetCtx.save();
  targetCtx.globalAlpha = Math.min(0.24, 0.08 + wind / 90);
  targetCtx.strokeStyle = phase.isNight ? "#dffaf3" : "#fff8dd";
  targetCtx.lineWidth = width > 800 ? 2.2 : 1.2;
  for (let i = 0; i < 12; i += 1) {
    const y = height * (0.13 + i * 0.063);
    const x = ((elapsed / (46 - Math.min(wind, 34))) + i * 131) % (width + 360) - 240;
    targetCtx.beginPath();
    targetCtx.moveTo(x, y);
    targetCtx.bezierCurveTo(x + 90, y - 22, x + 180, y + 30, x + 310, y - 8);
    targetCtx.stroke();
  }
  targetCtx.restore();
}

function drawRain(targetCtx, width, height, scene) {
  targetCtx.save();
  targetCtx.strokeStyle = "rgba(216,238,246,0.84)";
  targetCtx.lineWidth = width > 800 ? 2 : 1;
  scene.rain.forEach((drop) => {
    drop.y += drop.speed;
    drop.x -= 3.6;
    if (drop.y > height + drop.l) {
      drop.y = -drop.l;
      drop.x = Math.random() * width;
    }
    if (drop.x < -80) drop.x = width + 80;
    targetCtx.globalAlpha = drop.a;
    targetCtx.beginPath();
    targetCtx.moveTo(drop.x, drop.y);
    targetCtx.lineTo(drop.x - 12, drop.y + drop.l);
    targetCtx.stroke();
  });
  targetCtx.restore();
}

function drawSnow(targetCtx, width, height, elapsed, scene) {
  targetCtx.save();
  targetCtx.fillStyle = "#fffaf0";
  scene.snow.forEach((flake) => {
    flake.y += flake.speed;
    flake.x += Math.sin(elapsed / 900 + flake.y * 0.02) * flake.drift * 0.14;
    if (flake.y > height + 12) {
      flake.y = -12;
      flake.x = Math.random() * width;
    }
    targetCtx.globalAlpha = flake.a;
    targetCtx.beginPath();
    targetCtx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
    targetCtx.fill();
  });
  targetCtx.restore();
}

function drawFog(targetCtx, width, height, elapsed) {
  targetCtx.save();
  targetCtx.globalAlpha = 0.18;
  targetCtx.strokeStyle = "#fff4df";
  targetCtx.lineWidth = width > 800 ? 42 : 22;
  for (let i = 0; i < 9; i += 1) {
    const y = height * (0.14 + i * 0.08);
    const drift = Math.sin(elapsed / 1400 + i) * width * 0.06;
    targetCtx.beginPath();
    targetCtx.moveTo(-150, y);
    targetCtx.bezierCurveTo(width * 0.25 + drift, y - 42, width * 0.7 - drift, y + 46, width + 150, y);
    targetCtx.stroke();
  }
  targetCtx.restore();
}

function drawLightning(targetCtx, width, height, elapsed) {
  const cycle = elapsed % 4200;
  if (cycle > 360) return;
  const flash = Math.sin((cycle / 360) * Math.PI);
  if (flash < 0.35) return;
  targetCtx.save();
  targetCtx.globalAlpha = flash * 0.3;
  targetCtx.fillStyle = "#fff7c2";
  targetCtx.fillRect(0, 0, width, height);
  targetCtx.globalAlpha = flash;
  targetCtx.strokeStyle = "#fff9bc";
  targetCtx.lineWidth = width > 800 ? 6 : 3;
  const x = width * 0.28;
  targetCtx.beginPath();
  targetCtx.moveTo(x, 0);
  targetCtx.lineTo(x + 70, height * 0.16);
  targetCtx.lineTo(x + 30, height * 0.16);
  targetCtx.lineTo(x + 118, height * 0.36);
  targetCtx.lineTo(x + 68, height * 0.34);
  targetCtx.lineTo(x + 152, height * 0.56);
  targetCtx.stroke();
  targetCtx.restore();
}

function drawMotes(targetCtx, width, height, elapsed, result, scene) {
  targetCtx.save();
  scene.motes.forEach((mote) => {
    mote.y -= mote.speed;
    mote.x += Math.sin(elapsed / 1100 + mote.y * 0.02) * 0.2;
    if (mote.y < -10) {
      mote.y = height + 10;
      mote.x = Math.random() * width;
    }
    targetCtx.globalAlpha = result.weather.sky === "fog" ? mote.a * 2 : mote.a;
    targetCtx.fillStyle = result.phase.isNight ? "#dffaf3" : "#fff7dc";
    targetCtx.beginPath();
    targetCtx.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
    targetCtx.fill();
  });
  targetCtx.restore();
}

function drawHorizon(targetCtx, width, height, elapsed) {
  const base = height * 0.78;
  const drift = Math.sin(elapsed / 3600) * height * 0.01;
  const gradient = targetCtx.createLinearGradient(0, base - height * 0.08, 0, height);
  gradient.addColorStop(0, "rgba(8,22,22,0)");
  gradient.addColorStop(0.5, "rgba(8,22,22,0.34)");
  gradient.addColorStop(1, "rgba(2,8,9,0.82)");
  targetCtx.fillStyle = gradient;
  targetCtx.beginPath();
  targetCtx.moveTo(0, base + height * 0.02);
  targetCtx.bezierCurveTo(width * 0.2, base - height * 0.04 + drift, width * 0.36, base + height * 0.01, width * 0.52, base - height * 0.03);
  targetCtx.bezierCurveTo(width * 0.7, base - height * 0.06 - drift, width * 0.86, base + height * 0.01, width, base - height * 0.035);
  targetCtx.lineTo(width, height);
  targetCtx.lineTo(0, height);
  targetCtx.closePath();
  targetCtx.fill();
}

function drawOpeningVeil(targetCtx, width, height, elapsed, result) {
  const progress = easeInOutCubic(clamp01(elapsed / storyTiming.skyOpen));
  if (progress >= 1) return;

  const centerY = height * 0.36;
  const topEdge = centerY * (1 - progress);
  const bottomEdge = centerY + (height - centerY) * progress;
  const edgeAlpha = 0.34 + Math.sin(progress * Math.PI) * 0.42;

  targetCtx.save();
  targetCtx.shadowColor = result.phase.isNight ? "rgba(168,232,224,0.24)" : "rgba(255,216,142,0.22)";
  targetCtx.shadowBlur = width * 0.06;

  if (topEdge > 1) {
    const topGradient = targetCtx.createLinearGradient(0, 0, 0, topEdge);
    topGradient.addColorStop(0, "rgba(2,6,10,0.98)");
    topGradient.addColorStop(1, "rgba(2,6,10,0.66)");
    targetCtx.fillStyle = topGradient;
    targetCtx.fillRect(0, 0, width, topEdge + 3);
  }

  if (bottomEdge < height - 1) {
    const bottomGradient = targetCtx.createLinearGradient(0, bottomEdge, 0, height);
    bottomGradient.addColorStop(0, "rgba(2,6,10,0.62)");
    bottomGradient.addColorStop(1, "rgba(2,6,10,0.98)");
    targetCtx.fillStyle = bottomGradient;
    targetCtx.fillRect(0, bottomEdge - 3, width, height - bottomEdge + 3);
  }

  targetCtx.globalCompositeOperation = "screen";
  targetCtx.globalAlpha = edgeAlpha;
  const slit = targetCtx.createLinearGradient(0, topEdge - 10, 0, bottomEdge + 10);
  slit.addColorStop(0, "rgba(255,255,255,0)");
  slit.addColorStop(0.5, result.phase.isNight ? "rgba(173,245,232,0.72)" : "rgba(255,230,162,0.68)");
  slit.addColorStop(1, "rgba(255,255,255,0)");
  targetCtx.fillStyle = slit;
  targetCtx.fillRect(width * 0.08, topEdge - 12, width * 0.84, Math.max(24, bottomEdge - topEdge + 24));

  const bloom = targetCtx.createRadialGradient(
    width * 0.5,
    centerY,
    width * 0.08,
    width * 0.5,
    centerY,
    width * (0.28 + progress * 0.68)
  );
  bloom.addColorStop(0, result.phase.isNight ? "rgba(171,245,232,0.42)" : "rgba(255,226,158,0.38)");
  bloom.addColorStop(1, "rgba(255,255,255,0)");
  targetCtx.fillStyle = bloom;
  targetCtx.fillRect(0, 0, width, height);
  targetCtx.restore();
}

function drawStoryText(targetCtx, width, height, elapsed, result) {
  const { profile } = result;
  const margin = width * 0.07;
  const contentWidth = width - margin * 2;
  const titleAlpha = reveal(elapsed, storyTiming.title, 820);
  const metaAlpha = reveal(elapsed, storyTiming.subtitle, 740);
  const tagAlpha = reveal(elapsed, storyTiming.subtitle + 360, 700);
  const footerAlpha = reveal(elapsed, storyTiming.footer, 760);

  targetCtx.save();
  targetCtx.textBaseline = "top";

  drawTextScrim(targetCtx, width, height, elapsed);

  targetCtx.shadowColor = "rgba(0,0,0,0.42)";
  targetCtx.shadowBlur = 30;

  withCanvasReveal(targetCtx, titleAlpha, width * 0.035, () => {
    targetCtx.fillStyle = "#9ee6d5";
    targetCtx.font = `800 ${width * 0.026}px 'IBM Plex Sans KR', sans-serif`;
    targetCtx.fillText("FIRST SKY TYPE", margin, height * 0.355);

    targetCtx.fillStyle = "#fffaf0";
    targetCtx.font = `700 ${width * 0.086}px 'Gowun Batang', serif`;
    wrapCanvasText(targetCtx, profile.typeName, margin, height * 0.392, contentWidth, width * 0.095, 2);
  });

  withCanvasReveal(targetCtx, metaAlpha, width * 0.026, () => {
    targetCtx.fillStyle = "rgba(255,250,240,0.82)";
    targetCtx.font = `700 ${width * 0.032}px 'IBM Plex Sans KR', sans-serif`;
    wrapCanvasText(targetCtx, profile.signature, margin, height * 0.505, contentWidth, width * 0.046, 2);

    targetCtx.fillStyle = "#f1bf77";
    targetCtx.font = `800 ${width * 0.027}px 'IBM Plex Sans KR', sans-serif`;
    wrapCanvasText(targetCtx, profile.typeCode, margin, height * 0.575, contentWidth, width * 0.038, 1);
  });

  withCanvasReveal(targetCtx, tagAlpha, width * 0.02, () => {
    drawTagRow(targetCtx, profile.tags, margin, height * 0.615, width);
  });

  const sectionY = height * 0.65;
  const sectionH = height * 0.076;
  const gap = height * 0.015;
  const sections = profile.sections || [];
  sections.forEach((section, index) => {
    const sectionAlpha = reveal(elapsed, storyTiming.sections + index * 520, 720);
    withCanvasReveal(targetCtx, sectionAlpha, width * 0.03, () => {
      drawStorySection(targetCtx, section, margin, sectionY + index * (sectionH + gap), contentWidth, sectionH, width);
    });
  });

  withCanvasReveal(targetCtx, footerAlpha, width * 0.02, () => {
    const footerY = height * 0.945;
    targetCtx.shadowBlur = 0;
    targetCtx.fillStyle = "rgba(255,250,240,0.62)";
    targetCtx.font = `700 ${width * 0.024}px 'IBM Plex Sans KR', sans-serif`;
    targetCtx.fillText("첫 하늘 · FIRST SKY", margin, footerY);
    targetCtx.textAlign = "right";
    targetCtx.fillStyle = "rgba(158,230,213,0.78)";
    targetCtx.fillText(profile.weatherNote, width - margin, footerY);
    targetCtx.textAlign = "left";
  });
  targetCtx.restore();
}

function drawTextScrim(targetCtx, width, height, elapsed) {
  const alpha = 0.88 * reveal(elapsed, storyTiming.skyOpen - 360, 1100);
  if (alpha <= 0.01) return;

  targetCtx.save();
  targetCtx.globalAlpha = alpha;
  const gradient = targetCtx.createLinearGradient(0, height * 0.24, 0, height);
  gradient.addColorStop(0, "rgba(1,5,8,0)");
  gradient.addColorStop(0.28, "rgba(1,5,8,0.18)");
  gradient.addColorStop(0.64, "rgba(1,5,8,0.62)");
  gradient.addColorStop(1, "rgba(1,5,8,0.9)");
  targetCtx.fillStyle = gradient;
  targetCtx.fillRect(0, height * 0.24, width, height * 0.76);
  targetCtx.restore();
}

function drawStorySection(targetCtx, section, x, y, width, height, canvasWidth) {
  const padX = canvasWidth * 0.035;
  const padY = canvasWidth * 0.023;
  const accent = canvasWidth * 0.012;

  targetCtx.save();
  targetCtx.shadowBlur = 0;
  targetCtx.fillStyle = "rgba(255,250,240,0.072)";
  targetCtx.strokeStyle = "rgba(255,250,240,0.13)";
  roundRect(targetCtx, x, y, width, height, canvasWidth * 0.022);
  targetCtx.fill();
  targetCtx.stroke();

  targetCtx.fillStyle = "#9ee6d5";
  targetCtx.beginPath();
  targetCtx.arc(x + padX, y + padY + accent, accent, 0, Math.PI * 2);
  targetCtx.fill();

  targetCtx.fillStyle = "rgba(255,250,240,0.62)";
  targetCtx.font = `800 ${canvasWidth * 0.022}px 'IBM Plex Sans KR', sans-serif`;
  targetCtx.fillText(`${section.label} · ${section.role}`, x + padX + accent * 2.2, y + padY - canvasWidth * 0.004);

  targetCtx.fillStyle = "#fffaf0";
  targetCtx.font = `800 ${canvasWidth * 0.031}px 'IBM Plex Sans KR', sans-serif`;
  targetCtx.fillText(section.title, x + padX, y + padY + canvasWidth * 0.038);

  targetCtx.fillStyle = "rgba(255,250,240,0.78)";
  targetCtx.font = `600 ${canvasWidth * 0.025}px 'IBM Plex Sans KR', sans-serif`;
  wrapCanvasText(targetCtx, section.body, x + padX, y + padY + canvasWidth * 0.077, width - padX * 2, canvasWidth * 0.036, 1);
  targetCtx.restore();
}

function withCanvasReveal(targetCtx, alpha, offsetY, draw) {
  if (alpha <= 0.01) return;
  targetCtx.save();
  targetCtx.globalAlpha *= alpha;
  targetCtx.translate(0, offsetY * (1 - alpha));
  draw();
  targetCtx.restore();
}

function reveal(elapsed, start, duration) {
  return easeOutCubic(clamp01((elapsed - start) / duration));
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function drawPlacementPills(targetCtx, items, x, y, maxWidth, width) {
  let cursor = x;
  const rowGap = width * 0.015;
  const pillH = width * 0.062;
  targetCtx.save();
  targetCtx.font = `800 ${width * 0.026}px 'IBM Plex Sans KR', sans-serif`;
  items.forEach((item) => {
    const pillW = Math.min(maxWidth, targetCtx.measureText(item).width + 32);
    if (cursor + pillW > x + maxWidth) {
      cursor = x;
      y += pillH + rowGap;
    }
    targetCtx.fillStyle = "rgba(255,250,240,0.12)";
    targetCtx.strokeStyle = "rgba(255,250,240,0.18)";
    roundRect(targetCtx, cursor, y, pillW, pillH, 999);
    targetCtx.fill();
    targetCtx.stroke();
    targetCtx.fillStyle = "#fffaf0";
    targetCtx.fillText(item, cursor + 16, y + width * 0.014);
    cursor += pillW + rowGap;
  });
  targetCtx.restore();
}

function drawTagRow(targetCtx, tags, x, y, width) {
  let cursor = x;
  targetCtx.save();
  targetCtx.font = `800 ${width * 0.028}px 'IBM Plex Sans KR', sans-serif`;
  tags.forEach((tag) => {
    const textWidth = targetCtx.measureText(tag).width;
    const pillW = textWidth + 34;
    targetCtx.fillStyle = "rgba(255,250,240,0.15)";
    targetCtx.strokeStyle = "rgba(255,250,240,0.22)";
    roundRect(targetCtx, cursor, y, pillW, width * 0.058, 999);
    targetCtx.fill();
    targetCtx.stroke();
    targetCtx.fillStyle = "#fffaf0";
    targetCtx.fillText(tag, cursor + 17, y + width * 0.012);
    cursor += pillW + 12;
  });
  targetCtx.restore();
}

function wrapCanvasText(targetCtx, text, x, y, maxWidth, lineHeight, maxLines = Infinity) {
  const words = String(text).split(/\s+/);
  let line = "";
  let lineCount = 0;
  for (let index = 0; index < words.length; index += 1) {
    if (lineCount >= maxLines) break;
    const word = words[index];
    const testLine = line ? `${line} ${word}` : word;
    if (targetCtx.measureText(testLine).width > maxWidth && line) {
      targetCtx.fillText(line, x, y + lineCount * lineHeight);
      line = word;
      lineCount += 1;
    } else {
      line = testLine;
    }
    if (index === words.length - 1 && lineCount < maxLines) {
      targetCtx.fillText(line, x, y + lineCount * lineHeight);
    }
  }
}

function roundRect(targetCtx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  targetCtx.beginPath();
  targetCtx.moveTo(x + r, y);
  targetCtx.lineTo(x + width - r, y);
  targetCtx.quadraticCurveTo(x + width, y, x + width, y + r);
  targetCtx.lineTo(x + width, y + height - r);
  targetCtx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  targetCtx.lineTo(x + r, y + height);
  targetCtx.quadraticCurveTo(x, y + height, x, y + height - r);
  targetCtx.lineTo(x, y + r);
  targetCtx.quadraticCurveTo(x, y, x + r, y);
  targetCtx.closePath();
}

async function downloadStoryVideo(result) {
  if (typeof MediaRecorder === "undefined") throw new Error("이 브라우저는 영상 저장을 지원하지 않습니다.");
  if (document.fonts?.ready) await document.fonts.ready;
  const stream = storyCanvas.captureStream?.(30);
  if (!stream) throw new Error("이 브라우저는 영상 저장을 지원하지 않습니다.");
  const mimeType = pickVideoMimeType();
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  const chunks = [];
  const duration = storyTiming.duration;
  const scene = seedScene(storyCanvas.width, storyCanvas.height, result.weather, result.phase);

  const recording = new Promise((resolve, reject) => {
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onerror = () => reject(new Error("영상 기록 중 오류가 발생했습니다."));
    recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
  });

  recorder.start();
  await new Promise((resolve) => {
    const startedAt = performance.now();
    const frame = (now) => {
      const elapsed = now - startedAt;
      renderSkyFrame(storyCtx, storyCanvas.width, storyCanvas.height, elapsed, result, scene, { text: true });
      if (elapsed < duration) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
  recorder.stop();

  const blob = await recording;
  const extension = (recorder.mimeType || mimeType || "").includes("mp4") ? "mp4" : "webm";
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `first-sky-${result.payload.date}.${extension}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function pickVideoMimeType() {
  return [
    "video/mp4;codecs=h264",
    "video/mp4",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ].find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function shadeColor(color, percent) {
  const value = parseInt(color.replace("#", ""), 16);
  const amount = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (value >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((value >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (value & 0x0000ff) + amount));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

const form = document.querySelector("#birthForm");
const submitButton = document.querySelector("#submitButton");
const buttonLabel = document.querySelector(".button-label");
const statusLine = document.querySelector("#locationStatus");
const skyStage = document.querySelector("#skyStage");
const canvas = document.querySelector("#skyCanvas");
const ctx = canvas.getContext("2d");

const readingEyebrow = document.querySelector("#readingEyebrow");
const readingTitle = document.querySelector("#readingTitle");
const weatherCondition = document.querySelector("#weatherCondition");
const weatherTemperature = document.querySelector("#weatherTemperature");
const weatherSummary = document.querySelector("#weatherSummary");
const placementGrid = document.querySelector("#placementGrid");
const readingText = document.querySelector("#readingText");
const storyButton = document.querySelector("#storyButton");
const storyOverlay = document.querySelector("#storyOverlay");
const storyCloseButton = document.querySelector("#storyCloseButton");
const storyDownloadButton = document.querySelector("#storyDownloadButton");
const storyPreviewCanvas = document.querySelector("#storyPreviewCanvas");
const storyPreviewCtx = storyPreviewCanvas.getContext("2d");

const zodiac = [
  { key: "aries", ko: "양자리", element: "불", tone: "먼저 불을 붙이는 힘", text: "빠르게 반응하고 시작점에 서는 감각이 강합니다." },
  { key: "taurus", ko: "황소자리", element: "흙", tone: "감각을 오래 붙드는 힘", text: "느리더라도 확실하게 쌓아가는 결이 있습니다." },
  { key: "gemini", ko: "쌍둥이자리", element: "공기", tone: "말과 연결을 여는 힘", text: "정보를 잡아내고 장면을 가볍게 전환하는 재능이 있습니다." },
  { key: "cancer", ko: "게자리", element: "물", tone: "기억과 보호의 힘", text: "사람과 장소의 온도를 오래 품는 편입니다." },
  { key: "leo", ko: "사자자리", element: "불", tone: "자기 빛을 세우는 힘", text: "존재감을 숨기기보다 따뜻하게 드러낼 때 힘이 살아납니다." },
  { key: "virgo", ko: "처녀자리", element: "흙", tone: "정돈하고 고치는 힘", text: "흐트러진 것을 읽고 쓸모 있게 다듬는 감각이 있습니다." },
  { key: "libra", ko: "천칭자리", element: "공기", tone: "균형을 맞추는 힘", text: "관계의 온도와 거리감을 섬세하게 조율합니다." },
  { key: "scorpio", ko: "전갈자리", element: "물", tone: "깊이 파고드는 힘", text: "겉보다 안쪽의 진심과 변화를 민감하게 봅니다." },
  { key: "sagittarius", ko: "사수자리", element: "불", tone: "멀리 보는 힘", text: "좁은 답보다 큰 방향과 가능성에 끌립니다." },
  { key: "capricorn", ko: "염소자리", element: "흙", tone: "시간을 견디는 힘", text: "책임과 구조를 통해 오래 남는 결과를 만듭니다." },
  { key: "aquarius", ko: "물병자리", element: "공기", tone: "새 규칙을 상상하는 힘", text: "익숙한 틀에서 한 발 떨어져 전체 흐름을 봅니다." },
  { key: "pisces", ko: "물고기자리", element: "물", tone: "경계를 녹이는 힘", text: "감정과 상상, 보이지 않는 신호에 열려 있습니다." },
];

const weatherCodeMap = {
  0: { label: "맑음", sky: "clear", sentence: "맑은 하늘은 당신에게 단순하고 선명한 중심을 남깁니다." },
  1: { label: "대체로 맑음", sky: "partly", sentence: "빛과 구름이 함께 있던 하늘처럼 명확함과 여지를 동시에 품습니다." },
  2: { label: "부분적으로 흐림", sky: "partly", sentence: "드러난 것과 감춰진 것을 함께 읽어내는 감각이 자연스럽습니다." },
  3: { label: "흐림", sky: "cloudy", sentence: "낮게 깔린 하늘처럼 서두르지 않고 분위기를 먼저 살피는 편입니다." },
  45: { label: "안개", sky: "fog", sentence: "안개 낀 하늘처럼 직선보다 암시와 직감을 통해 길을 찾습니다." },
  48: { label: "서리 안개", sky: "fog", sentence: "차분하고 희미한 장면 속에서도 미묘한 차이를 잡아냅니다." },
  51: { label: "약한 이슬비", sky: "rain", sentence: "가느다란 비처럼 작은 감정의 변화를 놓치지 않는 섬세함이 있습니다." },
  53: { label: "이슬비", sky: "rain", sentence: "촉촉한 하늘처럼 말보다 분위기에 먼저 반응하는 면이 있습니다." },
  55: { label: "강한 이슬비", sky: "rain", sentence: "계속 스며드는 비처럼 경험을 천천히 깊게 받아들입니다." },
  56: { label: "약한 어는 이슬비", sky: "rain", sentence: "부드러움과 긴장이 함께 있어 쉽게 흔들리지 않는 결을 만듭니다." },
  57: { label: "강한 어는 이슬비", sky: "rain", sentence: "차갑고 젖은 하늘처럼 감정의 밀도를 단단히 붙듭니다." },
  61: { label: "약한 비", sky: "rain", sentence: "비가 지나간 자리처럼 정화와 회복의 감각이 중요하게 작동합니다." },
  63: { label: "비", sky: "rain", sentence: "젖은 하늘 아래에서 태어난 사람처럼 감정의 흐름을 숨기지 않습니다." },
  65: { label: "강한 비", sky: "rain", sentence: "강한 비처럼 한 번 마음이 움직이면 장면 전체를 바꾸는 힘이 있습니다." },
  66: { label: "약한 어는 비", sky: "rain", sentence: "차갑고 투명한 비처럼 감정과 판단이 동시에 선명해집니다." },
  67: { label: "강한 어는 비", sky: "rain", sentence: "견디기 어려운 날씨 속에서도 자기 중심을 세우는 방식이 있습니다." },
  71: { label: "약한 눈", sky: "snow", sentence: "눈이 내려앉는 하늘처럼 조용히 분위기를 바꾸는 사람이 될 수 있습니다." },
  73: { label: "눈", sky: "snow", sentence: "소리를 낮춘 하늘처럼 깊은 집중과 맑은 거리감을 함께 지닙니다." },
  75: { label: "강한 눈", sky: "snow", sentence: "하얗게 덮는 눈처럼 낡은 장면을 새롭게 시작하는 힘이 있습니다." },
  77: { label: "싸락눈", sky: "snow", sentence: "작은 결정들이 모이는 하늘처럼 사소한 신호가 큰 의미로 이어집니다." },
  80: { label: "약한 소나기", sky: "rain", sentence: "갑작스러운 소나기처럼 감정과 결단이 빠르게 지나갑니다." },
  81: { label: "소나기", sky: "rain", sentence: "순간적으로 쏟아지는 하늘처럼 몰입의 속도가 빠릅니다." },
  82: { label: "강한 소나기", sky: "storm", sentence: "강한 소나기처럼 한 번 방향이 잡히면 주변의 공기까지 움직입니다." },
  85: { label: "약한 눈 소나기", sky: "snow", sentence: "차갑고 가벼운 눈발처럼 감각이 예민하게 흩어졌다가 다시 모입니다." },
  86: { label: "강한 눈 소나기", sky: "snow", sentence: "거센 눈발처럼 조용해 보여도 내면의 움직임은 큽니다." },
  95: { label: "뇌우", sky: "storm", sentence: "번개가 치는 하늘처럼 긴장과 통찰이 동시에 찾아오는 타입입니다." },
  96: { label: "우박 동반 뇌우", sky: "storm", sentence: "격렬한 하늘처럼 위기를 또렷한 전환점으로 바꾸는 힘이 있습니다." },
  99: { label: "강한 우박 동반 뇌우", sky: "storm", sentence: "드문 하늘 아래에서 태어난 사람처럼 강한 인상과 변곡점을 품습니다." },
};

const fallbackWeather = {
  label: "기록 없음",
  sky: "clear",
  sentence: "날씨 기록이 비어 있어 별의 배치를 중심으로 첫 하늘을 읽었습니다.",
  temperature: null,
  humidity: null,
  cloudCover: null,
  windSpeed: null,
  precipitation: null,
  units: {},
};

let animationState = {
  sky: "clear",
  isNight: true,
  phase: { key: "night", label: "밤" },
  cloudCover: 18,
  precipitation: 0,
  windSpeed: 4,
  stars: [],
  clouds: [],
  rain: [],
  snow: [],
  motes: [],
};

let latestResult = null;
let storyPreviewScene = null;
let storyPreviewAnimation = null;
let storyPreviewStartedAt = 0;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = readFormPayload();
  if (!payload.date || !payload.time || !payload.place) {
    setStatus("출생일, 시간, 장소를 확인해 주세요.", "error");
    return;
  }
  if (!isValidDateString(payload.date)) {
    setStatus("출생일은 1994-06-21 형식으로 입력해 주세요.", "error");
    return;
  }
  if (!isValidTimeString(payload.time)) {
    setStatus("시간은 18:30 형식으로 입력해 주세요.", "error");
    return;
  }

  setLoading(true);
  setStatus("좌표와 하늘 기록을 찾는 중입니다.", "busy");

  try {
    const location = await resolveLocation(payload);
    setStatus(formatLocation(location), "ok");

    const utcDate = makeDateInTimeZone(payload.date, payload.time, location.timezone);
    const placements = calculatePlacements(utcDate, location.latitude, location.longitude);
    const weather = await fetchBirthWeather(payload.date, payload.time, location).catch(() => fallbackWeather);
    const phase = getTimePhase(payload.time, weather);
    const isNight = phase.isNight;
    const reading = buildReading(payload, location, placements, weather, phase);

    renderResult(reading, weather, placements);
    latestResult = { payload, location, placements, weather, reading, phase };
    storyButton.disabled = false;
    updateSky(weather.sky, isNight, weather, phase);
  } catch (error) {
    setStatus(error.message || "하늘을 불러오지 못했습니다.", "error");
  } finally {
    setLoading(false);
  }
});

storyButton.addEventListener("click", async () => {
  if (!latestResult) {
    setStatus("먼저 하늘을 열어 주세요.", "error");
    return;
  }

  await openStoryOverlay();
});

storyCloseButton.addEventListener("click", closeStoryOverlay);

storyOverlay.addEventListener("click", (event) => {
  if (event.target === storyOverlay) {
    closeStoryOverlay();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && storyOverlay.classList.contains("is-open")) {
    closeStoryOverlay();
  }
});

storyDownloadButton.addEventListener("click", async () => {
  if (!latestResult) return;

  storyDownloadButton.disabled = true;
  storyDownloadButton.textContent = "저장 중";

  try {
    await downloadStoryVideo(latestResult);
    setStatus("스토리 영상 다운로드를 시작했습니다.", "ok");
  } catch (error) {
    setStatus(error.message || "영상 저장에 실패했습니다.", "error");
  } finally {
    storyDownloadButton.textContent = "영상 저장";
    storyDownloadButton.disabled = false;
  }
});

window.addEventListener("resize", () => {
  resizeCanvas();
  seedSky();
});

resizeCanvas();
updateSky("clear", true, fallbackWeather);
requestAnimationFrame(drawSky);

function readFormPayload() {
  const data = new FormData(form);
  return {
    name: String(data.get("personName") || "").trim(),
    date: String(data.get("birthDate") || ""),
    time: String(data.get("birthTime") || ""),
    place: String(data.get("birthPlace") || "").trim(),
    latitude: parseOptionalNumber(data.get("latitude")),
    longitude: parseOptionalNumber(data.get("longitude")),
    timezone: String(data.get("timezone") || "").trim(),
  };
}

function parseOptionalNumber(value) {
  if (value === null || String(value).trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
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
    throw new Error("좌표 직접 입력은 위도와 경도를 함께 넣어 주세요.");
  }

  if (payload.latitude !== null && payload.longitude !== null) {
    const timezone = payload.timezone || "UTC";
    if (!isValidTimeZone(timezone)) {
      throw new Error("시간대는 Asia/Seoul 같은 IANA 형식으로 입력해 주세요.");
    }

    return {
      name: payload.place,
      country: "",
      admin1: "",
      latitude: payload.latitude,
      longitude: payload.longitude,
      timezone,
      source: "manual",
    };
  }

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", payload.place);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "ko");
  url.searchParams.set("format", "json");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("장소 검색에 실패했습니다.");
  }

  const data = await response.json();
  const result = data.results?.[0];
  if (!result) {
    throw new Error("장소를 찾지 못했습니다. 도시명이나 좌표를 확인해 주세요.");
  }

  return {
    name: result.name,
    country: result.country || "",
    admin1: result.admin1 || "",
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone || "UTC",
    source: "geocode",
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
  url.searchParams.set(
    "hourly",
    "temperature_2m,relative_humidity_2m,precipitation,weather_code,cloud_cover,wind_speed_10m"
  );
  url.searchParams.set("timezone", location.timezone || "auto");

  const response = await fetch(url);
  if (!response.ok) return fallbackWeather;

  const data = await response.json();
  const hourly = data.hourly;
  if (!hourly?.time?.length) return fallbackWeather;

  const index = findClosestHourIndex(hourly.time, date, time);
  const code = hourly.weather_code?.[index];
  const weatherBase = weatherCodeMap[code] || fallbackWeather;

  return {
    ...weatherBase,
    code,
    temperature: hourly.temperature_2m?.[index] ?? null,
    humidity: hourly.relative_humidity_2m?.[index] ?? null,
    cloudCover: hourly.cloud_cover?.[index] ?? null,
    windSpeed: hourly.wind_speed_10m?.[index] ?? null,
    precipitation: hourly.precipitation?.[index] ?? null,
    units: data.hourly_units || {},
    sourceTime: hourly.time[index],
  };
}

function findClosestHourIndex(times, date, time) {
  const [hour, minute] = time.split(":").map(Number);
  const targetMinutes = hour * 60 + minute;
  let bestIndex = 0;
  let bestDelta = Infinity;

  times.forEach((value, index) => {
    if (!value.startsWith(date)) return;
    const [, timePart] = value.split("T");
    const [valueHour, valueMinute] = timePart.split(":").map(Number);
    const delta = Math.abs(valueHour * 60 + valueMinute - targetMinutes);
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
    sunLon,
    moonLon,
    ascLon,
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
  const degree = normalized % 30;
  return {
    ...zodiac[index],
    degree,
    formatted: `${zodiac[index].ko} ${Math.floor(degree)}°`,
  };
}

function buildReading(payload, location, placements, weather, phase) {
  const name = payload.name || "당신";
  const timeLabel = phase.label;
  const placeName = formatLocationName(location);
  const weatherLine = formatWeatherLine(weather);

  const text = [
    `${name}의 첫 하늘은 ${placeName}의 ${timeLabel}, ${weatherLine}으로 열렸습니다.`,
    `태양은 ${placements.sun.formatted}에 있어 ${placements.sun.tone}이 중심축이 됩니다. ${placements.sun.text}`,
    `달은 ${placements.moon.formatted}입니다. 감정은 ${placements.moon.element}의 방식으로 움직이며, ${placements.moon.text}`,
    `상승궁은 ${placements.ascendant.formatted}이라 처음 드러나는 인상에는 ${placements.ascendant.tone}이 섞입니다.`,
    weather.sentence,
  ].join(" ");

  return {
    title: `${name}의 첫 하늘`,
    eyebrow: `${payload.date} ${payload.time} · ${placeName}`,
    weatherLine,
    text,
  };
}

function renderResult(reading, weather, placements) {
  readingEyebrow.textContent = reading.eyebrow;
  readingTitle.textContent = reading.title;
  weatherCondition.textContent = weather.label;
  weatherTemperature.textContent = weather.temperature === null ? "--" : `${round(weather.temperature)}°`;
  weatherSummary.textContent = reading.weatherLine;
  readingText.textContent = reading.text;

  placementGrid.innerHTML = `
    <div>
      <span>태양</span>
      <strong>${escapeHtml(placements.sun.formatted)}</strong>
    </div>
    <div>
      <span>달</span>
      <strong>${escapeHtml(placements.moon.formatted)}</strong>
    </div>
    <div>
      <span>상승궁</span>
      <strong>${escapeHtml(placements.ascendant.formatted)}</strong>
    </div>
  `;
}

function formatWeatherLine(weather) {
  if (weather.temperature === null) return weather.label;

  const pieces = [
    `${weather.label}`,
    `${round(weather.temperature)}${weather.units?.temperature_2m || "°C"}`,
  ];

  if (weather.cloudCover !== null) pieces.push(`구름 ${round(weather.cloudCover)}%`);
  if (weather.humidity !== null) pieces.push(`습도 ${round(weather.humidity)}%`);
  if (weather.windSpeed !== null) {
    pieces.push(`바람 ${round(weather.windSpeed)}${weather.units?.wind_speed_10m || "km/h"}`);
  }
  if (weather.precipitation !== null && weather.precipitation > 0) {
    pieces.push(`강수 ${round(weather.precipitation)}${weather.units?.precipitation || "mm"}`);
  }

  return pieces.join(" · ");
}

function formatLocation(location) {
  return `${formatLocationName(location)} · ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)} · ${location.timezone}`;
}

function formatLocationName(location) {
  return [location.name, location.admin1, location.country].filter(Boolean).join(", ");
}

function getTimePhase(time, weather) {
  const hour = Number(time.split(":")[0]);
  if (hour >= 4 && hour < 7) return { key: "dawn", label: "새벽", isNight: false, sun: 0.22 };
  if (hour >= 7 && hour < 11) return { key: "morning", label: "아침", isNight: false, sun: 0.36 };
  if (hour >= 11 && hour < 17) return { key: "day", label: "낮", isNight: false, sun: 0.68 };
  if (hour >= 17 && hour < 20) return { key: "dusk", label: "해질녘", isNight: false, sun: 0.84 };
  if (hour >= 20 && hour < 24) return { key: "night", label: "밤", isNight: true, sun: 0.74 };

  const deepNight = weather.sky === "storm" || weather.sky === "fog";
  return { key: "deep-night", label: deepNight ? "심야" : "깊은 밤", isNight: true, sun: 0.12 };
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

  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return asUTC - date.getTime();
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.classList.toggle("is-loading", isLoading);
  buttonLabel.textContent = isLoading ? "하늘 여는 중" : "하늘 열기";
}

function setStatus(message, type = "ok") {
  statusLine.textContent = message;
  statusLine.dataset.type = type;
}

function updateSky(sky, isNight, weather, phase = { key: isNight ? "night" : "day", label: isNight ? "밤" : "낮" }) {
  animationState.sky = sky || "clear";
  animationState.isNight = Boolean(isNight);
  animationState.phase = phase;
  animationState.cloudCover = weather.cloudCover ?? (sky === "cloudy" ? 86 : 22);
  animationState.precipitation = weather.precipitation ?? 0;
  animationState.windSpeed = weather.windSpeed ?? 4;
  skyStage.className = `sky-stage sky-${animationState.sky} ${animationState.isNight ? "sky-night" : "sky-day"} phase-${phase.key}`;
  seedSky();
}

function resizeCanvas() {
  const rect = skyStage.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function seedSky() {
  const rect = skyStage.getBoundingClientRect();
  const visual = getVisualRect(rect);
  const width = Math.max(rect.width, 360);
  const height = Math.max(visual.height, 640);
  const cloudCount = Math.max(3, Math.round(animationState.cloudCover / 16));
  const rainCount = animationState.sky === "storm" ? 150 : animationState.sky === "rain" ? 110 : 0;
  const snowCount = animationState.sky === "snow" ? 120 : 0;
  const starCount = animationState.isNight ? 130 : 32;
  const moteCount = animationState.sky === "fog" ? 90 : 36;

  animationState.stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height * 0.66,
    r: Math.random() * 1.35 + 0.35,
    a: Math.random() * 0.64 + 0.22,
    phase: Math.random() * Math.PI * 2,
  }));

  animationState.clouds = Array.from({ length: cloudCount }, (_, index) => ({
    x: Math.random() * width,
    y: height * (0.13 + Math.random() * 0.42),
    scale: width * (0.12 + Math.random() * 0.17),
    speed: 0.035 + Math.random() * 0.08 + animationState.windSpeed * 0.002,
    alpha: animationState.sky === "fog" ? 0.32 : 0.16 + index * 0.018,
  }));

  animationState.rain = Array.from({ length: rainCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    len: 18 + Math.random() * 26,
    speed: 7 + Math.random() * 9 + animationState.windSpeed * 0.1,
    alpha: 0.24 + Math.random() * 0.35,
  }));

  animationState.snow = Array.from({ length: snowCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 1.2 + Math.random() * 3.2,
    speed: 0.5 + Math.random() * 1.7,
    drift: 0.45 + Math.random() * 1.6,
    alpha: 0.34 + Math.random() * 0.45,
  }));

  animationState.motes = Array.from({ length: moteCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 2.3 + 0.6,
    speed: 0.16 + Math.random() * 0.36,
    alpha: 0.06 + Math.random() * 0.14,
  }));
}

function drawSky(timestamp) {
  const rect = skyStage.getBoundingClientRect();
  const visual = getVisualRect(rect);
  ctx.clearRect(0, 0, rect.width, rect.height);

  drawAtmosphere(visual, timestamp);
  drawAstroChart(visual, timestamp);
  drawOrb(visual, timestamp);
  drawStars(timestamp);
  drawMotes(visual, timestamp);
  drawClouds(visual);
  drawWeather(visual, timestamp);
  drawHorizon(rect, timestamp);

  requestAnimationFrame(drawSky);
}

function getVisualRect(rect) {
  if (rect.width <= 680) {
    return {
      width: rect.width,
      height: Math.min(rect.height, Math.max(window.innerHeight, 640)),
    };
  }

  return rect;
}

function drawAtmosphere(rect, timestamp) {
  const drift = Math.sin(timestamp / 4200) * rect.width * 0.04;
  const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  gradient.addColorStop(0, animationState.isNight ? "rgba(16, 31, 44, 0.18)" : "rgba(255, 243, 190, 0.16)");
  gradient.addColorStop(0.55, "rgba(124, 199, 177, 0.09)");
  gradient.addColorStop(1, "rgba(216, 121, 92, 0.12)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, rect.width, rect.height);

  ctx.save();
  ctx.globalAlpha = animationState.isNight ? 0.22 : 0.14;
  ctx.strokeStyle = animationState.isNight ? "#94d7c9" : "#fff0bd";
  ctx.lineWidth = 2;
  for (let index = 0; index < 3; index += 1) {
    const y = rect.height * (0.18 + index * 0.12);
    ctx.beginPath();
    ctx.moveTo(-80, y + drift);
    ctx.bezierCurveTo(
      rect.width * 0.25,
      y - 80 - drift,
      rect.width * 0.7,
      y + 72 + drift,
      rect.width + 80,
      y - drift
    );
    ctx.stroke();
  }
  ctx.restore();
}

function drawAstroChart(rect, timestamp) {
  const centerX = rect.width * (rect.width > 900 ? 0.68 : 0.58);
  const centerY = rect.height * (rect.width > 900 ? 0.38 : 0.36);
  const radius = Math.min(rect.width, rect.height) * (rect.width > 900 ? 0.28 : 0.34);
  const rotation = timestamp / 52000;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  ctx.strokeStyle = "rgba(255, 250, 240, 0.13)";
  ctx.lineWidth = 1;

  for (let index = 0; index < 4; index += 1) {
    ctx.beginPath();
    ctx.arc(0, 0, radius * (0.46 + index * 0.18), 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let index = 0; index < 12; index += 1) {
    const angle = (Math.PI * 2 * index) / 12;
    const inner = radius * 0.48;
    const outer = radius;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255, 250, 240, 0.34)";
  for (let index = 0; index < 12; index += 1) {
    const angle = (Math.PI * 2 * index) / 12 - rotation * 0.8;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * radius * 0.72, Math.sin(angle) * radius * 0.72, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawOrb(rect, timestamp) {
  const orbit = animationState.phase?.sun ?? 0.72;
  const x = rect.width * (0.16 + orbit * 0.72);
  const arc = Math.sin(Math.PI * Math.min(0.96, Math.max(0.04, orbit)));
  const y = rect.height * (0.64 - arc * 0.48);
  const radius = Math.max(44, Math.min(rect.width, rect.height) * 0.075);

  if (animationState.isNight) {
    ctx.save();
    const glow = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 3.2);
    glow.addColorStop(0, "rgba(255, 246, 214, 0.62)");
    glow.addColorStop(0.33, "rgba(255, 246, 214, 0.18)");
    glow.addColorStop(1, "rgba(255, 246, 214, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, radius * 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.94;
    ctx.fillStyle = "#f5ecd8";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x + radius * 0.38, y - radius * 0.08, radius * 0.86, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  const pulse = 1 + Math.sin(timestamp / 1300) * 0.03;
  const glow = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius * 3.5);
  glow.addColorStop(0, "rgba(255, 233, 158, 0.95)");
  glow.addColorStop(0.36, "rgba(240, 188, 114, 0.38)");
  glow.addColorStop(1, "rgba(240, 188, 114, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius * 3.5 * pulse, 0, Math.PI * 2);
  ctx.fill();
}

function drawStars(timestamp) {
  ctx.save();
  animationState.stars.forEach((star) => {
    const twinkle = Math.sin(timestamp / 900 + star.phase) * 0.22;
    ctx.globalAlpha = Math.max(0.08, star.a + twinkle) * (animationState.isNight ? 1 : 0.32);
    ctx.fillStyle = "#fff7d6";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawMotes(rect, timestamp) {
  ctx.save();
  animationState.motes.forEach((mote) => {
    mote.y -= mote.speed;
    mote.x += Math.sin(timestamp / 1600 + mote.y * 0.02) * 0.12;
    if (mote.y < -8) {
      mote.y = rect.height + 8;
      mote.x = Math.random() * rect.width;
    }

    ctx.globalAlpha = animationState.sky === "fog" ? mote.alpha * 1.8 : mote.alpha;
    ctx.fillStyle = animationState.isNight ? "#dffaf3" : "#fff7dc";
    ctx.beginPath();
    ctx.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawClouds(rect) {
  if (!["partly", "cloudy", "rain", "snow", "fog", "storm"].includes(animationState.sky)) return;

  ctx.save();
  animationState.clouds.forEach((cloud) => {
    cloud.x += cloud.speed;
    if (cloud.x - cloud.scale > rect.width) cloud.x = -cloud.scale * 1.7;

    ctx.globalAlpha = cloud.alpha;
    ctx.fillStyle = animationState.isNight ? "#dce8ee" : "#fff3df";
    cloudShape(cloud.x, cloud.y, cloud.scale);
  });
  ctx.restore();
}

function cloudShape(x, y, scale) {
  ctx.beginPath();
  ctx.arc(x, y, scale * 0.28, Math.PI, Math.PI * 2);
  ctx.arc(x + scale * 0.26, y - scale * 0.13, scale * 0.28, Math.PI, Math.PI * 2);
  ctx.arc(x + scale * 0.56, y, scale * 0.34, Math.PI, Math.PI * 2);
  ctx.rect(x - scale * 0.28, y, scale * 1.12, scale * 0.24);
  ctx.fill();
}

function drawWeather(rect, timestamp) {
  if (animationState.windSpeed > 7 || ["rain", "snow", "storm"].includes(animationState.sky)) {
    drawWind(rect, timestamp);
  }
  if (animationState.sky === "rain" || animationState.sky === "storm") drawRain(rect);
  if (animationState.sky === "snow") drawSnow(rect, timestamp);
  if (animationState.sky === "fog") drawFog(rect, timestamp);
  if (animationState.sky === "storm") drawLightning(rect, timestamp);
}

function drawWind(rect, timestamp) {
  ctx.save();
  ctx.globalAlpha = Math.min(0.26, 0.08 + animationState.windSpeed / 80);
  ctx.strokeStyle = animationState.isNight ? "#dffaf3" : "#fff8dd";
  ctx.lineWidth = 1;
  for (let index = 0; index < 9; index += 1) {
    const y = rect.height * (0.2 + index * 0.07);
    const offset = ((timestamp / (70 - Math.min(animationState.windSpeed, 40))) + index * 83) % (rect.width + 260);
    const x = offset - 180;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 54, y - 16, x + 112, y + 18, x + 188, y - 4);
    ctx.stroke();
  }
  ctx.restore();
}

function drawRain(rect) {
  ctx.save();
  ctx.strokeStyle = "rgba(215, 238, 246, 0.82)";
  ctx.lineWidth = 1.2;
  animationState.rain.forEach((drop) => {
    drop.y += drop.speed;
    drop.x -= 2.2;
    if (drop.y > rect.height + drop.len) {
      drop.y = -drop.len;
      drop.x = Math.random() * rect.width;
    }
    if (drop.x < -40) drop.x = rect.width + 40;

    ctx.globalAlpha = drop.alpha;
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x - 7, drop.y + drop.len);
    ctx.stroke();
  });
  ctx.restore();
}

function drawSnow(rect, timestamp) {
  ctx.save();
  ctx.fillStyle = "#fffaf0";
  animationState.snow.forEach((flake) => {
    flake.y += flake.speed;
    flake.x += Math.sin(timestamp / 900 + flake.y * 0.02) * flake.drift * 0.08;
    if (flake.y > rect.height + 10) {
      flake.y = -10;
      flake.x = Math.random() * rect.width;
    }

    ctx.globalAlpha = flake.alpha;
    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawFog(rect, timestamp) {
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "#fff4df";
  ctx.lineWidth = 28;
  for (let index = 0; index < 8; index += 1) {
    const y = rect.height * (0.17 + index * 0.095);
    const drift = Math.sin(timestamp / 1800 + index) * 42;
    ctx.beginPath();
    ctx.moveTo(-90, y);
    ctx.bezierCurveTo(rect.width * 0.22 + drift, y - 32, rect.width * 0.7 - drift, y + 32, rect.width + 90, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawLightning(rect, timestamp) {
  const cycle = timestamp % 5200;
  if (cycle > 360) return;
  const flash = Math.sin((cycle / 360) * Math.PI);
  if (flash < 0.35) return;

  ctx.save();
  ctx.globalAlpha = flash * 0.42;
  ctx.fillStyle = "#fff7c2";
  ctx.fillRect(0, 0, rect.width, rect.height);

  ctx.globalAlpha = flash;
  ctx.strokeStyle = "#fff9bc";
  ctx.lineWidth = 3;
  const x = rect.width * 0.32;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x + 36, rect.height * 0.16);
  ctx.lineTo(x + 12, rect.height * 0.16);
  ctx.lineTo(x + 62, rect.height * 0.38);
  ctx.lineTo(x + 30, rect.height * 0.34);
  ctx.lineTo(x + 82, rect.height * 0.58);
  ctx.stroke();
  ctx.restore();
}

function drawHorizon(rect, timestamp) {
  const base = rect.height * 0.83;
  const drift = Math.sin(timestamp / 5000) * 8;
  const gradient = ctx.createLinearGradient(0, base - 70, 0, rect.height);
  gradient.addColorStop(0, "rgba(9, 25, 24, 0)");
  gradient.addColorStop(0.5, "rgba(9, 25, 24, 0.28)");
  gradient.addColorStop(1, "rgba(3, 10, 10, 0.74)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, base + 24);
  ctx.bezierCurveTo(rect.width * 0.18, base - 56 + drift, rect.width * 0.34, base + 8, rect.width * 0.48, base - 32);
  ctx.bezierCurveTo(rect.width * 0.68, base - 82 - drift, rect.width * 0.84, base + 6, rect.width, base - 46);
  ctx.lineTo(rect.width, rect.height);
  ctx.lineTo(0, rect.height);
  ctx.closePath();
  ctx.fill();
}

async function openStoryOverlay() {
  if (!latestResult) return;
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  storyPreviewScene = createStoryScene(latestResult, storyPreviewCanvas.width, storyPreviewCanvas.height);
  storyPreviewStartedAt = performance.now();
  storyOverlay.classList.add("is-open");
  storyOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("story-open");
  storyCloseButton.focus();
  startStoryPreviewLoop();
}

function closeStoryOverlay() {
  storyOverlay.classList.remove("is-open");
  storyOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("story-open");

  if (storyPreviewAnimation) {
    cancelAnimationFrame(storyPreviewAnimation);
    storyPreviewAnimation = null;
  }
}

function startStoryPreviewLoop() {
  if (storyPreviewAnimation) {
    cancelAnimationFrame(storyPreviewAnimation);
  }

  const frame = (now) => {
    if (!storyOverlay.classList.contains("is-open") || !latestResult || !storyPreviewScene) {
      storyPreviewAnimation = null;
      return;
    }

    const elapsed = now - storyPreviewStartedAt;
    renderStoryFrame(
      storyPreviewCtx,
      storyPreviewCanvas.width,
      storyPreviewCanvas.height,
      elapsed,
      latestResult,
      storyPreviewScene
    );
    storyPreviewAnimation = requestAnimationFrame(frame);
  };

  storyPreviewAnimation = requestAnimationFrame(frame);
}

async function downloadStoryVideo(result) {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("이 브라우저는 영상 저장을 지원하지 않습니다.");
  }
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const storyCanvas = document.createElement("canvas");
  storyCanvas.width = 1080;
  storyCanvas.height = 1920;
  const storyCtx = storyCanvas.getContext("2d");
  const stream = storyCanvas.captureStream?.(30);
  if (!stream) {
    throw new Error("이 브라우저는 캔버스 영상 기록을 지원하지 않습니다.");
  }

  const mimeType = pickVideoMimeType();
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  const chunks = [];
  const scene = createStoryScene(result, storyCanvas.width, storyCanvas.height);
  const duration = 7600;

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
      renderStoryFrame(storyCtx, storyCanvas.width, storyCanvas.height, elapsed, result, scene);
      if (elapsed < duration) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(frame);
  });

  recorder.stop();
  const blob = await recording;
  const extension = (recorder.mimeType || mimeType || "").includes("mp4") ? "mp4" : "webm";
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `first-sky-story-${result.payload.date}.${extension}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function pickVideoMimeType() {
  const candidates = [
    "video/mp4;codecs=h264",
    "video/mp4",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function createStoryScene(result, width, height) {
  const weather = result.weather;
  const sky = weather.sky || "clear";
  const cloudCover = weather.cloudCover ?? (sky === "cloudy" ? 86 : 24);
  const windSpeed = weather.windSpeed ?? 4;

  return {
    stars: Array.from({ length: result.phase.isNight ? 170 : 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.62,
      r: 1 + Math.random() * 2.2,
      a: 0.22 + Math.random() * 0.58,
      phase: Math.random() * Math.PI * 2,
    })),
    clouds: Array.from({ length: Math.max(4, Math.round(cloudCover / 14)) }, () => ({
      x: Math.random() * width,
      y: height * (0.14 + Math.random() * 0.42),
      scale: width * (0.16 + Math.random() * 0.2),
      speed: 0.4 + Math.random() * 0.7 + windSpeed * 0.02,
      alpha: sky === "fog" ? 0.35 : 0.16 + Math.random() * 0.2,
    })),
    rain: Array.from({ length: sky === "storm" ? 230 : sky === "rain" ? 180 : 0 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: 28 + Math.random() * 46,
      speed: 14 + Math.random() * 18 + windSpeed * 0.25,
      alpha: 0.26 + Math.random() * 0.36,
    })),
    snow: Array.from({ length: sky === "snow" ? 180 : 0 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 2 + Math.random() * 5,
      speed: 0.9 + Math.random() * 2.6,
      drift: 0.8 + Math.random() * 2.2,
      alpha: 0.35 + Math.random() * 0.46,
    })),
    motes: Array.from({ length: sky === "fog" ? 150 : 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 4,
      speed: 0.2 + Math.random() * 0.5,
      alpha: 0.06 + Math.random() * 0.12,
    })),
  };
}

function renderStoryFrame(storyCtx, width, height, elapsed, result, scene) {
  drawStoryBackground(storyCtx, width, height, result.phase.key, result.weather.sky);
  drawStoryAtmosphere(storyCtx, width, height, elapsed, result);
  drawStoryAstro(storyCtx, width, height, elapsed);
  drawStoryOrb(storyCtx, width, height, elapsed, result.phase);
  drawStoryStars(storyCtx, elapsed, result, scene);
  drawStoryMotes(storyCtx, width, height, elapsed, result, scene);
  drawStoryClouds(storyCtx, width, height, scene);
  drawStoryWeather(storyCtx, width, height, elapsed, result, scene);
  drawStoryHorizon(storyCtx, width, height, elapsed);
  drawStoryText(storyCtx, width, height, result);
}

function drawStoryBackground(storyCtx, width, height, phaseKey, sky) {
  const palettes = {
    "deep-night": ["#02070d", "#071522", "#173039"],
    dawn: ["#142139", "#5f8792", "#e3a56f"],
    morning: ["#78bfd0", "#badfbf", "#f0c077"],
    day: ["#70bfd2", "#a5d8c6", "#e8be72"],
    dusk: ["#314662", "#bd8069", "#e0a35f"],
    night: ["#071018", "#113041", "#47616a"],
  };
  const colors = palettes[phaseKey] || palettes.night;
  const gradient = storyCtx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(0.5, sky === "storm" || sky === "rain" ? shadeColor(colors[1], -22) : colors[1]);
  gradient.addColorStop(1, sky === "fog" ? "#b8ae98" : colors[2]);
  storyCtx.fillStyle = gradient;
  storyCtx.fillRect(0, 0, width, height);
}

function drawStoryAtmosphere(storyCtx, width, height, elapsed, result) {
  const glow = storyCtx.createRadialGradient(width * 0.72, height * 0.18, 20, width * 0.72, height * 0.18, width * 0.72);
  glow.addColorStop(0, result.phase.isNight ? "rgba(255, 248, 220, 0.16)" : "rgba(255, 230, 150, 0.35)");
  glow.addColorStop(1, "rgba(255, 230, 150, 0)");
  storyCtx.fillStyle = glow;
  storyCtx.fillRect(0, 0, width, height);

  storyCtx.save();
  storyCtx.globalAlpha = 0.18;
  storyCtx.strokeStyle = result.phase.isNight ? "#9de6d7" : "#fff3c1";
  storyCtx.lineWidth = 3;
  for (let index = 0; index < 4; index += 1) {
    const y = height * (0.18 + index * 0.1);
    const drift = Math.sin(elapsed / 2200 + index) * 52;
    storyCtx.beginPath();
    storyCtx.moveTo(-120, y);
    storyCtx.bezierCurveTo(width * 0.25 + drift, y - 80, width * 0.7 - drift, y + 90, width + 120, y - 20);
    storyCtx.stroke();
  }
  storyCtx.restore();
}

function drawStoryAstro(storyCtx, width, height, elapsed) {
  storyCtx.save();
  storyCtx.translate(width * 0.5, height * 0.36);
  storyCtx.rotate(elapsed / 50000);
  storyCtx.strokeStyle = "rgba(255, 250, 240, 0.14)";
  storyCtx.lineWidth = 2;
  const radius = width * 0.42;

  for (let index = 0; index < 4; index += 1) {
    storyCtx.beginPath();
    storyCtx.arc(0, 0, radius * (0.42 + index * 0.17), 0, Math.PI * 2);
    storyCtx.stroke();
  }

  for (let index = 0; index < 12; index += 1) {
    const angle = (Math.PI * 2 * index) / 12;
    storyCtx.beginPath();
    storyCtx.moveTo(Math.cos(angle) * radius * 0.42, Math.sin(angle) * radius * 0.42);
    storyCtx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    storyCtx.stroke();
  }

  storyCtx.restore();
}

function drawStoryOrb(storyCtx, width, height, elapsed, phase) {
  const orbit = phase.sun ?? 0.72;
  const x = width * (0.16 + orbit * 0.72);
  const arc = Math.sin(Math.PI * Math.min(0.96, Math.max(0.04, orbit)));
  const y = height * (0.58 - arc * 0.38);
  const radius = width * 0.086;

  if (phase.isNight) {
    storyCtx.save();
    const glow = storyCtx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 4.2);
    glow.addColorStop(0, "rgba(255, 246, 214, 0.62)");
    glow.addColorStop(1, "rgba(255, 246, 214, 0)");
    storyCtx.fillStyle = glow;
    storyCtx.beginPath();
    storyCtx.arc(x, y, radius * 4.2, 0, Math.PI * 2);
    storyCtx.fill();
    storyCtx.fillStyle = "#f5ecd8";
    storyCtx.beginPath();
    storyCtx.arc(x, y, radius, 0, Math.PI * 2);
    storyCtx.fill();
    storyCtx.globalCompositeOperation = "destination-out";
    storyCtx.beginPath();
    storyCtx.arc(x + radius * 0.38, y - radius * 0.08, radius * 0.86, 0, Math.PI * 2);
    storyCtx.fill();
    storyCtx.restore();
    return;
  }

  const pulse = 1 + Math.sin(elapsed / 900) * 0.03;
  const glow = storyCtx.createRadialGradient(x, y, radius * 0.1, x, y, radius * 4.6);
  glow.addColorStop(0, "rgba(255, 233, 158, 0.95)");
  glow.addColorStop(0.34, "rgba(240, 188, 114, 0.42)");
  glow.addColorStop(1, "rgba(240, 188, 114, 0)");
  storyCtx.fillStyle = glow;
  storyCtx.beginPath();
  storyCtx.arc(x, y, radius * 4.6 * pulse, 0, Math.PI * 2);
  storyCtx.fill();
}

function drawStoryStars(storyCtx, elapsed, result, scene) {
  storyCtx.save();
  scene.stars.forEach((star) => {
    const alpha = (star.a + Math.sin(elapsed / 600 + star.phase) * 0.22) * (result.phase.isNight ? 1 : 0.25);
    storyCtx.globalAlpha = Math.max(0.05, alpha);
    storyCtx.fillStyle = "#fff7d6";
    storyCtx.beginPath();
    storyCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    storyCtx.fill();
  });
  storyCtx.restore();
}

function drawStoryMotes(storyCtx, width, height, elapsed, result, scene) {
  storyCtx.save();
  scene.motes.forEach((mote) => {
    mote.y -= mote.speed;
    mote.x += Math.sin(elapsed / 1100 + mote.y * 0.02) * 0.2;
    if (mote.y < -10) {
      mote.y = height + 10;
      mote.x = Math.random() * width;
    }
    storyCtx.globalAlpha = result.weather.sky === "fog" ? mote.alpha * 2 : mote.alpha;
    storyCtx.fillStyle = result.phase.isNight ? "#dffaf3" : "#fff7dc";
    storyCtx.beginPath();
    storyCtx.arc(mote.x, mote.y, mote.r, 0, Math.PI * 2);
    storyCtx.fill();
  });
  storyCtx.restore();
}

function drawStoryClouds(storyCtx, width, height, scene) {
  storyCtx.save();
  scene.clouds.forEach((cloud) => {
    cloud.x += cloud.speed;
    if (cloud.x - cloud.scale > width) cloud.x = -cloud.scale * 1.6;
    storyCtx.globalAlpha = cloud.alpha;
    storyCtx.fillStyle = "#fff2df";
    storyCloudShape(storyCtx, cloud.x, cloud.y, cloud.scale);
  });
  storyCtx.restore();
}

function storyCloudShape(storyCtx, x, y, scale) {
  storyCtx.beginPath();
  storyCtx.arc(x, y, scale * 0.28, Math.PI, Math.PI * 2);
  storyCtx.arc(x + scale * 0.26, y - scale * 0.13, scale * 0.28, Math.PI, Math.PI * 2);
  storyCtx.arc(x + scale * 0.56, y, scale * 0.34, Math.PI, Math.PI * 2);
  storyCtx.rect(x - scale * 0.28, y, scale * 1.12, scale * 0.24);
  storyCtx.fill();
}

function drawStoryWeather(storyCtx, width, height, elapsed, result, scene) {
  const sky = result.weather.sky;
  const windSpeed = result.weather.windSpeed ?? 4;

  if (windSpeed > 7 || ["rain", "snow", "storm"].includes(sky)) {
    storyCtx.save();
    storyCtx.globalAlpha = Math.min(0.24, 0.08 + windSpeed / 90);
    storyCtx.strokeStyle = result.phase.isNight ? "#dffaf3" : "#fff8dd";
    storyCtx.lineWidth = 2;
    for (let index = 0; index < 10; index += 1) {
      const y = height * (0.14 + index * 0.07);
      const x = ((elapsed / (48 - Math.min(windSpeed, 34))) + index * 124) % (width + 360) - 240;
      storyCtx.beginPath();
      storyCtx.moveTo(x, y);
      storyCtx.bezierCurveTo(x + 90, y - 22, x + 180, y + 28, x + 300, y - 8);
      storyCtx.stroke();
    }
    storyCtx.restore();
  }

  if (sky === "rain" || sky === "storm") {
    storyCtx.save();
    storyCtx.strokeStyle = "rgba(215, 238, 246, 0.86)";
    storyCtx.lineWidth = 2;
    scene.rain.forEach((drop) => {
      drop.y += drop.speed;
      drop.x -= 3.6;
      if (drop.y > height + drop.len) {
        drop.y = -drop.len;
        drop.x = Math.random() * width;
      }
      if (drop.x < -80) drop.x = width + 80;
      storyCtx.globalAlpha = drop.alpha;
      storyCtx.beginPath();
      storyCtx.moveTo(drop.x, drop.y);
      storyCtx.lineTo(drop.x - 12, drop.y + drop.len);
      storyCtx.stroke();
    });
    storyCtx.restore();
  }

  if (sky === "snow") {
    storyCtx.save();
    storyCtx.fillStyle = "#fffaf0";
    scene.snow.forEach((flake) => {
      flake.y += flake.speed;
      flake.x += Math.sin(elapsed / 900 + flake.y * 0.02) * flake.drift * 0.14;
      if (flake.y > height + 12) {
        flake.y = -12;
        flake.x = Math.random() * width;
      }
      storyCtx.globalAlpha = flake.alpha;
      storyCtx.beginPath();
      storyCtx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
      storyCtx.fill();
    });
    storyCtx.restore();
  }

  if (sky === "fog") {
    storyCtx.save();
    storyCtx.globalAlpha = 0.2;
    storyCtx.strokeStyle = "#fff4df";
    storyCtx.lineWidth = 42;
    for (let index = 0; index < 9; index += 1) {
      const y = height * (0.14 + index * 0.08);
      const drift = Math.sin(elapsed / 1400 + index) * 70;
      storyCtx.beginPath();
      storyCtx.moveTo(-150, y);
      storyCtx.bezierCurveTo(width * 0.25 + drift, y - 42, width * 0.7 - drift, y + 46, width + 150, y);
      storyCtx.stroke();
    }
    storyCtx.restore();
  }

  if (sky === "storm") {
    const cycle = elapsed % 4200;
    if (cycle < 360) {
      const flash = Math.sin((cycle / 360) * Math.PI);
      if (flash > 0.35) {
        storyCtx.save();
        storyCtx.globalAlpha = flash * 0.36;
        storyCtx.fillStyle = "#fff7c2";
        storyCtx.fillRect(0, 0, width, height);
        storyCtx.globalAlpha = flash;
        storyCtx.strokeStyle = "#fff9bc";
        storyCtx.lineWidth = 6;
        const x = width * 0.28;
        storyCtx.beginPath();
        storyCtx.moveTo(x, 0);
        storyCtx.lineTo(x + 70, height * 0.16);
        storyCtx.lineTo(x + 30, height * 0.16);
        storyCtx.lineTo(x + 118, height * 0.36);
        storyCtx.lineTo(x + 68, height * 0.34);
        storyCtx.lineTo(x + 152, height * 0.56);
        storyCtx.stroke();
        storyCtx.restore();
      }
    }
  }
}

function drawStoryHorizon(storyCtx, width, height, elapsed) {
  const base = height * 0.78;
  const drift = Math.sin(elapsed / 3600) * 18;
  const gradient = storyCtx.createLinearGradient(0, base - 120, 0, height);
  gradient.addColorStop(0, "rgba(9, 25, 24, 0)");
  gradient.addColorStop(0.5, "rgba(9, 25, 24, 0.3)");
  gradient.addColorStop(1, "rgba(3, 10, 10, 0.82)");
  storyCtx.fillStyle = gradient;
  storyCtx.beginPath();
  storyCtx.moveTo(0, base + 40);
  storyCtx.bezierCurveTo(width * 0.2, base - 86 + drift, width * 0.36, base + 12, width * 0.52, base - 52);
  storyCtx.bezierCurveTo(width * 0.68, base - 118 - drift, width * 0.86, base + 8, width, base - 62);
  storyCtx.lineTo(width, height);
  storyCtx.lineTo(0, height);
  storyCtx.closePath();
  storyCtx.fill();
}

function drawStoryText(storyCtx, width, height, result) {
  const margin = 76;
  storyCtx.save();
  storyCtx.fillStyle = "#fffaf0";
  storyCtx.textBaseline = "top";
  storyCtx.shadowColor = "rgba(0, 0, 0, 0.28)";
  storyCtx.shadowBlur = 28;

  storyCtx.font = "800 30px 'IBM Plex Sans KR', system-ui, sans-serif";
  storyCtx.fillStyle = "#9ee6d5";
  storyCtx.fillText("FIRST SKY", margin, 76);

  storyCtx.fillStyle = "#fffaf0";
  storyCtx.font = "700 100px 'Gowun Batang', 'IBM Plex Sans KR', serif";
  wrapCanvasText(storyCtx, result.reading.title, margin, 136, width - margin * 2, 112, 2);

  storyCtx.font = "700 32px 'IBM Plex Sans KR', system-ui, sans-serif";
  storyCtx.fillStyle = "rgba(255, 250, 240, 0.76)";
  wrapCanvasText(storyCtx, result.reading.eyebrow, margin, 388, width - margin * 2, 44, 2);

  storyCtx.font = "800 128px 'IBM Plex Sans KR', system-ui, sans-serif";
  storyCtx.fillStyle = "#fffaf0";
  const temp = result.weather.temperature === null ? "--" : `${round(result.weather.temperature)}°`;
  storyCtx.fillText(temp, margin, height * 0.49);

  storyCtx.font = "800 38px 'IBM Plex Sans KR', system-ui, sans-serif";
  storyCtx.fillStyle = "#f0bc72";
  storyCtx.fillText(`${result.phase.label} · ${result.weather.label}`, margin, height * 0.49 + 132);

  const panelY = height - 510;
  storyCtx.shadowBlur = 0;
  storyCtx.fillStyle = "rgba(7, 15, 21, 0.44)";
  storyCtx.strokeStyle = "rgba(255, 250, 240, 0.22)";
  roundRect(storyCtx, margin, panelY, width - margin * 2, 380, 22);
  storyCtx.fill();
  storyCtx.stroke();

  const placements = `태양 ${result.placements.sun.formatted} · 달 ${result.placements.moon.formatted} · 상승궁 ${result.placements.ascendant.formatted}`;
  storyCtx.fillStyle = "#9ee6d5";
  storyCtx.font = "800 30px 'IBM Plex Sans KR', system-ui, sans-serif";
  wrapCanvasText(storyCtx, placements, margin + 34, panelY + 34, width - margin * 2 - 68, 42, 2);

  storyCtx.fillStyle = "rgba(255, 250, 240, 0.82)";
  storyCtx.font = "600 33px 'IBM Plex Sans KR', system-ui, sans-serif";
  const shortReading = result.reading.text.length > 150 ? `${result.reading.text.slice(0, 150)}...` : result.reading.text;
  wrapCanvasText(storyCtx, shortReading, margin + 34, panelY + 132, width - margin * 2 - 68, 49, 5);

  storyCtx.restore();
}

function wrapCanvasText(storyCtx, text, x, y, maxWidth, lineHeight, maxLines = Infinity) {
  const words = String(text).split(/\s+/);
  let line = "";
  let lineCount = 0;

  for (let index = 0; index < words.length; index += 1) {
    if (lineCount >= maxLines) break;
    const word = words[index];
    const testLine = line ? `${line} ${word}` : word;
    const isLast = index === words.length - 1;
    if (storyCtx.measureText(testLine).width > maxWidth && line) {
      storyCtx.fillText(line, x, y + lineCount * lineHeight);
      line = word;
      lineCount += 1;
    } else {
      line = testLine;
    }

    if (isLast && lineCount < maxLines) {
      storyCtx.fillText(line, x, y + lineCount * lineHeight);
    }
  }
}

function roundRect(storyCtx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  storyCtx.beginPath();
  storyCtx.moveTo(x + r, y);
  storyCtx.lineTo(x + width - r, y);
  storyCtx.quadraticCurveTo(x + width, y, x + width, y + r);
  storyCtx.lineTo(x + width, y + height - r);
  storyCtx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  storyCtx.lineTo(x + r, y + height);
  storyCtx.quadraticCurveTo(x, y + height, x, y + height - r);
  storyCtx.lineTo(x, y + r);
  storyCtx.quadraticCurveTo(x, y, x + r, y);
  storyCtx.closePath();
}

function shadeColor(color, percent) {
  const value = parseInt(color.replace("#", ""), 16);
  const amount = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (value >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((value >> 8) & 0x00ff) + amount));
  const b = Math.max(0, Math.min(255, (value & 0x0000ff) + amount));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

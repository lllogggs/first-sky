const form = document.querySelector("#birthForm");
const submitButton = document.querySelector("#submitButton");
const statusLine = document.querySelector("#locationStatus");
const skyStage = document.querySelector("#skyStage");
const canvas = document.querySelector("#skyCanvas");
const ctx = canvas.getContext("2d");

const readingEyebrow = document.querySelector("#readingEyebrow");
const readingTitle = document.querySelector("#readingTitle");
const weatherSummary = document.querySelector("#weatherSummary");
const placementGrid = document.querySelector("#placementGrid");
const readingText = document.querySelector("#readingText");

const zodiac = [
  { key: "aries", ko: "양자리", element: "불", tone: "시작을 밀어붙이는 힘", text: "빠르게 반응하고 먼저 움직이는 기질이 강합니다." },
  { key: "taurus", ko: "황소자리", element: "흙", tone: "감각을 오래 붙드는 힘", text: "속도를 늦추더라도 확실히 쌓아가는 감각이 있습니다." },
  { key: "gemini", ko: "쌍둥이자리", element: "공기", tone: "말과 연결을 여는 힘", text: "정보를 잡아내고 장면을 가볍게 바꾸는 재능이 있습니다." },
  { key: "cancer", ko: "게자리", element: "물", tone: "기억과 보호의 힘", text: "사람과 장소의 분위기를 오래 품는 편입니다." },
  { key: "leo", ko: "사자자리", element: "불", tone: "자기 빛을 세우는 힘", text: "존재감을 숨기기보다 따뜻하게 드러낼 때 힘이 살아납니다." },
  { key: "virgo", ko: "처녀자리", element: "흙", tone: "정돈하고 고치는 힘", text: "흐트러진 것을 읽어내고 쓸모 있게 다듬는 감각이 있습니다." },
  { key: "libra", ko: "천칭자리", element: "공기", tone: "균형을 맞추는 힘", text: "관계의 온도와 거리감을 세밀하게 조율합니다." },
  { key: "scorpio", ko: "전갈자리", element: "물", tone: "깊이 파고드는 힘", text: "겉보다 안쪽의 진심과 변화를 더 민감하게 봅니다." },
  { key: "sagittarius", ko: "사수자리", element: "불", tone: "멀리 보는 힘", text: "좁은 답보다 큰 방향과 가능성에 끌립니다." },
  { key: "capricorn", ko: "염소자리", element: "흙", tone: "시간을 견디는 힘", text: "책임과 구조를 통해 오래 남는 결과를 만듭니다." },
  { key: "aquarius", ko: "물병자리", element: "공기", tone: "새 규칙을 상상하는 힘", text: "익숙한 틀에서 한 발 떨어져 전체의 흐름을 봅니다." },
  { key: "pisces", ko: "물고기자리", element: "물", tone: "경계를 녹이는 힘", text: "감정과 상상, 보이지 않는 신호에 열려 있습니다." },
];

const weatherCodeMap = {
  0: { label: "맑음", sky: "clear", sentence: "또렷한 하늘 아래에서 태어난 사람처럼 핵심을 정면으로 바라보는 힘이 있습니다." },
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
  65: { label: "강한 비", sky: "rain", sentence: "강한 비처럼 한번 마음이 움직이면 장면 전체를 바꾸는 힘이 있습니다." },
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
};

const manualFields = {
  latitude: document.querySelector("#latitude"),
  longitude: document.querySelector("#longitude"),
};

let animationState = {
  sky: "clear",
  isNight: true,
  cloudCover: 0,
  precipitation: 0,
  particles: [],
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const payload = {
    name: String(data.get("personName") || "").trim(),
    date: String(data.get("birthDate") || ""),
    time: String(data.get("birthTime") || ""),
    place: String(data.get("birthPlace") || "").trim(),
    latitude: parseOptionalNumber(data.get("latitude")),
    longitude: parseOptionalNumber(data.get("longitude")),
    timezone: String(data.get("timezone") || "").trim(),
  };

  if (!payload.date || !payload.time || !payload.place) {
    setStatus("출생 정보를 확인해 주세요.", "error");
    return;
  }

  setLoading(true);
  setStatus("장소와 하늘을 찾는 중입니다.", "busy");

  try {
    const location = await resolveLocation(payload);
    setStatus(formatLocation(location), "ok");

    const utcDate = makeDateInTimeZone(payload.date, payload.time, location.timezone);
    const placements = calculatePlacements(utcDate, location.latitude, location.longitude);
    const weather = await fetchBirthWeather(payload.date, payload.time, location).catch(() => fallbackWeather);
    const isNight = inferNight(payload.time, weather);
    const reading = buildReading(payload, location, placements, weather, isNight);

    renderResult(reading, weather, placements, isNight);
    updateSky(weather.sky, isNight, weather);
  } catch (error) {
    setStatus(error.message || "하늘을 불러오지 못했습니다.", "error");
  } finally {
    setLoading(false);
  }
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
updateSky("clear", true, fallbackWeather);
requestAnimationFrame(drawSky);

function parseOptionalNumber(value) {
  if (value === null || String(value).trim() === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

async function resolveLocation(payload) {
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
  if (!response.ok) {
    return fallbackWeather;
  }

  const data = await response.json();
  const hourly = data.hourly;
  if (!hourly?.time?.length) {
    return fallbackWeather;
  }

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
  const sunLon = normalizeDegrees(
    280.460 + 0.9856474 * (jd - 2451545.0) +
      1.915 * sinDeg(357.528 + 0.9856003 * (jd - 2451545.0)) +
      0.02 * sinDeg(2 * (357.528 + 0.9856003 * (jd - 2451545.0)))
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

function buildReading(payload, location, placements, weather, isNight) {
  const name = payload.name || "당신";
  const timeLabel = isNight ? "밤" : "낮";
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
  readingText.textContent = reading.text;

  weatherSummary.innerHTML = `
    <span>날씨</span>
    <strong>${escapeHtml(reading.weatherLine)}</strong>
  `;

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

  document.documentElement.style.setProperty("--temperature", weather.temperature ?? 12);
}

function formatWeatherLine(weather) {
  if (weather.temperature === null) {
    return weather.label;
  }

  const pieces = [
    `${weather.label}`,
    `${round(weather.temperature)}${weather.units?.temperature_2m || "°C"}`,
  ];

  if (weather.cloudCover !== null) pieces.push(`구름 ${round(weather.cloudCover)}%`);
  if (weather.windSpeed !== null) pieces.push(`바람 ${round(weather.windSpeed)}${weather.units?.wind_speed_10m || "km/h"}`);
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

function inferNight(time, weather) {
  const hour = Number(time.split(":")[0]);
  if (weather.sky === "storm" || weather.sky === "fog") return hour < 8 || hour >= 17;
  return hour < 6 || hour >= 18;
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
  submitButton.lastChild.textContent = isLoading ? " 여는 중" : " 하늘 열기";
}

function setStatus(message, type = "ok") {
  statusLine.textContent = message;
  statusLine.dataset.type = type;
}

function updateSky(sky, isNight, weather) {
  animationState.sky = sky || "clear";
  animationState.isNight = Boolean(isNight);
  animationState.cloudCover = weather.cloudCover ?? (sky === "cloudy" ? 88 : 20);
  animationState.precipitation = weather.precipitation ?? 0;
  animationState.particles = createParticles(animationState.sky, animationState.cloudCover, animationState.precipitation);

  skyStage.className = `sky-stage sky-${animationState.sky} ${isNight ? "sky-night" : "sky-day"}`;
}

function resizeCanvas() {
  const rect = skyStage.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(rect.width * ratio));
  canvas.height = Math.max(1, Math.floor(rect.height * ratio));
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  animationState.particles = createParticles(animationState.sky, animationState.cloudCover, animationState.precipitation);
}

function createParticles(sky, cloudCover, precipitation) {
  const rect = skyStage.getBoundingClientRect();
  const width = Math.max(rect.width, 320);
  const height = Math.max(rect.height, 420);
  const particles = [];
  const starCount = animationState.isNight ? 80 : 0;
  const cloudCount = Math.max(2, Math.round((cloudCover || 20) / 18));
  const rainCount = sky === "storm" ? 120 : sky === "rain" ? 90 : 0;
  const snowCount = sky === "snow" ? 80 : 0;

  for (let index = 0; index < starCount; index += 1) {
    particles.push({
      type: "star",
      x: Math.random() * width,
      y: Math.random() * height * 0.62,
      size: Math.random() * 1.6 + 0.4,
      alpha: Math.random() * 0.7 + 0.25,
      drift: Math.random() * 0.006 + 0.002,
    });
  }

  for (let index = 0; index < cloudCount; index += 1) {
    particles.push({
      type: "cloud",
      x: Math.random() * width,
      y: height * (0.16 + Math.random() * 0.38),
      size: width * (0.14 + Math.random() * 0.12),
      speed: 0.05 + Math.random() * 0.08,
      alpha: sky === "fog" ? 0.38 : 0.22 + Math.random() * 0.18,
    });
  }

  for (let index = 0; index < rainCount; index += 1) {
    particles.push({
      type: "rain",
      x: Math.random() * width,
      y: Math.random() * height,
      length: 16 + Math.random() * 18,
      speed: 8 + Math.random() * 7 + precipitation,
      alpha: 0.28 + Math.random() * 0.35,
    });
  }

  for (let index = 0; index < snowCount; index += 1) {
    particles.push({
      type: "snow",
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.5 + Math.random() * 3,
      speed: 0.7 + Math.random() * 1.6,
      sway: Math.random() * 2 + 0.8,
      alpha: 0.42 + Math.random() * 0.42,
    });
  }

  return particles;
}

function drawSky(timestamp) {
  const rect = skyStage.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  drawOrb(rect, timestamp);

  animationState.particles.forEach((particle) => {
    if (particle.type === "star") drawStar(particle, timestamp);
    if (particle.type === "cloud") drawCloud(particle, rect);
    if (particle.type === "rain") drawRain(particle, rect);
    if (particle.type === "snow") drawSnow(particle, rect, timestamp);
  });

  if (animationState.sky === "fog") drawFog(rect, timestamp);
  if (animationState.sky === "storm") drawLightning(rect, timestamp);

  requestAnimationFrame(drawSky);
}

function drawOrb(rect, timestamp) {
  const x = rect.width * 0.74;
  const y = rect.height * 0.2;
  const radius = Math.max(42, rect.width * 0.07);

  if (animationState.isNight) {
    ctx.save();
    ctx.globalAlpha = 0.86;
    ctx.fillStyle = "#f0eee2";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x + radius * 0.38, y - radius * 0.12, radius * 0.9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  const pulse = 1 + Math.sin(timestamp / 1200) * 0.025;
  const gradient = ctx.createRadialGradient(x, y, 4, x, y, radius * 2.4);
  gradient.addColorStop(0, "rgba(255, 220, 128, 0.96)");
  gradient.addColorStop(0.45, "rgba(255, 176, 88, 0.32)");
  gradient.addColorStop(1, "rgba(255, 176, 88, 0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius * 2.4 * pulse, 0, Math.PI * 2);
  ctx.fill();
}

function drawStar(star, timestamp) {
  ctx.save();
  ctx.globalAlpha = star.alpha + Math.sin(timestamp * star.drift) * 0.16;
  ctx.fillStyle = "#fff8d8";
  ctx.beginPath();
  ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCloud(cloud, rect) {
  cloud.x += cloud.speed;
  if (cloud.x - cloud.size > rect.width) cloud.x = -cloud.size * 1.4;

  ctx.save();
  ctx.globalAlpha = cloud.alpha;
  ctx.fillStyle = animationState.isNight ? "#dbe2ea" : "#fff7ed";
  drawCloudLobe(cloud.x, cloud.y, cloud.size * 0.48);
  drawCloudLobe(cloud.x + cloud.size * 0.36, cloud.y - cloud.size * 0.12, cloud.size * 0.42);
  drawCloudLobe(cloud.x + cloud.size * 0.7, cloud.y, cloud.size * 0.5);
  ctx.fillRect(cloud.x - cloud.size * 0.1, cloud.y, cloud.size, cloud.size * 0.28);
  ctx.restore();
}

function drawCloudLobe(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawRain(drop, rect) {
  drop.y += drop.speed;
  drop.x -= 1.8;
  if (drop.y > rect.height + drop.length) {
    drop.y = -drop.length;
    drop.x = Math.random() * rect.width;
  }
  if (drop.x < -20) drop.x = rect.width + 20;

  ctx.save();
  ctx.globalAlpha = drop.alpha;
  ctx.strokeStyle = "#d8eef7";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(drop.x, drop.y);
  ctx.lineTo(drop.x - 4, drop.y + drop.length);
  ctx.stroke();
  ctx.restore();
}

function drawSnow(flake, rect, timestamp) {
  flake.y += flake.speed;
  flake.x += Math.sin(timestamp / 900 + flake.y * 0.02) * flake.sway * 0.08;
  if (flake.y > rect.height + 8) {
    flake.y = -8;
    flake.x = Math.random() * rect.width;
  }

  ctx.save();
  ctx.globalAlpha = flake.alpha;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFog(rect, timestamp) {
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.strokeStyle = "#f4f0e6";
  ctx.lineWidth = 22;
  for (let index = 0; index < 6; index += 1) {
    const y = rect.height * (0.25 + index * 0.1);
    const drift = Math.sin(timestamp / 1800 + index) * 34;
    ctx.beginPath();
    ctx.moveTo(-80, y);
    ctx.bezierCurveTo(rect.width * 0.25 + drift, y - 28, rect.width * 0.62 - drift, y + 26, rect.width + 80, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawLightning(rect, timestamp) {
  if (Math.floor(timestamp / 1400) % 5 !== 0) return;
  const flash = Math.max(0, Math.sin(timestamp / 80));
  if (flash < 0.72) return;

  const x = rect.width * 0.28;
  ctx.save();
  ctx.globalAlpha = 0.38;
  ctx.strokeStyle = "#fff7b8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x + 38, rect.height * 0.18);
  ctx.lineTo(x + 10, rect.height * 0.18);
  ctx.lineTo(x + 54, rect.height * 0.38);
  ctx.stroke();
  ctx.restore();
}

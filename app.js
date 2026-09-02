const DECADES = [
  { start: 1820, end: 1830, label: "1820 – 1830" },
  { start: 1830, end: 1840, label: "1830 – 1840" },
  { start: 1840, end: 1850, label: "1840 – 1850" },
  { start: 1850, end: 1860, label: "1850 – 1860" },
  { start: 1860, end: 1870, label: "1860 – 1870" },
  { start: 1870, end: 1880, label: "1870 – 1880" },
  { start: 1880, end: 1890, label: "1880 – 1890" },
  { start: 1890, end: 1900, label: "1890 – 1900" },
];
const HISTORICAL_EVENTS = [
  { year: 1829, title: "Catholic Emancipation Act", type: "Politics" },
  { year: 1832, title: "First Reform Act", type: "Politics" },
  { year: 1833, title: "Slavery Abolition Act", type: "Empire" },
  { year: 1837, title: "Queen Victoria begins her reign", type: "Monarchy" },
  { year: 1845, title: "Irish Famine begins", type: "Crisis" },
  { year: 1848, title: "European Revolutions", type: "Politics" },
  { year: 1851, title: "Great Exhibition", type: "Culture/Industry" },
  { year: 1853, title: "Crimean War begins", type: "War" },
  { year: 1857, title: "Indian Rebellion", type: "Empire/War" },
  { year: 1859, title: "Darwin publishes On the Origin of Species", type: "Science" },
  { year: 1861, title: "American Civil War begins", type: "War" },
  { year: 1867, title: "Second Reform Act", type: "Politics" },
  { year: 1870, title: "Elementary Education Act", type: "Education" },
  { year: 1871, title: "Paris Commune", type: "Politics" },
  { year: 1876, title: "Victoria proclaimed Empress of India", type: "Empire" },
  { year: 1884, title: "Third Reform Act", type: "Politics" },
  { year: 1888, title: "Jack the Ripper murders", type: "Urban crisis" },
  { year: 1899, title: "Second Boer War begins", type: "War/Empire" }
];

const COLOR_SCALES = {
  financiallyPrivileged: {
    type: "boolean",
    trueLabel: "Financially privileged",
    falseLabel: "Not financially privileged",
    trueColor: "#ef9100",
    falseColor: "#4c0035",
  },


  ethnicity_white: {
    type: "boolean",
    trueLabel: "White ethnicity",
    falseLabel: "Non-white ethnicity",
    trueColor: "#0a4c00",
    falseColor: "#f40505",
  },

  gender: {
    type: "category",
    categories: {
      Male: "#58a6ff",
      Female: "#f778ba",
    },
  },
  writingAsLivelihood: {
    type: "boolean",
    trueLabel: "Writing as livelihood",
    falseLabel: "Not primary livelihood",
    trueColor: "#3fb950",
    falseColor: "#6e7681",
  },
  bornInLondon: {
    type: "boolean",
    trueLabel: "Born in London",
    falseLabel: "Born elsewhere",
    trueColor: "#a371f7",
    falseColor: "#484f58",
  },
};

const NODE_SIZE_SCALES = {
  canonScore: {
    type: "sequential",
    colors: ["#4c0035", "#880030", "#b75a00", "#ef9100", "#ffd54f", "#fff59d"],
  },
  totalPages: {
    type: "sequential",
    colors: ["#4c0035", "#880030", "#b72f15", "#d6610a", "#ef9100", "#ffc300"],
  },
  nortonWorks: {
    type: "sequential",
    colors: ["#4c0035", "#880030", "#b72f15", "#d6610a", "#ef9100", "#ffc300"],
  },
};

const FIELD_LABELS = {
  birthCity: "Birth city",
  birthCountry: "Birth country",
  bornInLondon: "Born in London",
  bornInEngland: "Born in England",
  yearOfBirth: "Year of birth",
  yearOfDeath: "Year of death",
  ageWhenDeceased: "Age at death",
  activeStart: "Active from",
  activeEnd: "Active until",
  literaryType: "Literary type",
  typeCategory: "Type category code",
  gender: "Gender",
  totalPages: "Total pages in Norton",
  nortonWorks: "Works in Norton Anthology",
  familyInNortonCanon: "Family member in Norton canon",
  familyInCanon: "Family member in canon",
  ethnicity_white: "White ethnicity",
  ethnicity_nonwhite: "Non-white ethnicity",
  writingAsLivelihood: "Writing as livelihood",
  financiallyPrivileged: "Financially privileged",
};

const CONNECTION_TYPE_DETAILS = {
  partner: {
    label: "Partner",
    description: "A direct partner relationship between two authors.",
    color: "#ff4d4d",
  },
  family: {
    label: "Family",
    description: "A family relationship between two authors.",
    color: "#ff8c42",
  },
  finance_yes: {
    label: "Privilege: yes",
    description: "Both authors are financially privileged.",
    color: "#f7c948",
  },
  finance_no: {
    label: "Privilege: no",
    description: "Both authors are not financially privileged.",
    color: "#3b82f6",
  },
  livelihood_yes: {
    label: "Writing as livelihood",
    description: "Both authors made writing a primary source of income.",
    color: "#3fb950",
  },
  livelihood_no: {
    label: "Not writing as livelihood",
    description: "Both authors do not make writing their primary source of income.",
    color: "#8b949e",
  },
  london_yes: {
    label: "Born in London",
    description: "Both authors were born in London.",
    color: "#a371f7",
  },
  london_no: {
    label: "Not born in London",
    description: "Both authors were not born in London.",
    color: "#6e7681",
  },
  england_yes: {
    label: "Born in England",
    description: "Both authors were born in England.",
    color: "#58a6ff",
  },
  england_no: {
    label: "Not born in England",
    description: "Both authors were not born in England.",
    color: "#2dd4bf",
  },
};

let relationships = [];
let networkLayer;
let authors = [];
let map;
let markers = new Map();
let selectedAuthor = null;
let selectedConnection = null;
let detailImageHidden = false;
let focusMapMode = false;
const TOUR_CITY_ZOOM = 7;
const TOUR_STEP_DELAY_MS = 3200;
const TOUR_FLY_DURATION_MS = 1.2;
let tourTimerId = null;
let tourArrivalTimerId = null;
let tourState = {
  active: false,
  paused: false,
  loop: false,
  index: 0,
  currentAuthorNumber: null,
  snapshot: null,
};
let state = {
  decadeIndex: 0,
  colorField: "gender",
  sizeField: "canonScore",
  search: "",
  dimInactive: true,

  overlays: {
    family: true,
    partner: false,
    finance: false,
    livelihood_yes: false,
    livelihood_no: false,
    london_yes: false,
    london_no: false,
    england_yes: false,
    england_no: false,
  }
};

const decadeSlider = document.getElementById("decade-slider");
const decadeLabel = document.getElementById("decade-label");
const decadeButtons = document.getElementById("decade-buttons");
const colorFieldSelect = document.getElementById("color-field");
const searchInput = document.getElementById("search");
const sizeFieldSelect = document.getElementById("size-field");
const showInactiveCheckbox = document.getElementById("show-inactive");
const authorListEl = document.getElementById("author-list");
const eventListEl = document.getElementById("event-list");
const legendEl = document.getElementById("legend");
const overlayFamilyCheckbox = document.getElementById("overlay-family");
const overlayPartnerCheckbox = document.getElementById("overlay-partner");
const overlayFinanceCheckbox = document.getElementById("overlay-finance");
const overlayLivelihoodYesCheckbox = document.getElementById("overlay-livelihood-yes");
const overlayLivelihoodNoCheckbox = document.getElementById("overlay-livelihood-no");
const overlayLondonYesCheckbox = document.getElementById("overlay-london-yes");
const overlayLondonNoCheckbox = document.getElementById("overlay-london-no");
const overlayEnglandYesCheckbox = document.getElementById("overlay-england-yes");
const overlayEnglandNoCheckbox = document.getElementById("overlay-england-no");
const overlayWarningEl = document.getElementById("overlay-warning");
const visibleCountEl = document.getElementById("visible-count");
const focusMapToggle = document.getElementById("focus-map-toggle");
const tourStartBtn = document.getElementById("tour-start");
const tourPrevBtn = document.getElementById("tour-prev");
const tourNextBtn = document.getElementById("tour-next");
const tourPauseBtn = document.getElementById("tour-pause");
const tourExitBtn = document.getElementById("tour-exit");
const tourLoopCheckbox = document.getElementById("tour-loop");
const tourProgressPanel = document.getElementById("tour-progress");
const tourProgressText = document.getElementById("tour-progress-text");
const tourProgressFill = document.getElementById("tour-progress-fill");
const toggleImageBtn = document.getElementById("toggle-image");
const detailPanel = document.getElementById("detail-panel");
const detailContent = document.getElementById("detail-content");
const closeDetailBtn = document.getElementById("close-detail");
const researcherToggle = document.getElementById("researcher-toggle");
const researcherToolbox = document.getElementById("researcher-toolbox");
const toolboxRuler = document.getElementById("toolbox-ruler");
const toolboxProtractor = document.getElementById("toolbox-protractor");

let toolboxActive = false;

// Ruler state: endpoints are stored in .map-area pixel coordinates.
const rulerState = {
  p1: { x: 200, y: 200 },
  p2: { x: 420, y: 200 },
  dragging: null, // "body" | "endpoint-a" | "endpoint-b" | "rotate"
  dragStart: null,
  centerStart: null,
  angleStart: 0,
};

// Protractor state: center, base-arm rotation, and measure-arm rotation.
const protractorState = {
  center: null, // set on init
  baseRotation: -90, // degrees, accent baseline arm (points up)
  measureRotation: -90, // degrees, blue measuring arm (points up)
  dragging: null, // "body" | "arm-base" | "arm-measure"
  dragStart: null,
  centerStart: null,
};

const RULER_MIN_LENGTH = 20;
// Sensitivity multipliers (0 < factor < 1 = less sensitive, slower following).
// Higher values make the tools follow the pointer more closely.
const ROTATION_SENSITIVITY = 0.55;
const PROTRACTOR_SENSITIVITY = 0.6;

function formatDistance(meters, mapObj) {
  if (!mapObj || typeof mapObj.distance !== "function") {
    return "0 km";
  }

  const km = meters / 1000;

  if (km >= 100) {
    return `${Math.round(km).toLocaleString()} km`;
  }
  if (km >= 1) {
    return `${km.toFixed(1)} km`;
  }
  // Sub-kilometre distances are shown in metres for precision.
  const windowMeters = getVisibleWindowMeters(mapObj);
  if (windowMeters < 40000) {
    return `${Math.round(meters)} m`;
  }
  return `${km.toFixed(2)} km`;
}

function getVisibleWindowMeters(mapObj) {
  const center = mapObj.getCenter();
  const bounds = mapObj.getBounds();
  const north = bounds.getNorth();
  const south = bounds.getSouth();
  return mapObj.distance([north, center.lng], [south, center.lng]);
}

function getRulerEndpoints() {
  return [rulerState.p1, rulerState.p2];
}

function rulerLineEl() {
  return toolboxRuler ? toolboxRuler.querySelector(".ruler-line") : null;
}

function getRulerRotationDeg() {
  const dx = rulerState.p2.x - rulerState.p1.x;
  const dy = rulerState.p2.y - rulerState.p1.y;
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function updateRulerPosition() {
  if (!toolboxRuler) return;

  const cx = (rulerState.p1.x + rulerState.p2.x) / 2;
  const cy = (rulerState.p1.y + rulerState.p2.y) / 2;
  const length = Math.hypot(
    rulerState.p2.x - rulerState.p1.x,
    rulerState.p2.y - rulerState.p1.y
  );
  const angle = getRulerRotationDeg();

  // The ruler element is a square container; we rotate it around its centre
  // and position it so the two endpoints sit at its left/right edges.
  toolboxRuler.style.left = `${cx}px`;
  toolboxRuler.style.top = `${cy}px`;
  toolboxRuler.style.width = `${length}px`;
  toolboxRuler.style.height = `${length}px`;
  toolboxRuler.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

  // The ruler-line spans the full width, so it now measures p1 -> p2.
  const line = rulerLineEl();
  if (line) {
    line.style.width = "100%";
  }

  updateRulerReadout();
}

function updateRulerReadout() {
  const readout = toolboxRuler ? toolboxRuler.querySelector('[data-role="readout"]') : null;
  if (!readout || !map) return;

  const meters = map.distance(
    map.containerPointToLatLng(rulerState.p1),
    map.containerPointToLatLng(rulerState.p2)
  );

  readout.textContent = formatDistance(meters, map);
}

function updateProtractorPosition() {
  if (!toolboxProtractor) return;

  const c = protractorState.center;
  toolboxProtractor.style.left = `${c.x}px`;
  toolboxProtractor.style.top = `${c.y}px`;
  toolboxProtractor.style.transform = `translate(-50%, -50%)`;

  const baseArm = toolboxProtractor.querySelector(".protractor-arm-base");
  const measureArm = toolboxProtractor.querySelector(".protractor-arm-measure");
  if (baseArm) {
    baseArm.style.transform = `translateX(-50%) rotate(${protractorState.baseRotation}deg)`;
  }
  if (measureArm) {
    measureArm.style.transform = `translateX(-50%) rotate(${protractorState.measureRotation}deg)`;
  }

  updateProtractorReadout();
}

function updateProtractorReadout() {
  const readout = toolboxProtractor
    ? toolboxProtractor.querySelector('[data-role="readout"]')
    : null;
  if (!readout) return;

  // Compute the smaller angle (0–180°) between the two arms.
  let diff = Math.abs(protractorState.measureRotation - protractorState.baseRotation);
  diff = diff % 360;
  if (diff > 180) diff = 360 - diff;
  readout.textContent = `${Math.round(diff)}°`;
}

function getMapAreaPoint(event) {
  const rect = document.querySelector(".map-area").getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

// Interpolate from `from` toward `to` on a circle (handles wrap-around),
// moving only a fraction (`t`, 0..1) of the way each step for reduced sensitivity.
function lerpAngle(from, to, t) {
  let diff = ((to - from + 540) % 360) - 180;
  return from + diff * t;
}

function initToolboxPositions() {
  const mapArea = document.querySelector(".map-area");
  if (!mapArea) return;

  const w = mapArea.clientWidth;
  const h = mapArea.clientHeight;

  rulerState.p1 = { x: Math.min(220, w * 0.35), y: h * 0.4 };
  rulerState.p2 = { x: Math.min(460, w * 0.6), y: h * 0.4 };

protractorState.center = { x: Math.min(300, w * 0.72), y: h * 0.4 };
  protractorState.baseRotation = -90;
  protractorState.measureRotation = -90;

  updateRulerPosition();
  updateProtractorPosition();
}

function syncResearcherToggle() {
  if (!researcherToggle) return;
  researcherToggle.textContent = toolboxActive ? "Hide Toolbox" : "Researcher Toolbox";
  researcherToggle.setAttribute("aria-pressed", String(toolboxActive));
}

function toggleResearcherToolbox() {
  toolboxActive = !toolboxActive;
  if (researcherToolbox) {
    researcherToolbox.classList.toggle("hidden", !toolboxActive);
  }
  syncResearcherToggle();

  if (toolboxActive) {
    initToolboxPositions();
  }
}

function bindToolboxEvents() {
  // Recompute the ruler distance whenever the map moves or zooms.
  map.on("move zoom", updateRulerReadout);

  // ---- RULER interactions ----
  const line = rulerLineEl();

// Drag the ruler body (move both endpoints together).
  if (line) {
    line.addEventListener("pointerdown", (event) => {
      rulerState.dragging = "body";
      rulerState.dragStart = getMapAreaPoint(event);
      rulerState.centerStart = {
        x: (rulerState.p1.x + rulerState.p2.x) / 2,
        y: (rulerState.p1.y + rulerState.p2.y) / 2,
      };
      // Snapshot original endpoints so the body drag translates cleanly.
      rulerState.p1Start = { ...rulerState.p1 };
      rulerState.p2Start = { ...rulerState.p2 };
      line.classList.add("dragging");
      event.preventDefault();
    });
  }

  // Endpoint & rotate handles.
  toolboxRuler.querySelectorAll("[data-role]").forEach((handle) => {
    if (handle.dataset.role === "readout") return;
    handle.addEventListener("pointerdown", (event) => {
      const role = handle.dataset.role;
      rulerState.dragging = role;
      rulerState.dragStart = getMapAreaPoint(event);
      rulerState.centerStart = {
        x: (rulerState.p1.x + rulerState.p2.x) / 2,
        y: (rulerState.p1.y + rulerState.p2.y) / 2,
      };
      rulerState.angleStart = getRulerRotationDeg();
      handle.classList.add("dragging");
      event.preventDefault();
      event.stopPropagation();
    });
  });

// ---- PROTRACTOR interactions ----
  const dial = toolboxProtractor.querySelector(".protractor-dial");
  const baseArm = toolboxProtractor.querySelector(".protractor-arm-base");
  const measureArm = toolboxProtractor.querySelector(".protractor-arm-measure");

  if (dial) {
    dial.addEventListener("pointerdown", (event) => {
      protractorState.dragging = "body";
      protractorState.dragStart = getMapAreaPoint(event);
      protractorState.centerStart = { ...protractorState.center };
      dial.classList.add("dragging");
      event.preventDefault();
      event.stopPropagation();
    });
  }

  const bindArmDrag = (armEl, role) => {
    if (!armEl) return;
    armEl.addEventListener("pointerdown", (event) => {
      protractorState.dragging = role;
      protractorState.dragStart = getMapAreaPoint(event);
      protractorState.centerStart = { ...protractorState.center };
      armEl.classList.add("dragging");
      event.preventDefault();
      event.stopPropagation();
    });
  };

  bindArmDrag(baseArm, "arm-base");
  bindArmDrag(measureArm, "arm-measure");

  // ---- Global pointer move / up ----
  const mapArea = document.querySelector(".map-area");

  mapArea.addEventListener("pointermove", (event) => {
    const point = getMapAreaPoint(event);

    if (rulerState.dragging) {
      const dx = point.x - rulerState.dragStart.x;
      const dy = point.y - rulerState.dragStart.y;

if (rulerState.dragging === "body") {
        rulerState.p1 = {
          x: rulerState.p1Start.x + dx,
          y: rulerState.p1Start.y + dy,
        };
        rulerState.p2 = {
          x: rulerState.p2Start.x + dx,
          y: rulerState.p2Start.y + dy,
        };
      } else if (rulerState.dragging === "endpoint-a") {
        rulerState.p1 = { x: point.x, y: point.y };
      } else if (rulerState.dragging === "endpoint-b") {
        rulerState.p2 = { x: point.x, y: point.y };
} else if (rulerState.dragging === "rotate") {
        const newAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const delta = (newAngle - rulerState.angleStart) * ROTATION_SENSITIVITY;
        rotateRulerAroundCenter(delta);
      }

      enforceRulerMinLength();
      updateRulerPosition();
    }

if (protractorState.dragging) {
      if (protractorState.dragging === "body") {
        protractorState.center = {
          x: protractorState.centerStart.x + (point.x - protractorState.dragStart.x),
          y: protractorState.centerStart.y + (point.y - protractorState.dragStart.y),
        };
} else if (protractorState.dragging === "arm-base") {
        const rel = {
          x: point.x - protractorState.center.x,
          y: point.y - protractorState.center.y,
        };
        const target = (Math.atan2(rel.y, rel.x) * 180) / Math.PI;
        protractorState.baseRotation = lerpAngle(
          protractorState.baseRotation,
          target,
          PROTRACTOR_SENSITIVITY
        );
      } else if (protractorState.dragging === "arm-measure") {
        const rel = {
          x: point.x - protractorState.center.x,
          y: point.y - protractorState.center.y,
        };
        const target = (Math.atan2(rel.y, rel.x) * 180) / Math.PI;
        protractorState.measureRotation = lerpAngle(
          protractorState.measureRotation,
          target,
          PROTRACTOR_SENSITIVITY
        );
      }
      updateProtractorPosition();
    }
  });

  const endDrag = () => {
    rulerState.dragging = null;
    protractorState.dragging = null;
    toolboxRuler.querySelectorAll(".dragging").forEach((el) => el.classList.remove("dragging"));
    toolboxProtractor.querySelectorAll(".dragging").forEach((el) => el.classList.remove("dragging"));
  };

  mapArea.addEventListener("pointerup", endDrag);
  mapArea.addEventListener("pointercancel", endDrag);
}

function rotateRulerAroundCenter(deltaDeg) {
  const cx = (rulerState.p1.x + rulerState.p2.x) / 2;
  const cy = (rulerState.p1.y + rulerState.p2.y) / 2;
  const rad = (deltaDeg * Math.PI) / 180;

  const rot = (p) => {
    const px = p.x - cx;
    const py = p.y - cy;
    return {
      x: cx + px * Math.cos(rad) - py * Math.sin(rad),
      y: cy + px * Math.sin(rad) + py * Math.cos(rad),
    };
  };

  rulerState.p1 = rot(rulerState.p1);
  rulerState.p2 = rot(rulerState.p2);
}

function enforceRulerMinLength() {
  const dx = rulerState.p2.x - rulerState.p1.x;
  const dy = rulerState.p2.y - rulerState.p1.y;
  const length = Math.hypot(dx, dy);
  if (length < RULER_MIN_LENGTH) {
    const scale = RULER_MIN_LENGTH / (length || 1);
    const cx = (rulerState.p1.x + rulerState.p2.x) / 2;
    const cy = (rulerState.p1.y + rulerState.p2.y) / 2;
    rulerState.p1 = { x: cx + (rulerState.p1.x - cx) * scale, y: cy + (rulerState.p1.y - cy) * scale };
    rulerState.p2 = { x: cx + (rulerState.p2.x - cx) * scale, y: cy + (rulerState.p2.y - cy) * scale };
  }
}

function yesNo(value) {
  return value ? "Yes" : "No";
}

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isActiveInDecade(author, decade) {
  return author.activeStart < decade.end && author.activeEnd >= decade.start;
}

function matchesFilters(author) {
  const query = state.search.trim().toLowerCase();
  if (query) {
    const haystack = normalizeSearchText([
      author.name,
      author.birthCity,
      author.birthCountry,
      author.literaryType,
    ].join(" "));
    if (!haystack.includes(normalizeSearchText(query))) return false;
  }

  return true;
}

function getSequentialColor(value, field) {
  const values = authors.map((a) => a[field]).filter((v) => typeof v === "number");
  const min = Math.min(...values);
  const max = Math.max(...values);
  const colors = NODE_SIZE_SCALES[field]?.colors || [];

  if (max === min) return colors[colors.length - 1];

  const ratio = (value - min) / (max - min);
  const index = Math.min(colors.length - 1, Math.floor(ratio * colors.length));
  return colors[index];
}

function getAuthorColor(author) {
  const scale = COLOR_SCALES[state.colorField];

  if (scale.type === "boolean") {
    return author[state.colorField] ? scale.trueColor : scale.falseColor;
  }

  if (scale.type === "category") {
    return scale.categories[author[state.colorField]] || "#888";
  }

  return getSequentialColor(author[state.colorField], state.colorField);
}

function getMarkerRadius(author) {
  const minR = 14;
  const maxR = 48;
  const field = state.sizeField;
  const scale = NODE_SIZE_SCALES[field];

  if (!scale) return (minR + maxR) / 2;

  const values = authors
    .map((a) => a[field])
    .filter((v) => typeof v === "number");

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (max === min) return (minR + maxR) / 2;

  const ratio = (author[field] - min) / (max - min);

  return minR + ratio * (maxR - minR);
}

function renderLegend() {
  const scale = COLOR_SCALES[state.colorField];
  legendEl.innerHTML = "";

  if (scale.type === "boolean") {
    legendEl.appendChild(createLegendItem(scale.trueColor, scale.trueLabel));
    legendEl.appendChild(createLegendItem(scale.falseColor, scale.falseLabel));
    return;
  }

  if (scale.type === "category") {
    Object.entries(scale.categories).forEach(([label, color]) => {
      legendEl.appendChild(createLegendItem(color, label));
    });
    return;
  }

  const values = authors.map((a) => a[state.colorField]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const label =
    state.colorField === "nortonWorks"
      ? "Norton works"
      : "Total Norton pages";

  legendEl.innerHTML = `
    <div class="legend-item">
      <span class="legend-swatch" style="background: linear-gradient(90deg, ${scale.colors.join(", ")})"></span>
      <span>${label}: ${min} (low) → ${max} (high)</span>
    </div>
  `;
}

function renderLineLegend() {
  const lineLegendEl = document.getElementById("line-legend");
  if (!lineLegendEl) return;

  lineLegendEl.innerHTML = "";

  Object.entries(CONNECTION_TYPE_DETAILS).forEach(([key, detail]) => {
    const item = document.createElement("div");
    item.className = "line-legend-item";
    item.innerHTML = `
      <span class="line-legend-swatch" style="background:${detail.color}"></span>
      <div>
        <strong>${detail.label}</strong>
        <p>${detail.description}</p>
      </div>
    `;
    lineLegendEl.appendChild(item);
  });
}

function createLegendItem(color, label) {
  const item = document.createElement("div");
  item.className = "legend-item";
  item.innerHTML = `<span class="legend-swatch" style="background:${color}"></span><span>${label}</span>`;
  return item;
}

function normalizeImageUrl(url) {
  if (!url) return "";
  return encodeURI(url.trim());
}

function toImageStem(path) {
  return path.replace(/\.[^./]+$/, "");
}

function getAuthorImageCandidates(author) {
  const raw = typeof author.image === "string" ? author.image.trim() : "";
  if (!raw) return [];

  const rawStem = toImageStem(raw);
  const nameStem = `data/images/${author.name.replace(/,/g, "").trim()}`;
  const stems = [rawStem, nameStem];
  const seen = new Set();
  const candidates = [];

  // Try current path first, then common file extension/name variants.
  [raw, ...stems.flatMap((stem) => [`${stem}.jpg`, `${stem}.jpeg`, `${stem}.png`])].forEach((value) => {
    const normalized = normalizeImageUrl(value);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    candidates.push(normalized);
  });

  return candidates;
}

function handleAuthorImageError(img) {
  if (!img) return;

  const fallbacks = (img.dataset.fallbacks || "")
    .split("||")
    .map((s) => s.trim())
    .filter(Boolean);

  if (fallbacks.length === 0) {
    img.onerror = null;
    img.classList.add("author-image-missing");
    return;
  }

  const [next, ...rest] = fallbacks;
  img.dataset.fallbacks = rest.join("||");
  img.src = next;
}

window.handleAuthorImageError = handleAuthorImageError;

function renderDecadeButtons() {
  decadeButtons.innerHTML = "";
  DECADES.forEach((decade, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "decade-btn" + (index === state.decadeIndex ? " active" : "");
    btn.textContent = `${decade.start}s`;
    btn.title = decade.label;
    btn.addEventListener("click", () => setDecade(index));
    decadeButtons.appendChild(btn);
  });
}

function renderConnectionDetails() {
  const connectionCardEl = document.getElementById("connection-details");
  const emptyEl = document.getElementById("connection-empty");
  const contentEl = document.getElementById("connection-content");

  if (!selectedConnection) {
    connectionCardEl?.classList.add("hidden");
    emptyEl.classList.remove("hidden");
    contentEl.classList.add("hidden");
    contentEl.innerHTML = "";
    return;
  }

  connectionCardEl?.classList.remove("hidden");
  emptyEl.classList.add("hidden");
  contentEl.classList.remove("hidden");
  contentEl.innerHTML = `
    <h4>${selectedConnection.title}</h4>
    <p class="connection-summary">${selectedConnection.summary}</p>
    <label for="connection-note">Notes</label>
    <textarea id="connection-note" rows="4" placeholder="Write a short interpretation of this connection...">${selectedConnection.description || ""}</textarea>
  `;

  const noteInput = document.getElementById("connection-note");
  if (noteInput) {
    noteInput.addEventListener("input", (event) => {
      selectedConnection.description = event.target.value;
    });
  }
}

function setSelectedConnection(a, b, matches) {
  const labels = [...new Set(
    matches.map((match) => CONNECTION_TYPE_DETAILS[match.type]?.label || match.type)
  )];

  const summary = matches.length >= 2
    ? labels.join(" + ")
    : `${labels[0] || "Connection"}: ${CONNECTION_TYPE_DETAILS[matches[0].type]?.description || "A meaningful connection between authors."}`;

  selectedConnection = {
    title: `${a.name} ↔ ${b.name}`,
    summary,
    description: selectedConnection?.description || "",
  };

  renderConnectionDetails();
}

function updateView() {
  renderLegend();
  renderLineLegend();
  renderHistoricalEvents();
  updateMarkers();
  renderConnectionDetails();
  renderNetworkLines();
}

function buildDetailHtml(author) {
  const decade = DECADES[state.decadeIndex];
  const activeNow = isActiveInDecade(author, decade);

  const rows = [
    ["Canonical Advantage Score", `${author.canonScore}/6`],
    ["Literary type", author.literaryType],
    ["Active period", `${author.activeStart} – ${author.activeEnd}`],
    ["Birthplace", `${author.birthCity}, ${author.birthCountry}`],
    ["Born in London", yesNo(author.bornInLondon)],
    ["Born in England", yesNo(author.bornInEngland)],
    ["Gender", author.gender],
    ["Works in Norton", String(author.nortonWorks)],
    ["Total Norton pages", String(author.totalPages)],
    ["Family in Norton canon", yesNo(author.familyInNortonCanon)],
    ["Family in literary canon", yesNo(author.familyInCanon)],
    ["Writing as livelihood", yesNo(author.writingAsLivelihood)],
    ["Financially privileged", yesNo(author.financiallyPrivileged)],
    [
      `Active in ${decade.label}`,
      activeNow ? "Yes — shown on map" : "No — outside active years",
    ],
  ];

  const grid = rows
    .map(
      ([label, value]) => `
      <div class="detail-row">
        <dt>${label}</dt>
        <dd>${value}</dd>
      </div>`
    )
    .join("");

  const imageCandidates = getAuthorImageCandidates(author);
  const imageHtml = imageCandidates.length
    ? `<img src="${imageCandidates[0]}" data-fallbacks="${imageCandidates.slice(1).join("||")}" onerror="handleAuthorImageError(this)" alt="${author.name}" class="author-image${detailImageHidden ? " hidden" : ""}" />`
    : "";

  return `
    ${imageHtml}
    <h3>${author.name}</h3>
    <p class="lifespan">${author.yearOfBirth} – ${author.yearOfDeath} · died age ${author.ageWhenDeceased}</p>
    <div class="detail-grid">${grid}</div>
  `;
}

function showDetail(author) {
  selectedAuthor = author;
  detailContent.innerHTML = buildDetailHtml(author);
  detailPanel.classList.remove("hidden");
  detailPanel.classList.add("detail-open");
  syncDetailImageToggle();
  highlightSelection();
  if (tourState.active && tourState.currentAuthorNumber !== author.number) {
    const nextIndex = getTourAuthorIndex(author);
    if (nextIndex >= 0) {
      tourState.index = nextIndex;
      tourState.currentAuthorNumber = author.number;
      updateTourProgress(author);
      syncTourControls();
      clearTourAdvanceTimer();
      if (!tourState.paused) {
        scheduleTourAdvance();
      }
    }
  }
  // Trigger map resize after animation
  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 300);
}

function hideDetail() {
  selectedAuthor = null;
  detailPanel.classList.remove("detail-open");
  detailPanel.classList.remove("hidden");
  detailContent.innerHTML = `
    <p class="detail-empty">Click an author node to see the profile panel here.</p>
  `;
  syncDetailImageToggle();
  highlightSelection();
  // Trigger map resize after animation
  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 300);
}

function showEmptyDetailPanel() {
  selectedAuthor = null;
  detailPanel.classList.remove("hidden");
  detailPanel.classList.add("detail-open");
  detailContent.innerHTML = `
    <p class="detail-empty">Click an author node to see the profile panel here.</p>
  `;
  syncDetailImageToggle();
  highlightSelection();
}

function highlightSelection() {
  markers.forEach((entry, id) => {
    const el = entry.marker.getElement();
    if (!el) return;
    const inner = el.querySelector(".author-marker");
    if (!inner) return;
    inner.classList.toggle("selected", selectedAuthor && selectedAuthor.number === id);
    inner.classList.toggle(
      "tour-highlight",
      tourState.active && tourState.currentAuthorNumber === id && selectedAuthor && selectedAuthor.number === id
    );
  });

  authorListEl.querySelectorAll("button").forEach((btn) => {
    btn.classList.toggle(
      "selected",
      selectedAuthor && Number(btn.dataset.id) === selectedAuthor.number
    );
  });
}

function getTourAuthorIndex(author) {
  return authors.findIndex((entry) => entry.number === author.number);
}
 
function getTourDecadeIndex(author) {
  const activeIndex = DECADES.findIndex((decade) => isActiveInDecade(author, decade));
  if (activeIndex >= 0) return activeIndex;

  const fallbackIndex = Math.floor((author.activeStart - DECADES[0].start) / 10);
  return Math.max(0, Math.min(DECADES.length - 1, fallbackIndex));
}

function captureTourSnapshot() {
  return {
    state: JSON.parse(JSON.stringify(state)),
    selectedAuthorNumber: selectedAuthor?.number ?? null,
    selectedConnection: selectedConnection ? { ...selectedConnection } : null,
    mapCenter: map ? [map.getCenter().lat, map.getCenter().lng] : null,
    mapZoom: map ? map.getZoom() : null,
  };
}

function syncTourControls() {
  if (tourStartBtn) tourStartBtn.disabled = tourState.active;
  if (tourPrevBtn) tourPrevBtn.disabled = !tourState.active;
  if (tourNextBtn) tourNextBtn.disabled = !tourState.active;
  if (tourPauseBtn) {
    tourPauseBtn.disabled = !tourState.active;
    tourPauseBtn.textContent = tourState.paused ? "Resume" : "Pause";
  }
  if (tourExitBtn) tourExitBtn.disabled = !tourState.active;
  if (tourLoopCheckbox) tourLoopCheckbox.checked = tourState.loop;
  if (tourProgressPanel) tourProgressPanel.classList.toggle("hidden", !tourState.active);
}

function updateTourProgress(author) {
  if (!tourProgressText || !tourProgressFill || !author) return;

  const position = Math.max(1, tourState.index + 1);
  const total = authors.length || 1;
  tourProgressText.textContent = `Author ${position} / ${total} – ${author.name}`;
  tourProgressFill.style.width = `${(position / total) * 100}%`;
}

function clearTourAdvanceTimer() {
  if (tourTimerId) {
    window.clearTimeout(tourTimerId);
    tourTimerId = null;
  }
}

function clearTourArrivalTimer() {
  if (tourArrivalTimerId) {
    window.clearTimeout(tourArrivalTimerId);
    tourArrivalTimerId = null;
  }
}

function scheduleTourAdvance() {
  clearTourAdvanceTimer();

  if (!tourState.active || tourState.paused || tourState.index >= authors.length - 1) {
    return;
  }

  tourTimerId = window.setTimeout(() => {
    advanceTour(1);
  }, TOUR_STEP_DELAY_MS);
}

function moveTourToAuthor(index) {
  const author = authors[index];
  if (!author) return;

  tourState.index = index;
  tourState.currentAuthorNumber = author.number;
  selectedAuthor = author;

  const decadeIndex = getTourDecadeIndex(author);
  if (state.decadeIndex !== decadeIndex) {
    setDecade(decadeIndex);
  } else {
    updateView();
  }

  updateTourProgress(author);
  syncTourControls();

  const markerEntry = markers.get(author.number);
  const marker = markerEntry?.marker;
  let arrived = false;
  const arrive = () => {
    if (arrived) return;
    arrived = true;
    clearTourArrivalTimer();
    showDetail(author);
    if (marker) {
      window.setTimeout(() => marker.openPopup(), 75);
    }
    scheduleTourAdvance();
  };

  if (!map) {
    arrive();
    return;
  }

  clearTourAdvanceTimer();
  clearTourArrivalTimer();
  map.stop();
  map.closePopup();
  map.flyTo([author.latitude, author.longitude], TOUR_CITY_ZOOM, {
    animate: true,
    duration: TOUR_FLY_DURATION_MS,
  });
  map.once("moveend", arrive);
  tourArrivalTimerId = window.setTimeout(arrive, Math.round(TOUR_FLY_DURATION_MS * 1000) + 150);
}

function startTour() {
  if (!authors.length || tourState.active) return;

  tourState.snapshot = captureTourSnapshot();
  tourState.active = true;
  tourState.paused = false;
  tourState.loop = Boolean(tourLoopCheckbox?.checked);
  tourState.index = 0;
  tourState.currentAuthorNumber = authors[0].number;

  syncTourControls();
  moveTourToAuthor(0);
}

function pauseOrResumeTour() {
  if (!tourState.active) return;

  tourState.paused = !tourState.paused;
  syncTourControls();

  if (tourState.paused) {
    clearTourAdvanceTimer();
    return;
  }

  scheduleTourAdvance();
}

function endTour() {
  if (!tourState.active && !tourState.snapshot) return;

  clearTourAdvanceTimer();
  clearTourArrivalTimer();
  tourState.active = false;
  tourState.paused = false;
  tourState.currentAuthorNumber = null;
  const snapshot = tourState.snapshot;
  tourState.snapshot = null;
  syncTourControls();

  if (!snapshot) return;

  selectedConnection = snapshot.selectedConnection ? { ...snapshot.selectedConnection } : null;

  state = JSON.parse(JSON.stringify(snapshot.state));
  decadeSlider.value = String(state.decadeIndex);
  colorFieldSelect.value = state.colorField;
  sizeFieldSelect.value = state.sizeField;
  searchInput.value = state.search;
  showInactiveCheckbox.checked = !state.dimInactive;
  overlayFamilyCheckbox.checked = state.overlays.family;
  overlayPartnerCheckbox.checked = state.overlays.partner;
  overlayFinanceCheckbox.checked = state.overlays.finance;
  overlayLivelihoodYesCheckbox.checked = state.overlays.livelihood_yes;
  overlayLivelihoodNoCheckbox.checked = state.overlays.livelihood_no;
  overlayLondonYesCheckbox.checked = state.overlays.london_yes;
  overlayLondonNoCheckbox.checked = state.overlays.london_no;
  overlayEnglandYesCheckbox.checked = state.overlays.england_yes;
  overlayEnglandNoCheckbox.checked = state.overlays.england_no;

  selectedAuthor = null;
  decadeLabel.textContent = DECADES[state.decadeIndex].label;
  renderDecadeButtons();
  updateView();
  showEmptyDetailPanel();

  if (snapshot.mapCenter && map) {
    map.setView(snapshot.mapCenter, snapshot.mapZoom ?? map.getZoom(), { animate: false });
  }

  if (snapshot.selectedAuthorNumber != null) {
    const restoredAuthor = authors.find((author) => author.number === snapshot.selectedAuthorNumber);
    if (restoredAuthor) {
      showDetail(restoredAuthor);
    } else {
      showEmptyDetailPanel();
    }
  } else {
    showEmptyDetailPanel();
  }

  renderConnectionDetails();
  if (map) {
    map.closePopup();
  }
}

function advanceTour(step) {
  if (!tourState.active) return;

  const nextIndex = tourState.index + step;

  if (nextIndex >= authors.length) {
    if (tourState.loop) {
      moveTourToAuthor(0);
    } else {
      tourState.paused = true;
      clearTourAdvanceTimer();
      syncTourControls();
    }
    return;
  }

  if (nextIndex < 0) {
    if (tourState.loop) {
      moveTourToAuthor(authors.length - 1);
    }
    return;
  }

  moveTourToAuthor(nextIndex);
}

function handleTourKeydown(event) {
  if (!tourState.active) return;

  const target = event.target;
  const tagName = target?.tagName?.toLowerCase();
  if (target?.isContentEditable || tagName === "input" || tagName === "textarea" || tagName === "select") {
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    advanceTour(-1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    advanceTour(1);
  } else if (event.key === " " || event.code === "Space" || event.key === "Spacebar") {
    event.preventDefault();
    pauseOrResumeTour();
  } else if (event.key === "Escape") {
    event.preventDefault();
    endTour();
  }
}

function buildPopupHtml(author) {
  const decade = DECADES[state.decadeIndex];
  const activeNow = isActiveInDecade(author, decade);

  return `
    <p class="popup-title">${author.name}</p>
    <p class="popup-meta">${author.birthCity}, ${author.birthCountry}</p>
    <p class="popup-meta">${author.literaryType}</p>
    <p class="popup-meta">Active ${author.activeStart}–${author.activeEnd}</p>
    <p class="popup-meta">${activeNow ? "Active this decade" : "Inactive this decade"}</p>
    <button class="popup-link" data-id="${author.number}">View full profile →</button>
  `;
}

function updateMarkers() {
  const decade = DECADES[state.decadeIndex];
  let visibleCount = 0;

  authors.forEach((author) => {
    const passesFilter = matchesFilters(author);
    const activeInDecade = isActiveInDecade(author, decade);
    const inactive = !activeInDecade;
    const isTourCurrent = tourState.active && tourState.currentAuthorNumber === author.number;
    const entry = markers.get(author.number);

    if ((!passesFilter || (!state.dimInactive && inactive)) && !isTourCurrent) {
      entry.marker.setOpacity(0);
      return;
    }

    visibleCount += activeInDecade || isTourCurrent ? 1 : 0;
    entry.marker.setOpacity(1);

    const color = getAuthorColor(author);
    const radius = getMarkerRadius(author);

    entry.marker.setIcon(
      L.divIcon({
        className: "",
        html: `<div class="author-marker${inactive ? " inactive" : ""}${selectedAuthor?.number === author.number ? " selected" : ""}${isTourCurrent ? " tour-highlight" : ""}" style="width:${radius}px;height:${radius}px;background:${color};"></div>`,
        iconSize: [radius, radius],
        iconAnchor: [radius / 2, radius / 2],
      })
    );

    entry.marker.setPopupContent(buildPopupHtml(author));
  });

  visibleCountEl.textContent = String(visibleCount);
  renderAuthorList(decade);
}

function renderAuthorList(decade) {
  authorListEl.innerHTML = "";

  const filtered = authors
    .filter(matchesFilters)
    .sort((a, b) => {
      const aActive = isActiveInDecade(a, decade);
      const bActive = isActiveInDecade(b, decade);
      if (aActive !== bActive) return aActive ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  filtered.forEach((author) => {
    const active = isActiveInDecade(author, decade);
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.dataset.id = String(author.number);
    btn.innerHTML = `
      ${author.name}
      <span class="meta">
        ${author.literaryType}
        ${active ? "" : '<span class="inactive-tag"> · inactive this decade</span>'}
      </span>
    `;
    btn.addEventListener("click", () => {
      showDetail(author);
      map.setView([author.latitude, author.longitude], Math.max(map.getZoom(), 7), {
        animate: true,
      });
      markers.get(author.number).marker.openPopup();
    });
    li.appendChild(btn);
    authorListEl.appendChild(li);
  });

  highlightSelection();
}

function calculateCanonScore(author) {
  let score = 0;

  if (author.financiallyPrivileged) score++;
  if (author.ethnicity_white) score++;
  if (author.writingAsLivelihood) score++;
  if (author.familyInCanon) score++;
  if (author.familyInNortonCanon) score++;
  if (author.bornInLondon) score++;

  return score;
}

async function fetchJsonWithFallback(paths, { required = false, label = "data" } = {}) {
  let lastError = null;

  for (const path of paths) {
    try {
      const url = new URL(path, window.location.href);
      const response = await fetch(url);
      if (!response.ok) {
        lastError = new Error(`${label}: ${response.status} ${response.statusText}`);
        continue;
      }
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }

  if (required) {
    throw lastError || new Error(`Could not load ${label}`);
  }

  return [];
}

async function init() {
  // Initialize the map FIRST so it always renders, even if the data
  // fails to load (e.g. when the page is opened directly via file://
  // where fetch() of local JSON is blocked by browser CORS).
initMap();
  networkLayer = L.layerGroup().addTo(map);
  bindEvents();
  bindToolboxEvents();
  renderDecadeButtons();
  showEmptyDetailPanel();
  syncFocusMapMode();
  syncTourControls();

  try {
    authors = await fetchJsonWithFallback(
      ["./data/authors.json", "data/authors.json", "/data/authors.json"],
      { required: true, label: "authors.json" }
    );

    authors.forEach((author) => {
      author.canonScore = calculateCanonScore(author);
    });

    relationships = await fetchJsonWithFallback(
      ["./data/relationships.json", "data/relationships.json", "/data/relationships.json"],
      { required: false, label: "relationships.json" }
    );

    // Markers depend on author data, so create them only after it loads.
    createMarkers();
  } catch (error) {
    console.error("Data loading failed:", error);
    if (overlayWarningEl) {
      overlayWarningEl.textContent = "Data failed to load — run a local server";
    }
  }

  updateView();

  // Ensure map size is correct after DOM is fully rendered
  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 500);
}

init().catch((error) => {
  if (overlayWarningEl) {
    overlayWarningEl.textContent = "Data failed to load";
  }
  console.error("Initialization failed:", error);
});
function initMap() {
  map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
  });

  map.setView([52.88, -1.4], 6);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?key=cb1_2ro0_1_9ee552fddd2f287e0f59e602', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);

  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 200);

  // Trigger resize when layout changes
  window.addEventListener("resize", () => {
    if (map) {
      setTimeout(() => map.invalidateSize(), 300);
    }
  });
}

function createMarkers() {
  markers.clear();

  authors.forEach((author) => {
    const marker = L.marker([author.latitude, author.longitude], {
      icon: L.divIcon({
        className: "",
        html: "",
        iconSize: [0, 0],
      }),
    }).addTo(map);

    marker.bindPopup(buildPopupHtml(author));

    marker.on("popupopen", (event) => {
      const popup = event.popup.getElement();
      const link = popup?.querySelector(".popup-link");
      link?.addEventListener("click", () => showDetail(author));
    });

    marker.on("click", () => showDetail(author));

    markers.set(author.number, { marker, author });
  });
}

function renderHistoricalEvents() {
  const decade = DECADES[state.decadeIndex];

  const eventsThisDecade = HISTORICAL_EVENTS.filter(
    (event) => event.year >= decade.start && event.year < decade.end
  );

  eventListEl.innerHTML = "";

  if (eventsThisDecade.length === 0) {
    eventListEl.innerHTML = `<li class="event-empty">No major events added for this decade.</li>`;
    return;
  }

  eventsThisDecade.forEach((event) => {
    const li = document.createElement("li");
    li.className = "event-item";
    li.innerHTML = `
      <span class="event-year">${event.year}</span>
      <span class="event-title">${event.title}</span>
      <span class="event-type">${event.type}</span>
    `;
    eventListEl.appendChild(li);
  });
}

function getSelectedOverlays() {
  return Object.entries(state.overlays)
    .filter(([key, value]) => value)
    .map(([key]) => key);
}

function enforceMaxTwoOverlays(changedKey, checkboxEl) {
  const selected = getSelectedOverlays();

  if (selected.length > 2) {
    state.overlays[changedKey] = false;
    if (checkboxEl) {
      checkboxEl.checked = false;
    }
    overlayWarningEl.textContent = "Choose up to 2 overlays only.";
  } else {
    overlayWarningEl.textContent = "";
  }
}

function pairKey(a, b) {
  return [a.name, b.name].sort().join("|||");
}

function addPairMatch(pairs, a, b, match) {
  const key = pairKey(a, b);

  if (!pairs.has(key)) {
    pairs.set(key, { a, b, matches: [] });
  }

  pairs.get(key).matches.push(match);
}

function getOverlayStyle(type) {
  const styles = {
    partner: { color: "#ff4d4d", weight: 3, opacity: 0.85 },
    family: { color: "#ff8c42", weight: 3, opacity: 0.85 },
    finance_yes: { color: "#f7c948", weight: 2, opacity: 0.65 },
    finance_no: { color: "#3b82f6", weight: 2, opacity: 0.65 },
    livelihood_yes: { color: "#3fb950", weight: 2, opacity: 0.45 },
    livelihood_no: { color: "#8b949e", weight: 2, opacity: 0.45 },
    london_yes: { color: "#a371f7", weight: 2, opacity: 0.45 },
    london_no: { color: "#6e7681", weight: 2, opacity: 0.45 },
    england_yes: { color: "#58a6ff", weight: 2, opacity: 0.45 },
    england_no: { color: "#2dd4bf", weight: 2, opacity: 0.45 },
  };

  return styles[type] || { color: "#999", weight: 2, opacity: 0.4 };
}

function getLineStyles(matches) {
  const uniqueMatches = [];
  const seenTypes = new Set();

  matches.forEach((match) => {
    if (seenTypes.has(match.type)) return;
    seenTypes.add(match.type);
    uniqueMatches.push(match);
  });

  if (uniqueMatches.length <= 1) {
    return [getOverlayStyle(uniqueMatches[0].type)];
  }

  return [
    {
      color: "#111111",
      weight: 8,
      opacity: 0.95,
    },
    ...uniqueMatches.map((match) => ({
      ...getOverlayStyle(match.type),
      weight: Math.max(2, getOverlayStyle(match.type).weight - 0.5),
      opacity: Math.min(0.95, getOverlayStyle(match.type).opacity + 0.15),
    })),
  ];
}
function renderNetworkLines() {
  if (!networkLayer) return;

  networkLayer.clearLayers();

  const decade = DECADES[state.decadeIndex];

  const visibleAuthors = authors.filter((author) => {
    return matchesFilters(author) && isActiveInDecade(author, decade);
  });

  const byName = new Map(visibleAuthors.map((a) => [a.name, a]));
  const pairs = new Map();

  if (state.overlays.family || state.overlays.partner) {
    relationships.forEach((rel) => {
      const a = byName.get(rel.source);
      const b = byName.get(rel.target);

      if (!a || !b) return;

      if (rel.type === "family" && state.overlays.family) {
        addPairMatch(pairs, a, b, { type: rel.type });
      }

      if (rel.type === "partner" && state.overlays.partner) {
        addPairMatch(pairs, a, b, { type: rel.type });
      }
    });
  }

  for (let i = 0; i < visibleAuthors.length; i++) {
    for (let j = i + 1; j < visibleAuthors.length; j++) {
      const a = visibleAuthors[i];
      const b = visibleAuthors[j];

      if (state.overlays.finance && a.financiallyPrivileged === b.financiallyPrivileged) {
        addPairMatch(pairs, a, b, {
          type: a.financiallyPrivileged ? "finance_yes" : "finance_no",
        });
      }

      if (state.overlays.livelihood_yes && a.writingAsLivelihood && b.writingAsLivelihood) {
        addPairMatch(pairs, a, b, { type: "livelihood_yes" });
      }

      if (state.overlays.livelihood_no && !a.writingAsLivelihood && !b.writingAsLivelihood) {
        addPairMatch(pairs, a, b, { type: "livelihood_no" });
      }

      if (state.overlays.london_yes && a.bornInLondon && b.bornInLondon) {
        addPairMatch(pairs, a, b, { type: "london_yes" });
      }

      if (state.overlays.london_no && !a.bornInLondon && !b.bornInLondon) {
        addPairMatch(pairs, a, b, { type: "london_no" });
      }

      if (state.overlays.england_yes && a.bornInEngland && b.bornInEngland) {
        addPairMatch(pairs, a, b, { type: "england_yes" });
      }

      if (state.overlays.england_no && !a.bornInEngland && !b.bornInEngland) {
        addPairMatch(pairs, a, b, { type: "england_no" });
      }
    }
  }

  pairs.forEach(({ a, b, matches }) => {
    const styles = getLineStyles(matches);

    styles.forEach((style) => {
      const line = L.polyline(
        [
          [a.latitude, a.longitude],
          [b.latitude, b.longitude],
        ],
        {
          ...style,
          bubblingMouseEvents: false,
        }
      ).addTo(networkLayer);

      const label = matches.map((m) => m.type).join(" + ");
      line.bindTooltip(`${a.name} ↔ ${b.name}<br>${label}`);
      line.on("click", (event) => {
        if (event?.originalEvent) {
          L.DomEvent.stopPropagation(event.originalEvent);
        }
        setSelectedConnection(a, b, matches);
      });
    });
  });
}

function updateView() {
  renderLegend();
  renderLineLegend();
  renderHistoricalEvents();
  updateMarkers();
  renderConnectionDetails();
  renderNetworkLines();
}

function syncFocusMapMode() {
  document.body.classList.toggle("focus-map-mode", focusMapMode);

  if (focusMapToggle) {
    focusMapToggle.textContent = focusMapMode ? "Show timeline" : "Focus Map";
    focusMapToggle.setAttribute("aria-pressed", String(focusMapMode));
  }

  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 250);
}

function setDecade(index) {
  state.decadeIndex = index;
  decadeLabel.textContent = DECADES[index].label;
  renderDecadeButtons();
  updateView();
}

function bindEvents() {
  decadeSlider.addEventListener("change", (e) => {
    setDecade(Number(e.target.value));
  });

  colorFieldSelect.addEventListener("change", (e) => {
    state.colorField = e.target.value;
    updateView();
  });

  sizeFieldSelect.addEventListener("change", (e) => {
    state.sizeField = e.target.value;
    updateView();
  });

  searchInput.addEventListener("input", (e) => {
    state.search = e.target.value;
    updateView();
  });

  showInactiveCheckbox.addEventListener("change", (e) => {
    state.dimInactive = !e.target.checked;
    updateView();
  });

  overlayFamilyCheckbox.addEventListener("change", (e) => {
    state.overlays.family = e.target.checked;
    enforceMaxTwoOverlays("family", e.target);
    updateView();
  });

  overlayPartnerCheckbox.addEventListener("change", (e) => {
    state.overlays.partner = e.target.checked;
    enforceMaxTwoOverlays("partner", e.target);
    updateView();
  });

  overlayFinanceCheckbox.addEventListener("change", (e) => {
    state.overlays.finance = e.target.checked;
    enforceMaxTwoOverlays("finance", e.target);
    updateView();
  });

  overlayLivelihoodYesCheckbox.addEventListener("change", (e) => {
    state.overlays.livelihood_yes = e.target.checked;
    enforceMaxTwoOverlays("livelihood_yes", e.target);
    updateView();
  });

  overlayLivelihoodNoCheckbox.addEventListener("change", (e) => {
    state.overlays.livelihood_no = e.target.checked;
    enforceMaxTwoOverlays("livelihood_no", e.target);
    updateView();
  });

  overlayLondonYesCheckbox.addEventListener("change", (e) => {
    state.overlays.london_yes = e.target.checked;
    enforceMaxTwoOverlays("london_yes", e.target);
    updateView();
  });

  overlayLondonNoCheckbox.addEventListener("change", (e) => {
    state.overlays.london_no = e.target.checked;
    enforceMaxTwoOverlays("london_no", e.target);
    updateView();
  });

  overlayEnglandYesCheckbox.addEventListener("change", (e) => {
    state.overlays.england_yes = e.target.checked;
    enforceMaxTwoOverlays("england_yes", e.target);
    updateView();
  });

  overlayEnglandNoCheckbox.addEventListener("change", (e) => {
    state.overlays.england_no = e.target.checked;
    enforceMaxTwoOverlays("england_no", e.target);
    updateView();
  });

closeDetailBtn.addEventListener("click", hideDetail);
  toggleImageBtn?.addEventListener("click", toggleDetailImage);
  focusMapToggle?.addEventListener("click", () => {
    focusMapMode = !focusMapMode;
    syncFocusMapMode();
  });

  researcherToggle?.addEventListener("click", toggleResearcherToolbox);

  tourStartBtn?.addEventListener("click", startTour);
  tourPrevBtn?.addEventListener("click", () => advanceTour(-1));
  tourNextBtn?.addEventListener("click", () => advanceTour(1));
  tourPauseBtn?.addEventListener("click", pauseOrResumeTour);
  tourExitBtn?.addEventListener("click", endTour);
  tourLoopCheckbox?.addEventListener("change", (e) => {
    tourState.loop = e.target.checked;
  });

  const eventsToggle = document.getElementById("events-toggle");
  const eventsBox = document.getElementById("events-box");
  if (eventsToggle && eventsBox) {
    eventsToggle.addEventListener("click", () => {
      const isOpen = eventsBox.classList.toggle("open");
      document.body.classList.toggle("events-open", isOpen);
      eventsToggle.textContent = isOpen
        ? "Hide historical context"
        : "Show historical context";
      eventsToggle.setAttribute("aria-expanded", String(isOpen));
      eventsBox.setAttribute("aria-hidden", String(!isOpen));
      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 300);
    });
  }

  window.addEventListener("keydown", handleTourKeydown);

  map.on("click", () => {
    selectedConnection = null;
    renderConnectionDetails();
  });
}

function syncDetailImageToggle() {
  if (!toggleImageBtn) return;

  toggleImageBtn.hidden = !selectedAuthor;
  toggleImageBtn.disabled = !selectedAuthor;
  toggleImageBtn.textContent = detailImageHidden ? "Show image" : "Hide image";
  toggleImageBtn.setAttribute(
    "aria-label",
    detailImageHidden ? "Show author image" : "Hide author image"
  );
}

function toggleDetailImage() {
  detailImageHidden = !detailImageHidden;

  if (selectedAuthor) {
    detailContent.innerHTML = buildDetailHtml(selectedAuthor);
  }

  syncDetailImageToggle();

  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 200);
}
const factoryLocations = [
  {
    id: "pv1",
    label: "PV1",
    x: 2.5,
    y: 53.5,
    width: 19.4,
    height: 13.7,
    matches: location => normalizeFactoryValue(location) === "pv1"
  },
  {
    id: "pv2",
    label: "PV2",
    x: 2.5,
    y: 68.5,
    width: 17.8,
    height: 6.8,
    matches: location => normalizeFactoryValue(location) === "pv2"
  },
  {
    id: "sub-assy-eo-wc",
    label: "Sub Assy WC and EO",
    x: 25,
    y: 40.6,
    width: 9.2,
    height: 10.7,
    matches: location => {
      const normalisedLocation = normalizeFactoryValue(location);

      return (
        normalisedLocation.includes("economizer") ||
        normalisedLocation.includes("economiser") ||
        normalisedLocation.includes("oil separator") ||
        normalisedLocation.includes("water cover")
      );
    }
  },
  {
    id: "hydro-test",
    label: "Hydro Test",
    x: 22,
    y: 53.5,
    width: 4.4,
    height: 9.9,
    matches: location =>
      normalizeFactoryValue(location).includes("hydrostatic")
  },
  {
    id: "pneumatic",
    label: "Pneumatic",
    x: 26.5,
    y: 53.5,
    width: 5.2,
    height: 9.9,
    matches: location =>
      normalizeFactoryValue(location).includes("pneumatic")
  },
  {
    id: "ac",
    label: "AC",
    x: 36.2,
    y: 40.8,
    width: 29.6,
    height: 13.2,
    matches: location => normalizeFactoryValue(location) === "ac"
  }
];

function normalizeFactoryValue(value) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function createFactoryLayoutController({
  factoryAreas,
  layoutMatchCount,
  layoutSelectedLabel,
  selectedLocationTitle,
  selectedLocationCount,
  layoutJigList,
  getJigs,
  onSelectJig
}) {
  let selectedFactoryLocationId = "";

  function getAllJigs() {
    return getJigs();
  }

  function getJigsForFactoryLocation(factoryLocation) {
    return getAllJigs().filter(jig =>
      factoryLocation.matches(jig.location)
    );
  }

  function renderFactoryAreas() {
    factoryAreas.innerHTML = factoryLocations
      .map(factoryLocation => {
        const jigCount =
          getJigsForFactoryLocation(factoryLocation).length;

        return `
          <button
            class="factory-area ${selectedFactoryLocationId === factoryLocation.id ? "factory-area--selected" : ""}"
            style="
              left: ${factoryLocation.x}%;
              top: ${factoryLocation.y}%;
              width: ${factoryLocation.width}%;
              height: ${factoryLocation.height}%;
            "
            type="button"
            data-location-id="${escapeHtml(factoryLocation.id)}"
            aria-label="${escapeHtml(factoryLocation.label)}: ${jigCount} jig record${jigCount === 1 ? "" : "s"}"
          >
            <span>${escapeHtml(factoryLocation.label)}</span>
          </button>
        `;
      })
      .join("");
  }

  function selectFactoryLocation(factoryLocationId) {
    const factoryLocation = factoryLocations.find(
      location => location.id === factoryLocationId
    );

    if (!factoryLocation) {
      return;
    }

    selectedFactoryLocationId = factoryLocation.id;

    const locationJigs = getJigsForFactoryLocation(factoryLocation)
      .sort((a, b) =>
        String(a.jigName ?? "").localeCompare(
          String(b.jigName ?? ""),
          undefined,
          {
            numeric: true,
            sensitivity: "base"
          }
        )
      );

    layoutMatchCount.textContent =
      `${locationJigs.length} jig record${locationJigs.length === 1 ? "" : "s"}`;

    layoutSelectedLabel.textContent = factoryLocation.label;
    selectedLocationTitle.textContent = factoryLocation.label;
    selectedLocationCount.textContent =
      `${locationJigs.length} jig name${locationJigs.length === 1 ? "" : "s"}`;

    if (locationJigs.length === 0) {
      layoutJigList.innerHTML = `
        <li class="factory-jig-list__empty">
          No jig names recorded here.
        </li>
      `;
    } else {
      layoutJigList.innerHTML = locationJigs
        .map(jig => `
          <li>
            <button
              class="factory-jig-list__button"
              type="button"
              data-jig-id="${escapeHtml(jig.jigId)}"
            >
              <span class="factory-jig-list__id">
                ${escapeHtml(jig.jigId || "No ID")}
              </span>

              <span class="factory-jig-list__separator">
                -
              </span>

              <span class="factory-jig-list__name">
                ${escapeHtml(jig.jigName || "Unnamed jig")}
              </span>
            </button>
          </li>
        `)
        .join("");
    }

    renderFactoryAreas();
  }

  function ensureFactoryLocationSelected() {
    renderFactoryAreas();

    if (!selectedFactoryLocationId && factoryLocations.length > 0) {
      selectFactoryLocation(factoryLocations[0].id);
    }
  }

  factoryAreas.addEventListener("click", event => {
    const factoryArea = event.target.closest(".factory-area");

    if (!factoryArea) {
      return;
    }

    selectFactoryLocation(factoryArea.dataset.locationId);
  });

  layoutJigList.addEventListener("click", event => {
    const jigButton = event.target.closest(
      ".factory-jig-list__button"
    );

    if (!jigButton) {
      return;
    }

    const selectedJig = getAllJigs().find(
      jig => String(jig.jigId) === jigButton.dataset.jigId
    );

    if (selectedJig) {
      onSelectJig(selectedJig);
    }
  });

  return {
    renderFactoryAreas,
    ensureFactoryLocationSelected
  };
}

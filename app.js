async function loadSiteData() {
  const response = await fetch("./data/site_data.json");
  if (!response.ok) {
    throw new Error(`Failed to load site_data.json (${response.status})`);
  }
  return response.json();
}

function renderComparison(container, comparison) {
  const comparisonTemplate = document.getElementById("comparison-template");
  const comparisonElement =
    comparisonTemplate.content.firstElementChild.cloneNode(true);

  comparisonElement.querySelector(".comparison-title").textContent = comparison.title;
  comparisonElement.querySelector(".comparison-meta").textContent = comparison.meta || "";

  const controls = comparisonElement.querySelector(".slider-controls");
  controls.remove();

  const viewport = comparisonElement.querySelector(".slider-viewport");
  viewport.classList.add("gallery-viewport");

  const track = comparisonElement.querySelector(".slider-track");
  track.classList.add("gallery-track");

  const slides = comparison.slides || [];
  const galleryLimit = comparison.gallery_limit || slides.length;
  const visibleSlides = slides.slice(0, galleryLimit);

  visibleSlides.forEach((slideData) => {
    const row = document.createElement("div");
    row.className = "sample-row";

    const cols = slideData.cards.length;
    row.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    slideData.cards.forEach((cardData) => {
      const cell = document.createElement("figure");
      cell.className = "sample-cell";
      if (cardData.highlight) cell.classList.add("highlight");

      const label = document.createElement("figcaption");
      label.className = "cell-label";
      label.textContent = cardData.label;
      cell.appendChild(label);

      const img = document.createElement("img");
      img.loading = "lazy";
      img.src = cardData.src;
      img.alt = `${comparison.title} · ${cardData.label} · sample ${slideData.sample_id}`;
      cell.appendChild(img);

      row.appendChild(cell);
    });

    track.appendChild(row);
  });

  container.appendChild(comparisonElement);
}

function renderSection(app, section) {
  const sectionTemplate = document.getElementById("section-template");
  const sectionElement = sectionTemplate.content.firstElementChild.cloneNode(true);

  sectionElement.querySelector(".section-title").textContent = section.title;
  sectionElement.querySelector(".section-description").textContent =
    section.description || "";

  const comparisonsContainer = sectionElement.querySelector(".section-comparisons");
  (section.comparisons || []).forEach((comparison) => {
    renderComparison(comparisonsContainer, comparison);
  });

  app.appendChild(sectionElement);
}

async function main() {
  const app = document.getElementById("app");
  try {
    const siteData = await loadSiteData();
    document.getElementById("site-title").textContent = siteData.site.title;
    document.getElementById("site-subtitle").textContent = siteData.site.subtitle;
    (siteData.sections || []).forEach((section) => renderSection(app, section));
  } catch (error) {
    app.innerHTML = `<section class="content-section"><p><strong>Failed to load page:</strong> ${error.message}</p></section>`;
  }
}

main();

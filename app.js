async function loadSiteData() {
  const response = await fetch("./data/site_data.json");
  if (!response.ok) {
    throw new Error(`Failed to load site_data.json (${response.status})`);
  }
  return response.json();
}

function buildImageCard(cardData, comparisonTitle, sampleId) {
  const template = document.getElementById("image-card-template");
  const card = template.content.firstElementChild.cloneNode(true);
  const labelNode = card.querySelector(".image-label");
  const imageNode = card.querySelector("img");

  labelNode.textContent = cardData.label;
  imageNode.src = cardData.src;
  imageNode.alt = `${comparisonTitle} · ${cardData.label} · sample ${sampleId}`;
  if (cardData.highlight) {
    card.classList.add("highlight");
  }
  return card;
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

  if (visibleSlides.length === 0) {
    container.appendChild(comparisonElement);
    return;
  }

  const labels = visibleSlides[0].cards.map((c) => c.label);
  const highlightFlags = visibleSlides[0].cards.map((c) => !!c.highlight);

  labels.forEach((label, labelIndex) => {
    const row = document.createElement("div");
    row.className = "method-row";
    if (highlightFlags[labelIndex]) {
      row.classList.add("method-row-highlight");
    }

    const rowLabel = document.createElement("div");
    rowLabel.className = "method-row-label";
    rowLabel.textContent = label;
    row.appendChild(rowLabel);

    const rowImages = document.createElement("div");
    rowImages.className = "method-row-images";

    visibleSlides.forEach((slideData) => {
      const cardData = slideData.cards[labelIndex];
      if (!cardData) return;

      const fig = document.createElement("figure");
      fig.className = "method-image-card";

      const img = document.createElement("img");
      img.loading = "lazy";
      img.src = cardData.src;
      img.alt = `${comparison.title} · ${cardData.label} · sample ${slideData.sample_id}`;
      fig.appendChild(img);

      rowImages.appendChild(fig);
    });

    row.appendChild(rowImages);
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

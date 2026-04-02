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

function updateSliderState(comparisonElement, currentIndex, totalSlides) {
  const track = comparisonElement.querySelector(".slider-track");
  const indicator = comparisonElement.querySelector(".slide-indicator");
  const prevButton = comparisonElement.querySelector(".prev-button");
  const nextButton = comparisonElement.querySelector(".next-button");

  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  indicator.textContent = `${currentIndex + 1} / ${totalSlides}`;
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === totalSlides - 1;
}

function renderComparison(container, comparison) {
  const comparisonTemplate = document.getElementById("comparison-template");
  const slideTemplate = document.getElementById("slide-template");
  const comparisonElement =
    comparisonTemplate.content.firstElementChild.cloneNode(true);

  comparisonElement.querySelector(".comparison-title").textContent = comparison.title;
  comparisonElement.querySelector(".comparison-meta").textContent = comparison.meta || "";

  const track = comparisonElement.querySelector(".slider-track");
  const slides = comparison.slides || [];
  const displayMode = comparison.display_mode || "slider";

  if (displayMode === "gallery") {
    comparisonElement.classList.add("gallery-comparison");
    const controls = comparisonElement.querySelector(".slider-controls");
    const viewport = comparisonElement.querySelector(".slider-viewport");
    controls.remove();
    viewport.classList.add("gallery-viewport");
    track.classList.add("gallery-track");

    const galleryLimit = comparison.gallery_limit || slides.length;
    slides.slice(0, galleryLimit).forEach((slideData) => {
      const slideElement = slideTemplate.content.firstElementChild.cloneNode(true);
      slideElement.classList.add("gallery-slide");
      const grid = slideElement.querySelector(".slide-grid");
      grid.style.gridTemplateColumns = `repeat(${slideData.cards.length}, minmax(0, 1fr))`;

      slideData.cards.forEach((cardData) => {
        grid.appendChild(buildImageCard(cardData, comparison.title, slideData.sample_id));
      });

      const caption = slideElement.querySelector(".slide-caption");
      caption.textContent = slideData.caption || `Sample ${slideData.sample_id}`;
      track.appendChild(slideElement);
    });

    container.appendChild(comparisonElement);
    return;
  }

  slides.forEach((slideData) => {
    const slideElement = slideTemplate.content.firstElementChild.cloneNode(true);
    const grid = slideElement.querySelector(".slide-grid");
    grid.style.gridTemplateColumns = `repeat(${slideData.cards.length}, minmax(0, 1fr))`;

    slideData.cards.forEach((cardData) => {
      grid.appendChild(buildImageCard(cardData, comparison.title, slideData.sample_id));
    });

    const caption = slideElement.querySelector(".slide-caption");
    caption.textContent =
      slideData.caption || `Sample ${slideData.sample_id}`;
    track.appendChild(slideElement);
  });

  let currentIndex = 0;
  const totalSlides = slides.length;
  const prevButton = comparisonElement.querySelector(".prev-button");
  const nextButton = comparisonElement.querySelector(".next-button");

  prevButton.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateSliderState(comparisonElement, currentIndex, totalSlides);
  });
  nextButton.addEventListener("click", () => {
    currentIndex = Math.min(totalSlides - 1, currentIndex + 1);
    updateSliderState(comparisonElement, currentIndex, totalSlides);
  });

  updateSliderState(comparisonElement, currentIndex, totalSlides);
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

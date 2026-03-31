async function loadSelections() {
  const response = await fetch("./data/selections.json");
  if (!response.ok) {
    throw new Error(`Failed to load selections.json (${response.status})`);
  }
  return response.json();
}

function buildImageCard(card, label, src, imageId, title) {
  const labelNode = card.querySelector(".image-label");
  const image = card.querySelector("img");
  labelNode.textContent = `${label} · Image ${imageId}`;
  image.src = src;
  image.alt = `${title} - ${label} - image ${imageId}`;
}

function renderComparison(app, comparison) {
  const sectionTemplate = document.getElementById("comparison-template");
  const rowTemplate = document.getElementById("row-template");

  const section = sectionTemplate.content.firstElementChild.cloneNode(true);
  section.querySelector(".comparison-title").textContent = comparison.title;
  section.querySelector(".comparison-meta").textContent =
    `Selected IDs: ${comparison.selected_ids.join(", ")}`;

  const grid = section.querySelector(".comparison-grid");
  const baseDir = comparison.asset_dir;

  comparison.selected_ids.forEach((imageId) => {
    const row = rowTemplate.content.firstElementChild.cloneNode(true);
    const cards = row.querySelectorAll(".image-card");
    buildImageCard(
      cards[0],
      comparison.source_label,
      `${baseDir}/source/${imageId}.png`,
      imageId,
      comparison.title
    );
    buildImageCard(
      cards[1],
      comparison.baseline_label,
      `${baseDir}/baseline/${imageId}.png`,
      imageId,
      comparison.title
    );
    buildImageCard(
      cards[2],
      comparison.ours_label,
      `${baseDir}/ours/${imageId}.png`,
      imageId,
      comparison.title
    );
    grid.appendChild(row);
  });

  app.appendChild(section);
}

async function main() {
  const app = document.getElementById("app");
  try {
    const config = await loadSelections();
    document.getElementById("site-title").textContent = config.site.title;
    document.getElementById("site-subtitle").textContent = config.site.subtitle;

    config.comparisons.forEach((comparison) => renderComparison(app, comparison));
  } catch (error) {
    app.innerHTML = `<section class="note"><strong>Failed to load page:</strong> ${error.message}</section>`;
  }
}

main();

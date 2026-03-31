# Anonymous visualization site

This folder is a self-contained static site for anonymous qualitative comparisons.

## What is included

- `index.html`, `styles.css`, `app.js`: the webpage
- `data/selections.json`: edit this file to choose which 5 image IDs to show for each comparison
- `data/asset_manifest.json`: mapping from numbered display IDs back to the original local filenames
- `data/ibq_filename_map.json`: explicit mapping for the renamed IBQ/source256 files
- `assets/`: numbered copies of all images, generated as `1.png` to `50.png`

## Rebuild the site assets

From the repo root:

```bash
python3 scripts/build_anonymous_site.py
```

## Preview locally

From the repo root:

```bash
python3 -m http.server 8000 -d anonymous_site
```

Then open:

```text
http://127.0.0.1:8000
```

## Change the displayed images

Edit `anonymous_site/data/selections.json`.

Example:

```json
"selected_ids": [3, 8, 17, 29, 41]
```

All IDs are **1-based**, so image `1` means the first file in the numbered assets.

# Anonymous visualization site

This folder is a self-contained static site for anonymous qualitative comparisons.

## Included sections

- **Reconstruction**: first 15 examples for each model, shown in a slider
- **Generation**: baseline/ours pairs from `generation/`, aligned by ascending file modification time

## Control the reconstruction display order

Edit:

```text
site_config/reconstruction_display_order.json
```

Example:

```json
"simvq_262144": [4, 1, 7, 10, 2, 3, 5, 6, 8, 9, 11, 12, 13, 14, 15]
```

This means:

- display slot 1 shows image 4
- display slot 2 shows image 1
- display slot 3 shows image 7

The indices are **1-based**.

## Rebuild the site

From the repo root:

```bash
python3 scripts/build_anonymous_site.py
```

This will also sync the generated files into `publish_anonymous_site/` if that folder exists.

## Preview locally

```bash
python3 -m http.server 8000 -d anonymous_site
```

Then open:

```text
http://127.0.0.1:8000
```

## Data files

- `data/site_data.json`: webpage content
- `data/asset_manifest.json`: mapping from displayed files back to local source files
- `data/ibq_filename_map.json`: mapping for the numbered IBQ reconstruction images

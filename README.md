# Anonymous visualization site

This folder is a self-contained static site for anonymous qualitative comparisons.

## Included sections

- **Reconstruction**: first 15 examples for each model, shown in a slider
- **Generation**: baseline/ours pairs from `generation/`, aligned by ascending file modification time

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

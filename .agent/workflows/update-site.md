---
description: Maintain the existing GitHub Pages portfolio with private references and review before publication.
---

# Website maintenance

Read `SITE_INSTRUCTIONS.txt` in full before changing this website. It is the
authoritative current file map, content policy, preview and publishing workflow.

- Preserve the professional default, project mood zones, off-duty easter egg,
  grounding pulse, and supported employer/role facts.
- Keep raw PDFs, private sources, unpublished data and original photos inside
  ignored `_reference/`; no public PDF links, embeds or download affordances.
- Use shared `js/main.js`, `css/style.css` and `css/refresh.css` on project pages.
- Preview with `python3 scripts/preview.py --port 8123`; this blocks private files.
- Validate with `python3 scripts/validate-site.py` and `node --check js/main.js`.
- Update all cache keys with `node scripts/cache-version.mjs VERSION`.
- Review the diff and stage explicit paths. Never blindly stage every file.
- Obtain owner approval for the reviewed preview before committing/pushing.
- Do not rewrite history or change hosting as part of routine maintenance.

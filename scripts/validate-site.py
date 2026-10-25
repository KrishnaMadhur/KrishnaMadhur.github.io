"""Check public HTML links/assets and enforce the no-public-PDF policy."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
root = Path(__file__).resolve().parents[1]
pages = [root / 'index.html', *sorted((root / 'projects').glob('*.html'))]
errors = []
class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.ids = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'): self.ids.add(attrs['id'])
        for key in ('href','src'):
            if attrs.get(key): self.refs.append(attrs[key])
parsed = {}
for page in pages:
    parser = Links()
    text = page.read_text()
    parser.feed(text)
    parsed[page] = parser
    if 'data-report=' in text or 'pdf-modal' in text: errors.append(f'PDF UI remains: {page.name}')
    if not any('/css/refresh.css' in r or r.startswith('css/refresh.css') for r in parser.refs): errors.append(f'Missing refresh CSS: {page.name}')
for page, parser in parsed.items():
    for ref in parser.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc: continue
        target = (page.parent / unquote(url.path)).resolve() if url.path else page
        if target.is_dir(): target /= 'index.html'
        if not target.exists(): errors.append(f'{page.name}: missing {ref}')
        if '_reference' in target.parts or target.suffix.lower() == '.pdf': errors.append(f'Private link in {page.name}: {ref}')
        if target in parsed and url.fragment and url.fragment not in parsed[target].ids: errors.append(f'{page.name}: missing anchor {ref}')
for file in root.rglob('*.pdf'):
    if '_reference' not in file.relative_to(root).parts: errors.append(f'Public PDF: {file.relative_to(root)}')
for photo in json.loads((root/'assets/gallery/photos.json').read_text()):
    if not (root/'assets/gallery'/photo['file']).exists(): errors.append(f'Missing photograph: {photo["file"]}')
if errors: raise SystemExit('\n'.join(errors))
print(f'PASS: {len(pages)} public pages, local links/assets, anchors, gallery manifest, no public PDFs or report UI.')

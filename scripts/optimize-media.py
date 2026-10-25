"""Strip image metadata and compress display copies; retain private originals."""
from pathlib import Path
from PIL import Image, ImageOps
import shutil

root = Path(__file__).resolve().parents[1]
saved = 0
for folder in ('gallery', 'brainwaves'):
    for source in (root / 'assets' / folder).rglob('*'):
        if source.suffix.lower() not in ('.jpg', '.jpeg'):
            continue
        backup = root / '_reference' / 'original-assets' / source.relative_to(root / 'assets')
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            shutil.copy2(source, backup)
        before = source.stat().st_size
        with Image.open(backup) as original:
            oriented = ImageOps.exif_transpose(original).convert('RGB')
            oriented.thumbnail((1600, 1600))
            # Fresh pixel image drops EXIF, GPS, XMP and comments, not just selected tags.
            clean = Image.new('RGB', oriented.size)
            clean.paste(oriented)
            clean.save(source, 'JPEG', quality=85, optimize=True, progressive=True)
        saved += before - source.stat().st_size
        with Image.open(source) as check:
            assert not check.getexif(), source
        print(f'{source.relative_to(root)}: {before} → {source.stat().st_size} bytes; no EXIF')
print(f'Total saved: {saved:,} bytes. Originals retained privately.')

"""Local preview with private references, PDFs, and Git files excluded."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--root', default=str(Path(__file__).resolve().parents[1]))
parser.add_argument('--port', type=int, default=8123)
args = parser.parse_args()
root = Path(args.root).resolve()

class Preview(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(root), **kw)

    def send_head(self):
        requested = unquote(urlsplit(self.path).path)
        parts = Path(requested).parts
        resolved = Path(self.translate_path(self.path)).resolve()
        if (any(p.startswith(('.', '_')) or p == 'reports' for p in parts[1:])
                or requested.lower().endswith('.pdf') or not resolved.is_relative_to(root)):
            self.send_error(404)
            return None
        return super().send_head()

    def list_directory(self, path):
        self.send_error(404)
        return None

print(f'Preview: http://127.0.0.1:{args.port}', flush=True)
ThreadingHTTPServer(('127.0.0.1', args.port), Preview).serve_forever()

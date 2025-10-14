#!/usr/bin/env python3

import http.server
import socketserver
import os

# Change to a different port
PORT = 8089

# Set the directory to serve files from
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler

print(f"Serving at http://localhost:{PORT}")
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
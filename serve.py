#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8088  # Changed to port 8088
Handler = http.server.SimpleHTTPRequestHandler

# Change to the directory where the script is located
os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
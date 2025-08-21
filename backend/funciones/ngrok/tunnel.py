#!/usr/bin/env python

from http.server import HTTPServer, BaseHTTPRequestHandler
import logging
from pyngrok import ngrok

# Inicia el túnel en el puerto 8000
public_url = ngrok.connect(8000)
print("URL pública:", public_url)

class HelloHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = bytes("Hello", "utf-8")
        self.protocol_version = "HTTP/1.1"
        self.send_response(200)
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

logging.basicConfig(level=logging.INFO)

server = HTTPServer(("localhost", 8000), HelloHandler)

try:
    logging.info("Starting server. Press Ctrl+C to stop.")
    server.serve_forever()
except KeyboardInterrupt:
    logging.info("Shutting down server...")
    server.server_close()
    ngrok.kill()
    logging.info("Server stopped cleanly.")

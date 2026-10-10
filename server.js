// Serves the download page (static files in this folder). The installer itself is on
// GitHub Releases; this site only links to it. Railway sets PORT.
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const root = __dirname
const types = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.css': 'text/css', '.js': 'text/javascript', '.ico': 'image/x-icon' }

http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0])
  if (p === '/' || p === '') p = '/index.html'
  const file = path.normalize(path.join(root, p))
  if (!file.startsWith(root) || path.basename(file) === 'server.js') { res.writeHead(404); return res.end('Not found') }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found') }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': p.endsWith('.html') ? 'no-cache' : 'public, max-age=86400' })
    res.end(data)
  })
}).listen(process.env.PORT || 8080, () => console.log('download site on', process.env.PORT || 8080))

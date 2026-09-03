// Genera src/lib/blogSlugs.generated.ts a partir de las carpetas reales en
// src/app/blog. Se corre automáticamente antes de cada build (ver "prebuild"
// en package.json) para que sitemap.ts nunca vuelva a quedar desactualizado
// manualmente ni dependa de fs.readdirSync en tiempo de ejecución (Vercel no
// empaqueta las carpetas fuente dentro de la función serverless, así que
// leer el directorio dinámicamente en runtime causaba un 500 en producción).
const fs = require('fs')
const path = require('path')

const blogDir = path.join(__dirname, '..', 'src', 'app', 'blog')
const outFile = path.join(__dirname, '..', 'src', 'lib', 'blogSlugs.generated.ts')

const slugs = fs.readdirSync(blogDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('[') && !d.name.startsWith('_'))
  .map(d => d.name)
  .sort()

const contents = `// ARCHIVO GENERADO AUTOMÁTICAMENTE — no editar a mano.
// Se regenera en cada build con: node scripts/generate-blog-slugs.js
// (corre solo, vía "prebuild" en package.json)
export const BLOG_SLUGS: string[] = ${JSON.stringify(slugs, null, 2)}
`

fs.writeFileSync(outFile, contents)
console.log(`✅ blogSlugs.generated.ts actualizado con ${slugs.length} artículos`)

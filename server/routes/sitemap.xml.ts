import { joinSiteUrl } from '../utils/seo'

export default defineEventHandler((event) => {
  const {
    public: { siteUrl },
  } = useRuntimeConfig()

  const lastModified = new Date().toISOString()
  const urls = [
    { loc: joinSiteUrl(siteUrl, '/'), priority: '1.0' },
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${entry.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return body
})

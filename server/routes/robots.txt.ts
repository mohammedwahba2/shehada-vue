import { joinSiteUrl } from '../utils/seo'

export default defineEventHandler((event) => {
  const {
    public: { siteUrl },
  } = useRuntimeConfig()

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${joinSiteUrl(siteUrl, '/sitemap.xml')}`,
  ].join('\n')

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return body
})

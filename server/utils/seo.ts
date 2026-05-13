export const withoutTrailingSlash = (value: string) => value.replace(/\/+$/, '')

export const withLeadingSlash = (value: string) =>
  value.startsWith('/') ? value : `/${value}`

export const joinSiteUrl = (siteUrl: string, path = '/') =>
  `${withoutTrailingSlash(siteUrl)}${withLeadingSlash(path)}`

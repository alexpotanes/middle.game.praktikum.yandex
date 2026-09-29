const HTML_ENTITIES: Record<string, string> = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&amp;': '&',
}

export const decodeHtmlEntities = (value: string): string =>
  value.replace(/&(?:lt|gt|quot|amp|#39);/g, entity => HTML_ENTITIES[entity])

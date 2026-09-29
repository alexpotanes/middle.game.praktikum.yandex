import sanitizeHtml from 'sanitize-html'

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const HTML_ENTITIES: Record<string, string> = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&amp;': '&',
}

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, char => HTML_ESCAPES[char])

export const unescapeHtml = (value: string): string =>
  value.replace(/&(?:lt|gt|quot|amp|#39);/g, entity => HTML_ENTITIES[entity])

export const sanitizePlainText = (value: string): string => {
  const withoutControlChars = value.normalize('NFC').replace(CONTROL_CHARS, '')

  const withoutTags = sanitizeHtml(withoutControlChars, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
  })

  return escapeHtml(unescapeHtml(withoutTags)).trim()
}

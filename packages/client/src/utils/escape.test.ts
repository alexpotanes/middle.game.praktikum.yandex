import { decodeHtmlEntities } from './escape'

describe('decodeHtmlEntities', () => {
  it('возвращает экранированные сущности в исходный вид', () => {
    expect(
      decodeHtmlEntities('Tom &amp; Jerry &lt;3 &quot;q&quot; &#39;s&#39;')
    ).toBe('Tom & Jerry <3 "q" \'s\'')
  })

  it('не декодирует дважды', () => {
    expect(decodeHtmlEntities('&amp;lt;')).toBe('&lt;')
  })

  it('не трогает обычный текст и неизвестные сущности', () => {
    expect(decodeHtmlEntities('Привет &nbsp; мир')).toBe('Привет &nbsp; мир')
  })
})

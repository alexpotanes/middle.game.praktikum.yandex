import { escapeHtml, sanitizePlainText, unescapeHtml } from '../utils/sanitize'

describe('sanitizePlainText', () => {
  it('вырезает script-теги полностью вместе с содержимым', () => {
    expect(sanitizePlainText('<script>alert(1)</script>Привет')).toBe('Привет')
  })

  it('убирает опасные атрибуты вроде onerror', () => {
    expect(sanitizePlainText('<img src=x onerror="alert(1)">Текст')).toBe(
      'Текст'
    )
  })

  it('оставляет обычный текст без изменений', () => {
    expect(sanitizePlainText('Обычный комментарий без разметки')).toBe(
      'Обычный комментарий без разметки'
    )
  })

  it('обрезает пробелы по краям', () => {
    expect(sanitizePlainText('   с пробелами   ')).toBe('с пробелами')
  })

  it('экранирует одиночные спецсимволы < > & " \'', () => {
    expect(sanitizePlainText('1 < 2 > 0 & "a" \'b\'')).toBe(
      '1 &lt; 2 &gt; 0 &amp; &quot;a&quot; &#39;b&#39;'
    )
  })

  it('не оставляет исполняемой разметки после вложенных/битых тегов', () => {
    const result = sanitizePlainText(
      '<scr<script>ipt>alert(1)</scr</script>ipt>'
    )
    expect(result).not.toMatch(/[<>]/)
  })

  it('не оставляет угловых скобок в javascript:-ссылках и svg', () => {
    expect(
      sanitizePlainText(
        '<a href="javascript:alert(1)">клик</a><svg onload=alert(1)>'
      )
    ).toBe('клик')
  })

  it('удаляет управляющие символы, включая нулевой байт', () => {
    expect(sanitizePlainText('a\u0000b\u0007c')).toBe('abc')
  })

  it('сохраняет переводы строк', () => {
    expect(sanitizePlainText('строка 1\nстрока 2')).toBe('строка 1\nстрока 2')
  })

  it('идемпотентна: повторная обработка не меняет результат', () => {
    const once = sanitizePlainText('Tom & Jerry <b>"hi"</b>')
    expect(sanitizePlainText(once)).toBe(once)
  })
})

describe('escapeHtml / unescapeHtml', () => {
  it('escapeHtml и unescapeHtml взаимно обратны', () => {
    const raw = `<a href="x">'&amp;'</a>`
    expect(unescapeHtml(escapeHtml(raw))).toBe(raw)
  })

  it('unescapeHtml не декодирует дважды', () => {
    expect(unescapeHtml('&amp;lt;')).toBe('&lt;')
  })
})

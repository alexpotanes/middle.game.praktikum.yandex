import { sanitizePlainText } from '../utils/sanitize'

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
})

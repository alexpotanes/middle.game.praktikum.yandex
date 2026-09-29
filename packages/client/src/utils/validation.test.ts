import { FORUM_LIMITS, validateForumText, validators } from './validation'

describe('validateForumText', () => {
  const opts = { required: 'Обязательно', max: 10 }

  it('требует непустой текст', () => {
    expect(validateForumText('   ', opts)).toBe('Обязательно')
  })

  it('ограничивает длину', () => {
    expect(validateForumText('a'.repeat(11), opts)).toMatch(/10/)
    expect(validateForumText('a'.repeat(10), opts)).toBeUndefined()
  })

  it.each([
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    '</div>',
    '<!-- x -->',
  ])('отклоняет html-разметку %s', value => {
    expect(validateForumText(value, { ...opts, max: 1000 })).toMatch(/HTML/)
  })

  it('разрешает одиночные < и > в обычном тексте', () => {
    expect(
      validateForumText('1 < 2 и 3 > 2', { ...opts, max: 100 })
    ).toBeUndefined()
  })

  it('лимиты совпадают с серверными', () => {
    expect(FORUM_LIMITS).toEqual({
      title: 200,
      topicMessage: 10000,
      commentMessage: 5000,
    })
  })
})

describe('validators.display_name', () => {
  it('разрешает пустое значение и обычные имена', () => {
    expect(validators.display_name('')).toBeUndefined()
    expect(validators.display_name('Степа_1 Иванов-мл.')).toBeUndefined()
  })

  it.each(['<script>', 'a&b', '"quoted"', "o'neil", 'a'.repeat(51)])(
    'отклоняет %s',
    value => {
      expect(validators.display_name(value)).toBeDefined()
    }
  )
})

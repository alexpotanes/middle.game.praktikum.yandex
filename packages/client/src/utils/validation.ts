export type ValidationRule = (value: string) => string | undefined

const FIRST_LAST_NAME = /^[A-ZА-ЯЁ][A-Za-zА-ЯЁа-яё-]*$/
const LOGIN = /^(?!\d+$)[A-Za-z\d_-]{3,20}$/
const EMAIL = /^[A-Za-z\d._%+-]+@[A-Za-z\d-]+\.[A-Za-z]{2,}$/
const PASSWORD = /^(?=.*[A-Z])(?=.*\d).{8,40}$/
const PHONE = /^\+?\d{10,15}$/

const DISPLAY_NAME = /^[\p{L}\p{N} ._-]{1,50}$/u

export const FORUM_LIMITS = {
  title: 200,
  topicMessage: 10000,
  commentMessage: 5000,
} as const

const HTML_TAG_LIKE = /<\s*[/!a-zA-Z?]/

export const validateForumText = (
  value: string,
  { required, max }: { required: string; max: number }
): string | undefined => {
  const trimmed = value.trim()
  if (!trimmed) return required
  if (trimmed.length > max) return `Не более ${max} символов`
  if (HTML_TAG_LIKE.test(trimmed))
    return 'HTML-теги не поддерживаются, уберите символы «<» и «>»'
}

export const validators = {
  first_name: (v: string) => {
    if (!v) return 'Обязательное поле'
    if (!FIRST_LAST_NAME.test(v))
      return 'Латиница или кириллица, первая — заглавная, без цифр и пробелов, допустим дефис'
  },
  second_name: (v: string) => {
    if (!v) return 'Обязательное поле'
    if (!FIRST_LAST_NAME.test(v))
      return 'Латиница или кириллица, первая — заглавная, без цифр и пробелов, допустим дефис'
  },
  login: (v: string) => {
    if (!v) return 'Обязательное поле'
    if (!LOGIN.test(v))
      return 'От 3 до 20 символов, латиница, цифры, дефис или _; не может состоять только из цифр'
  },
  email: (v: string) => {
    if (!v) return 'Обязательное поле'
    if (!EMAIL.test(v)) return 'Введите корректный email'
  },
  password: (v: string) => {
    if (!v) return 'Обязательное поле'
    if (!PASSWORD.test(v))
      return 'От 8 до 40 символов, минимум одна заглавная буква и одна цифра'
  },
  phone: (v: string) => {
    if (!v) return 'Обязательное поле'
    if (!PHONE.test(v)) return 'От 10 до 15 цифр, допускается «+» в начале'
  },
  display_name: (v: string) => {
    if (v && !DISPLAY_NAME.test(v))
      return 'До 50 символов: буквы, цифры, пробел, точка, дефис или _'
  },
  oldPassword: (v: string) => {
    if (!v) return 'Обязательное поле'
  },
  newPassword: (v: string) => {
    if (!v) return 'Обязательное поле'
    if (!PASSWORD.test(v))
      return 'От 8 до 40 символов, минимум одна заглавная буква и одна цифра'
  },
}

export type ValidatorKey = keyof typeof validators

import { render, screen, fireEvent } from '@testing-library/react'
import type { ButtonHTMLAttributes } from 'react'

jest.mock('../button', () => ({
  Button: (props: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props} />
  ),
}))

import { SearchingScreen } from './SearchingScreen'

describe('SearchingScreen', () => {
  it('shows the searching status', () => {
    render(<SearchingScreen onCancel={jest.fn()} />)

    expect(screen.getByText('Ищем соперника…')).not.toBeNull()
  })

  it('calls onCancel when "Отмена" is clicked', () => {
    const onCancel = jest.fn()
    render(<SearchingScreen onCancel={onCancel} />)

    fireEvent.click(screen.getByText('Отмена'))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})

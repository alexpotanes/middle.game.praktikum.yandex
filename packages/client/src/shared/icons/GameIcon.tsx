import type { IconProps } from './types'

export const GameIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" {...props}>
    <path
      d="M12 2 3 6v6c0 5 4 8.5 9 10 5-1.5 9-5 9-10V6z"
      fill="currentColor"
    />
  </svg>
)

import { Line } from './styles'

type FlourishProps = {
  className?: string
}

export const Flourish = ({ className }: FlourishProps) => (
  <Line className={className} aria-hidden="true" />
)

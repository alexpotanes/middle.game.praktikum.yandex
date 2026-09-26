import styled from 'styled-components'

export const ReactionsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
`

export const ReactionsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const ReactionButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid
    ${({ $active }) => ($active ? 'currentColor' : 'rgba(128, 128, 128, 0.35)')};
  background: ${({ $active }) =>
    $active ? 'rgba(128, 128, 128, 0.15)' : 'transparent'};
  color: inherit;
  font: inherit;
  font-size: 14px;
  line-height: 1.6;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.85)};
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    opacity 0.15s ease;

  &:hover:not(:disabled) {
    opacity: 1;
    border-color: currentColor;
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`

export const ReactionCount = styled.span`
  font-size: 12px;
  line-height: 1;
`

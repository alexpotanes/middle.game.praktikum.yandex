import { Link, NavLink } from 'react-router-dom'
import { styled } from 'styled-components'

import { colors } from '../../styles/theme'

export const Wrapper = styled.header`
  background: ${colors.header};
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-family: 'Georgia', 'Times New Roman', serif;
  line-height: 1.4;
`

export const Inner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`

export const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${colors.onHeader};
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 0.02em;
`

export const LogoBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${colors.crimson};
  border: 1px solid ${colors.gold};
  color: ${colors.goldLight};
  font-size: 13px;
  font-weight: 700;
`

export const Nav = styled.nav``

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
`

export const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
`

export const NavItem = styled(NavLink)`
  display: inline-flex;
  padding: 8px 14px;
  border-radius: 8px;
  color: rgba(245, 242, 239, 0.8);
  text-decoration: none;
  font-size: 14px;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${colors.onHeader};
  }

  &.active {
    background: rgba(255, 255, 255, 0.16);
    color: ${colors.onHeader};
  }
`

export const FullscreenToggle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 128px;
  min-height: 36px;
  padding: 8px 14px;
  border: 1px solid rgba(232, 200, 119, 0.7);
  border-radius: 8px;
  background: rgba(124, 38, 38, 0.28);
  color: ${colors.onHeader};
  font: inherit;
  font-size: 14px;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover:not(:disabled) {
    background: rgba(124, 38, 38, 0.48);
    border-color: ${colors.goldLight};
  }

  &:disabled {
    cursor: default;
    opacity: 0.55;
  }
`

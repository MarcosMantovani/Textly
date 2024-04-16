import styled from 'styled-components'
import { colors } from '../../styles'

type StandardButtonProps = {
  $styled?: 'standard' | 'minimalist' | 'sidebar' | 'post'
}

export const StandardButton = styled.button<StandardButtonProps>`
  background-color: ${({ $styled }) =>
    $styled === 'minimalist' ? 'transparent' : `${colors.blue}`};
  color: ${colors.white};
  font-size: 12px;
  padding: 10px 45px;
  border: 1px solid transparent;
  border-radius: 8px;
  border-color: ${({ $styled }) =>
    $styled === 'minimalist' ? `${colors.white2}` : 'transparent'};
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-top: 10px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${colors.white};
    color: ${colors.black};
    border-color: ${({ $styled }) =>
      $styled === 'minimalist' ? 'transparent' : `${colors.black}`};
  }

  &:disabled {
    background-color: ${colors.lightGray};
    color: ${colors.black};
    border-color: ${({ $styled }) =>
      $styled === 'minimalist' ? 'transparent' : `${colors.blue}`};
    cursor: not-allowed;
  }
`

export const PostButton = styled.button`
  background-color: ${colors.blue};
  width: 40px;
  height: 40px;
  padding: 8px;
  border: none;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border-bottom: 1px solid ${colors.white};
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${colors.white};
    border-bottom-color: ${colors.black};

    svg * {
      fill: ${colors.blue};
    }
  }

  svg {
    width: 20px;
    height: 20px;

    * {
      fill: ${colors.white};
    }
  }
`

export const SideBarButton = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 16px 20px;
  border: none;
  border-radius: 16px;
  margin: 0;

  font-size: 16px;
  text-align: left;

  background-color: ${colors.black};
  color: ${colors.white};

  column-gap: 8px;

  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${colors.white};
    color: ${colors.black};

    svg * {
      fill: ${colors.black};
    }
  }

  svg {
    height: 30px;
    width: 30px;

    * {
      fill: ${colors.white};
    }
  }
`

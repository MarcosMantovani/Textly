import styled from 'styled-components'
import { colors } from '../../styles'

type Props = {
  $opened: boolean
}

export const Container = styled.div<Props>`
  position: fixed;
  top: ${({ $opened }) => ($opened ? '32px' : '12px')};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 16px;
  width: 300px;
  padding: 16px 8px;
  border-radius: 8px;
  border: 1px solid ${colors.white};
  background-color: ${colors.blue};
  text-align: center;
  opacity: ${({ $opened }) => ($opened ? '1' : '0')};
  transition: top 0.3s ease, opacity 0.3s ease;
`

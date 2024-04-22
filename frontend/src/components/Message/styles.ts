import styled from 'styled-components'
import { colors } from '../../styles'

export const Container = styled.div`
  position: absolute;
  top: 32px;
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
`

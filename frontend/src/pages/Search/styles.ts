import styled from 'styled-components'
import { colors } from '../../styles'

export const SearchContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 32px;
  width: 100%;
  row-gap: 16px;
  background-color: ${colors.blue};

  .inputContainer {
    display: flex;
    column-gap: 16px;
  }

  .searchIcon {
    width: 35px;
    height: 35px;
    cursor: pointer;
  }

  .buttons {
    display: flex;
    justify-content: center;
    column-gap: 16px;
  }
`

export const Input = styled.input`
  background-color: transparent;
  border: 1px solid ${colors.white};
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  padding: 8px;
  color: ${colors.white};
`

import styled from 'styled-components'

import { colors } from '../../styles'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Title = styled.h2`
  text-align: center;
  font-size: 24px;
  width: 648px;
  margin: 32px 0 20px;
  color: ${colors.white};
`

export const Profile = styled.div`
  display: flex;
  align-items: center;
  column-gap: 16px;
  cursor: pointer;

  img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
  }
`

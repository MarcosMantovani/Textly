import styled from 'styled-components'

import { Sidebar } from '../Sidebar/styles'
import {
  Name as NamePost,
  ProfilePhoto as ProfilePhotoPost,
  Userame as UsernamePost
} from '../Post/styles'

export const Profilebar = styled(Sidebar)`
  right: 0;
  left: auto;

  > div {
    position: relative;
  }
`

export const Banner = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 264px;
  height: 144px;
  object-fit: cover;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10%);
  }
`

export const MainInfo = styled.div`
  position: absolute;
  width: 268px;
  top: 104px;
  row-gap: 0;
  align-items: center;
  text-align: center;
`

export const Photo = styled(ProfilePhotoPost)`
  width: 80px;
  height: 80px;
  margin: 0;
  cursor: default;
`

export const Name = styled(NamePost)`
  font-size: 20px;
  cursor: default;
`

export const UserName = styled(UsernamePost)`
  font-size: 16px;
  cursor: default;
`

export const UserEmail = styled(UsernamePost)`
  font-size: 12px;
  cursor: default;
`

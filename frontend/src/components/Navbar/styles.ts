import styled from 'styled-components'
import { breakpoints, colors } from '../../styles'
import { SideBarButton } from '../Button/styles'
import { ProfilePhoto as PostProfilePhoto } from '../Post/styles'

export const Container = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: auto;
  column-gap: 24px;
  padding: 8px;
  background-color: ${colors.blue};
  z-index: 5;

  ${SideBarButton} {
    padding: 8px;
    width: auto;
  }

  @media (max-width: ${breakpoints.desktop}) {
    display: flex;
  }
`

export const ProfilePhoto = styled(PostProfilePhoto)`
  margin: 0;
`

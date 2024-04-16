import styled from 'styled-components'

import { colors } from '../../styles'
import { ProfilePhoto as ProfilePhotoPost } from '../Post/styles'

export const Container = styled.div`
  display: grid;
  grid-template-columns: 40px 600px;
  column-gap: 8px;
  margin-bottom: 32px;

  .sideIcons {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  }
`

export const ProfilePhoto = styled(ProfilePhotoPost)`
  margin-top: 6px;
`

export const TextPost = styled.div`
  background-color: ${colors.blue};
  border-radius: 8px;
  border-top-left-radius: 0;
  padding: 16px;
  min-height: 142px;
  height: 100%;

  textarea {
    background-color: transparent;
    border: 1px solid ${colors.white};
    border-radius: 8px;
    resize: none;
    overflow-y: auto;
    color: ${colors.white};
    font-size: 16px;
    width: 100%;
    height: 100%;
    padding: 8px;
  }
`

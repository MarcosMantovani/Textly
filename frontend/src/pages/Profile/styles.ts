import styled from 'styled-components'

import { ProfilePhoto as PostProfilePhoto } from '../../components/Post/styles'

import TempBanner from '../../assets/media/rl_evergreen_16x9.jpg'

import {
  ProfilePhoto as ProfilePhotoPost,
  Name as NamePost,
  Username as UsernamePost
} from '../../components/Post/styles'

export const Header = styled.div`
  position: relative;
  margin: 0 auto;
`

export const ProfileContent = styled.div`
  &.container {
    margin-top: 402px;
  }
`

export const BackgroundBanner = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 330px;
  object-fit: cover;
  filter: blur(10px);
`

export const Banner = styled.div`
  background-image: url(${TempBanner});
  background-size: cover;
  position: absolute;
  left: 50%;
  top: 40px;
  transform: translateX(-50%);
  width: 600px;
  height: 330px;
  border-radius: 8px;
  object-fit: cover;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
`

export const Info = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;

  .maininfo {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      column-gap: 8px;
    }
  }

  .social {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    p {
      transition: all 0.3s ease-in-out;

      &:hover {
        transform: translateY(-10%);
      }
    }
    .description {
      cursor: pointer;
    }
  }
`

export const ProfilePhoto = styled(ProfilePhotoPost)`
  width: 80px;
  height: 80px;
  margin: 0;
  cursor: auto;
`

export const Name = styled(NamePost)`
  font-size: 20px;
  cursor: auto;
`

export const Username = styled(UsernamePost)`
  font-size: 16px;
  cursor: auto;
`

export const List = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 32px;
  row-gap: 16px;

  li {
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 8px;
  }
`

export const ListProfilePhoto = styled(PostProfilePhoto)`
  margin-top: 0;
  width: 60px;
  height: 60px;
`
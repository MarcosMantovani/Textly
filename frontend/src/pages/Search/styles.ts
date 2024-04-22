import styled from 'styled-components'

import { ProfilePhoto as PostProfilePhoto } from '../../components/Post/styles'
import { Name as PostName } from '../../components/Post/styles'
import { Username as PostUsername } from '../../components/Post/styles'
import { colors } from '../../styles'

export const Input = styled.input`
  background-color: transparent;
  border: 1px solid ${colors.white};
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  padding: 8px;
  color: ${colors.white};

  &:focus {
    outline: none;
  }
`

export const SearchForm = styled.form`
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
    column-gap: 8px;
  }

  .searchButton {
    border: none;
    border-radius: 8px;
    padding: 4px;
    background-color: transparent;
    width: 38px;
    height: 38px;
    transition: all 0.3s ease-in-out;

    &:hover {
      background-color: ${colors.white};

      .searchIcon * {
        fill: ${colors.black};
      }
    }
  }

  .searchIcon {
    width: 100%;
    height: 100%;
    cursor: pointer;
    fill: ${colors.white};
  }

  .buttons {
    display: flex;
    justify-content: center;
    column-gap: 16px;
  }
`

export const ProfilePhoto = styled(PostProfilePhoto)`
  width: 100%;
  max-width: 100px;
  height: 100%;
  max-height: 100px;
`

export const Name = styled(PostName)`
  font-size: 20px;
`

export const Username = styled(PostUsername)`
  font-size: 16px;
`

export const UsersList = styled.ul`
  display: flex;
  flex-direction: column;
  row-gap: 16px;

  .row {
    display: grid;
    grid-template-columns: 100px auto;
    column-gap: 16px;
    background-color: ${colors.blue};
    padding: 16px;
    border-radius: 8px;
  }

  .userInfo {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .secondInfo {
    text-align: end;
    font-size: 10px;
    opacity: 0.5;
  }

  .name {
    display: flex;
    column-gap: 8px;
  }

  .followButton {
    width: 20px;
    height: 20px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    * {
      fill: ${colors.white};
    }

    &:hover * {
      fill: ${colors.likeColor};
    }
  }
`

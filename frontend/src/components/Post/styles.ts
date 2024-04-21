import styled from 'styled-components'

import { colors } from '../../styles'

type ContainerProps = {
  $liked: boolean
}

export const Container = styled.div<ContainerProps>`
  display: grid;
  grid-template-columns: 40px 600px;
  column-gap: 8px;
  margin-bottom: 24px;
  .sideIcons {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  }

  .likeButton svg * {
    fill: ${({ $liked }) => ($liked ? `${colors.likeColor}` : '')};
  }

  .textQuotePost {
    background-color: transparent;
    border: 1px solid ${colors.white};
    border-radius: 8px;
    resize: none;
    overflow-y: auto;
    color: ${colors.white};
    font-size: 16px;
    width: 100%;
    padding: 8px;
    outline: none;
  }
`

export const ProfilePhoto = styled.img`
  margin-top: 8px;
  width: 40px;
  max-width: 40px;
  height: 40px;
  max-height: 40px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10%);
  }
`

export const Name = styled.p`
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10%);
  }
`

export const Username = styled.p`
  font-size: 12px;
  opacity: 0.75;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-10%);
  }
`

export const TextPost = styled.div`
  background-color: ${colors.blue};
  border-radius: 8px;
  border-top-left-radius: 0;
  padding: 0 8px;
  min-height: 142px;

  .postHeader {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
  }

  .secondInfo {
    text-align: end;
    font-size: 12px;
    opacity: 0.5;
  }

  .content {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    padding-bottom: 8px;

    .PostImage {
      object-fit: cover;
      width: 100%;
      max-height: 300px;
      border-radius: 8px;
    }
  }

  transition: all 0.3s ease-in-out;
  &:hover {
    filter: brightness(110%);
    transform: translateY(-1%);
  }
`

export const QuotedProfilePhoto = styled(ProfilePhoto)`
  margin: 0;
`

export const QuotedPostContainer = styled.div`
  .headInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mainInfo {
    display: flex;
    align-items: center;
    column-gap: 8px;
  }

  .quotedBody {
    margin-top: 8px;
  }

  .quotedContent {
    .PostImage {
      margin-top: 16px;
    }
  }
`

export const QuotePostForm = styled.form`
  display: grid;
  grid-template-columns: 40px 600px;
  column-gap: 8px;
  margin-bottom: 24px;
  .sideIcons {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  }

  .textQuotePost {
    background-color: transparent;
    border: 1px solid ${colors.white};
    border-radius: 8px;
    resize: none;
    overflow-y: auto;
    color: ${colors.white};
    font-size: 16px;
    width: 100%;
    padding: 8px;
    outline: none;
  }
`

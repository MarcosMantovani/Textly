import { ReactComponent as LikeIcon } from '../../assets/media/heart-outline.svg'
import { ReactComponent as MessageIcon } from '../../assets/media/message-circle-outline.svg'

import Button from '../Button'

import * as S from './styles'
import { useNavigate } from 'react-router-dom'

export type PostType = {
  id: number
  body: string
  image?: string | null
  created_at: string
  user: {
    id: number
    name: string
    username: string
    profile_photo: string | null
  }
}

type Props = {
  postContent: PostType
}

const Post = ({ postContent }: Props) => {
  const navigate = useNavigate()

  const redirectToProfilePage = (id: number) =>
    navigate(`/profile/${id}`, { replace: true })

  return (
    <S.Container>
      <div className="sideIcons">
        <S.ProfilePhoto
          src={
            postContent.user.profile_photo
              ? postContent.user.profile_photo
              : `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
          }
          alt="Profile Photo"
          onClick={() => redirectToProfilePage(postContent.user.id)}
        />
        <Button title="" type="button" styled="post" icon={<LikeIcon />} />
        <Button title="" type="button" styled="post" icon={<MessageIcon />} />
      </div>
      <div>
        <S.TextPost>
          <div className="postHeader">
            <div>
              <S.Name
                onClick={() => redirectToProfilePage(postContent.user.id)}
              >
                {postContent.user.name}
              </S.Name>
              <S.Username
                onClick={() => redirectToProfilePage(postContent.user.id)}
              >
                @{postContent.user.username}
              </S.Username>
            </div>
            <p className="time">{postContent.created_at}</p>
          </div>
          <div className="content">
            <p>{postContent.body}</p>
            {postContent.image && (
              <img src={postContent.image} alt="Post Image" />
            )}
          </div>
        </S.TextPost>
      </div>
    </S.Container>
  )
}

export default Post

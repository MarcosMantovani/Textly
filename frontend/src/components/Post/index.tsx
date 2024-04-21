import axios from 'axios'
import { ReactComponent as LikeIcon } from '../../assets/media/heart-outline.svg'
import { ReactComponent as MessageIcon } from '../../assets/media/message-circle-outline.svg'

import Button from '../Button'

import * as S from './styles'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export type PostType = {
  id: number
  body: string
  image?: string | null
  created_at: string
  number_of_likes: number
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

  const [likes, setLikes] = useState(postContent.number_of_likes)
  const [error, setError] = useState<string | null>(null)

  const redirectToProfilePage = () =>
    navigate(`/profile/${postContent.user.id}`, { replace: true })

  const likePost = async () => {
    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('access')}`,
          Accept: 'application/json'
        }
      }

      const body = JSON.stringify({
        post_id: postContent.id
      })

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/like-post/`,
          body,
          config
        )

        if (likes === postContent.number_of_likes) {
          setLikes(likes + 1)
        } else {
          setLikes(likes - 1)
        }
      } catch (err) {
        setError('Erro ao curtir post, atualize a página.')
      }
    } else {
      setError('Entre para curtir um post.')
    }
  }

  if (error) {
    return (
      <>
        <h3>{error}</h3>
        <br />
      </>
    )
  }

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
          onClick={redirectToProfilePage}
        />
        <Button
          title=""
          type="button"
          styled="post"
          icon={<LikeIcon />}
          onClick={likePost}
        />
        <Button title="" type="button" styled="post" icon={<MessageIcon />} />
      </div>
      <div>
        <S.TextPost>
          <div className="postHeader">
            <div>
              <S.Name onClick={redirectToProfilePage}>
                {postContent.user.name}
              </S.Name>
              <S.Username onClick={redirectToProfilePage}>
                @{postContent.user.username}
              </S.Username>
            </div>
            <div>
              <p className="secondInfo">{postContent.created_at}</p>
              <p className="secondInfo">{likes} curtidas</p>
            </div>
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

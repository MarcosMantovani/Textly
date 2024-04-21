import axios from 'axios'
import { ChangeEvent, useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import { RootState } from '../../store/reducers'

import { ReactComponent as LikeIcon } from '../../assets/media/heart-outline.svg'
import { ReactComponent as MessageIcon } from '../../assets/media/message-circle-outline.svg'
import { ReactComponent as ConfirmIcon } from '../../assets/media/checkmark-outline.svg'
import { ReactComponent as CloseIcon } from '../../assets/media/close-outline.svg'

import Button from '../Button'

import * as S from './styles'
import { useNavigate } from 'react-router-dom'

export type PostType = {
  id: number
  body: string
  image?: string | null
  created_at: string
  number_of_likes: number
  likes: number[]
  user: {
    id: number
    name: string
    username: string
    profile_photo: string | null
  }
  quoted_post?: {
    id: number
    body: string
    image?: string | null
    created_at: string
    likes: number[]
    number_of_likes: number
    user: {
      id: number
      name: string
      username: string
      profile_photo: string | null
    }
  }
}

type Props = {
  postContent: PostType
}

const connector = connect(
  (state: RootState) => ({ profile: state.auth.profile }),
  {}
)

type PropsFromRedux = ConnectedProps<typeof connector>

type CombinedProps = Props & PropsFromRedux

const Post = ({ postContent, profile }: CombinedProps) => {
  const navigate = useNavigate()

  const [error, setError] = useState<string | null>(null)
  const [isQuote, setIsQuote] = useState(false)
  const [postQuoteBody, setPostQuoteBody] = useState('')
  const [formCallback, setFormCallback] = useState<PostType[] | null>(null)

  const hasLikedPost = (): boolean => {
    if (profile) {
      return postContent.likes.includes(profile.id)
    }
    return false
  }

  const [liked, setLiked] = useState(hasLikedPost)

  const redirectToProfilePage = () =>
    navigate(`/profile/${postContent.user.id}`, { replace: true })

  const redirectToQuotedProfilePage = () => {
    if (postContent.quoted_post) {
      navigate(`/profile/${postContent.quoted_post.user.id}`, { replace: true })
    }
  }

  const redirectToUserProfilePage = () => {
    if (profile) {
      navigate(`/profile/${profile.id}`, { replace: true })
    }
  }

  const likePost = async (post_id: number) => {
    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('access')}`,
          Accept: 'application/json'
        }
      }

      const body = JSON.stringify({
        post_id: post_id
      })

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/like-post/`,
          body,
          config
        )

        console.log(liked)

        setLiked(!liked)
        liked ? postContent.number_of_likes-- : postContent.number_of_likes++
      } catch (err) {
        setError('Erro ao curtir post, atualize a página.')
      }
    } else {
      setError('Entre para curtir um post.')
    }
  }

  const createQuotePost = async () => {
    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('access')}`
        }
      }

      const body = JSON.stringify({
        body: postQuoteBody,
        quoted_post_id: postContent.id
      })

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/create-post/`,
          body,
          config
        )

        if (formCallback !== null) {
          setFormCallback([res.data, ...formCallback])
        } else {
          setFormCallback([res.data])
        }

        setPostQuoteBody('')
        setIsQuote(false)
      } catch (err) {
        setError('Houve um erro ao criar o post. Recarregue a página.')
      }
    } else {
      setError('Entre para criar posts')
    }
  }

  const handleQuoteBodyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostQuoteBody(e.target.value)
    console.log(postQuoteBody)
  }

  const handleQuotePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    createQuotePost()
  }

  if (error) {
    return (
      <>
        <h3>{error}</h3>
        <br />
      </>
    )
  }

  if ((isQuote || formCallback) && profile) {
    // Renderizando o formCallback e quotePost
    return (
      <>
        {formCallback && (
          <>
            {formCallback?.map((post) => (
              <S.Container $liked={liked} key={post.id}>
                <div className="sideIcons">
                  <S.ProfilePhoto
                    src={
                      post.user.profile_photo
                        ? post.user.profile_photo
                        : `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
                    }
                    alt="Profile Photo"
                    onClick={redirectToProfilePage}
                  />
                  <Button
                    className="likeButton"
                    title=""
                    type="button"
                    styled="post"
                    icon={<LikeIcon />}
                    onClick={() => likePost(post.id)}
                  />
                </div>
                <div>
                  <S.TextPost>
                    <div className="postHeader">
                      <div>
                        <S.Name onClick={redirectToProfilePage}>
                          {post.user.name}
                        </S.Name>
                        <S.Username onClick={redirectToProfilePage}>
                          @{post.user.username}
                        </S.Username>
                      </div>
                      <div>
                        <p className="secondInfo">{postContent.created_at}</p>
                        <p className="secondInfo">
                          {post.number_of_likes} curtidas
                        </p>
                      </div>
                    </div>
                    <div className="content">
                      <p>{post.body}</p>
                      {post.quoted_post && (
                        <S.QuotedPostContainer>
                          <div className="headInfo">
                            <div className="mainInfo">
                              <S.QuotedProfilePhoto
                                src={
                                  post.quoted_post.user.profile_photo
                                    ? post.quoted_post.user.profile_photo
                                    : `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
                                }
                                alt="Profile Photo"
                                onClick={redirectToQuotedProfilePage}
                              />
                              <div>
                                <S.Name onClick={redirectToQuotedProfilePage}>
                                  {post.quoted_post.user.name}
                                </S.Name>
                                <S.Username
                                  onClick={redirectToQuotedProfilePage}
                                >
                                  {post.quoted_post.user.username}
                                </S.Username>
                              </div>
                            </div>
                            <div>
                              <p className="secondInfo">
                                {post.quoted_post.created_at}
                              </p>
                              <p className="secondInfo">
                                {post.quoted_post.likes} curtidas
                              </p>
                            </div>
                          </div>
                          <div className="quotedContent">
                            <p className="quotedBody">
                              {post.quoted_post.body}
                            </p>
                            {post.quoted_post.image && (
                              <img
                                className="PostImage"
                                src={post.quoted_post.image}
                                alt="Post Image"
                              />
                            )}
                          </div>
                        </S.QuotedPostContainer>
                      )}
                    </div>
                  </S.TextPost>
                </div>
              </S.Container>
            ))}
          </>
        )}
        {isQuote && (
          <S.QuotePostForm onSubmit={(e) => handleQuotePostSubmit(e)}>
            <div className="sideIcons">
              <S.ProfilePhoto
                src={
                  profile.profile_photo
                    ? profile.profile_photo
                    : `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
                }
                alt="Profile Photo"
                onClick={redirectToUserProfilePage}
              />
              <Button
                title=""
                type="button"
                styled="post"
                icon={<CloseIcon />}
                onClick={() => setIsQuote(false)}
              />
              <Button
                title="Confirm"
                type="submit"
                styled="post"
                icon={<ConfirmIcon />}
              />
            </div>
            <div>
              <S.TextPost>
                <div className="postHeader">
                  <div>
                    <S.Name onClick={redirectToUserProfilePage}>
                      {profile.name}
                    </S.Name>
                    <S.Username onClick={redirectToUserProfilePage}>
                      @{profile.username}
                    </S.Username>
                  </div>
                </div>
                <div className="content">
                  <textarea
                    className="textQuotePost"
                    name="body"
                    value={postQuoteBody}
                    onChange={(e) => handleQuoteBodyChange(e)}
                    minLength={3}
                    maxLength={200}
                    required
                  />
                  <S.QuotedPostContainer>
                    <div className="headInfo">
                      <div className="mainInfo">
                        <S.QuotedProfilePhoto
                          src={
                            postContent.user.profile_photo
                              ? postContent.user.profile_photo
                              : `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
                          }
                          alt="Profile Photo"
                          onClick={redirectToQuotedProfilePage}
                        />
                        <div>
                          <S.Name onClick={redirectToQuotedProfilePage}>
                            {postContent.user.name}
                          </S.Name>
                          <S.Username onClick={redirectToQuotedProfilePage}>
                            {postContent.user.username}
                          </S.Username>
                        </div>
                      </div>
                      <div>
                        <p className="secondInfo">{postContent.created_at}</p>
                        <p className="secondInfo">
                          {postContent.likes} curtidas
                        </p>
                      </div>
                    </div>
                    <div className="quotedContent">
                      <p className="quotedBody">{postContent.body}</p>
                      {postContent.image && (
                        <img
                          className="PostImage"
                          src={postContent.image}
                          alt="Post Image"
                        />
                      )}
                    </div>
                  </S.QuotedPostContainer>
                </div>
              </S.TextPost>
            </div>
          </S.QuotePostForm>
        )}
      </>
    )
  }

  return (
    // Renderizando o formCallback e Posts
    <>
      {formCallback && (
        <>
          {formCallback?.map((post) => (
            <S.Container $liked={liked} key={post.id}>
              <div className="sideIcons">
                <S.ProfilePhoto
                  src={
                    post.user.profile_photo
                      ? post.user.profile_photo
                      : `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
                  }
                  alt="Profile Photo"
                  onClick={redirectToProfilePage}
                />
                <Button
                  className="likeButton"
                  title=""
                  type="button"
                  styled="post"
                  icon={<LikeIcon />}
                  onClick={() => likePost(post.id)}
                />
              </div>
              <div>
                <S.TextPost>
                  <div className="postHeader">
                    <div>
                      <S.Name onClick={redirectToProfilePage}>
                        {post.user.name}
                      </S.Name>
                      <S.Username onClick={redirectToProfilePage}>
                        @{post.user.username}
                      </S.Username>
                    </div>
                    <div>
                      <p className="secondInfo">{postContent.created_at}</p>
                      <p className="secondInfo">
                        {post.number_of_likes} curtidas
                      </p>
                    </div>
                  </div>
                  <div className="content">
                    <p>{post.body}</p>
                    {post.quoted_post && (
                      <S.QuotedPostContainer>
                        <div className="headInfo">
                          <div className="mainInfo">
                            <S.QuotedProfilePhoto
                              src={
                                post.quoted_post.user.profile_photo
                                  ? post.quoted_post.user.profile_photo
                                  : `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
                              }
                              alt="Profile Photo"
                              onClick={redirectToQuotedProfilePage}
                            />
                            <div>
                              <S.Name onClick={redirectToQuotedProfilePage}>
                                {post.quoted_post.user.name}
                              </S.Name>
                              <S.Username onClick={redirectToQuotedProfilePage}>
                                {post.quoted_post.user.username}
                              </S.Username>
                            </div>
                          </div>
                          <div>
                            <p className="secondInfo">
                              {post.quoted_post.created_at}
                            </p>
                            <p className="secondInfo">
                              {post.quoted_post.likes} curtidas
                            </p>
                          </div>
                        </div>
                        <div className="quotedContent">
                          <p className="quotedBody">{post.quoted_post.body}</p>
                          {post.quoted_post.image && (
                            <img
                              className="PostImage"
                              src={post.quoted_post.image}
                              alt="Post Image"
                            />
                          )}
                        </div>
                      </S.QuotedPostContainer>
                    )}
                  </div>
                </S.TextPost>
              </div>
            </S.Container>
          ))}
        </>
      )}
      <S.Container $liked={liked}>
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
            className="likeButton"
            title=""
            type="button"
            styled="post"
            icon={<LikeIcon />}
            onClick={() => likePost(postContent.id)}
          />
          <Button
            title=""
            type="button"
            styled="post"
            icon={<MessageIcon />}
            onClick={() => setIsQuote(true)}
          />
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
                <p className="secondInfo">
                  {postContent.number_of_likes} curtidas
                </p>
              </div>
            </div>
            <div className="content">
              <p>{postContent.body}</p>
              {postContent.image && (
                <img
                  className="PostImage"
                  src={postContent.image}
                  alt="Post Image"
                />
              )}
              {postContent.quoted_post && (
                <S.QuotedPostContainer>
                  <div className="headInfo">
                    <div className="mainInfo">
                      <S.QuotedProfilePhoto
                        src={
                          postContent.quoted_post.user.profile_photo
                            ? postContent.quoted_post.user.profile_photo
                            : `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
                        }
                        alt="Profile Photo"
                        onClick={redirectToQuotedProfilePage}
                      />
                      <div>
                        <S.Name onClick={redirectToQuotedProfilePage}>
                          {postContent.quoted_post.user.name}
                        </S.Name>
                        <S.Username onClick={redirectToQuotedProfilePage}>
                          {postContent.quoted_post.user.username}
                        </S.Username>
                      </div>
                    </div>
                    <div>
                      <p className="secondInfo">
                        {postContent.quoted_post.created_at}
                      </p>
                      <p className="secondInfo">
                        {postContent.quoted_post.likes} curtidas
                      </p>
                    </div>
                  </div>
                  <div className="quotedContent">
                    <p className="quotedBody">{postContent.quoted_post.body}</p>
                    {postContent.quoted_post.image && (
                      <img
                        className="PostImage"
                        src={postContent.quoted_post.image}
                        alt="Post Image"
                      />
                    )}
                  </div>
                </S.QuotedPostContainer>
              )}
            </div>
          </S.TextPost>
        </div>
      </S.Container>
    </>
  )
}

export default connector(Post)

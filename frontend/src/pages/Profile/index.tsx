import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ConnectedProps, connect } from 'react-redux'

import { Profile as ProfileType, User } from '../../store/actions/types'
import { RootState } from '../../store/reducers'

import Loader from '../../components/Loader'
import Sidebar from '../../components/Sidebar'
import Profilebar from '../../components/Profilebar'
import { Name, Username } from '../../components/Post/styles'
import Post, { PostType } from '../../components/Post'
import Button from '../../components/Button'

import { Title } from '../Home/styles'
import * as S from './styles'
import Message from '../../components/Message'

type Params = {
  id: string
}

type ShowingType = 'posts' | 'follows' | 'followers'

const connector = connect(
  (state: RootState) => ({
    profile: state.auth.profile,
    isAuthenticated: state.auth.isAuthenticated
  }),
  {}
)

type PropsFromRedux = ConnectedProps<typeof connector>

const Profile = ({ profile, isAuthenticated }: PropsFromRedux) => {
  const navigate = useNavigate()

  const { id } = useParams<Params>()
  const [user, setUser] = useState<AxiosResponse<ProfileType | null>>()
  const [listType, setListType] = useState<ShowingType>('posts')
  const [listContent, setListContent] = useState<User[]>()
  const [userFollowed, setUserFollowed] = useState(false)
  const [posts, setPosts] = useState<PostType[]>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (localStorage.getItem('access')) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('access')}`,
            Accept: 'application/json'
          }
        }
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/user/${id}/`,
            config
          )
          setUser(response)
        } catch (err) {
          setError('Perfil não encontrado ou inexistente')
        }
      } else {
        setError('Entre para visualizar outros perfis')
      }
    }

    fetchProfile()
  }, [id])

  useEffect(() => {
    const fecthPosts = async () => {
      if (localStorage.getItem('access')) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.getItem('access')}`,
            Accept: 'application/json'
          }
        }

        try {
          const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/posts/${id}/`,
            config
          )

          setPosts(res.data)
        } catch (err) {
          setError('Erro ao carregar posts deste usuário')
        }
      } else {
        setError('Entre para vizualizar os posts de outros usuários')
      }
    }

    fecthPosts()
  }, [id])

  useEffect(() => {
    // Verificando se usuário já é seguido
    const isFollowing = profile?.follows.some(
      (profile) => profile.id === Number(id)
    )
    if (isFollowing) {
      setUserFollowed(isFollowing)
    }
  }, [id, profile?.follows])

  useEffect(() => {
    // Adicionar lista de posts
    if (user && user.data) {
      if (listType === 'follows') {
        setListContent(user.data.follows)
      } else if (listType === 'followers') {
        setListContent(user.data.followed_by)
      }
    }
  }, [listType, posts, user])

  const followUser = async (user_to_be_followed_id: number) => {
    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('access')}`,
          Accept: 'application/json'
        }
      }

      const body = JSON.stringify({
        user_to_be_followed_id: user_to_be_followed_id
      })

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/user/follow/`,
          body,
          config
        )
        setUserFollowed(true)
      } catch (err) {
        setUserFollowed(false)
      }
    } else {
      setUserFollowed(false)
    }
  }

  const unfollowUser = async (user_to_be_unfollowed_id: number) => {
    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('access')}`,
          Accept: 'application/json'
        }
      }

      const body = JSON.stringify({
        user_to_be_unfollowed_id: user_to_be_unfollowed_id
      })

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/user/unfollow/`,
          body,
          config
        )
        setUserFollowed(false)
      } catch (err) {
        setUserFollowed(false)
        setError('Houve um erro ao seguir o usuário')
      }
    } else {
      setUserFollowed(false)
      setError('Entre para seguir outros usuários')
    }
  }

  const handlePostsList = () => {
    setListType('posts')
  }

  const handleFollowersList = () => {
    setListType('followers')
  }

  const handleFollowsList = () => {
    setListType('follows')
  }

  const redirectToProfilePage = (id: number) =>
    navigate(`/profile/${id}`, { replace: true })

  if (isAuthenticated !== true) {
    navigate('/login', { replace: true })
  }

  return (
    <>
      <Message opened={error ? true : false} onClick={() => setError(null)}>
        {error}
      </Message>
      <Sidebar />
      {user && user.data && profile ? (
        <>
          <S.Header className="container">
            <S.BackgroundBanner
              src={
                user.data.banner
                  ? user.data.banner
                  : `${process.env.REACT_APP_API_URL}/media/images/no-banner.png`
              }
            />
            <S.Banner $banner={user.data.banner}>
              <S.Info>
                <div className="social"></div>
                <div className="maininfo">
                  <div>
                    <S.ProfilePhoto
                      src={
                        user.data.profile_photo
                          ? user.data.profile_photo
                          : `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
                      }
                    />
                    <div>
                      <S.Name className="name">
                        {user.data.name}{' '}
                        {Number(id) !== profile.id && (
                          <>
                            {!userFollowed ? (
                              <Button
                                type="button"
                                title="Follow"
                                styled="follow"
                                onClick={() => followUser(Number(id))}
                              >
                                +
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                title="Unfollow"
                                styled="follow"
                                onClick={() => unfollowUser(Number(id))}
                              >
                                -
                              </Button>
                            )}
                          </>
                        )}
                      </S.Name>
                      <S.Username>@{user.data.username}</S.Username>
                    </div>
                  </div>
                  <div className="social">
                    <div>
                      <p>{user.data.followed_by.length}</p>
                      <p className="description" onClick={handleFollowersList}>
                        Seguidores
                      </p>
                    </div>
                    <div>
                      <p>{user.data.follows.length}</p>
                      <p className="description" onClick={handleFollowsList}>
                        Seguindo
                      </p>
                    </div>
                    <div>
                      <p>{posts?.length}</p>
                      <p className="description" onClick={handlePostsList}>
                        Posts
                      </p>
                    </div>
                  </div>
                </div>
              </S.Info>
            </S.Banner>
          </S.Header>
          <S.ProfileContent className="container">
            {user.data.bio && <h5 className="bio">{user.data.bio}</h5>}
            {listType === 'posts' && posts && (
              <>
                <Title>POSTS</Title>
                {posts ? (
                  <>
                    {posts.map((post) => (
                      <Post postContent={post} key={post.id} />
                    ))}
                  </>
                ) : (
                  <Loader withBackground={false} active />
                )}
              </>
            )}
            {listType !== 'posts' && listContent && (
              <>
                {listType === 'follows' && (
                  <Title>Quem @{user.data.username} segue</Title>
                )}
                {listType === 'followers' && (
                  <Title>Quem segue @{user.data.username}</Title>
                )}
                {listContent.length > 0 && (
                  <S.List>
                    {listContent.map((user) => (
                      <li key={user.id}>
                        <S.ListProfilePhoto
                          className="profilePhoto"
                          src={
                            user.profile_photo
                              ? user.profile_photo
                              : `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
                          }
                          alt="Foto de perfil"
                          onClick={() => redirectToProfilePage(user.id)}
                        />
                        <div>
                          <Name onClick={() => redirectToProfilePage(user.id)}>
                            {user.name}
                          </Name>
                          <Username
                            onClick={() => redirectToProfilePage(user.id)}
                          >
                            @{user.username}
                          </Username>
                        </div>
                      </li>
                    ))}
                  </S.List>
                )}
              </>
            )}
          </S.ProfileContent>
        </>
      ) : (
        <Loader withBackground={false} active />
      )}
      {profile && <Profilebar user={profile} />}
    </>
  )
}

export default connector(Profile)

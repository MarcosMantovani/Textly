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
import Post from '../../components/Post'
import Button from '../../components/Button'

import tempBanner from '../../assets/media/rl_evergreen_16x9.jpg'
import tempPhoto from '../../assets/media/Foto LinkedIn.jpg'
import tempImg from '../../assets/media/Foto LinkedIn.jpg'

import { Title } from '../Home/styles'
import * as S from './styles'

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
  const [userNotFound, setUserNotFound] = useState(false)
  const [notAuthenticated, setNotAuthenticated] = useState(false)
  const [listType, setListType] = useState<ShowingType>('posts')
  const [listContent, setListContent] = useState<User[]>()

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
            `${process.env.REACT_APP_API_URL}/auth/${id}/`,
            config
          )
          setUser(response)
        } catch (err) {
          setUserNotFound(true)
        }
      } else {
        setNotAuthenticated(true)
      }
    }

    fetchProfile()
  }, [id])

  useEffect(() => {
    // Adicionar lista de posts
    if (user && user.data) {
      if (listType === 'follows') {
        setListContent(user.data.follows)
      } else if (listType === 'followers') {
        setListContent(user.data.followed_by)
      }
    }
  }, [listType, user])

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

  if (userNotFound || notAuthenticated) {
    return (
      <div className="container">
        {userNotFound && <h3>Usuário não encontrado ou inexistente</h3>}
        {notAuthenticated && <h3>Entre para visualizar outros perfis</h3>}
      </div>
    )
  }

  return (
    <>
      <Sidebar />
      {user && user.data && profile ? (
        <>
          <S.Header className="container">
            <S.BackgroundBanner src={tempBanner} />
            <S.Banner>
              <S.Info>
                <div className="social"></div>
                <div className="maininfo">
                  <div>
                    <S.ProfilePhoto
                      src={tempPhoto}
                      onClick={() => console.log(listType)}
                    />
                    <div>
                      <S.Name className="name">
                        {user.data.name}{' '}
                        {Number(id) !== profile.id && (
                          <Button type="button" title="Follow" styled="follow">
                            +
                          </Button>
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
                      <p>100</p>
                      <p className="description" onClick={handlePostsList}>
                        Posts
                      </p>
                    </div>
                  </div>
                </div>
              </S.Info>
            </S.Banner>
          </S.Header>
          {listContent && (
            <S.ProfileContent className="container">
              {listType === 'posts' ? ( // Fazer map dos posts
                <>
                  <Title>POSTS</Title>
                  <Post />
                </>
              ) : (
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
                            src={tempImg}
                            alt="Foto de perfil"
                            onClick={() => redirectToProfilePage(user.id)}
                          />
                          <div>
                            <Name
                              onClick={() => redirectToProfilePage(user.id)}
                            >
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
          )}
        </>
      ) : (
        <Loader withBackground={false} active />
      )}
      {profile && <Profilebar user={profile} />}
    </>
  )
}

export default connector(Profile)

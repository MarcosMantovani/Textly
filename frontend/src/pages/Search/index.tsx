import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ConnectedProps, connect } from 'react-redux'

import { RootState } from '../../store/reducers'

import Button from '../../components/Button'
import Post, { PostType } from '../../components/Post'
import Sidebar from '../../components/Sidebar'
import Profilebar from '../../components/Profilebar'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import Navbar from '../../components/Navbar'

import { Title } from '../Home/styles'

import { ReactComponent as SearchIcon } from '../../assets/media/search-outline.svg'
import { ReactComponent as PersonIcon } from '../../assets/media/person-outline.svg'
import { ReactComponent as PostIcon } from '../../assets/media/email-outline.svg'
import { ReactComponent as AddPersonIcon } from '../../assets/media/person-add-outline.svg'
import { ReactComponent as CheckedPersonIcon } from '../../assets/media/person-done-outline.svg'

import * as S from './styles'

type SimplifiedUserType = {
  id: number
  name: string
  username: string
  profile_photo: string | null
  followed_by: number[]
  follows: number[]
  bio: string | null
}

type SearchType = 'username' | 'name' | 'posts' | 'usuários'

const connector = connect(
  (state: RootState) => ({
    profile: state.auth.profile,
    isAuthenticated: state.auth.isAuthenticated
  }),
  {}
)

type PropsFromRedux = ConnectedProps<typeof connector>

const Search = ({ profile, isAuthenticated }: PropsFromRedux) => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('Posts')
  const [searchType, setSearchType] = useState<SearchType>('posts')
  const [searchText, setSearchText] = useState<string>('')
  const [posts, setPosts] = useState<PostType[] | null>(null)
  const [users, setUsers] = useState<SimplifiedUserType[] | null>(null)

  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const fecthAllPosts = async () => {
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
            `${process.env.REACT_APP_API_URL}/posts/`,
            config
          )

          setPosts(res.data)
        } catch (err) {
          setMessage('Erro ao carregar posts')
        }
      } else {
        setMessage('Entre para visualizar a Search Page.')
      }
    }

    fecthAllPosts()
  }, [])

  useEffect(() => {
    const fecthAllUsers = async () => {
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
            `${process.env.REACT_APP_API_URL}/search-users/`,
            config
          )

          setUsers(res.data)
        } catch (err) {
          setMessage('Erro ao carregar usuários.')
        }
      } else {
        setMessage('Entre para visualizar a Search Page.')
      }
    }

    fecthAllUsers()
  }, [])

  const fetchSearchedPosts = async () => {
    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('access')}`,
          Accept: 'application/json'
        }
      }

      let url
      if (searchText === '') {
        url = `${process.env.REACT_APP_API_URL}/search-posts/`
      } else {
        url = `${process.env.REACT_APP_API_URL}/search-posts/${searchText}/`
      }

      try {
        const response = await axios.get(url, config)
        setPosts(response.data)
        setTitle(`Posts com "${searchText}"`)
      } catch (err) {
        setMessage('Houve um erro ao procurar posts.')
      }
    } else {
      setMessage('Entre para procurar posts.')
    }
  }

  const fetchSearchedUsers = async () => {
    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('access')}`,
          Accept: 'application/json'
        }
      }

      let url
      if (searchText === '') {
        url = `${process.env.REACT_APP_API_URL}/search-users/`
      } else {
        url = `${process.env.REACT_APP_API_URL}/search-users/${searchText}/`
      }

      try {
        const response = await axios.get(url, config)
        console.log(response.data)
        setUsers(response.data)
        setTitle(`Usuários com "${searchText}"`)
      } catch (err) {
        setMessage('Houve um erro ao procurar usuários.')
      }
    } else {
      setMessage('Entre para procurar usuários.')
    }
  }

  const OnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const OnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchType === 'posts') {
      fetchSearchedPosts()
    } else {
      fetchSearchedUsers()
    }
  }

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
        setMessage('Usuário seguido com sucesso.')
      } catch (err) {
        setMessage('Houve um erro ao seguir o usuário. Recarregue a página.')
      }
    } else {
      setMessage('Entre para seguir outros usuários.')
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
        setMessage('Usuário deixado de ser seguido com sucesso.')
      } catch (err) {
        setMessage('Houve um erro ao deixar de seguir o usuário')
      }
    } else {
      setMessage('Entre para deixar de seguir outros usuários')
    }
  }

  const redirectToProfilePage = (user_id: number) => {
    navigate(`/profile/${user_id}`, { replace: true })
  }

  const isFollowing = (user: SimplifiedUserType): boolean => {
    if (profile) {
      return user.followed_by.includes(profile.id)
    }
    return false
  }

  if (isAuthenticated !== true) {
    navigate('/login', { replace: true })
  }

  return (
    <>
      <Message opened={message ? true : false} onClick={() => setMessage(null)}>
        {message}
      </Message>
      {profile && <Navbar />}
      <Sidebar />
      <div className="container">
        <S.SearchForm onSubmit={(e) => OnSubmit(e)}>
          <div className="inputContainer">
            <S.Input
              className="searchInput"
              type="text"
              placeholder={`Procurar por "${searchType}"`}
              onChange={(e) => OnChange(e)}
            />
            <button className="searchButton" type="submit" title="Procurar">
              <SearchIcon className="searchIcon" />
            </button>
          </div>
          <div className="buttons">
            <Button
              type="button"
              styled="search"
              title="Post"
              icon={<PostIcon />}
              onClick={() => setSearchType('posts')}
              active={searchType === 'posts'}
            >
              Posts
            </Button>
            <Button
              type="button"
              styled="search"
              title="Post"
              icon={<PersonIcon />}
              onClick={() => setSearchType('usuários')}
              active={searchType === 'usuários'}
            >
              Usuários
            </Button>
          </div>
        </S.SearchForm>
        <Title>{title}</Title>
        {searchType === 'posts' && (
          <>
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

        {searchType === 'usuários' && profile && (
          <>
            {users ? (
              <S.UsersList>
                {users.map((user) => (
                  <li className="row" key={user.id}>
                    <S.ProfilePhoto
                      src={
                        user.profile_photo
                          ? user.profile_photo
                          : `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
                      }
                      alt="Profile Photo"
                      onClick={() => redirectToProfilePage(user.id)}
                    />
                    <div className="userInfo">
                      <div>
                        <div className="name">
                          <S.Name
                            onClick={() => redirectToProfilePage(user.id)}
                          >
                            {user.name}
                          </S.Name>
                          {user.id !== profile.id && (
                            <>
                              {isFollowing(user) ? (
                                <button
                                  className="followButton"
                                  type="button"
                                  onClick={() => {
                                    unfollowUser(user.id)
                                    user.followed_by.splice(
                                      user.followed_by.indexOf(profile.id),
                                      1
                                    )
                                    isFollowing(user)
                                  }}
                                >
                                  <CheckedPersonIcon />
                                </button>
                              ) : (
                                <button
                                  className="followButton"
                                  type="button"
                                  onClick={() => {
                                    followUser(user.id)
                                    user.followed_by.push(profile.id)
                                    isFollowing(user)
                                  }}
                                >
                                  <AddPersonIcon />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                        <S.Username
                          onClick={() => redirectToProfilePage(user.id)}
                        >
                          @{user.username}
                        </S.Username>
                      </div>
                      <div>
                        <p>{user.bio ? user.bio : 'Usuário sem biografia.'}</p>
                      </div>
                      <div>
                        <p className="secondInfo">
                          seguindo {user.follows.length} - seguidores{' '}
                          {user.followed_by.length}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </S.UsersList>
            ) : (
              <Loader withBackground={false} active />
            )}
          </>
        )}
      </div>
      {profile && <Profilebar user={profile} />}
    </>
  )
}

export default connector(Search)

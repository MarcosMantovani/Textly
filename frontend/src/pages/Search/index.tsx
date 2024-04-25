import { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ConnectedProps, connect } from 'react-redux'

import { SimplifiedUserType } from '../../store/actions/types'
import { RootState } from '../../store/reducers'

import Button from '../../components/Button'
import Post, { PostType } from '../../components/Post'
import Sidebar from '../../components/Sidebar'
import Profilebar from '../../components/Profilebar'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import Navbar from '../../components/Navbar'
import UsersList from '../../components/UsersList'

import { ReactComponent as SearchIcon } from '../../assets/media/search-outline.svg'
import { ReactComponent as PersonIcon } from '../../assets/media/person-outline.svg'
import { ReactComponent as PostIcon } from '../../assets/media/email-outline.svg'

import { Title } from '../Home/styles'
import * as S from './styles'

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
              <UsersList users={users} profile={profile} />
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

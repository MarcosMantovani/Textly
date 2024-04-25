import { useNavigate } from 'react-router-dom'
import { ConnectedProps, connect } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { RootState } from '../../store/reducers'
import { load_user } from '../../store/actions/auth'

import NewPost from '../../components/NewPost'
import Post, { PostType } from '../../components/Post'
import Sidebar from '../../components/Sidebar'
import Profilebar from '../../components/Profilebar'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import Navbar from '../../components/Navbar'

import * as S from './styles'

const connector = connect(
  (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    profile: state.auth.profile,
    type: state.auth.type
  }),
  {
    load_user: load_user
  }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const Home: React.FC<PropsFromRedux> = ({
  isAuthenticated,
  profile,
  type,
  load_user
}) => {
  const navigate = useNavigate()

  const [posts, setPosts] = useState<PostType[]>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) {
      load_user()
    }
  }, [load_user, profile])

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
            `${process.env.REACT_APP_API_URL}/posts/`,
            config
          )

          setPosts(res.data)
        } catch (err) {
          setError('Erro ao carregar posts')
        }
      } else {
        setError('Entre para visualizar a Home Page')
      }
    }

    fecthPosts()
  }, [])

  if (isAuthenticated !== true) {
    navigate('/login', { replace: true })
  }

  if (type !== 'IS_LOADING') {
    if (profile) {
      return (
        <>
          <Message opened={error ? true : false} onClick={() => setError(null)}>
            {error}
          </Message>
          {profile && <Navbar />}
          <Sidebar />
          <div className="container">
            <S.Title>HOME</S.Title>
            <NewPost
              profilePhoto={
                profile.profile_photo
                  ? profile.profile_photo
                  : `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
              }
            />
            {posts ? (
              <>
                {posts.map((post) => (
                  <Post postContent={post} key={post.id} />
                ))}
              </>
            ) : (
              <Loader withBackground={false} active />
            )}
          </div>
          <Profilebar user={profile} />
        </>
      )
    }
  }

  return <h2>Carregando...</h2>
}

export default connector(Home)

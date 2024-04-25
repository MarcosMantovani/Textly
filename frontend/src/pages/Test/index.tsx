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

import * as S from './styles'
import Navbar from '../../components/Navbar'

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

const Test: React.FC<PropsFromRedux> = ({
  isAuthenticated,
  profile,
  type,
  load_user
}) => {
  const navigate = useNavigate()

  const [posts, setPosts] = useState<PostType[]>()
  const [error, setError] = useState<string | null>(null)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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

  const postMock: PostType = {
    id: 1,
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: 'https://example.com/image.jpg',
    created_at: '2024-04-18T10:00:00',
    number_of_likes: 10,
    likes: [1, 2, 3],
    edited: false,
    user: {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      profile_photo: 'https://example.com/profile.jpg',
      followed_by: [2, 3]
    },
    quoted_post: {
      id: 2,
      body: 'Quoted post body',
      image: null,
      created_at: '2024-04-17T15:30:00',
      number_of_likes: 5,
      likes: [1, 2],
      edited: true,
      user: {
        id: 2,
        name: 'Jane Smith',
        username: 'janesmith',
        profile_photo: 'https://example.com/janesmith.jpg',
        followed_by: [1, 3]
      }
    }
  }

  return (
    <>
      {profile && <Navbar />}
      <Sidebar />
      <div className="container">
        <h1>teste</h1>
        <Post postContent={postMock} />
      </div>
      {/* <Profilebar /> */}
    </>
  )
}

export default connector(Test)

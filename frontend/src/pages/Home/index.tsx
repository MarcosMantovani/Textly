import { useNavigate } from 'react-router-dom'
import { ConnectedProps, connect } from 'react-redux'

import NewPost from '../../components/NewPost'
import Post from '../../components/Post'
import Sidebar from '../../components/Sidebar'
import Profilebar from '../../components/Profilebar'

import { RootState } from '../../store/reducers'
import * as S from './styles'
import { load_user } from '../../store/actions/auth'
import { useEffect } from 'react'

const connector = connect(
  (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    type: state.auth.type
  }),
  {
    load_user: load_user
  }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const Home: React.FC<PropsFromRedux> = ({
  isAuthenticated,
  user,
  load_user
}) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      load_user()
    }
  }, [load_user, user])

  if (isAuthenticated !== true) {
    navigate('/login', { replace: true })
  }

  if (user) {
    return (
      <>
        <Sidebar />
        <S.Container>
          <S.Title>HOME FEED</S.Title>
          <NewPost />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </S.Container>
        <Profilebar user={user} />
      </>
    )
  }

  return <h2>Carregando...</h2>
}

export default connector(Home)

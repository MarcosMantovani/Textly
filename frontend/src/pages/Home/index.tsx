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
import { Profile } from '../../store/actions/types'

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

  useEffect(() => {
    if (!profile) {
      load_user()
    }
    console.log(profile)
  }, [load_user, profile])

  // if (isAuthenticated !== true) {
  //   navigate('/login', { replace: true })
  // }

  const mock: Profile = {
    id: 1,
    name: 'John Doe',
    username: 'john_doe',
    email: 'john@example.com',
    follows: [
      {
        id: 2,
        name: 'Jane Smith',
        username: 'jane_smith',
        email: 'jane@example.com'
      },
      {
        id: 3,
        name: 'Michael Johnson',
        username: 'michael_johnson',
        email: 'michael@example.com'
      },
      {
        id: 4,
        name: 'Emily Davis',
        username: 'emily_davis',
        email: 'emily@example.com'
      },
      {
        id: 5,
        name: 'David Wilson',
        username: 'david_wilson',
        email: 'david@example.com'
      },
      {
        id: 6,
        name: 'Sarah Brown',
        username: 'sarah_brown',
        email: 'sarah@example.com'
      },
      {
        id: 7,
        name: 'Matthew Taylor',
        username: 'matthew_taylor',
        email: 'matthew@example.com'
      },
      {
        id: 8,
        name: 'Olivia Martinez',
        username: 'olivia_martinez',
        email: 'olivia@example.com'
      },
      {
        id: 9,
        name: 'Daniel Anderson',
        username: 'daniel_anderson',
        email: 'daniel@example.com'
      },
      {
        id: 10,
        name: 'Ava Thomas',
        username: 'ava_thomas',
        email: 'ava@example.com'
      },
      {
        id: 11,
        name: 'Ethan Hernandez',
        username: 'ethan_hernandez',
        email: 'ethan@example.com'
      },
      {
        id: 12,
        name: 'Ethan Hernandez',
        username: 'ethan_hernandez',
        email: 'ethan@example.com'
      },
      {
        id: 13,
        name: 'Ethan Hernandez',
        username: 'ethan_hernandez',
        email: 'ethan@example.com'
      },
      {
        id: 14,
        name: 'Ethan Hernandez',
        username: 'ethan_hernandez',
        email: 'ethan@example.com'
      },
      {
        id: 15,
        name: 'Ethan Hernandez',
        username: 'ethan_hernandez',
        email: 'ethan@example.com'
      }
    ],
    followed_by: [
      {
        id: 12,
        name: 'Emma Wilson',
        username: 'emma_wilson',
        email: 'emma@example.com'
      },
      {
        id: 13,
        name: 'Noah Garcia',
        username: 'noah_garcia',
        email: 'noah@example.com'
      },
      {
        id: 14,
        name: 'Isabella Martinez',
        username: 'isabella_martinez',
        email: 'isabella@example.com'
      },
      {
        id: 15,
        name: 'Liam Robinson',
        username: 'liam_robinson',
        email: 'liam@example.com'
      },
      {
        id: 16,
        name: 'Sophia Lee',
        username: 'sophia_lee',
        email: 'sophia@example.com'
      },
      {
        id: 17,
        name: 'Mason Perez',
        username: 'mason_perez',
        email: 'mason@example.com'
      },
      {
        id: 18,
        name: 'Amelia Lopez',
        username: 'amelia_lopez',
        email: 'amelia@example.com'
      },
      {
        id: 19,
        name: 'James Smith',
        username: 'james_smith',
        email: 'james@example.com'
      },
      {
        id: 20,
        name: 'Mia Hall',
        username: 'mia_hall',
        email: 'mia@example.com'
      },
      {
        id: 21,
        name: 'Benjamin Allen',
        username: 'benjamin_allen',
        email: 'benjamin@example.com'
      },
      {
        id: 22,
        name: 'Benjamin Allen',
        username: 'benjamin_allen',
        email: 'benjamin@example.com'
      },
      {
        id: 23,
        name: 'Benjamin Allen',
        username: 'benjamin_allen',
        email: 'benjamin@example.com'
      },
      {
        id: 24,
        name: 'Benjamin Allen',
        username: 'benjamin_allen',
        email: 'benjamin@example.com'
      },
      {
        id: 25,
        name: 'Benjamin Allen',
        username: 'benjamin_allen',
        email: 'benjamin@example.com'
      }
    ],
    date_modified: '2024-04-16T12:00:00Z'
  }

  if (type !== 'IS_LOADING') {
    if (mock) {
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
          <Profilebar user={mock} />
        </>
      )
    }
  }

  return <h2>Carregando...</h2>
}

export default connector(Home)

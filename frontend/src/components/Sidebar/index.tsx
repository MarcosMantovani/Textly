import { ConnectedProps, connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { logout } from '../../store/actions/auth'

import { ReactComponent as LogoutIcon } from '../../assets/media/log-out-outline.svg'
import { ReactComponent as HomeIcon } from '../../assets/media/home-outline.svg'
import { ReactComponent as SearchIcon } from '../../assets/media/search-outline.svg'
import { ReactComponent as OptionsIcon } from '../../assets/media/options-2-outline.svg'

import Button from '../Button'
import TextlyTitle from '../TextlyTitle'

import * as S from './styles'

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(null, {
  logout: logout
})

const Sidebar = ({ logout }: PropsFromRedux) => {
  const navigate = useNavigate()

  const handlerLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const redirectToHomePage = () => {
    navigate('/home', { replace: true })
  }

  const redirectToSearchPage = () => {
    navigate('/search', { replace: true })
  }

  return (
    <S.Sidebar>
      <S.MainOptions>
        <TextlyTitle />
        <Button
          title="test"
          type="button"
          styled="sidebar"
          icon={<HomeIcon />}
          onClick={redirectToHomePage}
        >
          Home
        </Button>
        <Button
          title="test"
          type="button"
          styled="sidebar"
          icon={<SearchIcon />}
          onClick={redirectToSearchPage}
        >
          Search
        </Button>
        <Button
          title="test"
          type="button"
          styled="sidebar"
          icon={<OptionsIcon />}
        >
          Configurações
        </Button>
      </S.MainOptions>
      <Button
        title="test"
        type="button"
        styled="sidebar"
        icon={<LogoutIcon />}
        onClick={handlerLogout}
      >
        Logout
      </Button>
    </S.Sidebar>
  )
}

export default connector(Sidebar)

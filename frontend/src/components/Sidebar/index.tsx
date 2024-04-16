import { ConnectedProps, connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { logout } from '../../store/actions/auth'

import { ReactComponent as TempIcon } from '../../assets/media/email-outline.svg'
import { ReactComponent as LogoutIcon } from '../../assets/media/log-out-outline.svg'

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
  return (
    <S.Sidebar>
      <S.MainOptions>
        <TextlyTitle />
        <Button title="test" type="button" styled="sidebar" icon={<TempIcon />}>
          Test
        </Button>
        <Button title="test" type="button" styled="sidebar" icon={<TempIcon />}>
          Test
        </Button>
        <Button title="test" type="button" styled="sidebar" icon={<TempIcon />}>
          Test
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

import { User } from '../../store/actions/types'

import { ReactComponent as Icon } from '../../assets/media/email-outline.svg'
import perfilBanner from '../../assets/media/rl_evergreen_16x9.jpg'
import tempImg from '../../assets/media/Foto LinkedIn.jpg'

import Button from '../Button'

import * as S from './styles'

type Props = {
  user: User
}

const Profilebar: React.FC<Props> = ({ user }) => {
  return (
    <S.Profilebar>
      <div>
        <S.Banner src={perfilBanner} alt="Banner do perfil" />
        <S.MainInfo className="mainInfo">
          <S.Photo src={tempImg} alt="Foto do perfil" />
          <S.Name>{user.name}</S.Name>
          <S.UserName>@{user.username}</S.UserName>
          <S.UserEmail>{user.email}</S.UserEmail>
        </S.MainInfo>
      </div>
      <Button title="Perfil" type="button" styled="sidebar" icon={<Icon />}>
        PERFIL
      </Button>
    </S.Profilebar>
  )
}

export default Profilebar

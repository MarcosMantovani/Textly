import { useState } from 'react'

import { Profile } from '../../store/actions/types'

import { ReactComponent as Icon } from '../../assets/media/email-outline.svg'
import perfilBanner from '../../assets/media/rl_evergreen_16x9.jpg'
import tempImg from '../../assets/media/Foto LinkedIn.jpg'

import Button from '../Button'
import FollowersList from '../FollowersList'

import * as S from './styles'

type ListDisplayType = 'followers' | 'following' | 'none'

type Props = {
  user: Profile
}

const Profilebar: React.FC<Props> = ({ user }) => {
  const [listDisplay, setListDisplay] = useState<ListDisplayType>('none')

  const handleFolowersList = () => {
    if (listDisplay === 'followers') {
      setListDisplay('none')
    } else {
      setListDisplay('followers')
    }
  }
  const handleFolowingList = () => {
    if (listDisplay === 'following') {
      setListDisplay('none')
    } else {
      setListDisplay('following')
    }
  }
  const handleNoneList = () => setListDisplay('none')

  return (
    <S.Profilebar>
      <div>
        <S.Banner src={perfilBanner} alt="Banner do perfil" />
        <S.MainInfo className="mainInfo">
          <S.Photo src={tempImg} alt="Foto do perfil" />
          <S.Name>{user.name}</S.Name>
          <S.UserName>@{user.username}</S.UserName>
          <S.UserEmail>{user.email}</S.UserEmail>
          <S.FollowListButtons>
            <button
              title="followers"
              type="button"
              onClick={handleFolowersList}
            >
              Seguidores {user.followed_by.length}
            </button>
            <button onClick={() => handleFolowingList()}>
              Seguindo {user.follows.length}
            </button>
          </S.FollowListButtons>
          <FollowersList
            listDisplay={listDisplay}
            followers={user.followed_by}
            following={user.follows}
          />
        </S.MainInfo>
      </div>
      <Button title="Perfil" type="button" styled="sidebar" icon={<Icon />}>
        PERFIL
      </Button>
    </S.Profilebar>
  )
}

export default Profilebar

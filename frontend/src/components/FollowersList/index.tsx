import * as S from './styles'
import { User } from '../../store/actions/types'
import tempImg from '../../assets/media/Foto LinkedIn.jpg'
import { Name, Username } from '../Post/styles'

type Props = {
  followers: User[]
  following: User[]
  listDisplay: 'followers' | 'following' | 'none'
}

const FollowersList = ({ followers, following, listDisplay }: Props) => {
  return (
    <S.Container $type={listDisplay}>
      <>
        {listDisplay === 'followers' ? (
          <h3 className="sectionTitle">Quem segue você</h3>
        ) : (
          <h3 className="sectionTitle">Quem você segue</h3>
        )}
        {listDisplay === 'followers' ? (
          <>
            {followers.length > 0 ? (
              <S.List>
                {followers.map((follower) => (
                  <li key={follower.id}>
                    <S.ProfilePhoto
                      className="profilePhoto"
                      src={tempImg}
                      alt="Foto de perfil"
                    />
                    <div>
                      <Name>{follower.name}</Name>
                      <Username>@{follower.username}</Username>
                    </div>
                  </li>
                ))}
              </S.List>
            ) : (
              <h3>Você não possui seguidores</h3>
            )}
          </>
        ) : (
          <>
            {following.length > 0 ? (
              <S.List>
                {following.map((user) => (
                  <li key={user.id}>
                    <S.ProfilePhoto
                      className="profilePhoto"
                      src={tempImg}
                      alt="Foto de perfil"
                    />
                    <div>
                      <Name>{user.name}</Name>
                      <Username>@{user.username}</Username>
                    </div>
                  </li>
                ))}
              </S.List>
            ) : (
              <h3>Você não segue ninguém</h3>
            )}
          </>
        )}
      </>
    </S.Container>
  )
}

export default FollowersList

import axios, { AxiosError, AxiosResponse } from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ConnectedProps, connect } from 'react-redux'

import { Profile as ProfileType, User } from '../../store/actions/types'
import { RootState } from '../../store/reducers'

import { ReactComponent as EditIcon } from '../../assets/media/edit-outline.svg'
import { ReactComponent as CloseIcon } from '../../assets/media/edit-outline.svg'
import { ReactComponent as ConfirmIcon } from '../../assets/media/checkmark-outline.svg'

import Loader from '../../components/Loader'
import Sidebar from '../../components/Sidebar'
import Profilebar from '../../components/Profilebar'
import { Name, Username } from '../../components/Post/styles'
import Post, { PostType } from '../../components/Post'
import Button from '../../components/Button'
import Message from '../../components/Message'

import { Title } from '../Home/styles'
import test from '../../../../backend/media/images/Foto_LinkedIn_x1pGMXv.jpg'

import * as S from './styles'

import { Profile } from '../../store/actions/types'
import { load_user } from '../../store/actions/auth'

// const profile: Profile = {
//   id: 1,
//   name: 'John Doe',
//   username: 'johndoe',
//   email: 'johndoe@example.com',
//   profile_photo:
//     'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ27f5Qdh6FzZ5qiectY4Sj-uF8cZFGybWdd9YYc3P-cQ&s',
//   banner:
//     'https://cdn1.epicgames.com/offer/9773aa1aa54f4f7b80e44bef04986cea/EGS_RocketLeague_PsyonixLLC_S1_2560x1440-bb7699fad7b5101432236737c8809214',
//   bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//   follows: [
//     {
//       id: 2,
//       name: 'Jane Smith',
//       username: 'janesmith',
//       email: 'janesmith@example.com',
//       profile_photo: 'https://example.com/janesmith.jpg',
//       banner: null,
//       bio: null
//     }
//     // Add more users if needed
//   ],
//   followed_by: [
//     // List of users who follow John Doe
//   ],
//   post_count: 10,
//   date_modified: '2024-04-18T12:00:00Z'
// }

type Params = {
  id: string
}

type ShowingType = 'posts' | 'follows' | 'followers'

const connector = connect(
  (state: RootState) => ({
    profile: state.auth.profile,
    isAuthenticated: state.auth.isAuthenticated,
    type: state.auth.type
  }),
  {
    load_user: load_user
  }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const EditProfile = ({
  profile,
  isAuthenticated,
  type,
  load_user
}: PropsFromRedux) => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const profilePhotoRef = useRef<HTMLInputElement | null>(null)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(
    `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
  )
  const bannerRef = useRef<HTMLInputElement | null>(null)
  const [bannerUrl, setBannerUrl] = useState(
    `${process.env.REACT_APP_API_URL}/media/images/no-banner.png`
  )
  const [message, setMessage] = useState<string | null>(null)
  const [password, setPassword] = useState('')

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    re_new_password: ''
  })

  const [changingUsername, setChangingUsername] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [updatedProfile, setUpdatedProfile] = useState<ProfileType | null>(
    profile
  )

  useEffect(() => {
    if (!profile) {
      load_user()
    }
  }, [load_user, profile])

  useEffect(() => {
    setName(profile?.name ? profile.name : '')
    setUsername(profile?.username ? profile.username : '')
    setBio(profile?.bio ? profile.bio : '')
    setProfilePhotoUrl(
      profile?.profile_photo
        ? profile.profile_photo
        : `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
    )
    setBannerUrl(
      profile?.banner
        ? profile.banner
        : `${process.env.REACT_APP_API_URL}/media/images/no-banner.png`
    )
  }, [profile])

  useEffect(() => {
    if (profile) {
      setUpdatedProfile({
        ...profile,
        name: name,
        username: username,
        bio: bio,
        profile_photo: profilePhotoUrl,
        banner: bannerUrl
      })
    }
  }, [name, username, bio, profilePhotoUrl, bannerUrl, profile])

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('access')}`,
          Accept: 'application/json'
        }
      }

      const body = JSON.stringify({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        re_new_password: passwordData.re_new_password
      })

      setIsLoading(true)

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/users/set_password/`,
          body,
          config
        )
        setMessage(`Senha alterada.`)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.data) {
            const errorMessage =
              error.response.data[Object.keys(error.response.data)[0]][0]
            setMessage(`Erro ao alterar a senha: ${errorMessage}`)
          } else {
            setMessage(`Erro ao alterar senha: ${error}`)
          }
        } else {
          setMessage(`Erro ao alterar senha: ${error}`)
        }
      }
    } else {
      setMessage('Você precisa estar autenticado para alterar sua senha.')
    }

    setIsLoading(false)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleUpdateName = async () => {
    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('access')}`,
          Accept: 'application/json'
        }
      }

      const body = JSON.stringify({
        name: name
      })

      setIsLoading(true)

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/user/update-name/`,
          body,
          config
        )
        setMessage(`Nome alterado.`)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.data) {
            const errorMessage =
              error.response.data[Object.keys(error.response.data)[0]][0]
            setMessage(`Erro ao alterar o nome: ${errorMessage}`)
          } else {
            setMessage(`Erro ao alterar nome: ${error}`)
          }
        } else {
          setMessage(`Erro ao alterar nome: ${error}`)
        }
      }
    } else {
      setMessage('Você precisa estar autenticado para alterar seu nome.')
    }

    setIsLoading(false)
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value.startsWith('@')) {
      setUsername(value.substring(1))
    } else {
      setUsername(value)
    }
  }

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault()

    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('access')}`,
          Accept: 'application/json'
        }
      }

      setIsLoading(true)

      const body = JSON.stringify({
        new_username: username,
        current_password: password
      })

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/users/set_username/`,
          body,
          config
        )
        setMessage(`Username alterado para ${username}.`)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.data) {
            // Acessamos o primeiro índice do primeiro campo do objeto de erro
            const errorMessage =
              error.response.data[Object.keys(error.response.data)[0]][0]
            setMessage(`Erro ao alterar username: ${errorMessage}`)
          } else {
            setMessage(`Erro ao alterar username: ${error}`)
          }
        } else {
          setMessage(`Erro ao alterar username: ${error}`)
        }
      }
    } else {
      setMessage('Você precisa estar autenticado para alterar sua senha.')
    }

    setChangingUsername(false)
    setIsLoading(false)
  }

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value)

    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  const handleUpdateBio = async () => {
    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('access')}`,
          Accept: 'application/json'
        }
      }

      const body = JSON.stringify({
        bio: bio
      })

      setIsLoading(true)

      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/user/update-bio/`,
          body,
          config
        )
        setMessage(`Biografia alterada.`)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.data) {
            const errorMessage =
              error.response.data[Object.keys(error.response.data)[0]][0]
            setMessage(`Erro ao alterar a biografia: ${errorMessage}`)
          } else {
            setMessage(`Erro ao alterar biografia: ${error}`)
          }
        } else {
          setMessage(`Erro ao alterar biografia: ${error}`)
        }
      }
    } else {
      setMessage('Você precisa estar autenticado para alterar sua biografia.')
    }

    setIsLoading(false)
  }

  const handleEditProfilePhotoClick = () => {
    if (profilePhotoRef.current) {
      profilePhotoRef.current.click()
    }
  }

  const handleProfilePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null
    setProfilePhotoUrl(
      file
        ? URL.createObjectURL(file)
        : `${process.env.REACT_APP_API_URL}/media/images/no-profile-photo.png`
    )

    const handleProfilePhotoUpload = async () => {
      if (file) {
        if (localStorage.getItem('access')) {
          const formData = new FormData()
          formData.append('profile_photo', file)

          setIsLoading(true)

          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `JWT ${localStorage.getItem('access')}`
            }
          }

          try {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/user/update-profile-photo/`,
              formData,
              config
            )
            setMessage('Foto de perfil atualizada com sucesso!')
          } catch (err) {
            setMessage(`Erro ao enviar a foto de perfil: ${err}`)
          }
        } else {
          setMessage('Você precisa estar autenticado para enviar uma foto')
        }
      } else {
        setMessage('Selecione um arquivo antes de enviar')
      }

      setIsLoading(false)
    }

    handleProfilePhotoUpload()
  }

  const handleEditBannerClick = () => {
    if (bannerRef.current) {
      bannerRef.current.click()
    }
  }

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setBannerUrl(
      file
        ? URL.createObjectURL(file)
        : `${process.env.REACT_APP_API_URL}/media/images/no-banner.png`
    )

    const handleBannerUpload = async () => {
      if (file) {
        if (localStorage.getItem('access')) {
          const formData = new FormData()
          formData.append('banner', file)

          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `JWT ${localStorage.getItem('access')}`
            }
          }

          setIsLoading(true)

          try {
            await axios.post(
              `${process.env.REACT_APP_API_URL}/user/update-banner/`,
              formData,
              config
            )
            setMessage('Banner atualizado com sucesso!')
          } catch (err) {
            setMessage(`Erro ao enviar Banner: ${err}`)
          }
        } else {
          setMessage('Você precisa estar autenticado para enviar um banner')
        }
      } else {
        setMessage('Selecione um arquivo antes de enviar')
      }

      setIsLoading(false)
    }

    handleBannerUpload()
  }

  if (isAuthenticated !== true) {
    navigate('/login', { replace: true })
  }

  if (type !== 'IS_LOADING') {
    return (
      <>
        {isLoading && <Loader withBackground={true} active />}
        <Message
          opened={message ? true : false}
          onClick={() => setMessage(null)}
        >
          {message}
        </Message>
        {changingUsername && (
          <S.RequestPassword onSubmit={(e) => handleUpdateUsername(e)}>
            <form className="requestPasswordForm">
              <h3>Informe sua senha</h3>
              <input
                className="passwordInput"
                value={password}
                type="password"
                placeholder="Sua senha atual"
                onChange={(e) => handlePasswordChange(e)}
              />
              <Button
                title="Alterar username"
                type="submit"
                styled="minimalist"
              >
                Alterar username
              </Button>
            </form>
          </S.RequestPassword>
        )}
        <Sidebar />
        {profile ? (
          <>
            <S.Header className="container">
              <S.BackgroundBanner src={bannerUrl} />
              <S.Banner $banner={bannerUrl}>
                <span className="editBanner" onClick={handleEditBannerClick}>
                  <EditIcon className="editBannerIcon" />
                </span>
                <input
                  className="bannerInput"
                  ref={bannerRef}
                  type="file"
                  onChange={handleBannerChange}
                  accept=".jpg, .jpeg, .png, .gif"
                />
                <S.Info>
                  <div className="maininfo">
                    <div>
                      <S.ProfilePhoto
                        $profilePhoto={profilePhotoUrl}
                        onClick={handleEditProfilePhotoClick}
                      >
                        <EditIcon className="editIcon" />
                        <input
                          className="profilePhotoInput"
                          ref={profilePhotoRef}
                          type="file"
                          onChange={handleProfilePhotoChange}
                          accept=".jpg, .jpeg, .png, .gif"
                        />
                      </S.ProfilePhoto>
                      <div>
                        <S.NameInput>
                          <input
                            className="input"
                            type="text"
                            name="name"
                            value={name}
                            onChange={handleNameChange}
                            minLength={3}
                            maxLength={18}
                          />{' '}
                          <button
                            className="confirmButton"
                            title="Alterar nome"
                            disabled={isLoading}
                            onClick={handleUpdateName}
                          >
                            <ConfirmIcon className="confirmIcon" />
                          </button>
                        </S.NameInput>
                        <S.UsernameInput>
                          <input
                            className="input"
                            type="text"
                            name="name"
                            value={`@${username}`}
                            onChange={handleUsernameChange}
                            minLength={3}
                            maxLength={18}
                          />
                          <button
                            className="confirmButton"
                            title="Alterar username"
                            onClick={() => setChangingUsername(true)}
                          >
                            <ConfirmIcon className="confirmIcon" />
                          </button>
                        </S.UsernameInput>
                      </div>
                    </div>
                    <div className="social">
                      <div>
                        <p>{profile.followed_by.length}</p>
                        <p className="description">Seguidores</p>
                      </div>
                      <div>
                        <p>{profile.follows.length}</p>
                        <p className="description">Seguindo</p>
                      </div>
                      <div>
                        <p>{profile.post_count}</p>
                        <p className="description">Posts</p>
                      </div>
                    </div>
                  </div>
                </S.Info>
              </S.Banner>
            </S.Header>
            <S.ProfileContent className="container">
              <div className="bio">
                <textarea
                  className="textarea"
                  placeholder="Conte um pouco sobre você!"
                  value={bio}
                  onChange={handleBioChange}
                />
                <button
                  className="confirmButton"
                  type="button"
                  disabled={isLoading}
                  onClick={handleUpdateBio}
                >
                  <ConfirmIcon className="confirmIcon" />
                </button>
              </div>
              <form
                className="password"
                onSubmit={(e) => handleUpdatePassword(e)}
              >
                <h3 className="title">Alterar senha</h3>
                <div className="passwordInputs">
                  <input
                    className="input"
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={(e) => handleNewPasswordChange(e)}
                    placeholder="Sua senha atual"
                  />
                  <input
                    className="input"
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={(e) => handleNewPasswordChange(e)}
                    placeholder="Nova senha"
                  />
                  <input
                    className="input"
                    type="password"
                    name="re_new_password"
                    value={passwordData.re_new_password}
                    onChange={(e) => handleNewPasswordChange(e)}
                    placeholder="Repita a nova senha"
                  />
                </div>
                <button
                  className="confirmButton"
                  type="submit"
                  disabled={isLoading}
                >
                  <ConfirmIcon className="confirmIcon" />
                </button>
              </form>
            </S.ProfileContent>
          </>
        ) : (
          <Loader withBackground={false} active />
        )}
        {updatedProfile && <Profilebar user={updatedProfile} />}
      </>
    )
  }

  return <Loader withBackground={false} active />
}

export default connector(EditProfile)

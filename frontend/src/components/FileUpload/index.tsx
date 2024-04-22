import React, { ChangeEvent, useEffect, useState } from 'react'
import axios from 'axios'
import Button from '../Button'
import { ReactComponent as ImageIcon } from '../../assets/media/image-outline.svg'
import Message from '../Message'

const FileUpload = () => {
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [postImage, setPostImage] = useState<File | null>(null)
  const [postBody, setPostBody] = useState<string>('')

  const handleProfilePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null
    setProfilePhotoFile(file)
  }

  const handleProfilePhotoUpload = async () => {
    if (profilePhotoFile) {
      if (localStorage.getItem('access')) {
        const formData = new FormData()
        formData.append('profile_photo', profilePhotoFile)

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `JWT ${localStorage.getItem('access')}`
          }
        }

        try {
          const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/user/update-profile-photo/`,
            formData,
            config
          )
          console.log('Foto de perfil atualizada com sucesso!')
          console.log(res)
        } catch (err) {
          console.log('Erro ao enviar a foto de perfil:', err)
        }
      } else {
        console.log('Você precisa estar autenticado para enviar uma foto')
      }
    } else {
      console.log('Selecione um arquivo antes de enviar')
    }
  }

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setBannerFile(file)
  }

  const handleBannerUpload = async () => {
    if (bannerFile) {
      if (localStorage.getItem('access')) {
        const formData = new FormData()
        formData.append('banner', bannerFile)

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `JWT ${localStorage.getItem('access')}`
          }
        }

        try {
          const res = await axios.post(
            `${process.env.REACT_APP_API_URL}/user/update-banner/`,
            formData,
            config
          )
          console.log('Banner atualizada com sucesso!')
          console.log(res)
        } catch (err) {
          console.log('Erro ao enviar o banner:', err)
        }
      } else {
        console.log('Você precisa estar autenticado para enviar um banner')
      }
    } else {
      console.log('Selecione um arquivo antes de enviar')
    }
  }

  const handlePostImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null
    setPostImage(file)
  }

  const handleBodyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostBody(e.target.value)
  }

  const handleCreatePost = async () => {
    if (localStorage.getItem('access')) {
      const formData = new FormData()
      formData.append('body', postBody)
      if (postImage) {
        formData.append('image', postImage)
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `JWT ${localStorage.getItem('access')}`
        }
      }

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/create-post/`,
          formData,
          config
        )
        console.log('Banner atualizada com sucesso!')
        console.log(res)
      } catch (err) {
        console.log('Erro ao enviar o banner:', err)
      }
    } else {
      console.log('Você precisa estar autenticado para enviar um banner')
    }
  }

  useEffect(() => {
    console.log({
      body: postBody,
      image: postImage
    })
  }, [postBody, postImage])

  const [opened, setOpened] = useState(true)

  return (
    <div>
      <Message opened={opened} onClick={() => setOpened(!opened)}>
        Teste alou um dois tres asasa sasasa sasas
      </Message>
      <button
        onClick={() => {
          console.log(opened)
        }}
      >
        teste
      </button>
      {/* <input
        type="file"
        onChange={handleProfilePhotoChange}
        accept=".jpg, .jpeg, .png, .gif"
      />
      <button onClick={handleProfilePhotoUpload}>Enviar Foto</button>
      {profilePhotoFile && (
        <div>
          <p>Nome do arquivo: {profilePhotoFile.name}</p>
          <p>Tipo de arquivo: {profilePhotoFile.type}</p>
          <p>Tamanho do arquivo: {profilePhotoFile.size} bytes</p>
        </div>
      )}
      <br />
      <br />
      <br />
      <input
        type="file"
        onChange={handleBannerChange}
        accept=".jpg, .jpeg, .png, .gif"
      />
      <button onClick={handleBannerUpload}>Enviar Foto</button>
      {bannerFile && (
        <div>
          <p>Nome do arquivo: {bannerFile.name}</p>
          <p>Tipo de arquivo: {bannerFile.type}</p>
          <p>Tamanho do arquivo: {bannerFile.size} bytes</p>
        </div>
      )}
      <br />
      <br />
      <br />
      <Button
        styled="postImg"
        title=""
        type="button"
        icon={<ImageIcon />}
        onChange={handlePostImageChange}
      ></Button>
      <textarea
        className="newPostContainer"
        name="body"
        value={postBody}
        onChange={(e) => handleBodyChange(e)}
        minLength={3}
        maxLength={200}
        placeholder="Digite algo"
        required
      />
      <button type="button" onClick={handleCreatePost}>
        criar post
      </button> */}
    </div>
  )
}

export default FileUpload

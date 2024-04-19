import { ChangeEvent, useState } from 'react'

import Button from '../Button'

import { ReactComponent as ConfirmIcon } from '../../assets/media/checkmark-outline.svg'
import { ReactComponent as ImageIcon } from '../../assets/media/image-outline.svg'
import tempImg from '../../assets/media/Foto LinkedIn.jpg'

import * as S from './styles'
import axios from 'axios'
import Post, { PostType } from '../Post'

type CreatePostType = {
  body: string
}

const NewPost = () => {
  const [formData, setFormData] = useState<CreatePostType>({ body: '' })
  const [formCallback, setFormCallback] = useState<PostType[] | null>(null)

  const createPost = async () => {
    if (localStorage.getItem('access')) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.getItem('access')}`,
          Accept: 'application/json'
        }
      }

      const body = JSON.stringify(formData)

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/create-post/`,
          body,
          config
        )
        if (formCallback !== null) {
          setFormCallback([res.data, ...formCallback])
        } else {
          setFormCallback([res.data])
        }
      } catch (err) {
        return <h3>Erro ao criar seu post, tente novamente.</h3>
      }
    } else {
      return <h3>Para criar posts, é necessário estar autenticado</h3>
    }
  }

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createPost()
    setFormData({ body: '' })
  }

  return (
    <>
      <S.Form onSubmit={(e) => onSubmit(e)}>
        <div className="sideIcons">
          <S.ProfilePhoto src={tempImg} alt="profilePhoto" />
          <Button title="" type="button" styled="post" icon={<ImageIcon />} />
          <Button title="" type="submit" styled="post" icon={<ConfirmIcon />} />
        </div>
        <div className="postContent">
          <S.TextPost>
            <textarea
              className="newPostContainer"
              name="body"
              value={formData.body}
              onChange={(e) => onChange(e)}
              minLength={3}
              maxLength={200}
              placeholder="Digite algo"
              required
            />
          </S.TextPost>
        </div>
      </S.Form>
      {formCallback?.map((post) => (
        <Post postContent={post} key={post.id} />
      ))}
    </>
  )
}

export default NewPost

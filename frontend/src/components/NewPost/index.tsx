import { ChangeEvent, useState } from 'react'
import axios from 'axios'

import Button from '../Button'

import { ReactComponent as ConfirmIcon } from '../../assets/media/checkmark-outline.svg'
import { ReactComponent as ImageIcon } from '../../assets/media/image-outline.svg'

import Post, { PostType } from '../Post'
import Message from '../Message'

import * as S from './styles'

type Props = {
  profilePhoto: string
}

const NewPost = ({ profilePhoto }: Props) => {
  const [postBody, setPostBody] = useState('')
  const [postImage, setPostImage] = useState<File | null>(null)
  const [formCallback, setFormCallback] = useState<PostType[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const createPost = async () => {
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

        if (formCallback !== null) {
          setFormCallback([res.data, ...formCallback])
        } else {
          setFormCallback([res.data])
        }

        setPostBody('')
        setPostImage(null)
      } catch (err) {
        setError('Houve um erro ao criar o post. Recarregue a página.')
      }
    } else {
      setError('Entre para criar posts')
    }
  }

  const handleBodyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPostBody(e.target.value)
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setPostImage(file)
  }

  const handleQuotePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    createPost()
  }

  return (
    <>
      <Message opened={error ? true : false} onClick={() => setError(null)}>
        {error}
      </Message>
      <S.Form onSubmit={(e) => handleQuotePostSubmit(e)}>
        <div className="sideIcons">
          <S.ProfilePhoto src={profilePhoto} alt="profilePhoto" />
          <Button
            title=""
            type="button"
            styled="postImg"
            icon={<ImageIcon />}
            onChange={(e) => handleImageChange(e)}
          />
          <Button title="" type="submit" styled="post" icon={<ConfirmIcon />} />
        </div>
        <div className="postContent">
          <S.TextPost>
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

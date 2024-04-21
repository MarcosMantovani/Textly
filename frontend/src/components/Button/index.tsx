import React, { useRef } from 'react'

import * as S from './styles'

type ButtonProps = {
  type: 'button' | 'submit'
  title: string
  children?: string | React.ReactNode
  styled?: 'standard' | 'minimalist' | 'sidebar' | 'post' | 'follow' | 'postImg'
  icon?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Button = ({
  type,
  title,
  children,
  styled = 'standard',
  disabled = false,
  icon,
  onClick,
  onChange
}: ButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  if (styled === 'post') {
    return (
      <S.PostButton
        type={type}
        title={title}
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
      </S.PostButton>
    )
  }

  if (styled === 'postImg') {
    const handleButtonClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }

    return (
      <S.PostImgButton>
        <S.PostButton
          onClick={handleButtonClick}
          type="button"
          className="postImgButton"
        >
          {icon}
        </S.PostButton>
        <input
          ref={fileInputRef}
          className="postImgInput"
          type="file"
          onChange={onChange}
        ></input>
      </S.PostImgButton>
    )
  }

  if (styled === 'sidebar') {
    return (
      <S.SideBarButton
        type={type}
        title={title}
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
        {children}
      </S.SideBarButton>
    )
  }

  if (styled === 'follow') {
    return (
      <S.FollowButton
        type={type}
        title={title}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </S.FollowButton>
    )
  }

  // if styled === 'standard' || styled === 'minimalist'
  return (
    <S.StandardButton
      type={type}
      title={title}
      onClick={onClick}
      $styled={styled}
      disabled={disabled}
    >
      {children}
    </S.StandardButton>
  )
}

export default Button

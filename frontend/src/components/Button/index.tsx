import React from 'react'

import * as S from './styles'

type ButtonProps = {
  type: 'button' | 'submit'
  title: string
  children?: string | React.ReactNode
  styled?: 'standard' | 'minimalist' | 'sidebar' | 'post' | 'follow'
  icon?: React.ReactNode
  disabled?: boolean
  onClick?: () => void
}

const Button = ({
  type,
  title,
  children,
  styled = 'standard',
  disabled = false,
  icon,
  onClick
}: ButtonProps) => {
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

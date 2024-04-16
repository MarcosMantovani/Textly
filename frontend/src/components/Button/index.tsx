import React from 'react'

import * as S from './styles'

type ButtonProps = {
  type: 'button' | 'submit'
  title: string
  children?: string
  styled?: 'standard' | 'minimalist' | 'sidebar' | 'post'
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
  if (styled === 'standard' || styled === 'minimalist') {
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

  // styled === 'sidebar'
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

export default Button

import React, { ChangeEvent, useEffect, useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import { reset_password } from '../../store/actions/auth'
import { RootState } from '../../store/reducers'

import Button from '../Button'
import { Input, Title } from '../../pages/LoginRegister/styles'

import { ForgotPasswordForm as Form } from './styles'

const connector = connect(
  (state: RootState) => ({
    type: state.auth.type
  }),
  {
    reset_password: reset_password
  }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const ForgotPasswordForm: React.FC<PropsFromRedux> = ({
  type,
  reset_password
}) => {
  const [requestSent, setRequestSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: ''
  })
  const { email } = formData

  useEffect(() => {
    if (type === 'PASSWORD_RESET_FAIL') {
      setErrorMsg('E-mail incorreto ou não cadastrado')
    } else if (type === 'PASSWORD_RESET_SUCCESS') {
      setErrorMsg('Verifique seu e-mail para alterar sua senha')
      setRequestSent(true)
    }
  }, [type])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    reset_password(email)
  }

  return (
    <Form onSubmit={(e) => onSubmit(e)}>
      <Title>Esqueceu a Senha?</Title>
      <div>
        <span>Informe seu e-mail para trocar sua senha</span>
        <Input
          type="email"
          name="email"
          placeholder="E-mail"
          onChange={(e) => onChange(e)}
        />
        {errorMsg && <span>{errorMsg}</span>}
      </div>
      <Button disabled={requestSent} title="Sign Up" type="submit">
        {requestSent ? 'EMAIL ENVIADO' : 'Confirmar e-mail'}
      </Button>
    </Form>
  )
}

export default connector(ForgotPasswordForm)

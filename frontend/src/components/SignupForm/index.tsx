import { ChangeEvent, useEffect, useState } from 'react'
import { ConnectedProps, connect } from 'react-redux'

import { signup } from '../../store/actions/auth'
import { RootState } from '../../store/reducers'

import Button from '../Button'

import {
  Form,
  Input,
  SocialIcons,
  Title
} from '../../pages/LoginRegister/styles'
import * as S from './styles'
import { useNavigate } from 'react-router-dom'

const connector = connect(
  (state: RootState) => ({
    type: state.auth.type,
    error: state.auth.error
  }),
  {
    signup: signup
  }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const SignupForm: React.FC<PropsFromRedux> = ({ type, error, signup }) => {
  const navigate = useNavigate()

  const [signupData, setSignupData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    re_password: ''
  })
  const { name, username, email, password, re_password } = signupData

  const [accountCreated, setAccountCreated] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (type === 'SIGNUP_FAIL' && error) {
      if (error) {
        if (error.email && error.email[0]) {
          setErrorMsg(error.email[0])
        } else if (error.password && error.password[0]) {
          setErrorMsg(error.password[0])
        } else if (error.username && error.username[0]) {
          setErrorMsg(error.username[0])
        }
      }
    } else if (type === 'SIGNUP_SUCCESS') {
      setErrorMsg(null)
      setAccountCreated(true)
    }
  }, [error, type])

  const OnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value })
    setErrorMsg(null)
  }

  const OnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password === re_password) {
      signup(name, username, email, password, re_password)
    }
  }

  const rediretcToLoginPage = () => navigate('/login', { replace: true })

  return (
    <Form onSubmit={(e) => OnSubmit(e)}>
      <Title>Criar Conta</Title>
      <SocialIcons>
        <div>
          <a>
            <img alt="" />
          </a>
        </div>
        <div>
          <a>
            <img alt="" />
          </a>
        </div>
        <div>
          <a>
            <img alt="" />
          </a>
        </div>
        <div>
          <a>
            <img alt="" />
          </a>
        </div>
      </SocialIcons>
      <span>ou use seu e-mail para se registrar</span>
      <Input
        name="name"
        value={name}
        onChange={(e) => OnChange(e)}
        type="text"
        placeholder="Nome"
        maxLength={18}
        minLength={3}
        required
      />
      <Input
        name="username"
        value={username}
        onChange={(e) => OnChange(e)}
        type="text"
        placeholder="Username"
        maxLength={18}
        minLength={3}
        required
      />
      <Input
        name="email"
        value={email}
        onChange={(e) => OnChange(e)}
        type="email"
        placeholder="E-mail"
        required
      />
      <S.PasswordInput>
        <Input
          name="password"
          value={password}
          onChange={(e) => OnChange(e)}
          type="password"
          placeholder="Senha"
          minLength={6}
          required
        />
        <Input
          name="re_password"
          value={re_password}
          onChange={(e) => OnChange(e)}
          type="password"
          placeholder="Repita a Senha"
          minLength={6}
          required
        />
      </S.PasswordInput>
      {accountCreated && (
        <span>Confirme a criação da sua conta em seu e-mail</span>
      )}
      {errorMsg && <span>{errorMsg}</span>}
      <Button
        disabled={accountCreated || type === 'IS_LOADING'}
        title="Sign Up"
        type="submit"
      >
        {accountCreated ? 'Verifique seu e-mail' : 'Registrar-se'}
      </Button>
      <div className="mobileButton">
        <span>Já tem uma conta? </span>
        <span className="button" onClick={rediretcToLoginPage}>
          Entrar
        </span>
      </div>
    </Form>
  )
}

export default connector(SignupForm)

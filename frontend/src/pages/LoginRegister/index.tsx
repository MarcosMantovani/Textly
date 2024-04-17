import React, { ChangeEvent, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ConnectedProps, connect } from 'react-redux'

import Button from '../../components/Button'
import TextlyTitle from '../../components/TextlyTitle'
import SignupForm from '../../components/SignupForm'
import ForgotPasswordForm from '../../components/ForgotPasswordForm'

import { login } from '../../store/actions/auth'
import { RootState } from '../../store/reducers'

import * as S from './styles'
import Loader from '../../components/Loader'

const connector = connect(
  (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    type: state.auth.type,
    error: state.auth.error?.detail
  }),
  {
    login: login
  }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const LoginRegister: React.FC<PropsFromRedux> = ({
  login,
  isAuthenticated,
  type,
  error
}) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [signUp, setSignUp] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (isAuthenticated) {
    navigate('/', { replace: true })
  }

  useEffect(() => {
    if (pathname === '/register') {
      setSignUp(true)
      setForgotPassword(false)
    } else if (pathname === '/forgot-password') {
      setSignUp(true)
      setForgotPassword(true)
    }
  }, [pathname])

  useEffect(() => {
    if (type === 'LOGIN_FAIL' && error) {
      setErrorMsg(error)
    }
  }, [type, error])

  const redirectToRegister = () => {
    setSignUp(true)
    setForgotPassword(false)
    navigate('/register', { replace: true })
  }

  const redirectToLogin = () => {
    setSignUp(false)
    navigate('/login', { replace: true })
  }

  const redirectToForgotPassword = () => {
    setSignUp(true)
    setForgotPassword(true)
    navigate('/forgot-password', { replace: true })
  }

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })
  const { username, password } = loginData

  const LoginOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
    setErrorMsg(null)
  }

  const LoginOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    login(username, password)
  }

  return (
    <S.Body>
      <Loader active={type === 'IS_LOADING'} />
      <TextlyTitle position="middle-top" />
      <S.Container $signup={signUp}>
        <S.SignUp>
          {forgotPassword ? <ForgotPasswordForm /> : <SignupForm />}
        </S.SignUp>
        <S.SignIn>
          <S.Form onSubmit={(e) => LoginOnSubmit(e)}>
            <S.Title>Entrar</S.Title>
            <S.SocialIcons>
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
            </S.SocialIcons>
            <span>ou use seu nome de usuário e senha</span>
            <S.Input
              name="username"
              value={username}
              onChange={(e) => LoginOnChange(e)}
              type="text"
              placeholder="Nome de usuário"
              required
            />
            <S.Input
              name="password"
              value={password}
              onChange={(e) => LoginOnChange(e)}
              type="password"
              placeholder="Senha"
              minLength={6}
              required
            />
            <S.ForgotPasswordButton
              onClick={redirectToForgotPassword}
              title="Esqueceu a senha?"
              type="button"
            >
              Esqueceu a senha?
            </S.ForgotPasswordButton>
            {errorMsg && <span>{errorMsg}</span>}
            <Button
              disabled={type === 'IS_LOADING'}
              title="Sign In"
              type="submit"
            >
              Entrar
            </Button>
          </S.Form>
        </S.SignIn>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <S.Title>Já tem uma Perfil?</S.Title>
              <S.Subtitle>
                Entre com suas informações pessoais e aproveite o Textly
              </S.Subtitle>
              <Button
                title="Sign In"
                type="button"
                styled="minimalist"
                onClick={redirectToLogin}
              >
                Entrar
              </Button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Não tem conta?</h1>
              <S.Subtitle>
                Registre-se para aproveitar todas as funcionalidades do Textly
              </S.Subtitle>
              <Button
                title="Sign Up"
                type="button"
                styled="minimalist"
                onClick={redirectToRegister}
              >
                Registrar-se
              </Button>
            </div>
          </div>
        </div>
      </S.Container>
    </S.Body>
  )
}

export default connector(LoginRegister)

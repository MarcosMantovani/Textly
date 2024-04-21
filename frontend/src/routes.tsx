import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ConnectedProps, connect } from 'react-redux'

import { checkAuthenticated, load_user } from './store/actions/auth'

import Home from './pages/Home'
import LoginRegister from './pages/LoginRegister'
import ConfirmForm from './pages/ConfirmForm'
import Profile from './pages/Profile'
import FileUpload from './components/FileUpload'
import Test from './components/Test'

const connector = connect(null, {
  checkAuthenticated: checkAuthenticated,
  load_user: load_user
})

type PropsFromRedux = ConnectedProps<typeof connector>

const PageRoutes: React.FC<PropsFromRedux> = ({
  checkAuthenticated,
  load_user
}) => {
  useEffect(() => {
    checkAuthenticated()
    load_user()
  }, [checkAuthenticated, load_user])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/login" element={<LoginRegister />} />
      <Route path="/register" element={<LoginRegister />} />
      <Route path="/forgot-password" element={<LoginRegister />} />
      <Route
        path="/password/reset/confirm/:uid/:token"
        element={<ConfirmForm />}
      />
      <Route path="/activate/:uid/:token" element={<ConfirmForm />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  )
}

export default connector(PageRoutes)

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAIL = 'LOGIN_FAIL'
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'
export const SIGNUP_FAIL = 'SIGNUP_FAIL'
export const ACTIVATION_SUCCESS = 'ACTIVATION_SUCCESS'
export const ACTIVATION_FAIL = 'ACTIVATION_FAIL'
export const USER_LOADED_SUCCESS = 'USER_LOADED_SUCCESS'
export const USER_LOADED_FAIL = 'USER_LOADED_FAIL'
export const AUTHENTICATED_SUCCESS = 'AUTHENTICATED_SUCCESS'
export const AUTHENTICATED_FAIL = 'AUTHENTICATED_FAIL'
export const PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS'
export const PASSWORD_RESET_FAIL = 'PASSWORD_RESET_FAIL'
export const PASSWORD_RESET_CONFIRM_SUCCESS = 'PASSWORD_RESET_CONFIRM_SUCCESS'
export const PASSWORD_RESET_CONFIRM_FAIL = 'PASSWORD_RESET_CONFIRM_FAIL'
export const LOGOUT = 'LOGOUT'
export const IS_LOADING = 'IS_LOADING'

export interface User {
  id: number
  name: string
  username: string
  email: string
}

export interface Profile extends User {
  follows: User[]
  followed_by: User[]
  date_modified: string
}

export interface Error {
  detail?: string | null
  password?: string[] | null
  username?: string[] | null
  email?: string[] | null
}

export interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS
  payload: {
    access: string
    refresh: string
  }
}

export interface LoginFailAction {
  type: typeof LOGIN_FAIL
  payload: Error
}

export interface UserLoadedSuccessAction {
  type: typeof USER_LOADED_SUCCESS
  payload: Profile
}

export interface UserLoadedFailAction {
  type: typeof USER_LOADED_FAIL
}

export interface AuthenticatedSuccessAction {
  type: typeof AUTHENTICATED_SUCCESS
}
export interface AuthenticatedFailAction {
  type: typeof AUTHENTICATED_FAIL
}

export interface LogoutAction {
  type: typeof LOGOUT
}

export interface PasswordResetSuccessAction {
  type: typeof PASSWORD_RESET_SUCCESS
}

export interface PasswordResetFailAction {
  type: typeof PASSWORD_RESET_FAIL
  payload: Error
}

export interface PasswordResetConfirmSuccessAction {
  type: typeof PASSWORD_RESET_CONFIRM_SUCCESS
}

export interface PasswordResetConfirmFailAction {
  type: typeof PASSWORD_RESET_CONFIRM_FAIL
}

export interface SignupSuccessAction {
  type: typeof SIGNUP_SUCCESS
}

export interface SignupFailAction {
  type: typeof SIGNUP_FAIL
  payload: Error
}

export interface ActivationSuccessAction {
  type: typeof ACTIVATION_SUCCESS
}

export interface ActivationFailAction {
  type: typeof ACTIVATION_FAIL
}

export interface IsLoadingAction {
  type: typeof IS_LOADING
}

export type AuthActionTypes =
  | LoginSuccessAction
  | LoginFailAction
  | UserLoadedSuccessAction
  | UserLoadedFailAction
  | AuthenticatedSuccessAction
  | AuthenticatedFailAction
  | LogoutAction
  | PasswordResetSuccessAction
  | PasswordResetFailAction
  | PasswordResetConfirmSuccessAction
  | PasswordResetConfirmFailAction
  | SignupSuccessAction
  | SignupFailAction
  | ActivationSuccessAction
  | ActivationFailAction
  | IsLoadingAction

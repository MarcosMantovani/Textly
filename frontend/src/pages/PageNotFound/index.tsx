import TextlyTitle from '../../components/TextlyTitle'
import * as S from './styles'

const PageNotFound = () => {
  return (
    <S.Container>
      <TextlyTitle position="middle-top" />
      <h2 className="title">404</h2>
      <h3 className="subtitle">Page not found</h3>
    </S.Container>
  )
}

export default PageNotFound

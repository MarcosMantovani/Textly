import * as S from './styles'

type Props = {
  active: boolean
}

const Loader = ({ active }: Props) => {
  return (
    <S.Loader $active={active}>
      <div className="circle">
        <div className="dot"></div>
        <div className="outline"></div>
      </div>
      <div className="circle">
        <div className="dot"></div>
        <div className="outline"></div>
      </div>
      <div className="circle">
        <div className="dot"></div>
        <div className="outline"></div>
      </div>
    </S.Loader>
  )
}

export default Loader

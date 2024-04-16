import styled from 'styled-components'

type TitleProps = {
  $position: 'middle-top' | 'static'
}

export const Title = styled.h1<TitleProps>`
  position: ${({ $position }) =>
    $position === 'middle-top' ? 'absolute' : ''};
  top: ${({ $position }) => ($position === 'middle-top' ? '32px' : '')};
  left: ${({ $position }) => ($position === 'middle-top' ? '50%' : '')};
  transform: ${({ $position }) =>
    $position === 'middle-top' ? 'translateX(-50%)' : ''};
  height: 40px;
  text-align: ${({ $position }) =>
    $position === 'middle-top' ? '' : 'center'};

  img {
    max-height: 100%;
  }
`

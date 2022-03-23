import React from 'react'
import { Button } from '@fastswap-uikit'
import styled from 'styled-components'

interface Props {
  cssStyle?: React.CSSProperties;
  children?: React.ReactNode;
  onClick?: () => void;
}

const LButton = styled(Button)`
  border: solid 2px transparent;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #39E47F, #24E7C3, #6FA8FD);
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-shadow: 2px 1000px 1px #fff inset;
  border-radius: 5px;

  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`

const LText = styled.span`
  font-family: Oswald,sans-serif;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #39E47F, #24E7C3, #6FA8FD);
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
`

const LSButton: React.FC<Props> = ({
    cssStyle,
    children,
    onClick,
  }) => {

  return (
    <LButton onClick={onClick}>
      <LText>{children}</LText>
    </LButton>
  )
}

export default LSButton

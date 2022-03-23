import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Button, ButtonProps, useWalletModal } from '@fastswap-uikit'
import { injected, walletconnect } from 'connectors'
import styled from 'styled-components'

// interface Props {
//   style?: React.CSSProperties;
//   children?: React.ReactNode;
//   onClick?: () => void;
// }

const LButton = styled(Button)`
  background: none;
  border: 10px solid;
  border-image-slice: 1;
  border-width: 2px;
  border-radius: 8px;
  border-collapse: separate;
  border-image-source: linear-gradient(101deg, #39E47F, #24E7C3, #6FA8FD);
  background-clip: content-box, border-box;

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

const LSConnectWalletButton: React.FC<ButtonProps> = () => {

  const { account, activate, deactivate } = useWeb3React()

  const handleLogin = (connectorId: string) => {
    if (connectorId === 'walletconnect') {
      return activate(walletconnect)
    }
    return activate(injected)
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return (
    <LButton onClick={onPresentConnectModal}>
      <LText>CONNECT TO A WALLET</LText>
    </LButton>
  )
}

export default LSConnectWalletButton

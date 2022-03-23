import React from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'
import Logo from 'components/LogoLand'
import { injected, walletconnect } from 'connectors'
import { Button, useWalletModal } from '@fastswap-uikit'
import useAdminLogin from 'hooks/useAdminLogin'
import { AutoColumn } from '../../../../components/Column'

const Wrapper = styled.div`
  justify-content: space-around;
  width: 100%;
  height: 100%;
  background: #192219;
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;

  ${respondTo.sm`
    display: grid;
  `}

  ${respondTo.xss`

`}
`

const Section = styled.div`
  flex: 1;
  ${respondTo.sm`
    padding: 50px;
  `}
`

const BSection = styled.div`
  flex: 1;
  border-left: 1px solid #363936;
  padding-left: 50px;
  ${respondTo.sm`
    border: 0;
    padding: 50px;
  `}
`

const LButton = styled(Button)`
  border-radius: 8px;
  height: 64px;
  background-image: linear-gradient(to right, #64F9A1, #0EFFD4, #97AEFF);
`

const LText = styled.span`
  font-family: Oswald,sans-serif;
  font-size: 16px;
  font-weight: 500;
`

const Main: React.FC = () => {
  const { account, activate, deactivate } = useWeb3React()

  const handleLogin = (connectorId: string) => {
    if (connectorId === 'walletconnect') {
      return activate(walletconnect)
    }
    return activate(injected)
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  useAdminLogin(account)

  return (
    <Wrapper>
      <Section>
        <AutoColumn style={{ padding: '36px', float: 'right' }}>
          <Logo height={164} width={462} />
        </AutoColumn>
      </Section>
      <BSection>
        <AutoColumn style={{ maxWidth: '400px' }}>
          {account ?
            <LButton style={{ margin: '30px' }}>
              <LText style={{ color: '#192219' }}>
                {account}
              </LText>
            </LButton>
            :
            <LButton style={{ margin: '30px' }} onClick={onPresentConnectModal}>
              <LText style={{ color: '#192219' }}>
                LOG IN WITH WALLET
              </LText>
            </LButton>
          }
        </AutoColumn>
      </BSection>
    </Wrapper>
  )
}

export default Main

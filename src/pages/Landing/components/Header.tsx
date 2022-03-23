import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { injected, walletconnect } from 'connectors'
import styled from 'styled-components'
import { Button, Box, useWalletModal } from '@fastswap-uikit'
import LSConnectWalletButton from 'components/LSConnectWalletButton'
import TwitLink from 'components/TwitLink'
import TelLink from 'components/TelLink'
import Logo from 'components/LogoLand'
import respondTo from 'style/RespondTo'
import burger from 'img/burger.svg'
import close from 'img/x.svg'
import mLogo from 'img/mLogo.svg'
import TradeIcon from 'img/trade.png'
import WalletIcon from 'img/metamask.png'
import useWindowDimensions from 'hooks/useWindowDimensions'

const Hdr = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 64px;

  ${respondTo.sm`
    padding: 16px 32px 0 32px;
  `}
`

const SocialGroup = styled.div`
  display: flex;
  align-items: center;
  ${respondTo.sm`
    display: none;
  `}
`
// const Launch = styled(Link)`
//   padding: 16px 48px;
//   text-transform: uppercase;
//   font-size: 16px;
//   font-weight: 500;
//   background: #2ba55d;
//   color: #fcfcfc;
//   border-radius: 26px;
//   margin-left: 23px;
//   font-family: Oswald, sans-serif;
// `

const Burger = styled.button`
  border: none;
  background: url(${burger}) no-repeat center;
  width: 32px;
  height: 32px;
  display: none;

  ${respondTo.lg`
    display: block;
  `}
`

const NavOut = styled.div`
  background: #2ba55d;
  z-index: 4;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`

const NavMobile = styled.nav`
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 5;
  background: url(${mLogo}) no-repeat right;
  background-size: contain;
`
const BtnClose = styled.button`
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  width: 18px;
  height: 18px;
  position: absolute;
  top: 28px;
  right: 38px;
  background: url(${close}) no-repeat center;
`

const Text = styled(Link) <any>`
  font-family: Oswald, sans-serif;
  color: #fcfcfc;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  padding: 0 20px 0 20px;
  position: relative;
  &:after {
    content: '';
    width: 100%;
    height: 4px;
    background: ${({ active }) => active ? 'linear-gradient(180deg, #64F9A1 0%, #0EFFD4 49.48%, #97AEFF 100%)' : 'transparent'};
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 40px);
  }
`

const SocialMobile = styled.div`
  display: flex;
  align-items: center;
  margin-top: 84px;
`

const LButton = styled(Button)`
  margin: 0 20px 0 20px;
  background: none;
  border: 10px solid;
  border-image-slice: 1;
  border-width: 2px;
  border-radius: 8px;
  border-collapse: separate;
  border-image-source: linear-gradient(101deg, #39E47F, #24E7C3, #6FA8FD);
  background-clip: content-box, border-box;
`

const AccountButton = styled(LButton)`
  display: flex;
  justify-content: space-between;
  padding: 8.8px 8px;
  >div:first-of-type {
    border-radius: 50%;
    background: #2BA55D;
  }
  >*+* {
    margin-left: 11.8px;
  }
`

const LText = styled.span`
  font-family: Oswald,sans-serif;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #39E47F, #24E7C3, #6FA8FD);
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
`

const XText = styled(Text)`
  font-size: 40px;
  line-height: 60px;
`

const Header: React.FC = () => {
  const [isOpenMobile, setOpenMobile] = useState(false)

  const handleOpen = useCallback(() => {
    setOpenMobile(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpenMobile(false)
  }, [])

  const screenWidth = useWindowDimensions().width
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (screenWidth > 992)
      setIsMobile(false)
    else setIsMobile(true)
  }, [screenWidth])

  const { account, activate, deactivate } = useWeb3React()

  const handleLogin = (connectorId: string) => {
    if (connectorId === 'walletconnect') {
      return activate(walletconnect)
    }
    return activate(injected)
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)
  const accountEllipsis = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null;

  return (
    <>
      <Hdr>
        <Logo height={88} width={245} />
        <SocialGroup>
          {!isMobile &&
            <>
              <Text to="/project">PROJECTS</Text>
              <Text to="/staking">STAKING</Text>
              <Text to="/faq">FAQ</Text>
              <LButton>
                <LText>TRADE</LText>
                <Box ml={1}>
                  <img src={TradeIcon} alt='' />
                </Box>
              </LButton>
              {accountEllipsis ?
                <AccountButton onClick={onPresentConnectModal}>
                  <Box width='8px' height='8px' />
                  <Box>
                    <img src={WalletIcon} alt='' />
                  </Box>
                  <LText style={{ fontWeight: 400, fontSize: '16px', fontFamily: 'Raleway', color: '#EBF8F0' }}>{accountEllipsis}</LText>
                </AccountButton>
                :
                <LSConnectWalletButton />
              }
            </>
          }
        </SocialGroup>
        <Burger onClick={handleOpen} type="button" />
      </Hdr>
      {isOpenMobile && (
        <NavOut>
          <NavMobile>
            <BtnClose onClick={handleClose} />
            <Text to="/">Launch app</Text>
            {accountEllipsis &&
              <XText onClick={onPresentConnectModal} style={{marginBottom: '24px'}}>{accountEllipsis}</XText>
            }
            <XText to="/project">PROJECTS</XText>
            <XText to="/staking">STAKING</XText>
            <XText to="/faq">FAQ</XText>
            <SocialMobile>
              <TwitLink light />
              <TelLink light />
            </SocialMobile>
          </NavMobile>
        </NavOut>
      )}
    </>
  )
}

export default Header

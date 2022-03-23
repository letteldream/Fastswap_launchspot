import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Box, Flex, IconButton } from '@fastswap-uikit'
import TwitLink from 'components/TwitLink'
import TelLink from 'components/TelLink'
import Logo from 'components/LogoLandAdmin'
import respondTo from 'style/RespondTo'
import close from 'img/x.svg'
import mLogo from 'img/adminLogo.svg'
import logout from 'img/logout.svg'
import { useWeb3React } from '@web3-react/core'
import useWindowDimensions from 'hooks/useWindowDimensions';

const Hdr = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 64px;
  border: 1px solid #363936;
  height: 96px;

  ${respondTo.sm`
    padding: 16px 32px;
  `}
`

const SocialGroup = styled.div`
  display: flex;
  align-items: center;
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

// const Burger = styled.button`
//   border: none;
//   background: url(${burger}) no-repeat center;
//   width: 32px;
//   height: 32px;
//   display: none;

//   ${respondTo.sm`
//     display: block;
//   `}
// `

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

// const LButton = styled(Button)`
//   margin: 0 20px 0 20px;
//   background: none;
//   border: 10px solid;
//   border-image-slice: 1;
//   border-width: 2px;
//   border-radius: 8px;
//   border-collapse: separate;
//   border-image-source: linear-gradient(101deg, #39E47F, #24E7C3, #6FA8FD);
//   background-clip: content-box, border-box;
// `

// const LText = styled.span`
//   font-family: Oswald,sans-serif;
//   background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #39E47F, #24E7C3, #6FA8FD);
//   color: transparent;
//   -webkit-background-clip: text;
//   background-clip: text;
// `

const Icon = styled.img`
  width: 32px;
  height: 32px;
`

const Border = styled(Box)`
  height: 53px;
  width: 1px;
  background: #363936;
`

const Header: React.FC = () => {
  const history = useHistory()
  const [isOpenMobile, setOpenMobile] = useState(false)
  const { deactivate } = useWeb3React()

  const screenWidth = useWindowDimensions().width
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (screenWidth > 600) setIsMobile(false)
    else setIsMobile(true)
  }, [screenWidth])

  // const handleOpen = useCallback(() => {
  //   setOpenMobile(true)
  // }, [])

  const handleClose = useCallback(() => {
    setOpenMobile(false)
  }, [])

  const handleLogout = () => {
    deactivate()
    history.push('/admin/login')
    localStorage.removeItem('adaToken')
  }

  return (
    <Box width='100%' >
      <Hdr>
        <Flex alignItems='center'>
          <Logo height={70} width={200} />
          {!isMobile &&
            <>
              <Border ml='16px' mr='16px' />
              <Text active>PROJECTS</Text>
            </>
          }
        </Flex>
        <SocialGroup>
          <IconButton variant="text" title="Logout" onClick={handleLogout}>
            <Icon src={logout} alt="" />
          </IconButton>
        </SocialGroup>
      </Hdr>
      {isOpenMobile && (
        <NavOut>
          <NavMobile>
            <BtnClose onClick={handleClose} />
            <Text to="/">Launch app</Text>
            <SocialMobile>
              <TwitLink light />
              <TelLink light />
            </SocialMobile>
          </NavMobile>
        </NavOut>
      )}
    </Box>
  )
}

export default Header

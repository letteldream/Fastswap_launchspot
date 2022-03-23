import React from 'react'
import styled from 'styled-components'
import Logo from 'components/LogoLand'
import twit from 'img/twitGra.svg'
import telg from 'img/telGra.svg'
import respondTo from 'style/RespondTo'

// const Line = styled.hr`
//   height: 2px;
//   color: #131413;
//   margin: 0 64px;
//   ${respondTo.sm`
//     margin: 0;
// `}
// `

const In = styled.div`
  padding: 0 64px;
  display: flex;
  justify-content: space-between;
  margin-top: 46px;

  ${respondTo.sm`
    padding: 0 32px;
  `}
  ${respondTo.md`
    justify-content: center;
  `}
`

const Copy = styled.span`
  float: right;
  text-transform: uppercase;
  color: #757B75;
  font-size: 14px;
  font-weight: 500;
  font-family: Raleway, sans-serif;
`
const Group = styled.div`
  display: flex;
  flex-direction: column;
`
const SocialGroup = styled.div`
  display: flex;
  align-items: center;
  ${respondTo.md`
    display: none;
  `}
`

const Link = styled.a`
  padding: 0;
  margin: 0;
  border: 8px;
  cursor: pointer;
  margin-right: 16px;
  ${respondTo.md`
    margin-right: 0;
  `}
`

const TextOut = styled.div`
  flex-grow: 1;
  padding: 0 64px;
  ${respondTo.md`
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    >*+* {
      margin-top: 16px;
    }
  `}
`

const Text = styled(Link)`
  font-family: Raleway, sans-serif;
  color: #757B75;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  padding: 0 30px 0 0px;
  ${respondTo.sm`
    padding: 0;
  `}
`

const Footer: React.FC = () => {
  return (
    <footer>
      <In>
        <SocialGroup>
          <Link href="https://twitter.com/fastswapdex" rel="noopener noreferrer" target="_blank">
            <img src={twit} alt="Twitter" />
          </Link>
          <Link href="https://web.telegram.org/#/im?p=%40fastswapdex" rel="noopener noreferrer" target="_blank">
            <img src={telg} alt="Telegram" />
          </Link>
        </SocialGroup>
        {/* <Launch to="/farms">Launch app</Launch> */}
        <Group>
          <Logo width={255} height={100} />
        </Group>
      </In>
      <TextOut>
        <Text>Terms of Service</Text>
        <Text>Privacy policy</Text>
        <Copy>FASTSWAP   @All rights reserverd</Copy>
      </TextOut>
    </footer>
  )
}

export default Footer

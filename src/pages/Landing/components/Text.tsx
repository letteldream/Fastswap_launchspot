import React from 'react'
import styled from 'styled-components'
import blocks from 'img/blocks.svg'
import respondTo from 'style/RespondTo'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  margin-top: 240px;
  margin-bottom: 100px;
  justify-content: center;

  ${respondTo.sm`
    margin-bottom: 77px;
    padding: 0 32px;
  `}
  @media (max-width: 1350px) {
    flex-direction: column;
    align-items: center;
  }
`
const Image = styled.img`
  @media (min-width: 1350px) {
    margin-left: 152px;
  }
  ${respondTo.sm`
    margin:0;
    width: 290px;
    height: 229px;
  `}
`

const TextOut = styled.div`
  // position: absolute;
  // right: 160px;
  // bottom: -130px;
  ${respondTo.sm`
    width: 100%;
    position: relative;
    right: 0;
    bottom: 0;
    top: -40px;
  `}
`

const Header = styled.p`
  font-weight: 600;
  font-size: 48px;
  line-height: 54px;
  color: #fff;
  font-family: Oswald, sans-serif;

  ${respondTo.sm`
    font-size: 36px;
    line-height: 44px;
    margin-bottom: 40px;
  `}
`

const Headerb = styled.p`
  font-weight: 600;
  font-size: 24px;
  line-height: 28px;
  color: #fff;
  font-family: Oswald, sans-serif;
  margin-top: 50px;

  ${respondTo.sm`
    font-size: 36px;
    line-height: 44px;
    margin-bottom: 40px;
  `}
`

const Sub = styled.p`
  margin-top: 25px;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.5px;
  color: #fff;
  font-family: Raleway;
  width: 533px;

  ${respondTo.sm`
    width: 100%;
    font-size: 18px;
    margin-top: 0;
  `}
`
// const Launch = styled(Link)`
//   padding: 16px 82px;
//   text-transform: uppercase;
//   font-size: 16px;
//   font-weight: 500;
//   background: #2ba55d;
//   color: #fcfcfc;
//   border-radius: 26px;
//   font-family: Oswald, sans-serif;
//   text-align: center;

//   ${respondTo.sm`
//     position: absolute;
//     top: -310px;
//     padding: 16px 32px;
//     width: 100%;   
//   `}
// `

const Text: React.FC = () => (
  <Wrapper>
    
    <TextOut>
      <Header>ABOUT US</Header>
      <Sub>Launch Spot by FastSwap is designed and built with our token holders in mind. We understand the hustle of building a fully functional and delightful DEX, Dapps, we are here to empower these projects and lower the barrier for investors.</Sub>
      <Headerb>WHY CHOOSE US</Headerb>
      <Sub>The fundamental flaws of existing launchpads is that acquiring enough tokens to participate in the ecosystem is prohibitive, and even if you do hold the tokens, you are not guaranteed an allocation spot. They are based on a first come first serve basis where automated bots can fill the whitelist spots in a matter of seconds. Launchspot is creating fair decentralized launches.</Sub>
    </TextOut>
    <Image src={blocks} alt="blocks" width={530} height={418} />
  </Wrapper>
)

export default Text

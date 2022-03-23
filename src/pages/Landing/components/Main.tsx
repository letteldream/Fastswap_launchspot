import React from 'react'
import { Button } from '@fastswap-uikit'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'

const Wrapper = styled.div`
  padding: 0 172px;
  margin-bottom: 74px;
  margin-top: 200px;
  display: flex;
  jusify-content: space-between;

  ${respondTo.sm`
    padding: 0 32px;
    margin-bottom: 52px;
    margin-top: 98px;
  `}
  ${respondTo.lg`
    padding: 0;
  `}
`

const TextOut = styled.div`
  flex-grow: 1;
  text-align: center;
  margin: 20px auto;
  ${respondTo.sm`
    >button:nth-of-type(2) {
      margin-top: 20px;
    }
  `}
`
const Header = styled.h1`
  font-weight: 500;
  font-size: 72px;
  line-height: 80px;
  color: #fff;
  font-family: Oswald, sans-serif;

  ${respondTo.lg`
    font-size: 60px;
    line-height: 68px;
    margin-bottom: 24px;
  `}
  ${respondTo.md`
    font-size: 40px;
    line-height: 48px;
    margin-bottom: 24px;
  `}
  ${respondTo.sm`
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 24px;
  `}
`
const Text = styled.p`
  font-size: 16px;
  line-height: 20px;
  color: #fff;
  margin-top: 20px;
  margin-bottom: 20px;
  font-family: Raleway, sans-serif;
  width: 480px;
  text-align: center;
  margin: 20px auto;
  @media (max-width: 767px) {
    display: none;
  }
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

const LText = styled.span`
  font-family: Oswald,sans-serif;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #39E47F, #24E7C3, #6FA8FD);
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
`

const Main: React.FC = () => {
  // const data = useGetStats()
  // const trade = data ? data['24h_total_volume'] : 0
  // const value = data ? data.total_value_locked : 0

  // const globalData: any = useGlobalData()
  // const liqudiity = globalData ? Number(globalData.totalLiquidityUSD).toFixed(3) : 0

  return (
    <Wrapper>
      <TextOut>
        <Header>WELCOME TO LAUNCH SPOT<br/>THE CROSS-CHAIN IDO PLATFORM</Header>
        <Text>
          Launch spot by FastSwap empowers crypto currency projects with the ability to distribute tokens and raise liquidity. 
          <br/>Stake your FAST, YFT & MVP to support & earn rewards.
        </Text>
        <TextOut>
          <LButton><LText>VIEW ALL PROJECTS</LText></LButton>
          <LButton><LText>APPLY FOR IDO</LText></LButton>
        </TextOut>
        <TextOut>
          <LButton><LText>BUY FAST ON FASTSWAP</LText></LButton>
        </TextOut>
      </TextOut>
    </Wrapper>
  )
}

export default Main

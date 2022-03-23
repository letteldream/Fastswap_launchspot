import React from 'react'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'

const Wrapper = styled.div`
  padding: 100px 172px;
  margin-bottom: 74px;
  margin-top: 130px;
  display: flex;
  jusify-content: space-between;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #39E47F, #24E7C3, #6FA8FD);
  

  ${respondTo.sm`
    padding: 0 32px;
    margin-bottom: 52px;
    margin-top: 98px;
  `}
`

const TextOut = styled.div`
  flex-grow: 1;
  text-align: center;
`
const Header = styled.h1`
  font-weight: 300;
  font-size: 34px;
  line-height: 40px;
  color: #000;
  font-family: Oswald, sans-serif;
  

  ${respondTo.sm`
    font-size: 36px;
    line-height: 44px;
    margin-bottom: 24px;
  `}
`

// const Text = styled.p`
//   font-size: 16px;
//   line-height: 20px;
//   color: #fff;
//   margin-top: 20px;
//   font-family: Raleway, sans-serif;
//   width: 480px;
//   text-align: center;
//   margin: 20px auto;
// `

const Cline: React.FC = () => {
  // const data = useGetStats()
  // const trade = data ? data['24h_total_volume'] : 0
  // const value = data ? data.total_value_locked : 0

  // const globalData: any = useGlobalData()
  // const liqudiity = globalData ? Number(globalData.totalLiquidityUSD).toFixed(3) : 0

  return (
    <Wrapper>
      <TextOut>
        <Header>Launch spot has found a solution to incentivize and reward all token holders in a way that is inclusive and with a low barrier to entry.</Header>
      </TextOut>
    </Wrapper>
  )
}

export default Cline

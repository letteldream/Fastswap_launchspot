import React from 'react'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'
import ArrowLeft from 'img/left.png'
import ProjectGardGallery from './ProjectGardGallery'

const Wrapper = styled.div`
  margin-bottom: 150px;
  margin-top: 107px;
  display: flex;
  jusify-content: space-between;

  ${respondTo.sm`
    padding: 0 32px;
    margin-bottom: 52px;
    margin-top: 98px;
  `}
`

const TextOut = styled.div`
  flex-grow: 1;
  text-align: center;
  margin: 20px auto;
  position: relative;
  width: 100%;
`
const Header = styled.h1`
  font-weight: 500;
  font-size: 48px;
  line-height: 54px;
  color: #fff;
  font-family: Oswald, sans-serif;

  ${respondTo.sm`
    font-size: 36px;
    line-height: 44px;
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
  text-align: center;
  margin: 20px auto;
`

const Textb = styled.p`
  font-size: 20px;
  line-height: 24px;
  color: #fff;
  margin-top: 20px;
  margin-bottom: 20px;
  font-family: Oswald, sans-serif;
  text-align: center;
  margin: 20px auto;
`

const LText = styled.span`
  font-family: Oswald,sans-serif;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #39E47F, #24E7C3, #6FA8FD);
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
`

const PrevButton = styled.div`
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 30px;
  ${respondTo.sm`
    left: -10px;
  `}
  transform: translateY(-50%);
`

const NextButton = styled.div`
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 30px;
  ${respondTo.sm`
    right: -10px;
  `}
  transform: translateY(-50%);
  >img {
    transform: rotate(180deg);
  }
`

const Body: React.FC = () => {
  // const data = useGetStats()
  // const trade = data ? data['24h_total_volume'] : 0
  // const value = data ? data.total_value_locked : 0

  // const globalData: any = useGlobalData()
  // const liqudiity = globalData ? Number(globalData.totalLiquidityUSD).toFixed(3) : 0

  return (
    <Wrapper>
      <TextOut>
        <PrevButton>
          <img src={ArrowLeft} alt=''/>
        </PrevButton>
        <NextButton>
          <img src={ArrowLeft} alt=''/>
        </NextButton>
        <Header>PROJECTS</Header>
        <Text>
          Currently, we have X projects open and successfully helped X team to launch their project in the past.
        </Text>

        <ProjectGardGallery />

        <TextOut>
          <Textb>
            Interested to launch your project?
            <br />
            <LText>Apply for IDO now</LText>
          </Textb>
        </TextOut>
      </TextOut>
    </Wrapper>
  )
}

export default Body

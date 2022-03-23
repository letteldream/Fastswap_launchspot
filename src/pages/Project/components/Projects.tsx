import React, { useState } from 'react'
import { Text } from '@fastswap-uikit'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'
import { AutoColumn } from '../../../components/Column'
import ProjectCardList from './ProjectCardList'

const Wrapper = styled.div`
  padding: 0 67px;
  margin-bottom: 74px;
  margin-top: 100px;
  display: flex;

  ${respondTo.sm`
    padding: 0 32px;
    margin-bottom: 52px;
  `}
  ${respondTo.md`
    margin-top: 24px;
  `}
  ${respondTo.lg`
    flex-direction: column;
  `}
`

const Tab = styled.div`
  // flex: 1;
`

const TabBody = styled.div`
  flex: 1;
`

const WrappedText = styled.div`
  border-bottom: 1px solid #757B75;
  ${respondTo.lg`
    border-bottom: 0px solid #757B75;
  `}
  padding-bottom: 5px;
  margin-top: 30px;
  cursor: pointer;
`

const GText = styled(Text) <any>`
  font-weight: 500;
  font-family: Oswald, sans-serif;
  font-size: 24px;
  ${({ active }) => active ? `background-image: linear-gradient(#97AEFF, #0EFFD4, #64F9A1);
                              -webkit-background-clip: text;
                              -webkit-text-fill-color: transparent;`
    :
    `color: #757B75;`}
    
  ${respondTo.md`
    font-size: 20px;
  `} 
  ${respondTo.sm`
    font-size: 16px;
  `} 
`

const MAutoColumn = styled(AutoColumn)`
  >div:first-of-type {
    ${respondTo.lg`
      display: none;
    `} 
  }
  ${respondTo.lg`
    display: flex;
    justify-content: center;
    >div {
      margin: 0 30px;
    }
  `}
  ${respondTo.sm`
    >div {
      margin: 0 10px;
    }
  `}
  ${respondTo.xs`
    >div {
      margin: 0 5px;
    }
  `}
`

const Projects: React.FC = () => {

  const [timeType, setTimeType] = useState(2)

  return (
    <Wrapper>
      <Tab>
        <MAutoColumn>
          <Text style={{ fontWeight: 500, fontFamily: 'Oswald, sans-serif', fontSize: "48px" }} color="#fff">PROJECTS</Text>
          <WrappedText>
            <GText onClick={() => setTimeType(2)} active={timeType === 2 ? 1 : 0}>OPEN NOW</GText>
          </WrappedText>
          <WrappedText>
            <GText onClick={() => setTimeType(0)} active={timeType === 0 ? 1 : 0}>COMING SOON</GText>
          </WrappedText>
          <WrappedText>
            <GText onClick={() => setTimeType(1)} active={timeType === 1 ? 1 : 0}>CLOSED</GText>
          </WrappedText>
        </MAutoColumn>
      </Tab>
      <TabBody>
        <ProjectCardList timeType={timeType} />
      </TabBody>
    </Wrapper>
  )
}

export default Projects

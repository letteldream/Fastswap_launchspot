import React from 'react'
import _ from 'lodash'
import { Button, Text, Card as UIKitCard } from '@fastswap-uikit'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import respondTo from 'style/RespondTo'
import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed } from 'components/Row'

import ProjectRow from './ProjectRow'

interface Props {
  projectData: Array<any>
}

const Wrapper = styled.div`
  padding: 0 63px;
  margin-bottom: 74px;
  margin-top: 28px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  jusify-content: space-between;

  ${respondTo.md`
    padding: 0 32px;
    margin-bottom: 52px;
    >div >div:nth-of-type(2) {
      display: none;
    }
  `}
`

const LButton = styled(Button)`
  border-radius: 8px;
  height: 48px;
  color: #192219;
  letter: 1.25px;
  background-image: linear-gradient(to right, #64F9A1, #0EFFD4, #97AEFF);
`

const BText = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  font-family: Oswald;
  color: #CECECE;
`

const Section = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  ${respondTo.sm`
  `}
`

const LUIKitCard = styled(UIKitCard)`
  background-color: #263126;
  margin: 2px;
  border-radius: 8px;
  padding-left: 30px;
  padding-right: 30px;
  ${respondTo.sm`

  `}
`

const Main: React.FC<Props> = ({ projectData }) => {
  console.log('projectData', projectData);
  // const data = useGetStats()
  const history = useHistory()
  return (
    <Wrapper>
      <AutoColumn style={{ width: '100%' }}>
        <RowBetween>
          <RowFixed>
            <Text style={{ fontWeight: 300, fontFamily: 'Oswald, sans-serif', fontSize: "34px" }} color="#CECECE">PROJECTS</Text>
          </RowFixed>
          <RowFixed>
            <LButton fontSize="16px" fontWeight="500" fontFamily='Oswald' onClick={() => history.push('/admin/projects/add')}>ADD</LButton>
          </RowFixed>
        </RowBetween>

        <LUIKitCard style={{ marginTop: '36px' }}>
          <div style={{ display: 'flex' }}>
            <AutoColumn style={{ width: '100%' }}>
              <Section>
                <AutoColumn style={{ flex: 1 }}>
                  <BText>Name</BText>
                </AutoColumn>
                <AutoColumn style={{ flex: 1 }}>
                  <BText>Visibility</BText>
                </AutoColumn>
                <AutoColumn style={{ flex: 1 }}>
                  <BText>Token</BText>
                </AutoColumn>
                <AutoColumn style={{ flex: 1 }}>
                  <BText>Swap Rate</BText>
                </AutoColumn>
                <AutoColumn style={{ flex: 1 }}>
                  <BText>CAP</BText>
                </AutoColumn>
                <AutoColumn style={{ flex: 1 }}>
                  <BText>Open (UTC)</BText>
                </AutoColumn>
                <AutoColumn style={{ flex: 1 }}>
                  <BText>Close (UTC)</BText>
                </AutoColumn>
              </Section>
            </AutoColumn>
          </div>
        </LUIKitCard>

        {_.map(projectData, (x, i) =>
          <ProjectRow key={i} {...x} />
        )}
      </AutoColumn>
    </Wrapper>
  )
}

export default Main

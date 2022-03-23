import React from 'react'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'
import {TierCard} from '../../../components/TierCard'

const Wrapper = styled.div`
  justify-content: space-around;
  display: flex;
  text-align: left;

  ${respondTo.md`
    flex-direction: column;
  `}
  ${respondTo.sm`
    width: 100%;
  `}

  ${respondTo.xss`

`}
`

const TierCardList: React.FC = () => {
  return (
    <Wrapper>
      {/* <TierCard />
      <TierCard />
      <TierCard /> */}
    </Wrapper>
)}

export default TierCardList

import React, { useState } from 'react'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'
import { IconButton, Text } from '@fastswap-uikit'
import { AutoColumn } from 'components/Column'
import { RowFixed, RowBetween } from 'components/Row'

import arrowtop from 'img/arrowtop.svg'

const Wrapper = styled.div`
  justify-content: space-around;
  display: block;
  text-align: left;

  ${respondTo.sm`
    width: 100%;
  `}

  ${respondTo.xss`

`}
`

const MText = styled(Text)`
  font-size: 34px;
  font-weight: 300;
  font-family: Oswald;
  color: #A0F0CE;
  margin: 5px;
`

const CText = styled(Text)`
  font-family: Raleway;
  font-size: 16px;
  font-weight: 400;
  color: #F8F8F8;
  margin: 5px;
`

const Icon = styled.img`
  width: 20px;
  height: 20px;
`

const LDivider = styled.div`
  // width: 80%;
  height: 1px;
  background: #A0F0CE;
  margin: 24px 0;
`

const FaqCard: React.FC = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <Wrapper>
      <AutoColumn style={{maxWidth: '900px'}}>
        <RowBetween>
          <RowFixed>
            <MText>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</MText>
          </RowFixed>
          <RowFixed>
            <IconButton onClick={()=>{setIsOpen(!isOpen)}} variant="text" title="Back">
              { isOpen &&
                <Icon src={arrowtop} alt="" />
              }
              { !isOpen &&
                <Icon style={{transform: 'rotate(180deg)'}} src={arrowtop} alt="" />
              }
            </IconButton>
          </RowFixed>
        </RowBetween>
        { isOpen &&
          <CText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lobortis cras risus risus adipiscing vel. Nunc, turpis et tortor sed quisque eget. Massa in ac egestas felis eget viverra dictum sed. Tempus scelerisque velit in sodales enim, facilisis ut consectetur.</CText>
        }
        <LDivider />
      </AutoColumn>
    </Wrapper>
)}

export default FaqCard

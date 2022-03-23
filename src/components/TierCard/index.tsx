import React from 'react'
import { Card as UIKitCard, CardBody, Text } from '@fastswap-uikit'
import { darken } from 'polished'
import { BigNumber } from 'ethers'
import styled from 'styled-components'
import Card from '../Card'
import { AutoColumn } from '../Column'
import { RowBetween } from '../Row'



export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.invertedContrast};
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.colors.invertedContrast)};
  }
`

export const TierKitCard = styled(UIKitCard)`
  cursor: pointer;
  border-radius: 24px;
  margin: 10px;
  width: 264px;
  height: auto;
  text-align: center;
  background: 
    linear-gradient(#192219, #192219) padding-box, /*this is your grey background*/
    linear-gradient(to bottom, #64F9A1, #97AEFF) border-box;
  border: 1px solid transparent;
  display:inline-block;
  &:hover {
    background: ${({ theme }) => darken(0.06, theme.colors.primaryDark)};
  }
  &:active {
    background: ${({ theme }) => darken(0.06, theme.colors.primaryDark)};
  }
`

const GText = styled(Text)`
  background-image: linear-gradient(#97AEFF, #0EFFD4, #64F9A1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

interface TierCardProps {
  id: number
  name: string
  fastPrice: string
  dukePrice: string
  onClick: () => void
}
export const TierCard: React.FC<TierCardProps> = ({ id, name, fastPrice, dukePrice, onClick }) => {

  const fast = fastPrice.length > 3 ? `${BigNumber.from(fastPrice).div(BigNumber.from(10).pow(18)).toNumber() / 1000}K` : fastPrice
  const duke = dukePrice.length > 3 ? `${BigNumber.from(dukePrice).div(BigNumber.from(10).pow(18)).toNumber() / 1000}K` : dukePrice

  return (
    <>
      <TierKitCard onClick={() => { onClick() }}>
        <CardBody style={{ padding: '32px 20px' }}>
          <AutoColumn gap="8px">
            <Text fontSize="10px" fontWeight='500' fontFamily='Raleway' color="#FCFCFC" style={{ lineHeight: '12px' }}>
              TIER {id + 1}
            </Text>
            <GText fontSize="48px" fontWeight='500' fontFamily='Oswald' color="#FCFCFC" style={{ lineHeight: '54px' }}>
              {name}
            </GText>
            <Text fontSize="14px" fontWeight='500' fontFamily='Oswald' color="#CECECE" style={{ lineHeight: '16px', marginTop: '16px' }}>
              Staking Requirement
            </Text>
            <Text fontSize="34px" fontWeight='300' fontFamily='Oswald' color="#FCFCFC" style={{ lineHeight: '40px' }}>
              {fast} FAST
            </Text>
            <Text fontSize="34px" fontWeight='300' fontFamily='Oswald' color="#FCFCFC" style={{ lineHeight: '40px' }}>
              {duke} DUKE
            </Text>
            <Text fontSize="16px" fontWeight='400' fontFamily='Raleway' color="#FCFCFC" style={{ lineHeight: '20px', marginTop: '16px' }}>
              Required stake 7 days before project opens
            </Text>
          </AutoColumn>
        </CardBody>
      </TierKitCard>
    </>
  )
}

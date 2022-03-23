import React, { useEffect, useState } from 'react'
import web3 from 'web3'
import { useHistory } from 'react-router-dom'
import { Card as UIKitCard, CardBody, Text } from '@fastswap-uikit'
import { darken } from 'polished'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'
import { useToken } from 'hooks/Tokens'
import comparefy from 'utils/comparefy'
import useWindowDimensions from 'hooks/useWindowDimensions'
import { tokens } from 'constants/token/tokens'
import { secondsToDhms } from 'utils/msTime'
import Card from '../Card'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'

import logo from '../../img/logo.png'
import globalIcon from '../../img/globalGroup.svg'
import twitterIcon from '../../img/twitterGroup.svg'
import mediumIcon from '../../img/mediumGroup.svg'
import telegramIcon from '../../img/telegramGroup.svg'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.invertedContrast};
  :hover {
    border: 1px solid ${({ theme }) => darken(0.06, theme.colors.invertedContrast)};
  }
`

const AvatarImage = styled.img`
  display: inline;
  margin: 0 auto;
  height: 100%;
  width: auto;
`

const WrappedAvatar = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  background-color: #eee;
  border: 1px solid #39E47F;
  margin-right: 15px;
`

const Section = styled.div`
  padding-top: 5px;
  display: flex;
  align-items: center;
  ${respondTo.sm`
    
  `}
`

const Link = styled.a`
  border-radius: 50%;
  padding: 4px;
  margin-right: 5px;
  cursor: pointer;
  background-color: #363936;
`

const LabelText = styled(Text)`
  font-weight: 500;
  display: flex;
  align-items: center;
  background: rgba(160, 240, 206, 0.2);
  font-size: 14px;
  font-family: Raleway;
  color: #9DD1B2;
  border-radius: 8px;
  padding: 3px;
  margin-right: 5px;
`

const GText = styled(Text)`
  background-image: linear-gradient(#97AEFF, #0EFFD4, #64F9A1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const WrappedProgress = styled.div`
  border-radius: 4px;
  background: #333A36;
  width: 100%;
  height: 8px;
`

const Progress = styled.div<any>`
  background-image: linear-gradient(to right, #64F9A1, #0EFFD4, #97AEFF);
  border-radius: 4px;
  width: ${({ value }) => value}%;
  height: 8px;
`

const LDivider = styled.div`
  ${respondTo.lg`
    display: none;
  `}
  width: 80%;
  height: 1px;
  background: #237745;
  margin: 24px 0;
`

const TimeText = styled(LabelText) <any>`
  padding: 5px 10px;
  background: ${({ timeType }) => {
    if (timeType === 0) return 'linear-gradient(180deg, rgba(100, 249, 161, 0.2) 0%, rgba(14, 255, 212, 0.2) 49.48%, rgba(151, 174, 255, 0.2) 100%);'
    if (timeType === 1) return 'rgba(241, 104, 104, 0.2)'
    return 'rgba(160, 240, 206, 0.2)'
  }};
  color: ${({ timeType }) => {
    if (timeType === 0) return '#9DD1B2'
    if (timeType === 1) return '#F16868'
    return '#9DD1B2'
  }};
  * {
    color: ${({ timeType }) => {
    if (timeType === 0) return '#9DD1B2'
    if (timeType === 1) return '#F16868'
    return '#9DD1B2'
  }};
  }
`

const BUIKitCard = styled(UIKitCard)`
  border-radius: 24px;
  ${respondTo.lg`
    min-width: auto;
  `}
  min-width: 850px;
`

const PUIKitCard = styled(UIKitCard)`
  min-width: 500px;
  ${respondTo.md`
    width: 100%;
    min-width: auto;
  `}
`

const MRowBetween = styled(RowBetween)`
  ${respondTo.md`
    align-items: flex-start;
    flex-direction: column;
  `}
`

interface ProjectCardProps {
  // showUnwrapped?: boolean
  _id?: string
  name?: string
  description?: string
  swapRate?: string
  tokenAddress?: string
  allocation: string
  open: string
  close: string
  website?: string
  medium?: string
  twitter?: string
  telegramGroup?: string
  swapTokens: string
}

interface ProjectCardProps1 {
  name?: string
  description?: string
  allocation: string
  website?: string
  medium?: string
  twitter?: string
  telegramGroup?: string
  swapTokens: string
  open: string
  close: string
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ _id, name, description, website, medium, twitter, telegramGroup, swapRate, allocation, tokenAddress, open, close, swapTokens }) => {
  const screenWidth = useWindowDimensions().width
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (screenWidth > 450)
      setIsMobile(false)
    else setIsMobile(true)
  }, [screenWidth])
  const token = useToken(tokenAddress)?.symbol
  const history = useHistory()
  const returnTimeString = () => {
    if (comparefy(new Date(parseInt(open) * 1000), new Date(parseInt(close) * 1000)) === 0) return 'Upcoming'
    if (comparefy(new Date(parseInt(open) * 1000), new Date(parseInt(close) * 1000)) === 1) return 'Closed'
    return 'Open'
  }
  const returnTimeAgo = () => {
    const date1 = new Date(parseInt(open) * 1000)
    const date2 = new Date(parseInt(close) * 1000)
    const distance = (date2.getTime() - date1.getTime()) / 1000
    if (distance < 60) return `${distance} seconds`
    if (distance < 3600) return `${Math.round(distance / 60)} minutes`
    if (distance < 3600 * 24) return `${Math.round(distance / 3600)} hours`
    if (distance < 3600 * 24 * 30) return `${Math.round(distance / 3600 / 24)} days`
    return `${Math.round(distance / 3600 / 24 / 30)} months`
  }
  return (
    <>
      <PUIKitCard style={{ backgroundColor: '#192219', margin: '10px', cursor: 'pointer' }} onClick={() => history.push(`/project/${_id}`)}>
        <CardBody>
          <AutoColumn gap="12px">
            <Section>
              <WrappedAvatar>
                <AvatarImage src={logo} alt="Fast logo" width={80} height={80} />
              </WrappedAvatar>
              <AutoColumn>
                <Text style={{ fontWeight: 400, fontFamily: 'Oswald, sans-serif' }} fontSize="24px" color="#fff">
                  {!isMobile && 'Project name:'} {name}
                </Text>
                <Section>
                  <Link href={website} rel="noopener noreferrer" target="_blank">
                    <img src={globalIcon} style={{ display: 'flex' }} width={16} height={16} alt="Global" />
                  </Link>
                  <Link href={twitter} rel="noopener noreferrer" target="_blank">
                    <img src={twitterIcon} style={{ display: 'flex' }} width={16} height={16} alt="Twitter" />
                  </Link>
                  <Link href={medium} rel="noopener noreferrer" target="_blank">
                    <img src={mediumIcon} style={{ display: 'flex' }} width={16} height={16} alt="Medium" />
                  </Link>
                  <Link href={telegramGroup} rel="noopener noreferrer" target="_blank">
                    <img src={telegramIcon} style={{ display: 'flex' }} width={16} height={16} alt="Telegram" />
                  </Link>
                </Section>
                <Section>
                  <TimeText timeType={comparefy(new Date(parseInt(open) * 1000), new Date(parseInt(close) * 1000))}>
                    <Text fontSize="12px" fontFamily="Raleway">⬤</Text> &nbsp;{returnTimeString()}
                  </TimeText>
                  {!isMobile &&
                    <Text style={{ textTransform: 'uppercase', fontWeight: 500 }} fontSize="14px" fontFamily="Raleway" color="#9DD1B2">
                      FAST / YFT / MVP
                    </Text>
                  }
                </Section>
              </AutoColumn>
            </Section>
            <Section>
              <Text fontSize="12px" fontWeight='400' fontFamily='Raleway' color="#F8F8F8">
                {description}
                <GText fontSize="12px" fontFamily='Raleway' color="#F8F8F8">
                  Learn more
                </GText>
              </Text>
            </Section>
            <Section>
              <AutoColumn style={{ flex: 1 }}>
                <Text fontSize="9px" fontFamily="Raleway" color="#CECECE">Swap rate</Text>
                <Text fontSize="14px" fontWeight='500' fontFamily="Oswald" color="#FCFCFC">{web3.utils.fromWei(swapRate ?? '')} {token} = 1 {tokens[parseInt(swapTokens)].symbol}</Text>
              </AutoColumn>
              <AutoColumn style={{ flex: 1 }}>
                <Text fontSize="9px" fontFamily="Raleway" color="#CECECE">Access Type</Text>
                <Text fontSize="14px" fontWeight='500' fontFamily="Oswald" color="#FCFCFC">Private</Text>
              </AutoColumn>
            </Section>
            <Section>
              <RowBetween>
                <RowFixed>
                  {returnTimeString() === 'Closed' && <Text fontSize="12px" color="#FCFCFC">Ended {new Date(parseInt(close) * 1000).getFullYear()}/{new Date(parseInt(close) * 1000).getMonth() + 1}/{new Date(parseInt(close) * 1000).getDate()} {new Date(parseInt(close) * 1000).getHours()}:{new Date(parseInt(close) * 1000).getMinutes()}:{new Date(parseInt(close) * 1000).getSeconds()}</Text>}
                  {returnTimeString() === 'Upcoming' && <Text fontSize="12px" color="#FCFCFC">Opens in {new Date(parseInt(open) * 1000).getFullYear()}/{new Date(parseInt(open) * 1000).getMonth() + 1}/{new Date(parseInt(open) * 1000).getDate()}</Text>}
                  {returnTimeString() === 'Open' && <Text fontSize="12px" color="#FCFCFC">Period : {returnTimeAgo()}</Text>}
                </RowFixed>
                <RowFixed>
                  <GText fontSize="14px">Allocation: {returnTimeString() === 'Closed' ? 100 : returnTimeString() === 'Upcoming' ? 0 : allocation}%</GText>
                </RowFixed>
              </RowBetween>
            </Section>
            <WrappedProgress>
              <Progress value={returnTimeString() === 'Closed' ? 100 : returnTimeString() === 'Upcoming' ? 0 : allocation} />
            </WrappedProgress>
            <Section>
              <RowBetween>
                <RowFixed>
                  <Text fontSize="10px" color="#FCFCFC">320.21 {tokens[parseInt(swapTokens)].symbol}</Text>
                </RowFixed>
                <RowFixed>
                  <Text fontSize="10px" color="#FCFCFC">{200000 * (returnTimeString() === 'Closed' ? 100 : returnTimeString() === 'Upcoming' ? 0 : parseInt(allocation)) / 100} /200000</Text>
                </RowFixed>
              </RowBetween>
            </Section>
          </AutoColumn>
        </CardBody>
      </PUIKitCard>
    </>
  )
}

export function ProjectCardDetail({ name, description, allocation, open, close, website, medium, twitter, telegramGroup, swapTokens
}: ProjectCardProps1) {
  const screenWidth = useWindowDimensions().width
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (screenWidth > 450)
      setIsMobile(false)
    else setIsMobile(true)
  }, [screenWidth])

  const returnTimeString = () => {
    if (comparefy(new Date(parseInt(open) * 1000), new Date(parseInt(close) * 1000)) === 0) return 'Upcoming'
    if (comparefy(new Date(parseInt(open) * 1000), new Date(parseInt(close) * 1000)) === 1) return 'Closed'
    return 'Open'
  }

  const returnTimeAgo = () => {
    const date1 = new Date(parseInt(open) * 1000)
    const date2 = new Date(parseInt(close) * 1000)
    const distance = (date2.getTime() - date1.getTime()) / 1000
    if (distance < 60) return `${distance} seconds`
    if (distance < 3600) return `${Math.round(distance / 60)} minutes`
    if (distance < 3600 * 24) return `${Math.round(distance / 3600)} hours`
    if (distance < 3600 * 24 * 30) return `${Math.round(distance / 3600 / 24)} days`
    return `${Math.round(distance / 3600 / 24 / 30)} months`
  }

  return (
    <>
      <BUIKitCard style={{ backgroundColor: '#192219', margin: '10px' }}>
        <CardBody>
          <AutoColumn gap="12px">
            <Section>
              <WrappedAvatar>
                <AvatarImage src={logo} alt="Fast logo" width={80} height={80} />
              </WrappedAvatar>
              <AutoColumn>
                <Text style={{ fontWeight: 400, fontFamily: 'Oswald, sans-serif' }} fontSize="24px" color="#fff">
                  {!isMobile && 'Project name:'} {name}
                </Text>
                <Section>
                  <Link href={website} rel="noopener noreferrer" target="_blank">
                    <img src={globalIcon} style={{ display: 'flex' }} width={16} height={16} alt="Global" />
                  </Link>
                  <Link href={medium} rel="noopener noreferrer" target="_blank">
                    <img src={twitterIcon} style={{ display: 'flex' }} width={16} height={16} alt="Twitter" />
                  </Link>
                  <Link href={twitter} rel="noopener noreferrer" target="_blank">
                    <img src={mediumIcon} style={{ display: 'flex' }} width={16} height={16} alt="Medium" />
                  </Link>
                  <Link href={telegramGroup} rel="noopener noreferrer" target="_blank">
                    <img src={telegramIcon} style={{ display: 'flex' }} width={16} height={16} alt="Telegram" />
                  </Link>
                </Section>
                <Section>
                  <TimeText timeType={comparefy(new Date(parseInt(open) * 1000), new Date(parseInt(close) * 1000))}>
                    <Text fontSize="12px" fontFamily="Raleway">⬤</Text> &nbsp;{returnTimeString()}
                  </TimeText>
                  {!isMobile &&
                    <Text style={{ textTransform: 'uppercase', fontWeight: 500 }} fontSize="14px" fontFamily="Raleway" color="#9DD1B2">
                      FAST / YFT / MVP
                    </Text>
                  }
                </Section>
              </AutoColumn>
            </Section>
            <Section>
              <Text fontSize="12px" fontWeight='400' fontFamily='Raleway' color="#CECECE">
                {description}
              </Text>
            </Section>
          </AutoColumn>
        </CardBody>
      </BUIKitCard>
      <BUIKitCard style={{ backgroundColor: '#192219', margin: '10px' }}>
        <CardBody>
          <AutoColumn gap="12px">
            <Section>
              <MRowBetween>
                <RowFixed>
                  <Text fontSize="20px" fontFamily="Oswald" color="#A0F0CE">OPEN</Text>
                </RowFixed>
                <RowFixed>
                  {returnTimeString() === 'Closed' && <Text fontSize="12px" color="#FCFCFC">Ended {new Date(parseInt(close) * 1000).getFullYear()}/{new Date(parseInt(close) * 1000).getMonth() + 1}/{new Date(parseInt(close) * 1000).getDate()} {new Date(parseInt(close) * 1000).getHours()}:{new Date(parseInt(close) * 1000).getMinutes()}:{new Date(parseInt(close) * 1000).getSeconds()}</Text>}
                  {returnTimeString() === 'Upcoming' && <Text fontSize="12px" color="#FCFCFC">Opens in {new Date(parseInt(open) * 1000).getFullYear()}/{new Date(parseInt(open) * 1000).getMonth() + 1}/{new Date(parseInt(open) * 1000).getDate()}</Text>}
                  {returnTimeString() === 'Open' && <Text fontSize="12px" color="#FCFCFC">Open {returnTimeAgo()} ago</Text>}
                </RowFixed>
              </MRowBetween>
            </Section>
            <WrappedProgress>
              <Progress value={returnTimeString() === 'Closed' ? 100 : returnTimeString() === 'Upcoming' ? 0 : allocation} />
            </WrappedProgress>
            <Section>
              <RowBetween>
                <RowFixed>
                  <Text fontSize="10px" color="#FCFCFC">Total swapped: 320.21 {tokens[parseInt(swapTokens)]?.symbol}</Text>
                </RowFixed>
                <RowFixed>
                  <Text fontSize="10px" color="#FCFCFC">allocation: {returnTimeString() === 'Closed' ? 100 : returnTimeString() === 'Upcoming' ? 0 : allocation}%</Text>
                </RowFixed>
              </RowBetween>
            </Section>
            {returnTimeString() === 'Open' &&
              <Section>
                <RowBetween>
                  <RowFixed>
                    <Text fontSize="14px" fontFamily="Oswald" color="#A0F0CE">CLOSES IN</Text>
                  </RowFixed>
                  <LDivider />
                  <RowFixed>
                    <Text fontSize="14px" color="#FCFCFC">{secondsToDhms(new Date(parseInt(close) * 1000), new Date()).dDisplay}d {secondsToDhms(new Date(parseInt(close) * 1000), new Date()).hDisplay}h {secondsToDhms(new Date(parseInt(close) * 1000), new Date()).mDisplay}m {secondsToDhms(new Date(parseInt(close) * 1000), new Date()).sDisplay}s</Text>
                  </RowFixed>
                </RowBetween>
              </Section>
            }
          </AutoColumn>
        </CardBody>
      </BUIKitCard>
    </>
  )
}
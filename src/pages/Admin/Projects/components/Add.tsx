import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import web3 from 'web3'
import { Box, Button, IconButton, Text, Input } from '@fastswap-uikit'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'
import useGlobalData from 'hooks/useGlobalData'
import { useProjectData } from 'state/projects/hooks'
import { toast } from 'react-toastify'
import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed } from 'components/Row'
import calendar from 'img/calendar.svg'
import backbt from 'img/backbt.svg'
import { useHistory } from 'react-router-dom'
import useWindowDimensions from 'hooks/useWindowDimensions'
import zeroPad from 'utils/zeroPad'
import { tokens } from 'constants/token/tokens'
import Header from './Header'

const rx_live = /^[0-9]*[.,]?[0-9]*$/
const Wrapper = styled.div`
  padding: 0 63px;
  margin-bottom: 74px;
  margin-top: 28px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  jusify-content: space-between;
  >div { width: 100%; }

  ${respondTo.md`
    padding: 0 32px;
    margin-bottom: 52px;
  `}
`

const LButton = styled(Button)`
  border-radius: 8px;
  height: 48px;
  color: #192219;
  letter: 1.25px;
  background-image: linear-gradient(to right, #64F9A1, #0EFFD4, #97AEFF);
  font-family: Oswald;
  font-weight: 500;
  font-size: 16px;
`

const GButton = styled(Button)`
  height: 48px;
  color: #192219;
  letter: 1.25px;
  background: 
    linear-gradient(#192219, #192219) padding-box, /*this is your grey background*/
    linear-gradient(to bottom, #64F9A1, #97AEFF) border-box;
  border: 1px solid transparent;
  display:inline-block;
  border-radius: 8px;
  margin-right: 10px;
`

const LText = styled.span`
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), linear-gradient(101deg, #39E47F, #24E7C3, #6FA8FD);
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  font-family: Oswald;
  font-weight: 500;
  font-size: 16px;
`

const CText = styled(Text)`
  font-family: Oswald, sans-serif;
  color: #F8F8F8;
`

const Section = styled.div`
  display: flex;
  align-items: stretch;
  ${respondTo.sm`
    
  `}
`

const Tab = styled.div`
  background: #263126;
  min-width: 400px;
  border-radius: 8px;
  padding: 24px;
  flex: 1;
  ${respondTo.lg`
    min-width: auto;
  `}
`

const TabBody = styled.div`
  background: #263126;
  border-radius: 8px;
  padding: 24px;
  flex: 2;
  ${respondTo.md`
    >div {
      flex-direction: column !important;
    }
  `}
`

const Group = styled.div`
  margin: 5px;
  display: flex;
  align-items: center;
  padding: 16px;
  background: 
    linear-gradient(#192219, #192219) padding-box, /*this is your grey background*/
    linear-gradient(to bottom, #64F9A1, #97AEFF) border-box;
  border: 1px solid transparent;
  display:inline-block;
  border-radius: 8px;
  min-width: 360px;
  ${respondTo.md`
    min-width: auto;
  `}
`

const SGroup = styled.div<any>`
  margin: 5px;
  display: flex;
  flex: 1;
  align-items: center;
  padding: 16px;
  background: ${({ hideborder }) => hideborder ? 'transparent' : 'linear-gradient(#192219, #192219) padding-box, linear-gradient(to bottom, #64F9A1, #97AEFF) border-box'};
  border: 1px solid transparent;
  display:inline-block;
  border-radius: 8px;
  min-width: 150px;
  ${respondTo.xl`
    min-width: auto;
  `}
`

const Icon = styled.img`
  width: 32px;
  height: 32px;
`

const MRowFixed = styled(RowFixed)`
  width: 100%;
`

const InputField = styled(Input) <any>`
  font-family: ${({ isH1 }) => isH1 ? 'Oswald' : 'Raleway'};
  font-size: ${({ isH1 }) => isH1 ? 24 : 16}px;
  font-weight: ${({ isH1 }) => isH1 ? 500 : 400};
  color: #FCFCFC !important;
  background: transparent;
  box-shadow: unset !important;
  padding: 0;
  border-radius: 0;
  &::placeholder {
    color: grey;
  }
  &:disabled {
    background: transparent;
    color: grey !important;
  }
`

const BSection = styled(Section)`
  @media (max-width: 1550px) {
    flex-direction: column;
    >div {
      width: -webkit-fill-available;
    }
  }
`

const CalendarButton = styled(IconButton)`
  position: relative;
  input {
    position: absolute;
    caret-color: transparent;
    cursor: pointer;
    max-width: 30px;
    color: transparent;
    background: transparent;
    outline: none !important;
    border: none !important;
    &::-webkit-calendar-picker-indicator {
      width: 30px;
      height: 30px;
      cursor: pointer;
      margin:0;
      padding: 0;
      position: absolute;
      right: 50%;
      transform: translateX(50%);
      opacity: 0;
    }
  }
  &:hover {
    opacity: 1 !important;
  }
`

const TierSelect = styled.select<any>`
  margin-top: 16px;
  font-family: ${({ isH1 }) => isH1 ? 'Oswald' : 'Raleway'};
  font-size: ${({ isH1 }) => isH1 ? 24 : 16}px;
  font-weight: ${({ isH1 }) => isH1 ? 500 : 400};
  color: #FCFCFC !important;
  background: transparent;
  box-shadow: unset !important;
  padding: 0;
  border-radius: 0;
  border: none;
  outline: none;
  width: 100%;
  &::placeholder {
    color: grey;
  }
  >option {
    background: white;
    color: black;
  }
`

const AddressList = styled(Box)`
  color: white;
`

interface Props {
  match: any
}

const Add: React.FC<Props> = ({ match }) => {
  useGlobalData()
  const projectData = useProjectData()
  const history = useHistory()
  const decodedData = { ...projectData.filter(x => x._id === match.params.pro_id)[0] }
  const { visibility } = decodedData
  const [projectInfo, setProjectInfo] = useState(() => {
    const { name, description, website, medium, twitter, telegramGroup } = decodedData
    const tmpProject = { name, description, website, medium, twitter, telegramGroup }
    return (projectData && projectData.length > 0 && match.params.pro_id) ? tmpProject : {
      'name': '',
      'description': '',
      'website': '',
      'medium': '',
      'twitter': '',
      'telegramGroup': '',
    }
  })
  const [poolInfo, setPoolInfo] = useState(() => {
    const { open, close, swapTokens, swapRate, softcap, hardcap, addressForList, addressList, fastAmount, dukeAmount, allocation } = decodedData
    const tmpPool = { open, close, swapTokens, swapRate, softcap, hardcap, addressForList, addressList, fastAmount, dukeAmount, allocation }
    if (projectData && projectData.length > 0 && match.params.pro_id) {
      const openDate = new Date(parseInt(decodedData.open) * 1000)
      const closeDate = new Date(parseInt(decodedData.close) * 1000)
      tmpPool.swapRate = web3.utils.fromWei(decodedData.swapRate)
      tmpPool.softcap = web3.utils.fromWei(decodedData.softcap)
      tmpPool.hardcap = web3.utils.fromWei(decodedData.hardcap)
      tmpPool.open = `${zeroPad(openDate.getUTCMonth() + 1)}/${zeroPad(openDate.getUTCDate())}/${zeroPad(openDate.getUTCFullYear())}, ${zeroPad(openDate.getUTCHours())}:${zeroPad(openDate.getUTCMinutes())}:${zeroPad(openDate.getUTCSeconds())} UTC`
      tmpPool.close = `${zeroPad(closeDate.getUTCMonth() + 1)}/${zeroPad(closeDate.getUTCDate())}/${zeroPad(closeDate.getUTCFullYear())}, ${zeroPad(closeDate.getUTCHours())}:${zeroPad(closeDate.getUTCMinutes())}:${zeroPad(closeDate.getUTCSeconds())} UTC`
      tmpPool.fastAmount = decodedData.fastAmount.map((fast: string) => web3.utils.fromWei(fast))
      tmpPool.dukeAmount = decodedData.dukeAmount.map((duke: string) => web3.utils.fromWei(duke))
    }
    return (projectData && projectData.length > 0 && match.params.pro_id) ? tmpPool : {
      'open': `${zeroPad(new Date().getUTCMonth() + 1)}/${zeroPad(new Date().getUTCDate())}/${zeroPad(new Date().getUTCFullYear())}, ${zeroPad(new Date().getUTCHours())}:${zeroPad(new Date().getUTCMinutes())}:${zeroPad(new Date().getUTCSeconds())} UTC`,
      'close': `${zeroPad(new Date().getUTCMonth() + 1)}/${zeroPad(new Date().getUTCDate())}/${zeroPad(new Date().getUTCFullYear())}, ${zeroPad(new Date().getUTCHours())}:${zeroPad(new Date().getUTCMinutes())}:${zeroPad(new Date().getUTCSeconds())} UTC`,
      'swapTokens': '0',
      'swapRate': '',
      'softcap': '',
      'hardcap': '',
      'addressForList': '',
      'addressList': [],
      'fastAmount': ['0', '50000', '100000', '300000', '600000'],
      'dukeAmount': ['0', '500000000', '1000000000', '3000000000', '6000000000'],
      'allocation': [10, 10, 15, 25, 40],
    }
  })
  const [tokenInfo, setTokenInfo] = useState(() => {
    const { symbol, totalSupply, contractAddress, tokenAddress } = decodedData
    const tmpToken = { symbol, totalSupply, contractAddress, tokenAddress }
    return (projectData && projectData.length > 0 && match.params.pro_id) ? tmpToken : {
      'symbol': '',
      'totalSupply': '',
      'contractAddress': '',
      'tokenAddress': ''
    }
  })
  const [, openDatePicker1] = useState(false)
  const [, openDatePicker2] = useState(false)
  const screenWidth = useWindowDimensions().width
  const [isMobile, setIsMobile] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [tierLevel, setTierLevel] = useState(0);

  useEffect(() => {
    if (screenWidth > 640)
      setIsMobile(false)
    else setIsMobile(true)
  }, [screenWidth])

  const isValid = () => {
    return projectInfo.name && projectInfo.description && projectInfo.website && projectInfo.medium && projectInfo.twitter && projectInfo.telegramGroup &&
      poolInfo.swapRate && poolInfo.softcap && poolInfo.hardcap && tokenInfo.symbol && tokenInfo.totalSupply && tokenInfo.tokenAddress
  }

  const handleSave = () => {
    if (isValid()) {
      const tmpPool = { ...poolInfo }
      tmpPool.swapRate = web3.utils.toWei(poolInfo.swapRate)
      tmpPool.open = new Date(poolInfo.open).getTime() / 1000
      tmpPool.close = new Date(poolInfo.close).getTime() / 1000
      tmpPool.softcap = web3.utils.toWei(poolInfo.softcap)
      tmpPool.hardcap = web3.utils.toWei(poolInfo.hardcap)
      tmpPool.fastAmount = poolInfo.fastAmount.map((fast: string) => web3.utils.toWei(fast))
      tmpPool.dukeAmount = poolInfo.dukeAmount.map((duke: string) => web3.utils.toWei(duke))
      axios.post('http://localhost:3001/api/projectController/project', { ...tmpPool, ...projectInfo, ...tokenInfo })
        .then((res) => {
          if (res.data.success) {
            toast.success("Saved as draft", {
              theme: 'colored'
            })
            history.push(`/admin/projects`)
          }
          else toast.error('failed to check', {
            theme: 'colored'
          })
        })
    } else {
      toast.warning('Input the fields correct', {
        theme: 'colored'
      })
    }
  }

  const handleUpdate = () => {
    if (isValid()) {
      const tmpPool = { ...poolInfo }
      tmpPool.swapRate = web3.utils.toWei(poolInfo.swapRate)
      tmpPool.open = new Date(poolInfo.open).getTime() / 1000
      tmpPool.close = new Date(poolInfo.close).getTime() / 1000
      tmpPool.softcap = web3.utils.toWei(poolInfo.softcap)
      tmpPool.hardcap = web3.utils.toWei(poolInfo.hardcap)
      tmpPool.fastAmount = poolInfo.fastAmount.map((fast: string) => web3.utils.toWei(fast))
      tmpPool.dukeAmount = poolInfo.dukeAmount.map((duke: string) => web3.utils.toWei(duke))
      setIsUpdating(true)
      axios.post(`http://localhost:3001/api/projectController/doUpdateProject/${match.params.pro_id}`, { ...tmpPool, ...projectInfo, ...tokenInfo })
        .then((res) => {
          setIsUpdating(false)
          if (res.data.success) {
            toast.success("Updated", {
              theme: 'colored'
            })
          }
          else toast.error('failed to check', {
            theme: 'colored'
          })
        })
    } else {
      toast.warning('Input the fields correct ', {
        theme: 'colored'
      })
    }
  }

  const handleDelete = () => {
    if (match.params.pro_id) {
      axios.post(`http://localhost:3001/api/projectController/delete/${match.params.pro_id}`)
        .then((res) => {
          if (res.data.success) {
            history.push('/admin/projects')
            toast.success('Successfully deleted', {
              theme: 'colored'
            })
          }
          else toast.error('failed to check', {
            theme: 'colored'
          })
        })
    }
  }

  const handlePublish = () => {
    if (isValid()) {
      const tmpPool = { ...poolInfo }
      tmpPool.swapRate = web3.utils.toWei(poolInfo.swapRate)
      tmpPool.open = new Date(poolInfo.open).getTime() / 1000
      tmpPool.close = new Date(poolInfo.close).getTime() / 1000
      tmpPool.softcap = web3.utils.toWei(poolInfo.softcap)
      tmpPool.hardcap = web3.utils.toWei(poolInfo.hardcap)
      tmpPool.fastAmount = poolInfo.fastAmount.map((fast: string) => web3.utils.toWei(fast))
      tmpPool.dukeAmount = poolInfo.dukeAmount.map((duke: string) => web3.utils.toWei(duke))

      setIsPublishing(true);
      if (match.params.pro_id) {
        axios.post(`http://localhost:3001/api/projectController/publish/${match.params.pro_id}`, { ...tmpPool, ...projectInfo, ...tokenInfo })
          .then((res) => {
            setIsPublishing(false);
            if (res.data.success) {
              history.push('/admin/projects')
              toast.success('Successfully published', {
                theme: 'colored'
              })
            }
            else toast.error('failed to check', {
              theme: 'colored'
            })
          })
      }
      else {
        axios.post(`http://localhost:3001/api/projectController/publish/direct`, { ...tmpPool, ...projectInfo, ...tokenInfo })
          .then((res) => {
            setIsPublishing(false);
            if (res.data.success) {
              history.push('/admin/projects')
              toast.success('Successfully published', {
                theme: 'colored'
              })
            }
            else toast.error('failed to check', {
              theme: 'colored'
            })
          })
      }
    } else {
      toast.warning('Input the fields correct', {
        theme: 'colored'
      })
    }
  }

  const handleChangeOpenTime = (x: any) => {
    const xDate = new Date(x)
    setPoolInfo(prev => {
      const tmp = { ...prev }
      tmp.open = `${zeroPad(xDate.getUTCMonth() + 1)}/${zeroPad(xDate.getUTCDate())}/${zeroPad(xDate.getUTCFullYear())}, ${zeroPad(xDate.getUTCHours())}:${zeroPad(xDate.getUTCMinutes())}:${zeroPad(xDate.getUTCSeconds())} UTC`
      return tmp
    })
    openDatePicker1(false)
  }

  const handleChangeCloseTime = (x: any) => {
    const xDate = new Date(x)
    setPoolInfo(prev => {
      const tmp = { ...prev }
      tmp.close = `${zeroPad(xDate.getUTCMonth() + 1)}/${zeroPad(xDate.getUTCDate())}/${zeroPad(xDate.getUTCFullYear())}, ${zeroPad(xDate.getUTCHours())}:${zeroPad(xDate.getUTCMinutes())}:${zeroPad(xDate.getUTCSeconds())} UTC`
      return tmp
    })
    openDatePicker2(false)
  }

  return (
    <Box style={{ backgroundColor: '#192219', width: '100%' }}>
      <Header />
      <Wrapper>
        <AutoColumn>
          <RowBetween>
            <RowFixed>
              <IconButton variant="text" title="Back" onClick={() => history.push('/admin/projects')}>
                <Icon src={backbt} alt="" />
              </IconButton>
              {!isMobile &&
                <Text style={{ fontWeight: 300, fontFamily: 'Oswald, sans-serif', fontSize: "34px" }} color="#CECECE">{match.params.pro_id ? 'EDIT ' : 'ADD '}A PROJECT</Text>
              }
            </RowFixed>
            <RowFixed>
              {!match.params.pro_id && <GButton onClick={handleSave} disabled={isPublishing} isLoading={isPublishing} ><LText>SAVE</LText></GButton>}
              {match.params.pro_id && <GButton disabled={visibility === 'Drafte'} onClick={handleDelete}><LText>DELETE</LText></GButton>}
              {match.params.pro_id && <GButton disabled={visibility !== 'Drafted' || isUpdating} onClick={handleUpdate} isLoading={isUpdating}><LText>UPDATE</LText></GButton>}
              <LButton onClick={handlePublish} disabled={isPublishing || visibility === 'Published'} isLoading={isPublishing} >
                {visibility === 'Published' ? "PUBLISHED" : "PUBLISH"}
              </LButton>
            </RowFixed>
          </RowBetween>
          <BSection style={{ marginTop: '36px' }}>
            <Tab style={{ height: '100%' }}>
              <AutoColumn>
                <CText style={{ fontWeight: 500, fontSize: "20px" }}>Project Info</CText>
                <Group>
                  <AutoColumn style={{ width: '100%' }}>
                    <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Project name</CText>
                    <RowBetween>
                      <RowFixed>
                        <InputField isH1 color="#FCFCFC" placeholder='SUN Op' value={match.params.pro_id && projectInfo.name}
                          onChange={(e) => setProjectInfo(prev => { const tmp = { ...prev }; tmp.name = e.target.value; return tmp })}
                        />
                      </RowFixed>
                    </RowBetween>
                  </AutoColumn>
                </Group>
                <Group>
                  <AutoColumn style={{ width: '100%' }}>
                    <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Description</CText>
                    <RowBetween>
                      <RowFixed>
                        <InputField color="#FCFCFC" placeholder='lorem' value={match.params.pro_id && projectInfo.description}
                          onChange={(e) => setProjectInfo(prev => { const tmp = { ...prev }; tmp.description = e.target.value; return tmp })}
                          required />
                      </RowFixed>
                    </RowBetween>
                  </AutoColumn>
                </Group>
                <Group>
                  <AutoColumn style={{ width: '100%' }}>
                    <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Website</CText>
                    <RowBetween>
                      <RowFixed>
                        <InputField color="#FCFCFC" placeholder='https://' value={match.params.pro_id && projectInfo.website}
                          onChange={(e) => setProjectInfo(prev => { const tmp = { ...prev }; tmp.website = e.target.value; return tmp })}
                          required />
                      </RowFixed>
                    </RowBetween>
                  </AutoColumn>
                </Group>
                <Group>
                  <AutoColumn style={{ width: '100%' }}>
                    <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Medium</CText>
                    <RowBetween>
                      <RowFixed>
                        <InputField color="#FCFCFC" placeholder='xxx' value={match.params.pro_id && projectInfo.medium}
                          onChange={(e) => setProjectInfo(prev => { const tmp = { ...prev }; tmp.medium = e.target.value; return tmp })}
                          required />
                      </RowFixed>
                    </RowBetween>
                  </AutoColumn>
                </Group>
                <Group>
                  <AutoColumn style={{ width: '100%' }}>
                    <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Twitter</CText>
                    <RowBetween>
                      <RowFixed>
                        <InputField color="#FCFCFC" placeholder='xxx' value={match.params.pro_id && projectInfo.twitter}
                          onChange={(e) => setProjectInfo(prev => { const tmp = { ...prev }; tmp.twitter = e.target.value; return tmp })}
                          required />
                      </RowFixed>
                    </RowBetween>
                  </AutoColumn>
                </Group>
                <Group>
                  <AutoColumn style={{ width: '100%' }}>
                    <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Telegram group</CText>
                    <RowBetween>
                      <RowFixed>
                        <InputField color="#FCFCFC" placeholder='xxx' value={match.params.pro_id && projectInfo.telegramGroup}
                          onChange={(e) => setProjectInfo(prev => { const tmp = { ...prev }; tmp.telegramGroup = e.target.value; return tmp })}
                          required />
                      </RowFixed>
                    </RowBetween>
                  </AutoColumn>
                </Group>
              </AutoColumn>
            </Tab>
            <TabBody style={{ height: '100%', background: 'none' }}>
              <AutoColumn>
                <CText style={{ fontWeight: 500, fontSize: "20px" }}>Pool Detail</CText>
                <BSection>
                  <AutoColumn>
                    <Group>
                      <AutoColumn style={{ width: '100%' }}>
                        <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Open</CText>
                        <RowBetween>
                          <RowFixed flex={1}>
                            <InputField isH1 color="#FCFCFC" placeholder='08/22/2021, 08:00:00 UTC' value={poolInfo.open}
                              onChange={(e) => handleChangeOpenTime(e.target.value)}
                              required />
                          </RowFixed>
                          <RowFixed>
                            <CalendarButton variant="text" title="Calendar" onClick={() => openDatePicker1(true)}>
                              <Icon src={calendar} alt="" />
                              <input type='datetime-local' onChange={(e) => handleChangeOpenTime(e.target.value)} />
                            </CalendarButton>
                          </RowFixed>
                        </RowBetween>
                      </AutoColumn>
                    </Group>
                    <Section>
                      <SGroup>
                        <AutoColumn style={{ width: '100%' }}>
                          <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Swap Token</CText>
                          <RowBetween>
                            <RowFixed style={{ width: '100%' }}>
                              <TierSelect value={poolInfo.swapTokens} onChange={(e) => setPoolInfo(prev => { const tmp = { ...prev }; tmp.swapTokens = e.target.value; return tmp })}>
                                {tokens.map((each, i) =>
                                  <option value={i}>{each.symbol}</option>
                                )}
                              </TierSelect>
                            </RowFixed>
                          </RowBetween>
                        </AutoColumn>
                      </SGroup>
                      <SGroup>
                        <AutoColumn style={{ width: '100%' }}>
                          <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Swap rate, 1 {tokens[parseInt(poolInfo.swapTokens)].symbol} =</CText>
                          <RowBetween>
                            <RowFixed>
                              <InputField pattern="^[0-9]*[.,]?[0-9]*$" inputMode='decimal' color="#FCFCFC" placeholder='25' value={poolInfo.swapRate}
                                onChange={(e) => rx_live.test(e.target.value) && setPoolInfo(prev => { const tmp = { ...prev }; tmp.swapRate = e.target.value; return tmp })}
                                required />
                            </RowFixed>
                          </RowBetween>
                        </AutoColumn>
                      </SGroup>
                      <SGroup>
                        <AutoColumn style={{ width: '100%' }}>
                          <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Softcap</CText>
                          <RowBetween>
                            <RowFixed>
                              <InputField pattern="^[0-9]*[.,]?[0-9]*$" type='text' inputMode='decimal' color="#FCFCFC" placeholder='20' value={poolInfo.softcap}
                                onChange={(e) => rx_live.test(e.target.value) && setPoolInfo(prev => { const tmp = { ...prev }; tmp.softcap = e.target.value; return tmp })}
                                required />
                            </RowFixed>
                          </RowBetween>
                        </AutoColumn>
                      </SGroup>
                      <SGroup>
                        <AutoColumn style={{ width: '100%' }}>
                          <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Hardcap</CText>
                          <RowBetween>
                            <RowFixed>
                              <InputField pattern="^[0-9]*[.,]?[0-9]*$" type='text' inputMode='decimal' color="#FCFCFC" placeholder='30' value={poolInfo.hardcap}
                                onChange={(e) => rx_live.test(e.target.value) && setPoolInfo(prev => { const tmp = { ...prev }; tmp.hardcap = e.target.value; return tmp })}
                                required />
                            </RowFixed>
                          </RowBetween>
                        </AutoColumn>
                      </SGroup>
                    </Section>
                  </AutoColumn>
                  <AutoColumn>
                    <Group>
                      <AutoColumn style={{ width: '100%' }}>
                        <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Close</CText>
                        <RowBetween>
                          <RowFixed flex={1}>
                            <InputField isH1 color="#FCFCFC" placeholder='08/22/2021, 08:00:00 UTC' value={poolInfo.close}
                              onChange={(e) => handleChangeCloseTime(e.target.value)}
                              required />
                          </RowFixed>
                          <RowFixed>
                            <CalendarButton variant="text" title="Calendar" onClick={() => openDatePicker2(true)}>
                              <Icon src={calendar} alt="" />
                              <input type='datetime-local' onChange={(e) => handleChangeCloseTime(e.target.value)} />
                            </CalendarButton>
                          </RowFixed>
                        </RowBetween>
                      </AutoColumn>
                    </Group>
                    <Group>
                      <Section>
                        <AutoColumn style={{ width: '100%' }}>
                          <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Tier</CText>
                          <RowBetween>
                            <RowFixed style={{ width: '100%' }}>
                              <TierSelect value={tierLevel} onChange={(e) => {
                                setTierLevel(parseInt(e.target.value))
                              }
                              }>
                                <option value='0'>Tier 1</option>
                                <option value='1'>Tier 2</option>
                                <option value='2'>Tier 3</option>
                                <option value='3'>Tier 4</option>
                                <option value='4'>Tier 5</option>
                              </TierSelect>
                            </RowFixed>
                          </RowBetween>
                        </AutoColumn>
                      </Section>
                    </Group>
                  </AutoColumn>
                </BSection>
                <BSection>
                  <SGroup style={{ justifyContent: 'space-between', display: 'flex' }}>
                    <AutoColumn style={{ width: '100%', flex: '1' }}>
                      <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Fast amount</CText>
                      <RowBetween>
                        <RowFixed style={{ width: '100%' }}>
                          <InputField type='text' color="#FCFCFC" style={{ width: '100%' }} value={poolInfo.fastAmount[tierLevel]}
                            onChange={(e) => setPoolInfo(prev => {
                              const tmp = { ...prev };
                              const tmpArr = [...tmp.fastAmount]
                              tmpArr[tierLevel] = e.target.value;
                              tmp.fastAmount = tmpArr;
                              return tmp
                            })}
                            required />
                        </RowFixed>
                      </RowBetween>
                    </AutoColumn>
                  </SGroup>
                  <SGroup style={{ justifyContent: 'space-between', display: 'flex' }}>
                    <AutoColumn style={{ width: '100%', flex: '1' }}>
                      <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Duke amount</CText>
                      <RowBetween>
                        <RowFixed style={{ width: '100%' }}>
                          <InputField type='text' color="#FCFCFC" style={{ width: '100%' }} value={poolInfo.dukeAmount[tierLevel]}
                            onChange={(e) => setPoolInfo(prev => {
                              const tmp = { ...prev };
                              const tmpArr = [...tmp.dukeAmount];
                              tmpArr[tierLevel] = e.target.value;
                              tmp.dukeAmount = tmpArr;
                              return tmp
                            })}
                            required />
                        </RowFixed>
                      </RowBetween>
                    </AutoColumn>
                  </SGroup>
                  <SGroup style={{ justifyContent: 'space-between', display: 'flex' }}>
                    <AutoColumn style={{ width: '100%', flex: '1' }}>
                      <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>% of allocation</CText>
                      <RowBetween>
                        <RowFixed style={{ width: '100%' }}>
                          <InputField type='number' pattern="^[0-9]*[.,]?[0-9]*$" inputMode='decimal' color="#FCFCFC" style={{ width: '100%' }} value={poolInfo.allocation[tierLevel]}
                            onChange={(e) => rx_live.test(e.target.value) && setPoolInfo(prev => {
                              const tmp = { ...prev };
                              const tmpArr = [...tmp.allocation];
                              tmpArr[tierLevel] = e.target.value;
                              tmp.allocation = tmpArr;
                              return tmp
                            })}
                            required />
                        </RowFixed>
                      </RowBetween>
                    </AutoColumn>
                  </SGroup>
                </BSection>
                {!tierLevel &&
                  <>
                    <BSection>
                      <SGroup style={{ justifyContent: 'space-between', display: 'flex' }}>
                        <AutoColumn style={{ width: '100%', flex: '1' }}>
                          <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Whitelist Members</CText>
                          <RowBetween>
                            <RowFixed style={{ width: '100%' }}>
                              <InputField type='text' color="#FCFCFC" placeholder='0x6cb0859dB902eFD12231B9CadFb43Cd1f699c2Ac' style={{ width: '100%' }} value={poolInfo.addressForList}
                                onChange={(e) => setPoolInfo(prev => { const tmp = { ...prev }; tmp.addressForList = e.target.value; return tmp })}
                              />
                            </RowFixed>
                          </RowBetween>
                        </AutoColumn>
                        <GButton onClick={() => setPoolInfo(prev => {
                          const tmp = { ...prev };
                          const tmpArr = [...tmp.addressList]
                          if (tmpArr.indexOf(poolInfo.addressForList) === -1) {
                            tmpArr.push(poolInfo.addressForList);
                            tmp.addressForList = '';
                            tmp.addressList = tmpArr;
                          } return tmp
                        })}><LText>ADD</LText></GButton>
                      </SGroup>
                    </BSection>
                    <AddressList padding='16px 24px'>
                      {_.map(poolInfo.addressList, (x, i) =>
                        <Box key={i}>{x}</Box>
                      )}
                    </AddressList>
                  </>
                }
                <hr style={{ width: '100%', border: '1px solid #A0F0CE', margin: '50px 0' }} />
                <CText style={{ fontWeight: 500, fontSize: "20px" }}>Token Detail</CText>
                <BSection>
                  <AutoColumn style={{ flex: 1 }}>
                    <Section>
                      <SGroup>
                        <AutoColumn style={{ width: '100%' }}>
                          <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Sympol</CText>
                          <RowBetween>
                            <RowFixed>
                              <InputField color="#FCFCFC" placeholder='SUN' value={match.params.pro_id && tokenInfo.symbol}
                                onChange={(e) => setTokenInfo(prev => { const tmp = { ...prev }; tmp.symbol = e.target.value; return tmp })}
                                required />
                            </RowFixed>
                          </RowBetween>
                        </AutoColumn>
                      </SGroup>
                      <SGroup>
                        <AutoColumn style={{ width: '100%' }}>
                          <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Total Supply</CText>
                          <RowBetween>
                            <RowFixed>
                              <InputField color="#FCFCFC" placeholder='100000000' value={match.params.pro_id && tokenInfo.totalSupply}
                                onChange={(e) => setTokenInfo(prev => { const tmp = { ...prev }; tmp.totalSupply = e.target.value; return tmp })}
                                required />
                            </RowFixed>
                          </RowBetween>
                        </AutoColumn>
                      </SGroup>
                    </Section>
                  </AutoColumn>
                  <AutoColumn style={{ flex: 1 }}>
                    <Group>
                      <AutoColumn style={{ width: '100%' }}>
                        <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Token address</CText>
                        <RowBetween>
                          <MRowFixed>
                            <InputField color="#FCFCFC" placeholder='0x41951a72655b3823cb4AFacBd220f1A2B45d2B30' value={match.params.pro_id && tokenInfo.tokenAddress}
                              onChange={(e) => setTokenInfo(prev => { const tmp = { ...prev }; tmp.tokenAddress = e.target.value; return tmp })}
                              required />
                          </MRowFixed>
                        </RowBetween>
                      </AutoColumn>
                    </Group>
                  </AutoColumn>
                </BSection>
                <BSection>
                  <Group style={{ width: '100%' }}>
                    <AutoColumn style={{ width: '100%' }}>
                      <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>Contract address</CText>
                      <RowBetween>
                        <MRowFixed>
                          <InputField color="#FCFCFC" placeholder='' value={match.params.pro_id && tokenInfo.contractAddress} readOnly />
                        </MRowFixed>
                      </RowBetween>
                    </AutoColumn>
                  </Group>
                </BSection>
              </AutoColumn>
            </TabBody>
          </BSection>
        </AutoColumn >
      </Wrapper >
    </Box >
  )
}

export default Add

import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useHistory } from 'react-router-dom'
import { BigNumber } from 'ethers'
import { Box, Button, Text, Card as UIKitCard, CardBody, useWalletModal } from '@fastswap-uikit'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'
import { toast } from 'react-toastify'
import web3 from 'web3'
import _ from 'lodash'
import { tokens } from 'constants/token/tokens'
import { injected, walletconnect } from 'connectors'
import { useToken } from 'hooks/Tokens'
import useGlobalData from 'hooks/useGlobalData'
import { useProjectData } from 'state/projects/hooks'
import comparefy from 'utils/comparefy'
import LeftRaw from 'img/left_raw.png'
import JoinModalApprove from 'components/Modal/JoinModalApprove'
import JoinModalSwap from 'components/Modal/JoinModalSwap'
import TradeIcon from 'img/trade.png'
import { useTierContract, useTokenContract, usePoolContract } from '../../../hooks/useContract'
import { AutoColumn } from '../../../components/Column'
import { ProjectCardDetail } from '../../../components/ProjectCard'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { FASTTOKEN, DUKETOKEN, USDT, TEMPUSDT } from '../../../constants';
import { useTokenAllowance } from '../../../data/Allowances'

const tierSymbol = ['Silver', 'Gold', 'Platinum', 'Diamond', 'Sapphire'];

const Wrapper = styled.div`
  padding: 0 63px;
  margin-bottom: 74px;
  margin-top: 32px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  jusify-content: space-between;
  flex-direction: column;

  ${respondTo.sm`
    padding: 0 32px;
    margin-bottom: 52px;
  `}
  ${respondTo.md`
    padding: 0 18px;
  `}
`

const Container = styled.div`
  display: flex;
  @media (max-width: 1400px) {
    flex-wrap: wrap;
  }
  >div:first-of-type {
    flex: 1;
  }
`

const Tab = styled.div`
  // flex: 1;
  background-image: linear-gradient(#64F9A1, #0EFFD4, #97AEFF);
  min-width: 430px;
  border-radius: 24px;
  margin: 10px;
  padding: 32px;
  ${respondTo.md`
    width: 100%;
    min-width: auto;
  `}
`

const TabBody = styled.div`
  width: 100%;
  // flex: 5;
`

const WrappedText = styled.div`
  border-bottom: 1px solid #757B75;
  ${respondTo.md`
    border-bottom: 0px solid #757B75;
  `}
  padding-bottom: 5px;
  margin-top: 30px;
  cursor: pointer;
`

const CText = styled(Text)`
  font-family: Oswald, sans-serif;
  color: #363936;
`

const LButton = styled(Button)`
  border: 10px solid #192219;
  border-width: 2px;
  border-radius: 8px;
`

const LText = styled.span`
  font-family: Oswald,sans-serif;
  font-size: 16px;
  font-weight: 500;
`

const LDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #237745;
  margin: 24px 0;
`

const Paragraph = styled.div`
  margin-bottom: 30px;
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
`

const HText = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  font-family: Oswald;
  color: #A0F0CE;
  background: #263126;
  padding: 2px 15px;
`

const BText = styled(Text)`
  font-size: 16px;
  font-weight: 400;
  font-family: Raleway;
  color: #EBF8F0;
  padding: 2px 15px;
`

const Section = styled.div<any>`
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  ${({ noBottom }) => !noBottom && 'border-bottom: 1px solid #263126;'}
  ${respondTo.md`
    align-items: flex-start;
    flex-direction: column;
  `}
`

const BackButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 10px;
  >div:last-of-type {
    font-family: Oswald;
    font-weight: 500;
    font-size: 16px;
    color: #A0F0CE;
  }
`

const MCardBody = styled(CardBody)`
  ${respondTo.md`
    flex-direction: column;
  `}
  >div:first-of-type {
    ${respondTo.md`
      width: auto !important;
      display: flex;
      justify-content: center;
      >div+div {
        margin-left: 24px;
      }
    `}
  }
  >div:nth-of-type(2) {
    ${respondTo.md`
      width: 100% !important;
      padding: 16px 0 0 0 !important;
      >div {
        display: flex;
        flex-direction: column;
      }
    `}
  }
`

const BUIKitCard = styled(UIKitCard)`
  border-radius: 24px;
  ${respondTo.lg`
    min-width: auto;
  `}
  min-width: 850px;
`
interface Props {
  id?: any;
}

const ProjectDetail: React.FC<Props> = (id) => {

  useGlobalData()
  const projectData = useProjectData()


  // Match 
  const current = _.filter(projectData, x => x._id === id?.id)[0]

  let timeType = 2;

  if (comparefy(new Date(parseInt(current?.open) * 1000), new Date(parseInt(current?.close) * 1000)) === 0) {
    // this project is coming soon project
    // setTimetype(0);
    timeType = 0;
  }
  else if (comparefy(new Date(parseInt(current?.open) * 1000), new Date(parseInt(current?.close) * 1000)) === 1) {
    // this project is closed project
    // setTimetype(1);
    timeType = 1;
  }
  else {
    // this project is open now project
    // setTimetype(2);
    timeType = 2;
  }


  const history = useHistory()
  const [openApprove, setOpenApprove] = useState(false)
  const [openSwap, setOpenSwap] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const { account, activate, deactivate } = useWeb3React()

  // Connect wallet
  const handleLogin = (connectorId: string) => {
    if (connectorId === 'walletconnect') {
      return activate(walletconnect)
    }
    return activate(injected)
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  // Get user's FAST amount
  const [userFastAmount, setuserFastAmount] = useState(0)
  const tokenFASTContract = useTokenContract(FASTTOKEN.address, true)
  useEffect(() => {
    const getUserInfo = async () => {
      if (account) {
        try {
          let stakedAmount = await tokenFASTContract?.balanceOf(account)
          stakedAmount = stakedAmount.div(BigNumber.from(10).pow(18)).toNumber();

          setuserFastAmount(stakedAmount)
          // console.log('res', tokenFASTContract);
        } catch (err) {
          console.log("err", err);
        }
      }
    }
    getUserInfo();
  }, [tokenFASTContract, account])

  // Get user's Duke amount
  const [userDukeAmount, setuserDukeAmount] = useState(0)
  const tokenDUKEContract = useTokenContract(DUKETOKEN.address, true)
  useEffect(() => {
    const getUserInfo = async () => {
      if (account) {
        try {
          let stakedAmount = await tokenDUKEContract?.balanceOf(account)
          stakedAmount = stakedAmount.div(BigNumber.from(10).pow(18)).toNumber();

          setuserDukeAmount(stakedAmount)
        } catch (err) {
          console.log("err", err);
        }
      }
    }
    getUserInfo();
  }, [tokenDUKEContract, account])


  // Get Project token address - fast or duke
  const token = useToken(current?.tokenAddress)?.symbol
  const poolContract = usePoolContract(current?.contractAddress, true)

  // Get account info
  // const userUSDTBalance = useTokenBalance(account ?? undefined, USDT)
  const userUSDTBalance = useTokenBalance(account ?? undefined, TEMPUSDT)

  // Get User Info
  const [userTokenContributedAmount, setuserTokenContributedAmount] = useState(0)
  const [userStakedFastAmount, setuserStakedFastAmount] = useState(0)
  const [userStakedDukeAmount, setuserStakedDukeAmount] = useState(0)
  const [userAllowanceAmount, setUserAllowanceAmount] = useState(0)

  const userAllowance = useTokenAllowance(TEMPUSDT, account ?? undefined, current?.contractAddress)

  const [userTierLevel, setUserTierLevel] = useState(-1)

  useEffect(() => {
    async function fetchData() {
      if (!account) return

      setUserAllowanceAmount(Number(userAllowance?.toSignificant(4)) ?? 0)

      const userTier = await poolContract?.userTier(account)
      console.log('userTier', userTier)
      setUserTierLevel(userTier ? userTier.toNumber() : -1)
      const fastStakedAmount = await poolContract?.fastStakedAmount(account)
      setuserStakedFastAmount(fastStakedAmount ? fastStakedAmount.div(BigNumber.from(10).pow(18)).toNumber() : 0)
      const dukeStakedAmount = await poolContract?.dukeStakedAmount(account)
      setuserStakedDukeAmount(dukeStakedAmount ? dukeStakedAmount.div(BigNumber.from(10).pow(18)).toNumber() : 0)
      const contributions = await poolContract?.contributions(account)
      console.log('contributions', contributions)
      setuserTokenContributedAmount(contributions ? contributions.div(BigNumber.from(10).pow(18)).toNumber() : 0)
    }
    fetchData()
  }, [account, poolContract, userAllowance])

  // Unstake
  const [isUnstaking, setIsUnstaking] = useState(false);

  const unStake = async (tokenSymbol: string) => {
    try {
      setIsUnstaking(true);
      let tx;
      if (tokenSymbol === 'fast') {
        tx = await poolContract?.unStakeFast(userStakedFastAmount)
      } else {
        tx = await poolContract?.unStakeDuke(userStakedDukeAmount);
      }
      const res = await tx.wait(1)
      if (res.status) {
        toast.success("successfully unstaked", {
          theme: 'colored'
        })
      } else {
        toast.error("Failed", {
          theme: 'colored'
        })
      }
    } catch (err) {
      console.log('err', err)
    }
    setIsUnstaking(false)
  }

  // Render Box
  const renderBox = () => {
    if (!account) {
      return (
        // User have to connect wallet
        <AutoColumn>
          <Text style={{ fontWeight: 400, fontSize: '16px', fontFamily: 'Raleway' }} color='#363936'>Please connect your wallet in order to jin the project</Text>
          <LButton style={{ background: '#192219', marginTop: '15px' }} onClick={onPresentConnectModal}><LText style={{ color: '#FCFCFC' }}>CONNECT WALLET</LText></LButton>
        </AutoColumn>
      )
    }
    if (timeType === 0) {
      if (!userFastAmount && !userDukeAmount) {
        return (
          <AutoColumn>
            <CText style={{ fontWeight: 400, fontSize: '16px', fontFamily: 'Raleway', color: '#192219' }}>In order to participate Launch Spot, you are required to be FAST holder. Read more in FAQ</CText>
            <CText style={{ fontWeight: 500, fontSize: "14px", marginTop: '24px' }}>Your Balance</CText>
            <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userFastAmount} FAST</CText>
            <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userDukeAmount} DUKE</CText>
            <LButton style={{ background: 'none', marginTop: '15px' }} onClick={() => { window.open('https://fastswap.finance', '_blank') }}>
              <LText style={{ color: '#192219' }}>
                GET FAST or DUKE
              </LText>
              <Box ml='7px'>
                <img src={TradeIcon} alt='' />
              </Box>
            </LButton>
          </AutoColumn>
        )
      }
      return (
        <AutoColumn>
          <CText style={{ fontWeight: 500, fontSize: "24px" }}>This is coming project</CText>
          <CText style={{ fontWeight: 500, fontSize: "14px" }}>Your FAST Balance</CText>
          <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userFastAmount} FAST</CText>
          <CText style={{ fontWeight: 500, fontSize: "14px" }}>Your DUKE Balance</CText>
          <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userDukeAmount} DUKE</CText>
          <CText style={{ fontWeight: 500, fontSize: "14px" }}>Your TIER Level</CText>
          <CText style={{ fontWeight: 300, fontSize: "34px" }}>{tierSymbol[userTierLevel]}</CText>
          <CText style={{ fontWeight: 500, fontSize: "14px" }}>Amount Staked</CText>
          <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userStakedFastAmount} FAST</CText>
          <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userStakedDukeAmount} DUKE</CText>
        </AutoColumn>
      )
    }
    if (timeType === 1) {
      // Closed project - Claim tokens
      if (userTierLevel >= 0) {
        // User contributed project and can unstaked Token in closed project
        return (
          <AutoColumn>
            <CText style={{ fontWeight: 500, fontSize: "24px" }}>This is closed project</CText>
            <CText style={{ fontWeight: 500, fontSize: "14px" }}>Your FAST Balance</CText>
            <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userFastAmount} FAST</CText>
            <CText style={{ fontWeight: 500, fontSize: "14px" }}>Your DUKE Balance</CText>
            <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userDukeAmount} DUKE</CText>
            <CText style={{ fontWeight: 500, fontSize: "14px" }}>Project</CText>
            <CText style={{ fontWeight: 300, fontSize: "34px" }}>{current.description}</CText>
            <CText style={{ fontWeight: 500, fontSize: "14px" }}>Amount Staked</CText>
            {
              !userStakedFastAmount && !userStakedDukeAmount ?
                <CText style={{ fontWeight: 300, fontSize: "34px" }}> Not Staked </CText>
                : <div>
                  <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userStakedFastAmount} FAST</CText>
                  <LButton style={{ background: 'none', marginTop: '15px' }}
                    onClick={() => unStake('fast')} disabled={isUnstaking} >
                    <LText style={{ color: '#192219' }}>
                      UNSTAKE FAST
                    </LText>
                  </LButton>
                  <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userStakedDukeAmount} DUKE</CText>
                  <LButton style={{ background: 'none', marginTop: '15px' }}
                    onClick={() => unStake('duke')} disabled={isUnstaking} >
                    <LText style={{ color: '#192219' }}>
                      UNSTAKE DUKE
                    </LText>
                  </LButton>
                </div>
            }
          </AutoColumn>
        )
      }
      // User didn't stake token in this project
      return (
        <AutoColumn>
          <CText style={{ fontWeight: 500, fontSize: "24px" }}>This project is closed project.</CText>
          <CText style={{ fontWeight: 300, fontSize: "24px" }}>You are not a TIER</CText>
        </AutoColumn>
      )
    }
    // Opening project
    return (
      <AutoColumn>
        <CText style={{ fontWeight: 500, fontSize: "14px" }}>Your Balance</CText>
        <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userUSDTBalance?.toSignificant(4) || 0} USDT</CText>
        <CText style={{ fontWeight: 500, fontSize: "14px", paddingTop: '30px' }}>Your Approved Amount</CText>
        <CText style={{ fontWeight: 500, fontSize: "24px" }}>{userAllowanceAmount} USDT</CText>

        <LButton style={{ background: 'none', marginTop: '30px' }} onClick={() => setOpenApprove(true)} ><LText style={{ color: '#192219' }}>APPROVE</LText></LButton>
        <LButton style={{ background: '#192219', marginTop: '15px' }} onClick={() => setOpenSwap(true)} ><LText style={{ color: '#FCFCFC' }}>JOIN</LText></LButton>

        <CText style={{ fontWeight: 500, fontSize: "14px", marginTop: '30px' }}>Swapped</CText>
        <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userTokenContributedAmount} USDT</CText>
        <CText style={{ fontWeight: 500, fontSize: "24px" }}>{parseInt(web3.utils.fromWei(current?.swapRate ?? '0')) * userTokenContributedAmount} {token}</CText>

        {/* <CText style={{ fontWeight: 500, fontSize: "14px", paddingTop: '30px' }}>{userAllowanceAmount?.toSignificant(4)} Remaining Allocation</CText>
        <CText style={{ fontWeight: 500, fontSize: "24px" }}>0.00 USDT</CText> */}

        <LDivider />
        <CText style={{ fontWeight: 500, fontSize: "14px", marginTop: '30px' }}>Your Tier</CText>
        <CText style={{ fontWeight: 300, fontSize: "34px" }}>{tierSymbol[userTierLevel]}</CText>
        <CText style={{ fontWeight: 500, fontSize: "24px", width: "100%" }}> {userStakedFastAmount} FAST STAKED</CText>
        <CText style={{ fontWeight: 500, fontSize: "24px", width: "100%" }}> {userStakedDukeAmount} DUKE STAKED</CText>
      </AutoColumn>
    )
  }

  return (
    <Wrapper>
      <BackButton onClick={() => history.push('/project')}>
        <Box><img src={LeftRaw} alt='' /></Box>
        <Box ml='13.33px'>BACK</Box>
      </BackButton>
      <Container>
        <TabBody>
          <ProjectCardDetail {...current} />
          <BUIKitCard style={{ backgroundColor: '#192219', margin: '10px' }}>
            <MCardBody style={{ display: 'flex' }}>
              <AutoColumn style={{ width: '20%', height: '100%' }}>
                <WrappedText>
                  <GText onClick={() => setTabIndex(0)} active={tabIndex === 0 ? 1 : 0}>DETAIL</GText>
                </WrappedText>
                <WrappedText>
                  <GText onClick={() => setTabIndex(1)} active={tabIndex === 1 ? 1 : 0}>TIMELINE</GText>
                </WrappedText>
              </AutoColumn>
              <TabBody style={{ width: '80%', height: '100%', padding: '30px' }}>
                {tabIndex === 0 &&
                  <AutoColumn>
                    <Paragraph>
                      <HText>PARTICIPATE REQUIREMENT</HText>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Min. Stake Duration</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>7 days before project open</BText>
                        </AutoColumn>
                      </Section>
                    </Paragraph>
                    <Paragraph>
                      <HText>POOL DETAIL</HText>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Opens</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>{new Date(parseInt(current?.open) * 1000).getFullYear()}/{new Date(parseInt(current?.open) * 1000).getMonth() + 1}/{new Date(parseInt(current?.open) * 1000).getDate()} {new Date(parseInt(current?.open) * 1000).getHours()}:{new Date(parseInt(current?.open) * 1000).getMinutes()}:{new Date(parseInt(current?.open) * 1000).getSeconds()}</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Closes</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>{new Date(parseInt(current?.close) * 1000).getFullYear()}/{new Date(parseInt(current?.close) * 1000).getMonth() + 1}/{new Date(parseInt(current?.close) * 1000).getDate()} {new Date(parseInt(current?.close) * 1000).getHours()}:{new Date(parseInt(current?.close) * 1000).getMinutes()}:{new Date(parseInt(current?.close) * 1000).getSeconds()}</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Swap rate</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>1 {tokens[parseInt(current?.swapTokens)]?.symbol} = {current?.swapRate} {token}</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Softcap</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>{BigNumber.from(current?.softcap ?? '0').div(BigNumber.from(10).pow(18)).toNumber()}</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Hardcap</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>{BigNumber.from(current?.hardcap ?? '0').div(BigNumber.from(10).pow(18)).toNumber()}</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Fast Amount</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>{current?.fastAmount[1]}</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Duke Amount</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>{current?.dukeAmount[1]}</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Allocation</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>{current?.allocation[1]}</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Total Users Participated</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>865</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Total Funds Raised</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>62,052,012 USDT</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Access Type</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Private</BText>
                        </AutoColumn>
                      </Section>
                    </Paragraph>
                    <Paragraph>
                      <HText>TOKEN</HText>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Token</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText style={{ color: '#6BC08E' }}>{token}</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Type</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>ERC 20</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Total Supply</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>{current?.totalSupply}</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Token Address</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>{current?.tokenAddress.substring(0, 14)}...{current?.tokenAddress.substring(current?.tokenAddress.length - 7)}</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Contract Address</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>{current?.contractAddress.substring(0, 14)}...{current?.contractAddress.substring(current?.contractAddress.length - 7)}</BText>
                        </AutoColumn>
                      </Section>
                    </Paragraph>
                  </AutoColumn>
                }
                {tabIndex === 1 &&
                  <AutoColumn>
                    <Paragraph>
                      <HText>STAGE 1: STAKING</HText>
                      <Section noBottom>
                        <BText style={{ fontWeight: 500, fontSize: '14px' }}>You must stake your FAST/YFT/MVP  7 days before the project open, tier options shown in the staking page.</BText>
                      </Section>
                      <Section noBottom>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Ends</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>{current?.close}</BText>
                        </AutoColumn>
                      </Section>
                    </Paragraph>
                    <Paragraph>
                      <HText>STAGE 2: PARTICIPATE PERIOD</HText>
                      <Section noBottom>
                        <BText style={{ fontWeight: 500, fontSize: '14px' }}>We will calculate the amount you allow to swap based on your tier.</BText>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Opens</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>{current?.open}</BText>
                        </AutoColumn>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Ends</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>{current?.close}</BText>
                        </AutoColumn>
                      </Section>
                    </Paragraph>
                    <Paragraph>
                      <HText>STAGE 3: DISTRIBUTION</HText>
                      <Section noBottom>
                        <BText style={{ fontWeight: 500, fontSize: '14px' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</BText>
                      </Section>
                      <Section>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>Starts</BText>
                        </AutoColumn>
                        <AutoColumn style={{ flex: 1 }}>
                          <BText>{current?.open}</BText>
                        </AutoColumn>
                      </Section>
                    </Paragraph>
                  </AutoColumn>
                }
              </TabBody>
            </MCardBody>
          </BUIKitCard>
        </TabBody>
        <Tab style={{ height: '100%' }}>
          {renderBox()}
        </Tab>
        <JoinModalApprove
          open={openApprove}
          setOpen={setOpenApprove}
          userWalletAmount={userUSDTBalance?.toSignificant(4)}
          current={current}
          userTokenContract={TEMPUSDT}
        />
        <JoinModalSwap
          open={openSwap}
          setOpen={setOpenSwap}
          current={current}
          userAllowanceAmount={userAllowanceAmount}
        />
      </Container>
    </Wrapper>
  )
}

export default ProjectDetail

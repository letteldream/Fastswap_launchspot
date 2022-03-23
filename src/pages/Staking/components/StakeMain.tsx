import React, { useCallback, useState, useEffect } from 'react'
import _ from 'lodash'
import web3 from 'web3'
import { BigNumber } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { injected, walletconnect } from 'connectors'
import { Flex, Box, Button, Text, Card as UIKitCard, CardBody, useWalletModal } from '@fastswap-uikit'
import useGlobalData from 'hooks/useGlobalData'
import { useTokenContract, usePoolContract } from 'hooks/useContract'
import { useToken } from 'hooks/Tokens'
import { useProjectData } from 'state/projects/hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import { useTokenAllowance } from 'data/Allowances'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'
import { toast } from 'react-toastify'
import { AutoColumn } from 'components/Column'
import { TierCard } from 'components/TierCard'
import JoinModalApprove from 'components/Modal/JoinModalApprove'
import JoinModalSwap from 'components/Modal/JoinModalSwap'
import Dropdown from 'components/DropDown'
import comparefy, { isExpired } from 'utils/comparefy';
import TradeIcon from 'img/trade.png'
import Nothing from 'img/nothing.png'
import FModal from './FModal'
import { FASTTOKEN, DUKETOKEN, TEMPUSDT } from '../../../constants';

const tierSymbol = ['Silver', 'Gold', 'Platinum', 'Diamond', 'Sapphire'];

const Wrapper = styled.div`
  padding: 0 64px;
  margin-bottom: 74px;
  margin-top: 55px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  jusify-content: space-between;

  ${respondTo.md`
    width: 100%;
    margin-top: 0 !important;
  `}
  ${respondTo.sm`
    padding: 0 32px;
    margin-bottom: 52px;
    margin-top: 98px;
  `}
`

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  @media (max-width: 1450px) {
    flex-wrap: wrap;
  }
  >div:first-of-type {
    flex: 1;
  }
  ${respondTo.md`
    width: 100%;
    >div {
      width: 100%;
    }
  `}
`

const Tab = styled.div`
  // flex: 1;
  background-image: linear-gradient(#64F9A1, #0EFFD4, #97AEFF);
  min-width: 430px;
  border-radius: 24px;
  margin: 10px;
  padding: 32px;
  ${respondTo.md`
    min-width: auto;
  `}
`

const TabBody = styled.div`
  // flex: 5;
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

const HText = styled(Text)`
  font-size: 24px;
  font-weight: 500;
  font-family: Oswald;
  color: #A0F0CE;
`

const BText = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  font-family: Oswald;
  color: #CECECE;
`

const MText = styled(Text)`
  font-size: 16px;
  font-weight: 400;
  font-family: Raleway;
  color: #FCFCFC;
  margin: 20px 10px 10px 10px;
`

const Section = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  ${respondTo.md`
    flex-direction: column;
    align-items: flex-start;
  `}
`

const BUIKitCard = styled(UIKitCard)`
  border-radius: 24px;
  ${respondTo.lg`
    min-width: auto !important;
  `}
  >div {
    padding: 24px 32px;
  }
`

const TierCardWrapper = styled.div`
  justify-content: space-around;
  display: flex;
  flex-wrap: wrap;
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

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  ${respondTo.sm`
    flex-direction: column;
  `}
`

interface IProps {
  id?: any
}

const StakeMain: React.FC<IProps> = (id) => {

  // Show Project lists
  useGlobalData()
  const projectData = useProjectData()

  // Filter the projects
  const published = _.filter(projectData, x => x.visibility === 'Published')

  const filtered = published?.map((x: any) => {
    let timeType
    let expired = false
    if (comparefy(new Date(parseInt(x.open) * 1000), new Date(parseInt(x.close) * 1000)) === 1) {
      // This project is closed project
      timeType = "Closed"
    } else if (comparefy(new Date(parseInt(x.open) * 1000), new Date(parseInt(x.close) * 1000)) === 0) {
      // This project is coming project
      timeType = "Coming"
      if (isExpired(new Date(parseInt(x.open) * 1000))) expired = true;
    }
    else {
      // This project is opening project
      timeType = "Opening"
    }
    x = { ...x, timeType, expired }
    return x;
  })

  // Connect wallet
  const { account, activate, deactivate } = useWeb3React()

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

  const userUSDTBalance = useTokenBalance(account ?? undefined, TEMPUSDT)

  const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

  const [current, setCurrent] = useState(0)
  const [level, setLevel] = useState(-1)
  const [contractAddress, setContractAddress] = useState(NULL_ADDRESS)
  const [userTierLevel, setUserTierLevel] = useState(-1)
  const [userStakedFastAmount, setuserStakedFastAmount] = useState(0)
  const [userStakedDukeAmount, setuserStakedDukeAmount] = useState(0)
  const [userAllowanceAmount, setUserAllowanceAmount] = useState(0)
  const [userTokenContributedAmount, setuserTokenContributedAmount] = useState(0)

  const [fastStaker, setFastStaker] = useState(0)
  const [dukeStaker, setDukeStaker] = useState(0)
  const [stakedFastAmount, setStakedFastAmount] = useState(0)
  const [stakedDukeAmount, setStakedDukeAmount] = useState(0)

  const [openApprove, setOpenApprove] = useState(false)
  const [openSwap, setOpenSwap] = useState(false)

  const poolContract = usePoolContract(contractAddress, true)
  const token = useToken(filtered[current]?.tokenAddress)?.symbol
  const userAllowance = useTokenAllowance(TEMPUSDT, account ?? undefined, contractAddress === "" ? NULL_ADDRESS : contractAddress)

  useEffect(() => {
    async function fetchData() {
      if (!filtered.length) return
      if (!account) return

      setContractAddress(filtered[current].contractAddress)
      setUserAllowanceAmount(Number(userAllowance?.toSignificant(4)) ?? 0)

      const userTier = await poolContract?.userTier(account)
      setUserTierLevel(userTier ? userTier.toNumber() : -1)
      const fastStakedAmount = await poolContract?.fastStakedAmount(account)
      setuserStakedFastAmount(fastStakedAmount ? fastStakedAmount.div(BigNumber.from(10).pow(18)).toNumber() : 0)
      const dukeStakedAmount = await poolContract?.dukeStakedAmount(account)
      setuserStakedDukeAmount(dukeStakedAmount ? dukeStakedAmount.div(BigNumber.from(10).pow(18)).toNumber() : 0)
      const contributions = await poolContract?.contributions(account)
      setuserTokenContributedAmount(contributions ? contributions.div(BigNumber.from(10).pow(18)).toNumber() : 0)
      const fastTotalStaker = await poolContract?.fastTotalStakers()
      setFastStaker(fastTotalStaker ? fastTotalStaker.toNumber() : 0)
      const dukeTotalStaker = await poolContract?.dukeTotalStakers()
      setDukeStaker(dukeTotalStaker ? dukeTotalStaker.toNumber() : 0)
      const fastTotalStakedAmount = await poolContract?.fastTotalStakedAmount()
      setStakedFastAmount(fastTotalStakedAmount ? fastTotalStakedAmount.div(BigNumber.from(10).pow(18)).toNumber() : 0)
      const dukeTotalStakedAmount = await poolContract?.dukeTotalStakedAmount()
      setStakedDukeAmount(dukeTotalStakedAmount ? dukeTotalStakedAmount.div(BigNumber.from(10).pow(18)).toNumber() : 0)
    }
    fetchData()
  }, [filtered, account, current, poolContract, userAllowance])

  // Stake Modal
  const [stakeModal, setstakeModal] = useState<boolean>(false)
  const [tokenType, setTokenType] = useState("")
  const handleCloseFastModal = useCallback(() => {
    setstakeModal(false)
  }, []);

  const stakeToken = (tokenSymbol: string) => {
    if (level < 0) {
      toast.error('Select the TIER Level first', {
        theme: 'colored'
      })
      return
    }
    if (tokenSymbol === "fast") {
      const tierFastAmount = BigNumber.from(filtered[current].fastAmount[level]).div(BigNumber.from(10).pow(18)).toNumber()
      if (userFastAmount < tierFastAmount) {
        toast.error("You don't have enough FAST token for this TIER Level", {
          theme: 'colored'
        })
        return
      }
      setTokenType("FAST");
    }
    else {
      const tierDukeAmount = BigNumber.from(filtered[current].dukeAmount[level]).div(BigNumber.from(10).pow(18)).toNumber()
      if (userDukeAmount < tierDukeAmount) {
        toast.error("You don't have enough DUKE token for this TIER Level", {
          theme: 'colored'
        })
        return
      }
      setTokenType("DUKE");
    }
    setstakeModal(true)
  }

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
    if (filtered.length) {
      if (!account) {
        // Connect wallet
        return (
          <AutoColumn>
            <Text style={{ fontWeight: 400, fontSize: '16px', fontFamily: 'Raleway' }} color='#363936'>Please connect your wallet in order to jin the project</Text>
            <LButton style={{ background: '#192219', marginTop: '15px' }} onClick={onPresentConnectModal}><LText style={{ color: '#FCFCFC' }}>CONNECT WALLET</LText></LButton>
          </AutoColumn>
        )
      }

      if (filtered[current].timeType === 'Coming') {
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
            {
              filtered[current].expired ?
                <LButton style={{ background: '#192219', marginTop: '30px', width: '100%' }} disabled><LText style={{ color: '#FCFCFC' }}>EXPIRED</LText></LButton>
                :
                <div>
                  <LButton style={{ background: '#192219', marginTop: '30px', width: '100%' }} onClick={() => stakeToken("fast")}><LText style={{ color: '#FCFCFC' }}>STAKE FAST</LText></LButton>
                  <LButton style={{ background: '#192219', marginTop: '30px', width: '100%' }} onClick={() => stakeToken("duke")}><LText style={{ color: '#FCFCFC' }}>STAKE DUKE</LText></LButton>
                </div>
            }
          </AutoColumn>
        )
      }

      if (filtered[current].timeType === 'Opening') {
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
            <CText style={{ fontWeight: 500, fontSize: "24px" }}>{parseInt(web3.utils.fromWei(filtered[current]?.swapRate)) * userTokenContributedAmount} {token}</CText>

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

      if (filtered[current].timeType === "Closed") {
        // Closed project, if staked, available to unstake
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
              <CText style={{ fontWeight: 300, fontSize: "34px" }}>{filtered[current].description}</CText>
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

    }
    // There is no opening project
    return (
      <AutoColumn>
        <Text style={{ fontWeight: 400, fontSize: '25px', fontFamily: 'Raleway' }} color='#363936'>
          There is no Opening project now
        </Text>
      </AutoColumn>
    )
  }

  const onSelectProject = (index: number) => {
    setCurrent(index)
    setLevel(-1)
  }

  return (
    <Wrapper>
      <Container>
        <TabBody>
          <HeaderWrapper>
            <Text style={{ fontWeight: 500, fontFamily: 'Oswald, sans-serif', fontSize: "48px", marginTop: "8px", marginLeft: "10px", marginRight: "10px", marginBottom: "12px" }} color="#FCFCFC">STAKING</Text>
            {filtered.length > 1 ?
              <Dropdown target={<Button variant='text' style={{ color: 'white' }}>{filtered[current].name}</Button>}>
                {filtered.map((project, index) =>
                  index !== current &&
                  <Button variant='text' style={{ color: 'white' }} onClick={() => onSelectProject(index)}>{project.name}</Button>)}
              </Dropdown> : filtered.length && <Button>{filtered[current].name}</Button>
            }
          </HeaderWrapper>
          <MText>Stake FAST / YFT / MVP to participate projects launched. The allocation is calculation base on your tier, see breakdown below.</MText>
          {filtered.length > 0 ?
            <TierCardWrapper>
              {
                _.map(tierSymbol, (x, i) =>
                  // <TierCard key={i} {...x} onClick={() => { onProjectClicked(x._id, x.contractAddress, x.tier, x.timeType, x.description, x.fastAmount, x.dukeAmount) }} />
                  <TierCard key={i} id={i} name={tierSymbol[i]} fastPrice={filtered[current].fastAmount[i]} dukePrice={filtered[current].dukeAmount[i]} onClick={() => { setLevel(i) }} />
                )
              }
            </TierCardWrapper>
            :
            <Flex display='flex' flexDirection='column' alignItems='center'>
              <Box>
                <img src={Nothing} alt='' />
              </Box>
              <Box style={{ fontWeight: 400, fontFamily: 'Raleway', fontSize: '16px', color: '#FCFCFC' }}>No projects currently open</Box>
            </Flex>
          }
          <MText>System stats</MText>
          <BUIKitCard style={{ backgroundColor: '#192219', margin: '10px', minWidth: '850px' }}>
            <CardBody style={{ display: 'flex' }}>
              <TabBody style={{ width: '100%', height: '100%' }}>
                <AutoColumn>
                  <Section>
                    <AutoColumn style={{ flex: 1 }}>
                      <BText>Number of Staker</BText>
                      <HText>{fastStaker} Fasters/{dukeStaker} Dukers</HText>
                    </AutoColumn>
                    <AutoColumn style={{ flex: 1 }}>
                      <BText>Amount of Staked</BText>
                      <HText>{stakedFastAmount} FAST/{stakedDukeAmount} DUKE</HText>
                    </AutoColumn>
                    <AutoColumn style={{ flex: 1 }}>
                      <BText>Amount of Projects Launched</BText>
                      <HText>{filtered.length}</HText>
                    </AutoColumn>
                  </Section>
                </AutoColumn>
              </TabBody>
            </CardBody>
          </BUIKitCard>
        </TabBody>
        <Tab>
          {renderBox()}
        </Tab>
      </Container>
      {stakeModal &&
        <FModal
          onClose={handleCloseFastModal}
          projectID={filtered[current]._id}
          tokenContract={tokenType === "FAST" ? tokenFASTContract : tokenDUKEContract}
          poolContract={poolContract}
          userAmount={tokenType === "FAST" ? userFastAmount : userDukeAmount}
          stakingAmount={tokenType === "FAST" ? BigNumber.from(filtered[current].fastAmount[level]).sub(filtered[current].fastAmount[userTierLevel]).div(BigNumber.from(10).pow(18)).toNumber()
            : BigNumber.from(filtered[current].dukeAmount[level]).sub(filtered[current].dukeAmount[userTierLevel]).div(BigNumber.from(10).pow(18)).toNumber()}
          tokenType={tokenType}
          tierSymbol={tierSymbol[level]}
        />
      }
      {filtered.length && <JoinModalApprove
        open={openApprove}
        setOpen={setOpenApprove}
        userWalletAmount={userUSDTBalance?.toSignificant(4)}
        current={filtered[current]}
        userTokenContract={TEMPUSDT}
      />
      }
      {filtered.length && <JoinModalSwap
        open={openSwap}
        setOpen={setOpenSwap}
        userAllowanceAmount={userAllowanceAmount}
        current={filtered[current]}
      />}
    </Wrapper>
  )
}

export default StakeMain

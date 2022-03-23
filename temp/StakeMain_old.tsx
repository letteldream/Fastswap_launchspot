import React, { useCallback, useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected, walletconnect } from 'connectors'
import useGlobalData from 'hooks/useGlobalData'
import { useProjectData } from 'state/projects/hooks'
import { Flex, Box, Button, Text, Card as UIKitCard, CardBody, useWalletModal } from '@fastswap-uikit'
import { BigNumber } from 'ethers'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'
import _ from 'lodash'
import { FASTTOKEN, DUKETOKEN } from '../../../constants';
import { useTokenContract, useTierContract } from '../../../hooks/useContract'
import { AutoColumn } from '../../../components/Column'
import { TierCard } from '../../../components/TierCard'
import FModal from './FModal'
import comparefy from '../../../utils/comparefy';
import TradeIcon from '../../../img/trade.png'
import Nothing from '../../../img/nothing.png'
import TierTypes from './types'
import Dropdown from '../../../components/DropDown'

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

// const LDivider = styled.div`
//   width: 100%;
//   height: 1px;
//   background: #237745;
//   margin: 24px 0;
// `

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

const DropItem = styled(Button)`
  color: ${({ theme }) => theme.isDark ? '#FFFFFF' : '#000000'};
  border-radius: 8px;
  minHeight: 32px
  height: auto
`
DropItem.defaultProps = {
  variant: "tertiary",
  scale: "sm",
};

interface IProps {
  id?: any
}


const StakeMain: React.FC<IProps> = (id) => {

  // Show Project lists
  useGlobalData()
  const projectData = useProjectData()
  // Get opened project
  const pro_id = id?.id.id;
  // let filtered;
  // filtered = _.filter(projectData, x => comparefy(new Date(parseInt(x.open) * 1000), new Date(parseInt(x.close) * 1000)) !== 0
  //   && x.visibility === 'Published')

  const filtered = projectData?.map((x: any) => {
    let timeType;
    if (comparefy(new Date(parseInt(x.open) * 1000), new Date(parseInt(x.close) * 1000)) === 1) {
      // This project is closed project
      timeType = "Closed"
    } else if (comparefy(new Date(parseInt(x.open) * 1000), new Date(parseInt(x.close) * 1000)) === 0) {
      timeType = "Coming"
    } else {
      // This project is opening project
      timeType = "Opening"
    }
    x = { ...x, timeType }
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

  // Get Box Data
  const [projectID, setProjectID] = useState("");
  const [tierContractAddress, setTierContractAddress] = useState("")
  const [tierType, settierType] = useState(3)
  const [timeType, setTimeType] = useState("")
  const [projectDescription, setProjectDescription] = useState("");
  const [projectFastAmount, setProjectFastAmount] = useState(0);
  const [projectDukeAmount, setProjectDukeAmount] = useState(0);
  const [stakedIsUserStaked, setStakedIsUserStaked] = useState(0);
  const [userStakedFastAmount, setuserStakedFastAmount] = useState(0)
  const [userStakedDukeAmount, setuserStakedDukeAmount] = useState(0)
  const [userTokenContributedAmount, setuserTokenContributedAmount] = useState(0)
  const [whiteListed, setWhiteListed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Get Box data when project is selected
  // useEffect(() => {
  //   if (pro_id) {
  //     const fast = BigNumber.from(filtered.fastAmount).div(BigNumber.from(10).pow(18)).toNumber()
  //     const duke = BigNumber.from(filtered.dukeAmount).div(BigNumber.from(10).pow(18)).toNumber()

  //     setProjectID(filtered._id);
  //     setTierContractAddress(filtered.contractAddress);
  //     settierType(Number(filtered.tier));
  //     setTimeType(filtered.timeType)
  //     setProjectDescription(filtered.description);
  //     setProjectFastAmount(fast)
  //     setProjectDukeAmount(duke)
  //   }
  // }, [pro_id, filtered])

  // const onProjectClicked = async (project_ID: string, tierAddress: string, tier_ABI: string, timetype: string, tier_Description: string, fastAmount: string, dukeAmount: string) => {

  //   const fast = BigNumber.from(fastAmount).div(BigNumber.from(10).pow(18)).toNumber()
  //   const duke = BigNumber.from(dukeAmount).div(BigNumber.from(10).pow(18)).toNumber()

  //   setProjectID(project_ID);
  //   setTierContractAddress(tierAddress);
  //   settierType(Number(tier_ABI));
  //   setTimeType(timetype)
  //   setProjectDescription(tier_Description);
  //   setProjectFastAmount(fast)
  //   setProjectDukeAmount(duke)
  // }

  const tierContract = useTierContract(tierContractAddress, tierType, true)

  useEffect(() => {
    async function fetchStakeData() {
      if (!account) return;
      setIsLoading(true)
      // Check user is staked or not
      let IsUserStaked;
      if (tierType !== 0)
        IsUserStaked = await tierContract?.staked(account) || 0
      // Check user is whitelisted
      let whiteList;
      if (tierType === 0 || tierType === 1)
        whiteList = await tierContract?.whitelist(account)
      setWhiteListed(whiteList)
      // Check users has contributed
      let contibutedAmount = await tierContract?.contributions(account)
      contibutedAmount = contibutedAmount?.div(BigNumber.from(10).pow(18)).toNumber();
      // If user already contributed in project, they are not allowd to unstake in opening project
      setuserTokenContributedAmount(contibutedAmount || 0)
      setIsLoading(false)

      if (!IsUserStaked) return;
      IsUserStaked = await IsUserStaked.toNumber();
      setStakedIsUserStaked(IsUserStaked);
      if (stakedIsUserStaked === 1) {
        // User staked FAST for project
        setuserStakedFastAmount(projectFastAmount)
      }
      else if (stakedIsUserStaked === 2) {
        // User staked Duke for project
        setuserStakedDukeAmount(projectDukeAmount)
      }
    }
    fetchStakeData();
  }, [account, tierContract, projectDukeAmount, projectFastAmount, stakedIsUserStaked, tierType])

  // Stake Modal
  const [stakeModal, setstakeModal] = useState<boolean>(false)
  const [tokenType, setTokenType] = useState("")
  const handleCloseFastModal = useCallback(() => {
    setstakeModal(false)
  }, []);

  const stakeToken = (token) => {
    if (!tierContract) {
      alert("Please select the project first.")
      return;
    }
    if (projectFastAmount === 0 || projectDukeAmount === 0) {
      alert("This project is for white list members only")
      return
    }
    if (token === "fast") {
      if (userFastAmount < projectFastAmount) {
        alert("You don't have enough FAST token for project")
        return
      }
      setTokenType("FAST");
    }
    else {
      if (userDukeAmount < projectDukeAmount) {
        alert("You don't have enough DUKE token for project")
        return
      }
      setTokenType("DUKE");
    }
    setstakeModal(true)
  }


  // Unstake

  const [isUnstaking, setIsUnstaking] = useState(false);
  // const [userTokenContributedAmount, setuserTokenContributedAmount] = useState(0) 

  const unStake = async () => {

    if (userTokenContributedAmount > 0 && timeType === "Opening") {
      alert("You already contributed in project. You can unstake after project is closed.")
    }
    else {
      try {
        setIsUnstaking(true);
        const tx = await tierContract?.unstake();
        const res = await tx.wait(1)
        if (res.status) alert("successfully unstaked");
        else console.log("res", res)

      } catch (err) {
        console.log(err)
      }
      setIsUnstaking(false)
    }
  }

  // Render Box

  const renderBox = () => {
    if (filtered) {
      if (!account) {
        // Connect wallet
        return (
          <AutoColumn>
            <Text style={{ fontWeight: 400, fontSize: '16px', fontFamily: 'Raleway' }} color='#363936'>Please connect your wallet in order to jin the project</Text>
            <LButton style={{ background: '#192219', marginTop: '15px' }} onClick={onPresentConnectModal}><LText style={{ color: '#FCFCFC' }}>CONNECT WALLET</LText></LButton>
          </AutoColumn>
        )
      }
      if (timeType === "Closed") {
        // Closed project, if staked, available to unstake

        if (userTokenContributedAmount >= 0) {
          // User contributed project and can unstaked Token in closed project
          return (
            <AutoColumn>
              <CText style={{ fontWeight: 500, fontSize: "24px" }}>This is closed project</CText>
              <CText style={{ fontWeight: 500, fontSize: "14px" }}>Your FAST Balance</CText>
              <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userFastAmount} FAST</CText>
              <CText style={{ fontWeight: 500, fontSize: "14px" }}>Your DUKE Balance</CText>
              <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userDukeAmount} DUKE</CText>
              <CText style={{ fontWeight: 500, fontSize: "14px" }}>Project</CText>
              <CText style={{ fontWeight: 300, fontSize: "34px" }}>{projectDescription}</CText>
              <CText style={{ fontWeight: 500, fontSize: "14px" }}>Amount Staked</CText>
              <LButton style={{ background: 'none', marginTop: '15px' }}
                onClick={() => unStake()} disabled={isUnstaking} >
                <LText style={{ color: '#192219' }}>
                  UNSTAKE
                </LText>
              </LButton>
              {isLoading ?
                // Loading
                <CText style={{ fontWeight: 300, fontSize: "24px" }}> wait a moment... </CText>
                :
                stakedIsUserStaked === 0 ?
                  <CText style={{ fontWeight: 300, fontSize: "34px" }}> Not Staked </CText>
                  : stakedIsUserStaked === 1 ?
                    <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userStakedFastAmount} FAST</CText>
                    :
                    <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userStakedDukeAmount} DUKE</CText>
              }
              {stakedIsUserStaked === 0 ?
                // Not staked
                <div />
                :
                <LButton style={{ background: 'none', marginTop: '15px' }}
                  onClick={() => unStake()} disabled={isUnstaking} >
                  <LText style={{ color: '#192219' }}>
                    UNSTAKE {stakedIsUserStaked === 1 ? "FAST" : "DUKE"}
                  </LText>
                </LButton>
              }

            </AutoColumn>
          )
        }
        // User didn't stake token in this project
        return (
          <AutoColumn>
            <CText style={{ fontWeight: 500, fontSize: "24px" }}>This project is closed project.</CText>
            <CText style={{ fontWeight: 300, fontSize: "24px" }}>You need to be whitelisted</CText>
          </AutoColumn>
        )
      }

      // Opening project
      if (timeType === "Opening") {
        if (tierType === 0) {
          // Tier1 is white list member only project, user don't need to stake FAST or DUKE
          return (
            <AutoColumn>
              <CText style={{ fontWeight: 500, fontSize: "24px" }}>This project is for only whitelisted members.</CText>
              <CText style={{ fontWeight: 300, fontSize: "24px" }}>You dont need to stake FAST or DUKE for this project</CText>
            </AutoColumn>
          )
        }
        if (tierType === 1 && !whiteListed) {
          // Tier2 is white list member only project, , user need to stake FAST or DUKE
          return (
            <AutoColumn>
              <CText style={{ fontWeight: 500, fontSize: "24px" }}>This project is for only whitelisted members.</CText>
              <CText style={{ fontWeight: 300, fontSize: "24px" }}>You need to be whitelisted</CText>
            </AutoColumn>
          )
        }
        if (userFastAmount < projectFastAmount && userDukeAmount < projectDukeAmount) {
          // Not enough Fast or Duke for staking
          return (
            <AutoColumn>
              <CText style={{ fontWeight: 400, fontSize: '16px', fontFamily: 'Raleway', color: '#192219' }}>In order to participate Launch Spot, you are required to be FAST holder. Read more in FAQ</CText>
              <CText style={{ fontWeight: 500, fontSize: "14px", marginTop: '24px' }}>Your Balance</CText>
              <CText style={{ fontWeight: 300, fontSize: "34px" }}>0 FAST</CText>
              <CText style={{ fontWeight: 300, fontSize: "34px" }}>0 DUKE</CText>
              <LButton style={{ background: 'none', marginTop: '15px' }}>
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
            <CText style={{ fontWeight: 500, fontSize: "24px" }}>This is opening project</CText>
            <CText style={{ fontWeight: 500, fontSize: "14px" }}>Your FAST Balance</CText>
            <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userFastAmount} FAST</CText>
            <CText style={{ fontWeight: 500, fontSize: "14px" }}>Your DUKE Balance</CText>
            <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userDukeAmount} DUKE</CText>
            <CText style={{ fontWeight: 500, fontSize: "14px" }}>Project</CText>
            <CText style={{ fontWeight: 300, fontSize: "34px" }}>{projectDescription}</CText>
            <CText style={{ fontWeight: 500, fontSize: "14px" }}>Amount Staked</CText>
            {isLoading ?
              // Loading
              <CText style={{ fontWeight: 300, fontSize: "24px" }}> wait a moment... </CText>
              :
              stakedIsUserStaked === 0 ?
                <CText style={{ fontWeight: 300, fontSize: "34px" }}> Not Staked </CText>
                : stakedIsUserStaked === 1 ?
                  <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userStakedFastAmount} FAST</CText>
                  :
                  <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userStakedDukeAmount} DUKE</CText>
            }
            {stakedIsUserStaked === 0 ?
              <div>
                <LButton style={{ background: '#192219', marginTop: '30px', width: '100%' }} onClick={() => stakeToken("fast")}><LText style={{ color: '#FCFCFC' }}>APPROVE</LText></LButton>
                <LButton style={{ background: '#192219', marginTop: '30px', width: '100%' }} onClick={() => stakeToken("duke")}><LText style={{ color: '#FCFCFC' }}>JOIN</LText></LButton>
              </div>
              :
              <LButton style={{ background: 'none', marginTop: '15px' }} onClick={() => unStake()} disabled={isUnstaking} ><LText style={{ color: '#192219' }}>UNSTAKE {stakedIsUserStaked ? "FAST" : "DUKE"}</LText></LButton>
            }
          </AutoColumn>
        )
      }

      console.log(timeType === "Coming")
      // Coming project
      if (timeType === "Coming") {
        return (
          <AutoColumn>
            <CText style={{ fontWeight: 500, fontSize: "24px" }}>This is coming project</CText>
            <CText style={{ fontWeight: 500, fontSize: "14px" }}>Your FAST Balance</CText>
            <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userFastAmount} FAST</CText>
            <CText style={{ fontWeight: 500, fontSize: "14px" }}>Your DUKE Balance</CText>
            <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userDukeAmount} DUKE</CText>
            <CText style={{ fontWeight: 500, fontSize: "14px" }}>Project</CText>
            <CText style={{ fontWeight: 300, fontSize: "34px" }}>{projectDescription}</CText>
            <CText style={{ fontWeight: 500, fontSize: "14px" }}>Amount Staked</CText>
            {isLoading ?
              // Loading
              <CText style={{ fontWeight: 300, fontSize: "24px" }}> wait a moment... </CText>
              :
              stakedIsUserStaked === 0 ?
                <CText style={{ fontWeight: 300, fontSize: "34px" }}> Not Staked </CText>
                : stakedIsUserStaked === 1 ?
                  <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userStakedFastAmount} FAST</CText>
                  :
                  <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userStakedDukeAmount} DUKE</CText>
            }
            {stakedIsUserStaked === 0 ?
              <div>
                <LButton style={{ background: '#192219', marginTop: '30px', width: '100%' }} onClick={() => stakeToken("fast")}><LText style={{ color: '#FCFCFC' }}>STAKE FAST</LText></LButton>
                <LButton style={{ background: '#192219', marginTop: '30px', width: '100%' }} onClick={() => stakeToken("duke")}><LText style={{ color: '#FCFCFC' }}>STAKE DUKE</LText></LButton>
              </div>
              :
              <LButton style={{ background: 'none', marginTop: '15px' }} onClick={() => unStake()} disabled={isUnstaking} ><LText style={{ color: '#192219' }}>UNSTAKE {stakedIsUserStaked ? "FAST" : "DUKE"}</LText></LButton>
            }
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

  const [projectId, setProjectId] = useState(0);

  const handleSelect = (index: number) => {
    setProjectId(index);
    setTimeType(filtered[index].timeType);
  }

  return (
    <Wrapper>
      <Container>
        <TabBody>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text style={{ fontWeight: 500, fontFamily: 'Oswald, sans-serif', fontSize: "48px", margin: "10px" }} color="#FCFCFC">STAKING</Text>
            {filtered.length ? <div><Dropdown position='bottom' target={<Button style={{ color: '#ffffff' }} variant='text'>{filtered[projectId].name}</Button>} >
              {filtered.map((project, index) => index !== projectId && <Button style={{ color: '#ffffff' }} variant='text' onClick={() => handleSelect(index)}>{project.name}</Button>)}
            </Dropdown></div> : null}
          </div>
          <MText>Stake FAST / YFT / MVP to participate projects launched. The allocation is calculation base on your tier, see breakdown below.</MText>

          <TierCardWrapper>
            {TierTypes.map((tier, index) => <TierCard {...tier} />)}
          </TierCardWrapper>
        </TabBody>
        <Tab>
          {renderBox()}
        </Tab>
      </Container>
      {stakeModal &&
        <FModal
          onClose={handleCloseFastModal}
          projectID={projectID}
          tokenContract={tokenType === "FAST" ? tokenFASTContract : tokenDUKEContract}
          tierContract={tierContract}
          userAmount={tokenType === "FAST" ? userFastAmount : userDukeAmount}
          stakingAmount={tokenType === "FAST" ? projectFastAmount : projectDukeAmount}
          tokenType={tokenType}
        />
      }
    </Wrapper>
  )
}

export default StakeMain

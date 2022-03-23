import React, { useState } from 'react'
import { BigNumber } from 'ethers'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'
import { Button, Text, Checkbox } from '@fastswap-uikit'
import { useHistory } from 'react-router-dom'
import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed } from 'components/Row'
import { NumberFormatDefinition } from 'ajv'
import { toast } from 'react-toastify'

const Wrapper = styled.div`
  justify-content: space-around;
  width: 100%;
  height: 100%;
  background: #192219;
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;

  ${respondTo.sm`
    display: grid;
  `}

  ${respondTo.xss`

`}
`

const Section = styled.div`
  flex: 1;
  ${respondTo.sm`
    padding: 50px;
  `}
`

const BSection = styled.div`
  flex: 1;
  border-left: 1px solid #237745;
  padding-left: 50px;
  ${respondTo.sm`
    border: 0;
    padding: 50px;
  `}
`

const GText = styled(Text)`
  background-image: linear-gradient(#64F9A1, #0EFFD4, #97AEFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const CText = styled(Text)`
  font-family: Oswald, sans-serif;
  color: #F8F8F8;
`

const LButton = styled(Button)`
  border-radius: 8px;
  height: 64px;
  background-image: linear-gradient(to right, #64F9A1, #0EFFD4, #97AEFF);
`

const LText = styled.span`
  font-family: Oswald,sans-serif;
  font-size: 16px;
  font-weight: 500;
`

const Group = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  padding: 16px;
  background: 
    linear-gradient(#192219, #192219) padding-box, /*this is your grey background*/
    linear-gradient(to bottom, #64F9A1, #97AEFF) border-box;
  border: 1px solid transparent;
  display:inline-block;
  border-radius: 8px;
  ${respondTo.sm`
    
  `}
`

const BtnClose = styled.button`
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  position: absolute;
  top: 28px;
  right: 38px;
  color: #FCFCFC;
  cursor: pointer;
`

const GCheckbox = styled(Checkbox) <any>`
  min-width: 24px;
  width: 24px !important;
  height: 24px !important;
  border-radius: 4px;
  background: linear-gradient(180deg, #64F9A1 0%, #0EFFD4 49.48%, #97AEFF 100%);
  color: #192219;
  display: table;
  &:after {
    display: ${({ checked }) => checked ? 'block' : 'none'};
    border-color: black !important;
    top: 25%;
    left: 10%;
    right: 0;
    width: 61%;
    height: 35%;
  }
`

const AmountInput = styled.p`
  border: none;
  outline: none;
  font-size: 24px;
  font-weight: 500;
  font-family: 'Oswald'; 
  color: #FCFCFC;
  background: transparent;
  &::placeholder {
    color: #FCFCFC;
  }
`

interface IProps {
  onClose: () => void
  projectID?: string
  tokenContract: any
  poolContract: any
  userAmount: number
  stakingAmount: number
  tokenType: string
  tierSymbol: string
}

const FModal: React.FC<IProps> = ({ onClose, projectID, tokenContract, poolContract, userAmount, stakingAmount, tokenType, tierSymbol }) => {

  const history = useHistory();

  const [isApproving, setisApproving] = useState(false)
  const [approved, setApproved] = useState(false)
  const [isTransfering, setIsTransfering] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  const onApprove = async () => {
    try {
      setisApproving(true);
      const txFAST = await tokenContract?.approve(poolContract.address, BigNumber.from(stakingAmount).mul(BigNumber.from(10).pow(18)))
      const receipt = await txFAST.wait()
      if (receipt.status) {
        // Transfer FAST token
        setApproved(true);
      }
      else {
        toast.error('Please try again. Confirm the transaction and make sure you are paying enough gas!', {
          theme: 'colored'
        });
      }
    } catch (err) {
      console.log('err', err);
    }
    setisApproving(false)
  }

  const onTransfer = async () => {
    if (!isChecked) {
      toast.warning('Please accept Check box', {
        theme: 'colored'
      })
      return
    }
    try {
      setIsTransfering(true);
      const txTier = await poolContract?.stakeFast(BigNumber.from(stakingAmount).mul(BigNumber.from(10).pow(18)))
      const res = await txTier.wait()
      if (res.status) {
        // setuserFastAmount(userFastAmount - stakingAmount)
        toast.success('Successfully staked', {
          theme: 'colored'
        })
        history.push(`/project/${projectID}`)
        setIsTransfering(false)
      }
      else {
        toast('Please try again. Confirm the transaction and make sure you are paying enough gas!', {
          theme: 'colored'
        });
        setIsTransfering(false)
      }
    } catch (err) {
      // alert(err?.data.message)
      setIsTransfering(false)
    }

    onClose();
  }

  return (
    <Wrapper>
      <BtnClose onClick={() => onClose()}>✖</BtnClose>
      <Section>
        <AutoColumn style={{ maxWidth: '400px', float: 'right' }}>
          <GText fontSize="48px" fontWeight="500" fontFamily='Oswald'>Stake FAST to participate IDO & earn rewards.</GText>
          <Text style={{ fontWeight: 500, fontFamily: 'Oswald', fontSize: "20px", color: "#FCFCFC" }}>1/2</Text>
        </AutoColumn>
      </Section>
      <BSection>
        {!approved ?
          <AutoColumn style={{ maxWidth: '400px' }}>
            <CText style={{ fontWeight: 500, fontSize: "14px" }}>Your {tokenType} Balance</CText>
            <CText style={{ fontWeight: 300, fontSize: "34px" }}>{userAmount} {tokenType}</CText>
            <CText style={{ fontWeight: 500, fontSize: "14px", paddingTop: '30px' }}>Staking</CText>
            <Group>
              <AutoColumn style={{ width: '100%' }}>
                <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", color: "#CECECE" }}>The amount to stake</CText>
                <RowBetween>
                  <RowFixed>
                    {/* <AmountInput type='text' placeholder='0.00' /> */}
                    <CText style={{ fontWeight: 300, fontSize: "34px" }}>{stakingAmount}</CText>
                  </RowFixed>
                  <RowFixed>
                    <GText fontSize="16px" fontWeight="500" fontFamily='Oswald'>MAX</GText>
                  </RowFixed>
                </RowBetween>
              </AutoColumn>
            </Group>
            <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px" }}>Minimun of 100 FAST is required.</CText>

            <CText style={{ fontWeight: 500, fontSize: "14px", marginTop: '30px' }}>Tier</CText>
            <CText style={{ fontWeight: 300, fontSize: "34px" }}>{tierSymbol}</CText>

            <LButton style={{ marginTop: '30px' }} disabled={isApproving} onClick={() => onApprove()}><LText style={{ color: '#192219' }}>APPROVE</LText></LButton>
            <CText style={{ fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", paddingTop: '10px' }}>By approve, you are agree with Term of condition</CText>
          </AutoColumn>
          :
          <AutoColumn style={{ maxWidth: '400px' }}>

            <CText style={{ fontWeight: 500, fontSize: "14px" }}>You have approved this amount for staking</CText>
            <CText style={{ fontWeight: 300, fontSize: "34px" }}>{stakingAmount} FAST</CText>
            <div style={{ display: 'flex', paddingTop: '24px' }}>
              <GCheckbox checked={isChecked} onClick={() => setIsChecked(!isChecked)} />
              <CText style={{ color: '#FCFCFC', fontFamily: 'Raleway', fontWeight: 400, fontSize: "12px", lineHeight: '14px', paddingLeft: '20px' }}>I understand there will be 7 days of pending period after the project closed. I can only unstake by then.</CText>
            </div>
            <LButton style={{ marginTop: '30px' }} onClick={() => onTransfer()} disabled={isTransfering} ><LText style={{ color: '#192219' }}>CONFIRM</LText></LButton>
          </AutoColumn>
        }

      </BSection>
    </Wrapper>
  )
}

export default FModal

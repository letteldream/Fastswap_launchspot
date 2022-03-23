import React, { useState, useMemo, useCallback } from 'react'
import { BigNumber } from 'ethers'
import styled from 'styled-components'
import { Box, Text, Button } from '@fastswap-uikit'
import CloseImg from 'img/close.png'
import { toast } from 'react-toastify'
import Modal from '.'
import { useTokenContract } from '../../hooks/useContract'
import USER_TOKEN_ABI from '../../constants/temp'

const Description = styled.div`
  color: #cecece;
  font-family: Raleway;
  font-weight: normal;
  font-size: 16px;
  line-height: 20px;
`

const LText = styled.span`
  font-family: Oswald, sans-serif;
  font-size: 16px;
  font-weight: 500;
`

const LButton = styled(Button)`
  border-radius: 8px;
  height: 64px;
  background-image: linear-gradient(to right, #64f9a1, #0effd4, #97aeff);
`

const Group = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  background: linear-gradient(#192219, #192219) padding-box, linear-gradient(to bottom, #64f9a1, #97aeff) border-box;
  border: 1px solid transparent;
  display: inline-block;
  border-radius: 8px;
  min-width: 360px;
  > input {
    border: none;
    outline: none;
    font-family: Oswald;
    font-weight: 500;
    font-size: 24px;
    color: white;
    background: transparent;
  }
`

const GText = styled(Text)`
  background-image: linear-gradient(#64f9a1, #0effd4, #97aeff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const CloseIcon = styled(Box)`
  cursor: pointer;
  position: absolute;
  top: 38.67px;
  right: 38.67px;
`

const StyledContainer = styled(Box)`
  width: 100%;
  height: 100%;
  padding: 64px 32px 32px 32px;
  background: #263126;
  position: relative;
`

interface Props {
  open: boolean
  setOpen: any
  userWalletAmount: any
  current: any
  userTokenContract: any
}

const JoinModalApprove: React.FC<Props> = ({ open, setOpen, userWalletAmount, current, userTokenContract }) => {
  const [price, setPrice] = useState(1)
  const [isApproving, setIsApproving] = useState(false)
  const tokenContract = useTokenContract(userTokenContract.address, true)
  // console.log('user', tokenContract);

  const handleChange = useCallback((e) => {
    setPrice(e.target.value)

  }, [])

  const onApporve = async () => {
    try {
      if (Number(price) > Number(userWalletAmount)) {
        // Not enough price in wallet
        toast.warning('Sorry, Your amount is small', {
          theme: 'colored'
        })
      } else {

        setIsApproving(true)
        console.log('currentContractAddress', current.contractAddress)
        const tx = await tokenContract?.approve(current.contractAddress, BigNumber.from(price).mul(BigNumber.from(10).pow(18)))
        console.log('tx', tx)
        const receipt = await tx.wait()
        if (receipt.status) {
          toast.success("Approved tokens", {
            theme: 'colored'
          });
          setIsApproving(false)
        }
        else {
          toast.error('Please try again. Confirm the transaction and make sure you are paying enough gas!', {
            theme: 'colored'
          });
          setIsApproving(false)
        }
      }
    } catch (err) {
      console.log('err', err)
    }
    setIsApproving(false)
    setOpen(false)
  }

  // const buyTokens = useSingleCallResult(tierContract, 'buyTokens', price)

  return (
    <Modal isOpen={open} onDismiss={() => setOpen(!open)} maxHeight={100}>
      <StyledContainer>
        <CloseIcon onClick={() => setOpen(false)}>
          <img src={CloseImg} alt="" />
        </CloseIcon>
        <GText fontSize="48px" fontWeight="500" fontFamily="Oswald">
          Join DOP
        </GText>
        <Description style={{ marginTop: '24px' }}>Enter the amount of USDT you would like to participate</Description>
        <Group style={{ marginTop: '16px' }}>
          <input type="text" defaultValue="1" onChange={handleChange} />
        </Group>
        <LButton style={{ marginTop: '16px', width: '100%' }}
          onClick={() => onApporve()}
          disabled={isApproving}
          isLoading={isApproving}>
          <LText style={{ color: '#131413' }}>APPROVE</LText>
        </LButton>
      </StyledContainer>
    </Modal>
  )
}

export default JoinModalApprove

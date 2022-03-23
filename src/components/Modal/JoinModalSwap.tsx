import React, { useState, useMemo, useCallback } from 'react'
import { BigNumber } from 'ethers'
import styled from 'styled-components'
import { Box, Text, Button } from '@fastswap-uikit'
import CloseImg from 'img/close.png'
import { toast } from 'react-toastify'
import { useTierContract, usePoolContract } from '../../hooks/useContract'
import Modal from '.'

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
  current: any
  userAllowanceAmount: number
}

const JoinModalSwap: React.FC<Props> = ({ open, setOpen, current, userAllowanceAmount }) => {

  const [price, setPrice] = useState(1)
  const [isSwapping, setIsSwapping] = useState(false)

  const handleChange = useCallback((e) => {
    setPrice(e.target.value)

  }, [])

  // const tierContract = useTierContract(current.contractAddress, parseInt(current.tier), true)
  const tierContract = usePoolContract(current?.contractAddress, true)
  // console.log('tierContract', tierContract)

  const onSwap = async () => {

    // Not enough price in wallet

    if (Number(userAllowanceAmount) < Number(price)) {
      toast.warning('Sorry, Your approved amount is small.', {
        theme: 'colored'
      })
    } else {
      try {
        setIsSwapping(true)
        console.log('before tx')
        const tx = await tierContract?.purchase(BigNumber.from(price).mul(BigNumber.from(10).pow(18)))
        console.log('after tx')
        const res = await tx.wait(1)
        console.log('after tx')
        if (res.status) {
          toast.success("Successfully Staked", {
            theme: 'colored'
          })
        } else {
          toast.warning("Please try again. Confirm the transaction and make sure you are paying enough gas!", {
            theme: 'colored'
          })
        }
        const tx_claim = await tierContract?.claimTokens()
        const res_claim = await tx_claim.wait()
        if (res_claim.status) {
          toast.success("Successfully Swapped", {
            theme: 'colored'
          })
        } else {
          toast.warning("Please try again. Confirm the transaction and make sure you are paying enough gas!", {
            theme: 'colored'
          })
        }
      } catch (err) {
        console.log('err', err)
        toast.error('Error', {
          theme: 'colored'
        });
      }
      setIsSwapping(false)
      setOpen(false)
    }
  }

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
          onClick={() => onSwap()}
          disabled={isSwapping}
          isLoading={isSwapping}
        >
          <LText style={{ color: '#131413' }}>SWAP</LText>
        </LButton>
      </StyledContainer>
    </Modal>
  )
}

export default JoinModalSwap

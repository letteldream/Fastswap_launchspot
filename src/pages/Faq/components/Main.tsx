import React from 'react'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'
import { AutoColumn } from '../../../components/Column'
import FaqCard from './FaqCard'

const Wrapper = styled.div`
  padding: 0 150px;
  margin-bottom: 74px;
  margin-top: 100px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  jusify-content: space-between;
  ${respondTo.sm`
    padding: 0 32px;
    margin-bottom: 52px;
    margin-top: 24px;
  `}
`

// const Tab = styled.div`
//   // flex: 1;
//   background-image: linear-gradient(#64F9A1, #0EFFD4, #97AEFF);
//   min-width: 430px;
//   border-radius: 24px;
//   margin: 10px;
//   padding: 32px;
// `

// const TabBody = styled.div`
// `

// const CText = styled(Text)`
//   font-family: Oswald, sans-serif;
//   color: #363936;
// `

// const LButton = styled(Button)`
//   border: 10px solid #192219;
//   border-width: 2px;
//   border-radius: 8px;
// `

// const LText = styled.span`
//   font-family: Oswald,sans-serif;
//   font-size: 16px;
//   font-weight: 500;
// `

// const LDivider = styled.div`
//   width: 100%;
//   height: 1px;
//   background: #237745;
//   margin: 24px 0;
// `

// const HText = styled(Text)`
//   font-size: 24px;
//   font-weight: 500;
//   font-family: Oswald;
//   color: #A0F0CE;
// `

// const BText = styled(Text)`
//   font-size: 14px;
//   font-weight: 500;
//   font-family: Oswald;
//   color: #CECECE;
// `

// const MText = styled(Text)`
//   font-size: 16px;
//   font-weight: 400;
//   font-family: Raleway;
//   color: #FCFCFC;
//   margin: 20px 10px 10px 10px;
// `

// const Section = styled.div`
//   padding-top: 10px;
//   padding-bottom: 10px;
//   display: flex;
//   align-items: center;
//   ${respondTo.sm`
    
//   `}
// `

const Main: React.FC = () => {
  // const data = useGetStats()
  // const trade = data ? data['24h_total_volume'] : 0
  // const value = data ? data.total_value_locked : 0

  // const globalData: any = useGlobalData()
  // const liqudiity = globalData ? Number(globalData.totalLiquidityUSD).toFixed(3) : 0

  // const [showModal, setShowModal] = useState<boolean>(false)

  // const handleCloseModal = useCallback(() => {
  //   setShowModal(false)
  // }, []);

  return (
    <Wrapper>
      <AutoColumn>
        <FaqCard />
        <FaqCard />
        <FaqCard />
      </AutoColumn>
    </Wrapper>
  )
}

export default Main

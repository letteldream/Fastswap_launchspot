import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from 'components/Column'
import { Text, Card as UIKitCard } from '@fastswap-uikit'
import web3 from 'web3'

import respondTo from 'style/RespondTo'
import commafy from 'utils/commafy'
// import { useToken } from 'hooks/Tokens'
import { useHistory } from 'react-router-dom'

interface Props {
    _id: string;
    name: string;
    visibility: string;
    swapTokens: string;
    symbol: string;
    swapRate: string;
    softcap: string;
    hardcap: string;
    open: string;
    close: string;
}

const MText = styled(Text)`
  font-size: 16px;
  font-weight: 400;
  font-family: Raleway;
  color: #CECECECE;
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
  background: none;
  border: 1px solid #363936;
  margin: 2px;
  border-radius: 8px;
  padding-left: 30px;
  padding-right: 30px;
  cursor: pointer;
  ${respondTo.sm`
  `}
  ${respondTo.md`
    margin-top: 24px;
  `}
`

const ProjectRow: React.FC<Props> = ({ _id, name, visibility, swapTokens, symbol, swapRate, softcap, hardcap, open, close }) => {
    const history = useHistory()
    return (
        <>
            <BUIKitCard onClick={() => history.push(`/admin/projects/add/${_id}`)}>
                <div style={{ display: 'flex' }}>
                    <AutoColumn style={{ width: '100%' }}>
                        <Section>
                            <AutoColumn style={{ flex: 1 }}>
                                <MText>{name}</MText>
                            </AutoColumn>
                            <AutoColumn style={{ flex: 1 }}>
                                <MText>{visibility}</MText>
                            </AutoColumn>
                            <AutoColumn style={{ flex: 1 }}>
                                {/* <MText>{swapTokens === "0" ? "USDT" : "FAST"}</MText> */}
                                <MText>{symbol}</MText>
                            </AutoColumn>
                            <AutoColumn style={{ flex: 1 }}>
                                <MText>1 : {web3.utils.fromWei(swapRate)}</MText>
                            </AutoColumn>
                            <AutoColumn style={{ flex: 1 }}>
                                <MText>{commafy(web3.utils.fromWei(softcap))}, {commafy(web3.utils.fromWei(hardcap))}</MText>
                            </AutoColumn>
                            <AutoColumn style={{ flex: 1 }}>
                                <MText>{visibility === 'Draft' ? 'N/A' : `${new Date(parseInt(open) * 1000).getFullYear()}/${new Date(parseInt(open) * 1000).getMonth() + 1}/${new Date(parseInt(open) * 1000).getDate()}`}</MText>
                            </AutoColumn>
                            <AutoColumn style={{ flex: 1 }}>
                                <MText>{visibility === 'Draft' ? 'N/A' : `${new Date(parseInt(close) * 1000).getFullYear()}/${new Date(parseInt(close) * 1000).getMonth() + 1}/${new Date(parseInt(close) * 1000).getDate()}`}</MText>
                            </AutoColumn>
                        </Section>
                    </AutoColumn>
                </div>
            </BUIKitCard>
        </>
    )
}

export default ProjectRow
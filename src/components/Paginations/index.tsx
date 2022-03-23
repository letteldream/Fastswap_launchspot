import React from 'react'
import { Box } from '@fastswap-uikit'
import styled from 'styled-components'
import _ from 'lodash'

interface Props {
    page: any
    setPage: any
    totalCount: number
    step: number
}

const PageItem = styled.button<any>`
    cursor: pointer;
    outline: none;
    background: transparent;
    border: 2px solid ${({ active }) => active ? '#A0F0CE' : 'transparent'};
    border-radius: 50%;
    width: 40px; height: 40px;
    font-family: Oswald;
    color: white;
`

// const PrevButton = styled.button`
//     border: none; outline: none;
//     background: white;
//     border-radius: 50%;
//     width: 40px; height: 40px;
//     &:disabled {
//         cursor: not-allowed;
//     }
// `

// const NextButton = styled.button`
//     border: none; outline: none;
//     background: white;
//     border-radius: 50%;
//     width: 40px; height: 40px;
//     &:disabled {
//         cursor: not-allowed;
//     }
// `

const StyledContainer = styled(Box)`
    margin-top: 70px;
    justify-content: center;
    >button:not(:first-of-type, :last-of-type) {
        transition: .3s;
        &:hover {
            background: #ccc;
        }
    }
`

const Pagination:React.FC<Props> = ({ page, setPage, totalCount, step }) => {
    const pages = Array(Math.ceil(totalCount > 0 ? totalCount / step : 1)).fill('')

    // const handlePrevNext = (count) => {
    //     setPage(prev => prev + count)
    // }

    return (
        <StyledContainer display='flex'>
            {/* <PrevButton disabled={page === 1} onClick={() => handlePrevNext(-1)}>{'<'}</PrevButton> */}

            {_.map(pages, (each, i) =>
                <PageItem key={i} active={page === i + 1 ? 1 : 0} component='button' onClick={() => setPage(i + 1)}>
                    {i + 1}
                </PageItem>
            )}

            {/* <NextButton disabled={page === pages.length} onClick={() => handlePrevNext(1)}>{'>'}</NextButton> */}
        </StyledContainer>
    )
}

export default Pagination
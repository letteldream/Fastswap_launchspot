import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { Box, Flex } from '@fastswap-uikit'
import respondTo from 'style/RespondTo'
import useGlobalData from 'hooks/useGlobalData'
import { useProjectData } from 'state/projects/hooks'
import Nothing from 'img/nothing.png'
import { ProjectCard } from '../../../components/ProjectCard'
import comparefy from '../../../utils/comparefy';

const Wrapper = styled.div<any>`
  padding-left: 30px;
  ${({ center }) => !center && 'justify-content: space-around;'}
  display: flex;
  text-align: left;
  flex-wrap: wrap;

  ${respondTo.lg`
    padding-left: 0;
  `}
  ${respondTo.sm`
    width: 100%;
  `}

  ${respondTo.xss`

`}
`

interface Props {
  timeType: number
}

const ProjectCardList: React.FC<Props> = ({ timeType }) => {
  useGlobalData()
  const projectData = useProjectData()
  
  const filtered = _.filter(projectData, x => comparefy(new Date(parseInt(x.open) * 1000), new Date(parseInt(x.close) * 1000)) === timeType && x.visibility === 'Published')
  return (
    <Wrapper center={filtered.length > 0 ? 1 : 0}>
      {filtered.length > 0 ?
        _.map(filtered, (x, i) =>
          <ProjectCard key={i} {...x} />
        )
        :
        <Flex display='flex' flexDirection='column' alignItems='center'>
          <Box>
            <img src={Nothing} alt='' />
          </Box>
          <Box style={{ fontWeight: 400, fontFamily: 'Raleway', fontSize: '16px', color: '#FCFCFC' }}>No projects currently open</Box>
        </Flex>
      }
    </Wrapper>
  )
}

export default ProjectCardList

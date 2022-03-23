import React from 'react'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'
import _ from 'lodash'
import useGlobalData from 'hooks/useGlobalData'
import { useProjectData } from 'state/projects/hooks'
import { ProjectCard } from '../../../components/ProjectCard'

const Wrapper = styled.div`
  overflow: auto;
  margin: 90px auto;
  max-width: 80%;
  display: flex;
  text-align: left;
  ${respondTo.sm`
    width: 100%;
  `}

  ${respondTo.xss`

`}
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary}; 
    border-radius: 8px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px ${({ theme }) => theme.colors.primary}; 
    border-radius: 10px;
  }
`

const ProjectGardGallery: React.FC = () => {
  useGlobalData()
  const projectData = useProjectData()
  return (
    <Wrapper>
      {_.map(_.filter(projectData, x => x.visibility === 'Published'), (x, i) =>
        <ProjectCard key={i} {...x} />
      )}
    </Wrapper>
  )
}

export default ProjectGardGallery

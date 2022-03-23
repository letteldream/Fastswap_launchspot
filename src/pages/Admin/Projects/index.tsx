import React, { useState } from 'react'
import _ from 'lodash'
import { Box } from '@fastswap-uikit'
import LayoutDefault from 'components/LayoutDefault'
import useGlobalData from 'hooks/useGlobalData'
import { useProjectData } from 'state/projects/hooks'
import Pagination from 'components/Paginations'
import Main from './components/Main'
import Header from './components/Header'

const Projects: React.FC = () => {
  useGlobalData()
  const [page, setPage] = useState(1)
  const projectData = useProjectData()
  return (
    <LayoutDefault>
      <Header />
      <Main projectData={_.filter(projectData, (x, i) => i >= 10 * (page - 1) && i <= 10 * (page - 1) + 9)} />
      {projectData && projectData.length > 0 &&
        <Box style={{ marginBottom: '98px' }}>
          <Pagination step={10} totalCount={projectData.length} page={page} setPage={setPage} />
        </Box>
      }
    </LayoutDefault>
  )
}

export default Projects

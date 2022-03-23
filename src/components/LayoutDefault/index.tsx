import React from 'react'
import styled from 'styled-components'
import respondTo from 'style/RespondTo'
import back1 from 'img/bg1.png'
import back2 from 'img/bg2.png'
import { useLocation } from 'react-router-dom';

const LayoutOut = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  z-index: 1;

  ${respondTo.sm`
    margin: 0;
`}
`

const LayoutContent = styled.div<any>`
  background: url(${({ path }) => (path.search('staking') !== -1 || path.search('admin/projects') !== -1 || path.search('faq') !== -1) ? 'unset' : path.search('project/') !== -1 ? back2 : back1}) no-repeat;
  ${({ path }) => (path.search('admin/projects') !== -1 || path.search('faq') !== -1) && 'background-color: #192219;'}
  background-position-x: 40%;
  background-size: 100% auto;
  flex: 1 0 auto;
  width: 100%;
  min-width: 320px;
`

const LayoutDefault: React.FC = ({ children }) => {
  const location = useLocation()
  return (
    <LayoutOut>
      <LayoutContent path={location.pathname}>{children}</LayoutContent>
    </LayoutOut>
  )
}

export default LayoutDefault

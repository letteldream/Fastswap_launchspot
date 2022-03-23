import React from 'react'
import styled from 'styled-components'
import LayoutDefault from 'components/LayoutDefault'
import back from 'img/bg1.png'
import Header from './components/Header'
import Main from './components/Main'
import Text from './components/Text'
import Body from './components/Body'
import Cline from './components/Cline'
import Footer from './components/Footer'

const Back = styled.div`
  background-image: url(${back});
  background-size: 100% 100%;
`

const Home: React.FC = () => {
  return (
    <LayoutDefault>
      <Back>
        <Header />
        <Main />
        <Text />
      </Back>
      <Cline />
      <Body />
      <Footer />
    </LayoutDefault>
  )
}

export default Home

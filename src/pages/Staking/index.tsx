import React from 'react'
import LayoutDefault from 'components/LayoutDefault'
import Header from './components/Header'
import StakeMain from './components/StakeMain'
import Footer from './components/Footer'

interface IProps {
  id? : any
}

const Staking: React.FC<IProps> = (id) => {
  return (
    <LayoutDefault>
      <Header />
      <StakeMain id = {id}/>
      <Footer />
    </LayoutDefault>
  )
}

export default Staking

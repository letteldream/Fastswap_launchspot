import React from 'react'
import LayoutDefault from 'components/LayoutDefault'
import Header from './components/Header'
import Projects from './components/Projects'
import ProjectDetail from './components/ProjectDetail'
import Footer from './components/Footer'

interface IProps {
  id? : any
}


const Project: React.FC<IProps> = ({ id }) => {

  if (id){
    return (
      <LayoutDefault>
        <Header />
        <ProjectDetail id={id} />
        <Footer />
      </LayoutDefault>
    )
  }
  
  return (
    <LayoutDefault>
      <Header />
      <Projects />
      <Footer />
    </LayoutDefault>
  )
}

export default Project

import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { ToastContainer } from 'react-toastify'
import PrivateRoute from 'components/Routes/PrivateRoute'
import Popups from '../components/Popups'
import Web3ReactManager from '../components/Web3ReactManager'
import { EN, allLanguages } from '../constants/localisation/languageCodes'
import { LanguageContext } from '../hooks/LanguageContext'
import { TranslationsContext } from '../hooks/TranslationsContext'
import langSrc from '../constants/localisation/translate/index'
import Landing from './Landing'
import Project from './Project'
import Staking from './Staking'
import Faq from './Faq'
import AdminLogin from './Admin/Login'
import AdminProjects from './Admin/Projects'
import AdminAddProjects from './Admin/Projects/components/Add'
import Menu from '../components/Menu'
import 'utils/axiosSetting'
import 'react-toastify/dist/ReactToastify.css'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 32px 16px;
  align-items: center;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  justify-content: center;
  background-repeat: no-repeat;
  background-position: bottom 24px center;
  background-size: 90%;

  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    background-repeat: no-repeat;
    background-position: center 420px, 10% 230px, 90% 230px;
    background-size: contain, 266px, 266px;
    min-height: 90vh;
  }
`

const Marginer = styled.div`
  // padding-top: 5rem;
`

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<any>(undefined)
  const [translatedLanguage, setTranslatedLanguage] = useState<any>(undefined)
  const [translations, setTranslations] = useState<Array<any>>([])

  const getStoredLang = (storedLangCode: string) => {
    return allLanguages.filter((language) => {
      return language.code === storedLangCode
    })[0]
  }

  useEffect(() => {
    const storedLangCode = localStorage.getItem('pancakeSwapLanguage')
    if (storedLangCode) {
      const storedLang = getStoredLang(storedLangCode)
      setSelectedLanguage(storedLang)
    } else {
      setSelectedLanguage(EN)
    }
  }, [])

  const getLang = () => {
    return langSrc[selectedLanguage.code] ? langSrc[selectedLanguage.code].src : []
  }

  const fetchTranslationsForSelectedLanguage = async () => {
    setTranslations(getLang())
    setTranslatedLanguage(selectedLanguage)
  }

  useEffect(() => {
    if (selectedLanguage) {
      fetchTranslationsForSelectedLanguage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage])

  return (
    <Suspense fallback={null}>
      <HashRouter>
        <AppWrapper>
          <LanguageContext.Provider
            value={{ selectedLanguage, setSelectedLanguage, translatedLanguage, setTranslatedLanguage }}
          >
            <TranslationsContext.Provider value={{ translations, setTranslations }}>
              <Popups />
              <Web3ReactManager>
                <Switch>
                  <Route exact strict path="/" component={Landing} />
                  <Route exact strict path="/project" component={Project} />
                  <Route exact strict path="/project/:pro_id" render={({ match }) => <Project id={match.params.pro_id} />} />
                  <Route exact strict path="/staking" component={Staking} />
                  <Route exact strict path="/staking/:pro_id" render={({ match }) => <Staking id={match.params.pro_id} />} />
                  <Route exact strict path="/faq" component={Faq} />
                  <Route exact strict path="/admin/login" component={AdminLogin} />
                  <PrivateRoute exact strict path="/admin/projects" component={AdminProjects} />
                  <PrivateRoute exact strict path="/admin/projects/add" component={AdminAddProjects} />
                  <Route exact strict path="/admin/projects/add/:pro_id" render={({ match }) => <AdminAddProjects match={match} />} />
                  <Redirect to='/admin/login' />
                  <Menu>
                    <BodyWrapper>

                      {/* Redirection: These old routes are still used in the code base */}
                    </BodyWrapper>
                  </Menu>
                </Switch>
              </Web3ReactManager>
              <Marginer />
              <ToastContainer />
            </TranslationsContext.Provider>
          </LanguageContext.Provider>
        </AppWrapper>
      </HashRouter>
    </Suspense>
  )
}

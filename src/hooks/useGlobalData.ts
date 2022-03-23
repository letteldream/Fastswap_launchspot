import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { doGetAllProjects } from 'state/projects/actions'

const useGlobalData = () => {
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    axios.get('http://localhost:3001/api/projectController/projects')
      .then((res) => {
        // console.log('res.data.projectData', res.data.projectData);
        dispatch(doGetAllProjects({ 'projectData': res.data.projectData }))
      })
      .catch(err => err)
  }, [dispatch])
}

export default useGlobalData

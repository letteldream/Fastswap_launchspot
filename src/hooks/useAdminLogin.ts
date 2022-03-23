import axios from 'axios'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

const useAdminLogin = (account) => {
  const history = useHistory()
  useEffect(() => {
    console.log('accout', account);
    if (account) {
      
      axios.post('http://localhost:3001/api/authController/checkAdmin', { 'account': account })
        .then((res) => {
          if (res.data.success) {
            localStorage.setItem('adaToken', res.data.token)
            history.push('/admin/projects')
          }
          else alert('failed to check')
        })
    }
  }, [account, history])

}

export default useAdminLogin

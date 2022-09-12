import { url } from '../config/config'

const signup = async ({name, email, password }) => {

    try {
      let response = await fetch(url + 'user/signup', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({name, email , password})
      })
      return await response.json()
    } catch (err) {
      console.log(err)
    }
  }  
  
  export {
      signup
  }
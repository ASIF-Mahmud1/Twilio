import { url } from '../config/config'

const signup = async ({name, email, password, admin }) => {

    try {
      let response = await fetch(url + 'user/signup', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({name, email , password, admin})
      })
      return await response.json()
    } catch (err) {
      console.log(err)
    }
  }  

  const signupGroupChat = async ({name, email, password, admin , room_id}) => {

    try {
      let response = await fetch(url + 'user/signup-group-chat', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({name, email , password, admin, room_id})
      })
      return await response.json()
    } catch (err) {
      console.log(err)
    }
  }  
   
  
  export {
      signup, 
      signupGroupChat
  }
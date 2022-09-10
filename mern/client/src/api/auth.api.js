import { url } from '../config/config'

const signin = async ({ email, password }) => {

  try {
    let response = await fetch(url + 'auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({email , password})
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}  

const getTwilioToken = async ({ email }) => {

  try {
    let response = await fetch(url + 'auth/twilioToken', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({email })
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}  



export{
    signin,
    getTwilioToken
}
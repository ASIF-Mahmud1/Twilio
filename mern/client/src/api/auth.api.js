import { url } from '../config/config'

const getTwilioToken = async ({ email }) => {

  try {
    let response = await fetch(url + 'twilioToken', {
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
    getTwilioToken
}
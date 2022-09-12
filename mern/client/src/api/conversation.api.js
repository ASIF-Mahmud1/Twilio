import { url } from '../config/config'

const list = async () => {

    try {
      let response = await fetch(url + 'conversation/list', {
        method: 'GET',
      //  headers: {
       //   Accept: 'application/json',
        //  'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`,
       // },
      })
      return await response.json()
    } catch (err) {
      console.log(err)
    }
  } 
 
const addParticipant = async ({sid,identity }) => {

  try {
    let response = await fetch(url + 'conversation/addParticipant', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify( {sid,identity })
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}    

export{
    list,
    addParticipant
}
  
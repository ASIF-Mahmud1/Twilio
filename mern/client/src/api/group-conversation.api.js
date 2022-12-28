import { url ,localUrl} from '../config/config'

const list = async () => {

  try {
    let response = await fetch(url + 'groupConversation/list', {
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

const createGroupChat = async ({name, email, room_id }) => {

  try {
    let response = await fetch(url + 'groupConversation/addParticipant', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify( {name, email, room_id  })
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}
 
const addParticipant = async ({sid,identity }) => {

  try {
    let response = await fetch(url + 'groupConversation/addParticipant', {
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

const getParticipantByConversationSID = async ({sid }) => {

  try {
    let response = await fetch(url + 'groupConversation/listParticipant/'+sid, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
     
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}   

const deleteConversationBySID = async ({sid }) => {

  try {
    let response = await fetch(url + 'groupConversation/remove/'+sid, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
     
    })
    return await response.json()
  } catch (err) {
    console.log(err)
  }
}    



export{
  list,
  createGroupChat,
  addParticipant,
  getParticipantByConversationSID,
  deleteConversationBySID
}
  
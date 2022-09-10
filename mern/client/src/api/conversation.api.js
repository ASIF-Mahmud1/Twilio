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

export{
    list
}
  
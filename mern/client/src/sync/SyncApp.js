import React, { useState, useCallback, useEffect } from "react";
import {Client as SyncClient }  from 'twilio-sync'
import OnlineUsers from './OnlineUsers.js';
import { getSyncTwilioToken } from "../api/auth.api.js";
import {setUniqueId} from '../utils/helper'

let info={
 id: setUniqueId(),
 requestedUserId:setUniqueId(),
 requestedUserName:'',
 roomName:'',
 roomId:setUniqueId(),
 onGoing:false,
 users:[],
 url:'',
}

const SyncApp=()=>{
    const [identity, setIdentity] = useState('');
    const [localUser, setLocalUser] = useState(null);
    const [onlineUsersSyncList, setOnlineUsersSyncList] = useState(null);
  
    const getAccessToken = async () => {
       
        try {
            const result= await getSyncTwilioToken({email:identity})
            if(result.twilioToken)
            {
                const syncClient = new SyncClient(result.twilioToken);
                const SyncList = await syncClient.list('online-users');
                info.requestedUserName=identity
                info.roomName= "Room for "+identity
                info.url='www.url.meetup.'+identity
                const localUser = await SyncList.push({name: identity, info:info})

                await setLocalUser(localUser);
                await setOnlineUsersSyncList(SyncList);

            }
            else 
            {
                alert("Something went wrong")
            }
        } catch (error) {
            alert("Error retrieving Sync Token ")
            console.log("Error retrieving Sync Token ", error);
        }
       
      }

      
    return (
        <div className="app">
        {
          localUser && onlineUsersSyncList
          ? <OnlineUsers localUser={localUser} onlineUsersSyncList={onlineUsersSyncList} />
          : <div>
              <input 
                type="text" 
                value={identity} 
                onChange={(event) => setIdentity(event.target.value)}
                placeholder="Enter your name"></input>
              <button onClick={getAccessToken}>Connect to App and show you're online!</button>
            </div>
        }
        </div>
      );
      
}

export default SyncApp
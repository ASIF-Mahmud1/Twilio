import React, { useState, useCallback, useEffect } from "react";

const OnlineUsers=({localUser, onlineUsersSyncList})=>{
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        getSetOnlineUsers();
    
        onlineUsersSyncList.on('itemAdded', event => {
          if (!event.isLocal) {
            getSetOnlineUsers();
          }
        });
    
        onlineUsersSyncList.on('itemRemoved', getSetOnlineUsers);

       onlineUsersSyncList.on('itemUpdated', item => {
       // alert("UPDATED")
        console.log("Item Updated", item?.item?.descriptor?.data.info)
       
    });
    
        window.addEventListener("beforeunload", removeParticipant);
      }, []);

    // Gets current list of online users from Sync
    const getSetOnlineUsers = async () => {
        const items = await onlineUsersSyncList.getItems();
        setOnlineUsers(items.items);
    }

    // Removes local user from Sync list
    const removeParticipant = async () => {
        const list = await onlineUsersSyncList.remove(localUser.index)
        list.close();
    }

    const handleRemoveParticipant=async(index)=>{
      const list = await onlineUsersSyncList.remove(index)
      
    }

    const handleUpdateParticipant=async(p, key , value)=>{
      

      const list = await onlineUsersSyncList.update(p.index,{name: p.data.name, info: {...p.data.info, [key]: value}});

    }

    console.log("Online Users ",onlineUsers);
   // console.log("Local Users ",localUser);

    return (
        <div className="participants">
        <h2>Online users:</h2>
        {
          onlineUsers.map((p) =>{return(
            <div style={{display:'flex',flex:1, flexDirection:'row', alignItems:'center',}}>
               <div key={p.index}>{p.data.name}: {p.index}</div>
               <button onClick={()=>handleRemoveParticipant(p.index)}>Remove fromd Queue</button>
               <button onClick={()=>handleUpdateParticipant(p, "on_going",true)}>Update On Going True</button>
               <button onClick={()=>handleUpdateParticipant(p, "on_going", false)}>Update On Going False</button>

               <button onClick={()=>handleUpdateParticipant(p,"is_scheduled", true)}>Booking Scheduled  True</button>
               <button onClick={()=>handleUpdateParticipant(p, "is_scheduled",false)}>Booking Scheduled False</button>

            </div>
          )
        })
        }
      </div>
    )
}

export default OnlineUsers
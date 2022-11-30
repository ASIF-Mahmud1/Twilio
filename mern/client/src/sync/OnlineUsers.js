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


    return (
        <div className="participants">
        <h2>Online users:</h2>
        {
          onlineUsers.map(p => <div key={p.index}>{p.data.name}</div>)
        }
      </div>
    )
}

export default OnlineUsers
import React, { useState, useCallback, useEffect } from "react";
import Video from "twilio-video";
import Lobby from "./Lobby";
import Room from "./Room";
import {getTwilioTokenVideo} from'../api/auth.api'

const VideoChat = () => {
  const [username, setUsername] = useState("Admin");
  const [roomName, setRoomName] = useState("Caratell Shop Live");
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const handleRoomNameChange = useCallback((event) => {
    setRoomName(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setConnecting(true);
      try {
        const data = await getTwilioTokenVideo({ identity: username, room: roomName })
        if(!data.error)
        {
          console.log("Apart ", data);
          Video.connect(data.twilioToken, {
            name: roomName,
          })
            .then((room) => {
              setConnecting(false);
              setRoom(room);
            })
            .catch((err) => {
              console.error(err);
              setConnecting(false);
            });
        }
        else
        {

        }
      } catch (error) {
        
      }
   
      //////////////////////////////////////////////////
      // fetch("/video/token", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     identity: username,
      //     room: roomName,
      //   }),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // }).then((res) => res.json());
      // Video.connect(data.token, {
      //   name: roomName,
      // })
      //   .then((room) => {
      //     setConnecting(false);
      //     setRoom(room);
      //   })
      //   .catch((err) => {
      //     console.error(err);
      //     setConnecting(false);
      //   });
      //////////////////////////////////////////////////

    },
    [roomName, username]
  );

  const handleLogout = useCallback(() => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      return null;
    });
  }, []);

  useEffect(() => {
    if (room) {
      const tidyUp = (event) => {
        if (event.persisted) {
          return;
        }
        if (room) {
          handleLogout();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);
      return () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
      };
    }
  }, [room, handleLogout]);

  let render;
  if (room) {
    render = (
      <Room roomName={roomName} room={room} handleLogout={handleLogout} />
    );
  } else {
    render = (
      <Lobby
        username={username}
        roomName={roomName}
        handleUsernameChange={handleUsernameChange}
        handleRoomNameChange={handleRoomNameChange}
        handleSubmit={handleSubmit}
        connecting={connecting}
      />
    );
  }
  return render;
};

export default VideoChat;

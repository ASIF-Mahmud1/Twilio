import React, { useEffect, useState } from "react";
import Participant from "./Participant";

const Room = ({ roomName, room, handleLogout }) => {
  const [participants, setParticipants] = useState([]);
  const [videoEnabled, setVideo]= useState(true)
  const [audioEnabled, setAudio]= useState(true)

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    return () => {
      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  const handleAudio=()=>{
    if(audioEnabled)
    {
      room.localParticipant.audioTracks.forEach(publication => {
        publication.track.disable();
      });
      
      setAudio(prevState=> !prevState)
    }
    else 
    {
      room.localParticipant.audioTracks.forEach(publication => {
        publication.track.enable();
      });
      
      setAudio(prevState=> !prevState)
    }
  }
  const handleVideo=()=>{
    if(videoEnabled)
    {
      room.localParticipant.videoTracks.forEach(publication => {
        publication.track.disable();
      });
      setVideo(prevState=> !prevState)
    }
    else 
    {
      room.localParticipant.videoTracks.forEach(publication => {
        publication.track.enable();
      });
      setVideo(prevState=> !prevState)
    }

  }
  return (
    <>
        <div style={{display:'flex', flexDirection:'column',borderWidth:1, borderColor:'red'}}>
       <br/>
       <button onClick={handleAudio}>Audio is {audioEnabled? "ON":"OFF"}</button><br/>
      <button onClick={handleVideo}>Video is {videoEnabled? "ON":"OFF"}</button>
   
       <br/>
      </div>
    <div className="room">
     
      <h2>Room: {roomName}</h2>
      <button onClick={handleLogout}>Log out</button>
  
      <div className="local-participant">
        {room ? (
          <Participant
          key={room.localParticipant.sid}
          participant={room.localParticipant}
          />
          ) : (
            ""
            )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
            </>
  );
};

export default Room;

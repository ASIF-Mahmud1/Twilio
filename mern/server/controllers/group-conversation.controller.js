const TWILIO_ACCOUNT_SID= process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN=process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/*
   Creating  Group Conversation 
*/
const create = async (req, res, next) => {
  try {
   const body = req.body
   const { name, email ,room_id} = body
   const result = await client.conversations.v1.conversations
      .create({ uniqueName:room_id , friendlyName: "Group Chat: "+name, })

   if (result.sid) {
      const first_participant = await client.conversations.v1.conversations(result.sid)
         .participants
         .create({ identity: email, attributes:JSON.stringify({name}) })
   }
   res.status(201).send({
      message: `Group Chat With ${name} Created Successfully!`,
      result:result

   });
  } catch (error) {
   res.status(500).send({
      message: "Something went wrong",
      error: error,
   });
  }
  

}

const addParticipant = async (req, res, next) => {
   const conversationSid = req.body.sid
   const identity = req.body.identity
   if (conversationSid && identity) 
   {
      try {

         const result = await client.conversations.v1.conversations(conversationSid)
         .participants
         .create({ identity: identity })

      if (!result.error) 
      {
         res.status(200).send({
            message: "Participant Added Succesfully !",
            conversation: result,
         });
      }
      else 
      {
         res.status(500).send({
            message: "Error adding participant",
            error: result.error,
         });
      }
      } catch (error) {
         res.status(500).send({
            message: "Something went wrong",
            error: error,
         });
      }

   }
   else 
   {  
      res.status(500).send({
         message: "Parameters are missing",
         error: {},
      });
   }

}

const listParticipantByConversationID = async (req, res, next) => { 

   const conversationSid = req.params.sid
   console.log(req.params);
   if(conversationSid)
   {
      try {
         const result = await client.conversations.v1.conversations(conversationSid)
         .participants
         .list()
   
         res.status(200).send({
            message: "Participant Fetched Succesfully !",
            participants: result,
         });
      } catch (error) {
         res.status(500).send({
            message: "Something went wrong",
            error: error,
         });
      }
 
   }
   else 
   {
      res.status(500).send({
         message: "Parameters are missing",
         error: {},
      });
   }
   

}

const list =async (req,res, next)=>{
   const result = await client.conversations.v1.conversations.list()
   if(!result.error)
   {
      res.status(200).send({
         message: "All Conversation",
         conversation:result,
      });
   }
   else
   {
      res.status(500).send({
         message: "Error fetching conversation ",
         error:result.error,
       });
   }

}

const remove = async (req, res, next) => { 

   const conversationSid = req.params.sid
   console.log(req.params);
   if(conversationSid)
   {
      try {
         const result = await  client.conversations.v1.conversations(conversationSid).remove();
        
         res.status(200).send({
            message: "Conversation Deleted Succesfully !",
            result:result
         });
      } catch (error) {
         res.status(500).send({
            message: "Something went wrong",
            error: error,
         });
      }
 
   }
   else 
   {
      res.status(500).send({
         message: "Parameters are missing",
         error: {},
      });
   }
   

}
module.exports= {
    create:create,
    addParticipant:addParticipant,
    listParticipantByConversationID:listParticipantByConversationID,
    list:list,
    remove:remove
   }
 
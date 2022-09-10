const TWILIO_ACCOUNT_SID= process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN=process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/*
   Creating Conversation 
*/
const create = async (req, res, next) => {
   const user = req.user

   const result = await client.conversations.v1.conversations
      .create({ friendlyName: req.body.email })

   if (result.sid) 
   {
      const first_participant = await client.conversations.v1.conversations(result.sid)
         .participants
         .create({ identity: req.body.email })

      console.log("First Participant ", first_participant);

      const second_participant = await client.conversations.v1.conversations(result.sid)
         .participants
         .create({ identity: "admin@gmail.com" })

      console.log("Second Participant ", first_participant);

   }

   res.status(201).send({
      message: "User Created Successfully",
      user,
   });

}

const list =async (req,res, next)=>{
   const result = await client.conversations.v1.conversations.list()
   if(!result.error)
   {
      res.status(200).send({
         message: "All Conversation",
         connversation:result,
      });
   }

   res.status(500).send({
      message: "Error fetching conversation ",
      error:result.error,
    });
}

module.exports= {
    create:create,
    list:list,
   
   }
 
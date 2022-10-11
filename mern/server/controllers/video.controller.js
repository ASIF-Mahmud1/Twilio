const TWILIO_ACCOUNT_SID= process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN=process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const list =async (req,res, next)=>{
 
    const result=  await client.video.v1.rooms.list({ 
      //status: 'completed',
    })

            
    if(!result.error)
    {
       res.status(200).send({
          message: "All Videos",
          videos:result,
       });
    }
    else
    {
       res.status(500).send({
          message: "Error fetching Rooms ",
          error:result.error,
        });
    }
 
 }


module.exports= {
    list:list,
   }
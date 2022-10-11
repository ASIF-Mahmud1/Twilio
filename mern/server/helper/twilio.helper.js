require("dotenv").config();
//console.log(process.env) 


const AccessToken = require('twilio').jwt.AccessToken;
const {VideoGrant} = AccessToken
const getToken =({email})=>{

    const ChatGrant = AccessToken.ChatGrant;

    // Used when generating any kind of tokens
    const twilioAccountSid =process.env.TWILIO_ACCOUNT_SID;
    const twilioApiKey =  process.env.TWILIO_API_KEY
    const twilioApiSecret = process.env.TWILIO_API_SECRET

    // Used specifically for creating Chat tokens
    const serviceSid = process.env.TWILIO_CHAT_SERVICE_SID 
    const identity = email;

    // Create a "grant" which enables a client to use Chat as a given user,
    // on a given device
    const chatGrant = new ChatGrant({
      serviceSid: serviceSid,
    });
   

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(
      twilioAccountSid,
      twilioApiKey,
      twilioApiSecret,
      { identity: identity }
    );

    token.addGrant(chatGrant);

    // Serialize the token to a JWT string
  
    return token.toJwt()
   
}

const getLiveVideoToken =({identity, room})=>{  
  const twilioAccountSid =process.env.TWILIO_ACCOUNT_SID;
  const twilioApiKey =  process.env.TWILIO_API_KEY
  const twilioApiSecret = process.env.TWILIO_API_SECRET

  const videoGrant=  new VideoGrant({
    room: room // the specific room's name
  });

  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    { identity: identity }
  );
  token.addGrant(videoGrant);

  return token.toJwt()
}

module.exports= {
    getToken: getToken,
    getLiveVideoToken,getLiveVideoToken
  
  }


require("dotenv").config();
//console.log(process.env) 

const twilio = require('twilio')
const AccessToken = require('twilio').jwt.AccessToken;
const {VideoGrant,ChatGrant} = AccessToken
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
  // Used specifically for creating Chat tokens
  const serviceSid = process.env.TWILIO_CHAT_SERVICE_SID 
  
  const chatGrant = new ChatGrant({
    serviceSid: serviceSid,
  });
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
  token.addGrant(chatGrant);

  return token.toJwt()
}

const getVerificationCode = async (phoneNumber) => {
  try {
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN
    const twilioVerifyServiceId = process.env.TWILIO_VERIFY_SERVICE_SID
    const client = new twilio(twilioAccountSid, twilioAuthToken)

    const result = await client.verify.services(twilioVerifyServiceId).verifications.create({ to: phoneNumber, channel: 'sms' })
    return result
  } catch (error) {
    throw error
  }

}

module.exports= {
    getToken: getToken,
    getLiveVideoToken,getLiveVideoToken,
    getVerificationCode:getVerificationCode
  
  }


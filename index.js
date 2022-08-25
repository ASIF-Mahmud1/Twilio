// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
//import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_API_KEY, TWILIO_API_SECRET, TWILIO_CHAT_SERVICE_SID, } from './config'
require('dotenv').config();

const TWILIO_ACCOUNT_SID= process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN=process.env.TWILIO_AUTH_TOKEN
const TWILIO_API_KEY= process.env.TWILIO_API_KEY
const TWILIO_API_SECRET= process.env.TWILIO_API_SECRET 
const TWILIO_CHAT_SERVICE_SID= process.env.TWILIO_CHAT_SERVICE_SID

const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

/**
 * 1. Create Conversation : My Second Conversation
 * 2. Add SMS participant
 * 3. Add Chat participant
 */

/*
 * 1. 
*/

// client.conversations.v1.conversations
//                        .create({friendlyName: 'My Second Conversation'})
//                        .then(conversation => console.log(conversation));
                       


const id= '<sid>'  // from 1

client.conversations.v1.conversations(id)
.fetch()
.then((conversation , err)=> console.log(conversation));                 



/*
 * 2.  
*/

//   client.conversations.v1.conversations(id)
//   .participants
//   .create({
//     'messagingBinding.address': '+8801924458496',
//     'messagingBinding.proxyAddress': '+16282775617'
//    })
//   .then(participant => console.log(participant.sid));

/*
 * 3.  
*/

// client.conversations.v1.conversations(id)
//                        .participants
//                        .create({identity: 'Asif'})
//                        .then(participant => console.log(participant));
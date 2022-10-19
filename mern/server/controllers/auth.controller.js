const User =require('../models/user.model')
const twilio = require('../helper/twilio.helper')

const signin = (req, res) => {
  
    User.findOne({
    "email": req.body.email
  }, (err, user) => {

    if (err || !user) 
    {
        console.log(err);
        return res.status('401').json({
            error: "User not found"
          })
    }
    if(user.password===req.body.password)
    {
      const token= twilio.getToken({email:req.body.email})
      return res.json({
        twilioToken: token,
        user: {_id: user._id, name: user.name, email: user.email, admin: user.admin}
      })
    }
    else 
    {
      return res.status('401').json({
        error: "Incorrect Credentials"
      })
    }
    


  })
}

const getTwilioToken=(req,res)=>{

  const token= twilio.getToken({email:req.body.email})
  return res.json({
    twilioToken: token,
   
  })
}

const getLiveVideoTwilioToken=(req,res)=>{
  const {identity, room} =req.body
  const token= twilio.getLiveVideoToken({identity, room})
  return res.json({
    twilioToken: token
   
  })
}

const getVerficationTwilio=(req,res)=>{
  const to = req.params.to
  console.log("Phone Number ",to);
  const result= twilio.getVerificationCode(to)
   return res.json({
    result 
   })
}


module.exports= {
  signin:signin,
  getTwilioToken:getTwilioToken, 
  getLiveVideoTwilioToken:getLiveVideoTwilioToken,
  getVerficationTwilio:getVerficationTwilio

}
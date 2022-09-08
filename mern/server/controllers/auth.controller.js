const User =require('../models/user.model')
const twilio = require('../helper/twilio.helper')

const signin = (req, res) => {
    console.log(req.body);
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
    
    const token= twilio.getToken({email:req.body.email})
    return res.json({
      twilioToken: token,
      user: {_id: user._id, name: user.name, email: user.email}
    })

  })
}


module.exports= {
  signin:signin,

}
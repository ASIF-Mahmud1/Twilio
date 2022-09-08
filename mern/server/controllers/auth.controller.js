const User =require('../models/user.model')

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
    

    return res.json({
    
      user: {_id: user._id, name: user.name, email: user.email}
    })

  })
}


module.exports= {
  signin:signin,

}
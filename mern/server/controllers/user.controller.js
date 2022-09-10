const User =require('../models/user.model')
const TWILIO_ACCOUNT_SID= process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN=process.env.TWILIO_AUTH_TOKEN

const signUp=(req,res, next)=>{


      const user = new User({
        name: req.body.name,  
        email: req.body.email,
        password: req.body.password,
        admin: req.body.admin? req.body.admin: false
      });

      user
        .save()
       
        .then((result) => {
          req.user= result
          next() 
        })
        .catch((error) => {
          res.status(500).send({
            message: "Error creating user",
            error,
          });
        });

  }


module.exports= {
   signUp:signUp
  
  }

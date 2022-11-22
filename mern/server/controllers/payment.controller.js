const HITPAY_API_KEY= process.env.HITPAY_API_KEY


const requestPaymentURL =async (req,res, next)=>{

  const url='https://api.sandbox.hit-pay.com/v1/payment-requests?redirect_url=https://test.com/success&webhook=https://test.com/webhook&amount=600&currency=SGD'

  try {
    const response =await fetch(url , {
        method: 'POST',
        headers: {
          'X-BUSINESS-API-KEY':HITPAY_API_KEY,
          'X-Requested-With':'XMLHttpRequest',
          'Content-Type':'application/x-www-form-urlencoded'
        },
    })
    const result=  await response.json()
    res.status(200).send({
      message: "Payement Request Details",
      result:result,
   });

} catch (error) {
    console.log("Error in Payment Request ");
    res.status(500).send({
      message: "Error in Payment Request",
      error:result.error,
    });
}

}

module.exports= {
  requestPaymentURL:requestPaymentURL
  
  }

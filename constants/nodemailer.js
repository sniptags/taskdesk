const nodemailer=require('nodemailer')
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: process.env.EMAIL,
      pass:process.env.PASSWORD
    }
  });

  const sendWelcomeEmail=(email,user)=>{
    transporter.sendMail({
        from:process.env.EMAIL,
        to:email,
        subject:`Welcome to the tasker- ${user}`,
        text:`Welocome ${user} \n Hope you will enjoy managing your task with us`
      }
    )}
  module.exports={sendWelcomeEmail}
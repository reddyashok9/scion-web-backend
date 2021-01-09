import sgMail from '@sendgrid/mail';
import config from 'config';

sgMail.setApiKey(config.get("mailer.API_KEY"));

console.log(config.get("mailer.API_KEY"));

const sendEmail = async (data: any) => {
   const msg: any = {
    personalizations: [
      {
        to: [
          {
            email: data.email,
            name: data.name
          }
        ],
        dynamic_template_data: {
          name: data.name,
          password: data.password,
          email: data.email,
          link: data.link
        },
        subject: data.subject
      }
    ],
    from: {
      email: 'reddyashok9@gmail.com',
      name: 'Scion'
    },
    reply_to: {
      email: 'reddyashok9@gmail.com',
      name: 'Scion'
    },
    template_id: data.templateId
  };
    //send the email
    const mail = await sgMail.send(msg);
    return mail;
}

export default sendEmail;
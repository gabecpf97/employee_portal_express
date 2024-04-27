import emailjs from "@emailjs/nodejs";

emailjs.init({
  publicKey: process.env.EMAIL_PUBLICKEY,
  privateKey: process.env.EMAIL_PRIVATEKEY,
  blockHeadless: true,
  blockList: {},
  limitRate: {
    id: "app",
    throttle: 10000,
  },
});

const sendEmail = (targetStep, targetEmail) => {
  return emailjs.send(process.env.EMAIL_SERVICEID, process.env.EMAIL_TEMPLATE, {
    form_type: targetStep,
    to_email: targetEmail,
  });
};

export default sendEmail;

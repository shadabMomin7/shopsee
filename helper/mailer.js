let mail = require("nodemailer")

async function gmail(mailoption) {
    return new Promise((res, rej) => {
        let trasnport = mail.createTransport({
            service: "gmail",
            auth: {
                user: "mominshadab533@gmail.com",
                pass: "bgjztjrqimgutfmo"
            }
        })
        trasnport.sendMail(mailoption, (error, info) => {
            if (error) {
                rej(false)
            }
            res(`otp send to your email ${mailoption.to}`)
        })
    })
};

module.exports = { gmail };

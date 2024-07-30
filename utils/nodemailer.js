import nodemailer from "nodemailer";

export const sendMail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            //console.log(err);
        } else {
            console.log(info);
        }
    });

    return;
}

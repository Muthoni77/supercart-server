import nodemailer from "nodemailer";
import { EmailBodyType } from "../Types/Utils";

export const sendEmailActivation = async ({
  recipientEmail,
  recipientName,
  token,
}: EmailBodyType): Promise<boolean> => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "supercart254@gmail.com",
        pass: "umsyawebxjbobgif",
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"SuperCart🛍️" <supercart254@gmail.com>', // sender address
      to: recipientEmail, // list of receivers
      subject: "Welcome to SuperCart", // Subject line
      html: `
      <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to SuperCart!</title>
            <style>
           
            </style>
        </head>
        <body>
            <table style="width: 100%; max-width: 600px; margin: 0 auto;">
            <tr>
                <td style="background-color: #f8f8f8; text-align: center; padding: 20px;">
                <img src="https://example.com/supercart-logo.png" alt="SuperCart logo" style="max-width: 100%;">
                <h1>Welcome to SuperCart!</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px;">
                <p>Dear ${recipientName},</p>
                <p>Thank you for signing up for SuperCart! We're thrilled to have you on board.</p>
                <p>Before you can start shopping, you need to activate your account. To do so, simply click the button below:</p>
                <center><p><a href="${process.env.EMAIL_VERIFICATION_LINK}/${token}" target="_blank" style="background-color: #008CBA; color: #fff; display: inline-block; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Activate Your Account</a></p></center>
                <p>Once your account is activated, you'll have access to a wide variety of products at great prices. Whether you're looking for electronics, home goods, or fashion, we've got you covered.</p>
                <p>If you have any questions or feedback, please don't hesitate to contact us. Our team is always happy to help.</p>
                <p>Thanks again for joining SuperCart! We look forward to serving you.</p>
                <p>Best regards,</p>
                <p>The SuperCart Team</p>
                </td>
            </tr>
            </table>
        </body>
        </html>
`,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

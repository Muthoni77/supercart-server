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
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"SuperCart🛍️" <jaysmith254321@gmail.com>', // sender address
      to: recipientEmail, // list of receivers
      subject: "Welcome to SuperCart", // Subject line
      html: `
      <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to SuperCart!</title>
            <style>
            *{
              color:black;
            }

            p{
              font-size:14px;
            }
            </style>
        </head>
        <body>
            <table style="width: 100%; max-width: 600px; margin: 0 auto;">
            <tr>
                <td style="background-color: #fff2f2; text-align: center; padding: 20px;">
                <img src="https://res.cloudinary.com/jbcloudinary/image/upload/v1680889938/superCart/logo_a3y5bf.png" alt="SuperCart logo" style="width: 25%;">
                <h1>Welcome to SuperCart!</h1>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px;">
                <p><b>Dear ${recipientName},</b></p>
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

export const sendRequestPasswordChangeEmail = async ({
  recipientEmail,
  token,
}: EmailBodyType): Promise<boolean> => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "jaysmith254321@gmail.com",
        pass: "umsyawebxjbobgif",
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"SuperCart🛍️" <jaysmith254321@gmail.com>', // sender address
      to: recipientEmail, // list of receivers
      subject: "Reset Account Password ", // Subject line
      html: `
      <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Reset Account Password</title>
            <style>
            *{
              color:black;
            }

            p{
              font-size:14px;
            }
            </style>
        </head>
        <body>
            <table style="width: 100%; max-width: 600px; margin: 0 auto;">
            <tr>
                <td style="background-color: #fff2f2; text-align: center; padding: 10px;">
                <img src="https://res.cloudinary.com/jbcloudinary/image/upload/v1680889938/superCart/logo_a3y5bf.png" alt="SuperCart logo" style="width: 25%;">
                </td>
            </tr>
            <tr>
              <td style="padding:20px;">
                <h2>Reset You Account's Password</h2>
                <p>Hello,</p>
                <p>We have received a request to reset your password. If you did not make this request, you can safely ignore this email.</p>
                <p>Otherwise, please click the button below to proceed to reset your password:</p>
                <a href="${process.env.FRONTEND_RESET_PASSWORD_LINK}/${token}" target="_blank" style="background-color: #008CBA; color: #fff; display: inline-block; padding: 10px 20px; border-radius: 5px; text-decoration: none;">Reset Password</a>
                <br/>
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

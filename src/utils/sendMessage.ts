import { Client } from "africastalking-ts";
import { MessageBodyType } from "../Types/Utils";

const africasTalking = new Client({
  apiKey: "17a2a1423396c10594c4da25ea4a129f12523024bda1f0fc0f40cfc737009a6e",
  username: "SuperCart",
});

const sendMessage = async ({ recipients, message }: MessageBodyType) => {
  try {
    const sendMsg = await africasTalking.sendSms({
      to: recipients, // Your phone number
      message,
      //   from: "Supercart", // Your shortcode or alphanumeric
    });

    console.log("sendMessage");
    console.log(sendMsg);
    return true;
  } catch (error) {
    console.log("otp error");
    console.log(error);
    return null;
  }
};

export default sendMessage;

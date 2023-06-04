const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

export const getTokenPassword = async (): Promise<string | boolean> => {
  try {
    const encodedString = Buffer.from(
      `${consumerKey}:${consumerSecret}`,
      "utf-8"
    ).toString("base64");

    return encodedString;
  } catch (error) {
    console.log(error);
    return false;
  }
};

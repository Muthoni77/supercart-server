const formatPhoneNumber = async (phoneNumber: string): Promise<string> => {
  let num: string = phoneNumber;

  try {
    if (phoneNumber[0] == "0") {
      num = phoneNumber.substring(1);
      num = "254" + num;
    }
    if (phoneNumber[0] == "+") {
      num = phoneNumber.substring(1);
    }
    return num;
  } catch (error) {
    throw new Error("Failed to format phone number");
  }
};

export default formatPhoneNumber;

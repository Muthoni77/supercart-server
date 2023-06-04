export interface AccessTokenType {
  access_token: string;
  expires_in: string;
}

export interface StkPushRequestBodyType {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: string;
  Amount: string;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

export interface StkPushUserRequestBodyType {
  Amount: string;
  PhoneNumber: string;
}
export interface StkPushGeneratePasswordBodyType {
  BusinessShortCode: string;
  PassKey: string;
  Timestamp: string;
}

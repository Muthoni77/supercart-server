export interface hashType {
  rawText: string;
}

export interface compareHashType {
  rawText: string;
  hashText: string;
}

export interface EmailBodyType {
  recipientName?: string;
  recipientEmail: string;
  token: string;
}

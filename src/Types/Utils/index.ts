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
export interface MessageBodyType {
  recipients: string[];
  message: string;
}

export interface LogDataBodyType {
  content: string;
  filePath: string;
}

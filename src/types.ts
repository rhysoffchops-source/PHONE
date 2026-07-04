export interface SmsMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isIncoming: boolean;
}

export interface CallSession {
  phoneNumber: string;
  contactName?: string;
  status: "idle" | "dialing" | "connected" | "disconnected";
  duration: number; // in seconds
  isIncoming: boolean;
}

export interface SavedContact {
  id: string;
  name: string;
  phoneNumber: string;
  avatarColor: string;
}

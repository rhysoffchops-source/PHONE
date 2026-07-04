export interface HardwareSignature {
  brand: string;
  model: string;
  product: string;
  device: string;
  board: string;
  hardware: string;
  manufacturer: string;
  bootloader: string;
  fingerprint: string;
  securityPatch: string;
  kernelVersion: string;
}

export interface NetworkConfig {
  carrierName: string;
  mcc: string;
  mnc: string;
  networkType: "5G" | "LTE" | "3G" | "No Service";
  signalStrength: number; // 0 to 4
  simState: "ABSENT" | "READY" | "LOCKED";
  phoneNumber: string;
}

export interface SafetyNetConfig {
  basicIntegrity: boolean;
  ctsProfileMatch: boolean;
  evaluationType: "BASIC" | "HARDWARE_BACKED";
  playIntegrityMeetsStrong: boolean;
  playIntegrityMeetsDevice: boolean;
  playIntegrityMeetsBasic: boolean;
}

export interface VirtualDevice {
  id: string;
  name: string;
  avatar: string;
  isRooted: boolean;
  isZygiskEnabled: boolean;
  isDenyListActive: boolean;
  magiskVersion: string;
  customRecovery: "None" | "TWRP" | "OrangeFox";
  hardware: HardwareSignature;
  network: NetworkConfig;
  safetyNet: SafetyNetConfig;
}

export interface SmsMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isIncoming: boolean;
}

export interface CallSession {
  phoneNumber: string;
  status: "idle" | "dialing" | "connected" | "disconnected";
  duration: number; // in seconds
  isIncoming: boolean;
}

export interface InstalledApp {
  id: string;
  name: string;
  icon: string;
  packageName: string;
  version: string;
  isSystem: boolean;
  isDenyListed: boolean; // Magisk DenyList
  permissions?: {
    camera: boolean;
    location: boolean;
    contacts: boolean;
  };
}

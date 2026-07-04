import { HardwareSignature, VirtualDevice } from "./types";

export const PRESET_HARDWARE_PROFILES: { name: string; signature: HardwareSignature }[] = [
  {
    name: "Google Pixel 8 Pro",
    signature: {
      brand: "google",
      model: "Pixel 8 Pro",
      product: "husky",
      device: "husky",
      board: "shiba",
      hardware: "google",
      manufacturer: "Google",
      bootloader: "husky-14.0-12345678",
      fingerprint: "google/husky/husky:14/UQ1A.231205.015/11100311:user/release-keys",
      securityPatch: "2026-06-05",
      kernelVersion: "5.15.110-g81a5a92a-ab112233"
    }
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    signature: {
      brand: "samsung",
      model: "SM-S928B",
      product: "e3q",
      device: "e3qxxx",
      board: "kalama",
      hardware: "qcom",
      manufacturer: "Samsung",
      bootloader: "S928BXXU1AXAD",
      fingerprint: "samsung/e3qxxx/e3q:14/UP1A.231005.007/S928BXXU1AXAD:user/release-keys",
      securityPatch: "2026-05-01",
      kernelVersion: "6.1.25-android14-9-g390ea1b"
    }
  },
  {
    name: "OnePlus 12",
    signature: {
      brand: "OnePlus",
      model: "CPH2581",
      product: "OnePlus12",
      device: "OnePlus12",
      board: "kalama",
      hardware: "qcom",
      manufacturer: "OnePlus",
      bootloader: "CPH2581_11_A.01",
      fingerprint: "OnePlus/OnePlus12/OnePlus12:14/UKQ1.230924.001/R.20231215:user/release-keys",
      securityPatch: "2026-04-05",
      kernelVersion: "6.1.43-android-oneplus"
    }
  },
  {
    name: "Xiaomi 14 Pro",
    signature: {
      brand: "Xiaomi",
      model: "23116PN5BC",
      product: "shennong",
      device: "shennong",
      board: "shennong",
      hardware: "qcom",
      manufacturer: "Xiaomi",
      bootloader: "XM-HYPEROS-2024",
      fingerprint: "Xiaomi/shennong/shennong:14/UKQ1.230804.001/V816.0.4.0.UNBCNXM:user/release-keys",
      securityPatch: "2026-03-01",
      kernelVersion: "6.1.57-xiaomi-g7ffb6b91"
    }
  },
  {
    name: "Sony Xperia 1 VI",
    signature: {
      brand: "Sony",
      model: "XQ-EC54",
      product: "pdx245",
      device: "pdx245",
      board: "lanai",
      hardware: "qcom",
      manufacturer: "Sony",
      bootloader: "XQ-EC54-v1.0",
      fingerprint: "Sony/XQ-EC54/XQ-EC54:14/68.1.A.2.174/0681A2174:user/release-keys",
      securityPatch: "2026-05-05",
      kernelVersion: "6.1.68-android-sony"
    }
  }
];

export const DEFAULT_DEVICES: VirtualDevice[] = [
  {
    id: "device-1",
    name: "My Pixel 8 Pro (Commercial)",
    avatar: "📱",
    isRooted: false,
    isZygiskEnabled: false,
    isDenyListActive: false,
    magiskVersion: "27.0",
    customRecovery: "None",
    hardware: { ...PRESET_HARDWARE_PROFILES[0].signature },
    network: {
      carrierName: "T-Mobile",
      mcc: "310",
      mnc: "260",
      networkType: "5G",
      signalStrength: 4,
      simState: "READY",
      phoneNumber: "+1 (555) 489-2310"
    },
    safetyNet: {
      basicIntegrity: true,
      ctsProfileMatch: true,
      evaluationType: "HARDWARE_BACKED",
      playIntegrityMeetsStrong: true,
      playIntegrityMeetsDevice: true,
      playIntegrityMeetsBasic: true
    }
  },
  {
    id: "device-2",
    name: "Rooted Galaxy S24 Ultra (Custom)",
    avatar: "⚡",
    isRooted: true,
    isZygiskEnabled: true,
    isDenyListActive: true,
    magiskVersion: "27.0",
    customRecovery: "TWRP",
    hardware: { ...PRESET_HARDWARE_PROFILES[1].signature },
    network: {
      carrierName: "Verizon Wireless",
      mcc: "311",
      mnc: "480",
      networkType: "LTE",
      signalStrength: 3,
      simState: "READY",
      phoneNumber: "+1 (555) 891-4432"
    },
    safetyNet: {
      basicIntegrity: false,
      ctsProfileMatch: false,
      evaluationType: "BASIC",
      playIntegrityMeetsStrong: false,
      playIntegrityMeetsDevice: false,
      playIntegrityMeetsBasic: true
    }
  }
];

export const SYSTEM_APPS = [
  { id: "app-dialer", name: "Phone", packageName: "com.android.dialer", icon: "📞", version: "12.0.4", isSystem: true, isDenyListed: false },
  { id: "app-mms", name: "Messages", packageName: "com.android.providers.telephony", icon: "💬", version: "11.1.2", isSystem: true, isDenyListed: false },
  { id: "app-settings", name: "Settings", packageName: "com.android.settings", icon: "⚙️", version: "14.0.0", isSystem: true, isDenyListed: false },
  { id: "app-chrome", name: "Chrome Browser", packageName: "com.android.chrome", icon: "🌐", version: "124.0.6367.82", isSystem: true, isDenyListed: false },
  { id: "app-playstore", name: "Google Play Store", packageName: "com.android.vending", icon: "🛍️", version: "40.5.30", isSystem: true, isDenyListed: false },
  { id: "app-magisk", name: "Magisk Manager", packageName: "com.topjohnwu.magisk", icon: "🎭", version: "27.0", isSystem: false, isDenyListed: false },
  { id: "app-safetynet", name: "SafetyNet Attestation Helper", packageName: "com.scottyab.safetynet.sample", icon: "🛡️", version: "2.1.0", isSystem: false, isDenyListed: false }
];

export const OTHER_AVAILABLE_APPS = [
  { id: "app-netflix", name: "Netflix", packageName: "com.netflix.mediaclient", icon: "🎬", version: "8.112.0", isSystem: false, isDenyListed: true, description: "Demands strict SafetyNet check & widevine security to play HD videos. Fails on rooted/unpatched systems." },
  { id: "app-paypal", name: "PayPal", packageName: "com.paypal.android.p2pmobile", icon: "💳", version: "8.55.0", isSystem: false, isDenyListed: true, description: "Finance app that detects Root, unlocked bootloader, or custom kernel signatures instantly." },
  { id: "app-pokemon", name: "Pokémon GO", packageName: "com.nianticlabs.pokemongo", icon: "🔴", version: "0.311.1", isSystem: false, isDenyListed: true, description: "Uses aggressive root detection & zygote hook checks. Fails if root or unlocked bootloader is detected." },
  { id: "app-snapchat", name: "Snapchat", packageName: "com.snapchat.android", icon: "👻", version: "12.82.0", isSystem: false, isDenyListed: false, description: "Requires device integrity. Fails to login if basic security parameters are violated." },
  { id: "app-gpay", name: "Google Wallet", packageName: "com.google.android.apps.walletnfcrel", icon: "👛", version: "24.16.2", isSystem: false, isDenyListed: true, description: "Requires STRONG/DEVICE integrity for NFC transactions. Explains CTS mismatches." }
];

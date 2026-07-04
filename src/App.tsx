import React, { useState, useEffect, useRef } from "react";
import { 
  VirtualDevice, 
  SmsMessage, 
  CallSession, 
  InstalledApp, 
  HardwareSignature,
  NetworkConfig,
  SafetyNetConfig
} from "./types";
import { 
  DEFAULT_DEVICES, 
  PRESET_HARDWARE_PROFILES, 
  SYSTEM_APPS, 
  OTHER_AVAILABLE_APPS 
} from "./presets";
import { 
  Phone, 
  Smartphone, 
  MessageSquare, 
  Settings, 
  ShieldAlert, 
  ShieldCheck, 
  Cpu, 
  Wifi, 
  Plus, 
  Trash2, 
  RefreshCw, 
  RotateCw,
  Radio, 
  CornerDownLeft, 
  Key, 
  HardDrive, 
  FolderLock, 
  Sparkles, 
  Layers, 
  Check, 
  AlertCircle, 
  Info, 
  User, 
  Send, 
  Maximize2, 
  Download, 
  Hash, 
  X, 
  Wrench,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Camera,
  MapPin,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Device list state
  const [devices, setDevices] = useState<VirtualDevice[]>(() => {
    return DEFAULT_DEVICES;
  });
  
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("device-1");
  const activeDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];

  // Simulator core state
  const [installedApps, setInstalledApps] = useState<{ [deviceId: string]: InstalledApp[] }>({
    "device-1": [...SYSTEM_APPS],
    "device-2": [...SYSTEM_APPS, { ...OTHER_AVAILABLE_APPS[1], isDenyListed: true }] // PayPal pre-installed and deny-listed on Device 2
  });

  const [smsLogs, setSmsLogs] = useState<{ [deviceId: string]: SmsMessage[] }>({
    "device-1": [
      { id: "sms-1", sender: "Google Play Support", text: "Your device CTS verification code is 829103.", timestamp: "10:14 AM", isIncoming: true },
      { id: "sms-2", sender: "+1 (555) 302-9911", text: "Are you running an advanced root cloaking on that virtual device?", timestamp: "Yesterday", isIncoming: true }
    ],
    "device-2": [
      { id: "sms-3", sender: "SuperSU Terminal", text: "Access granted to app pkg: com.paypal.android.p2pmobile", timestamp: "11:00 AM", isIncoming: true },
      { id: "sms-4", sender: "+1 (555) 918-2020", text: "Did you bypass Play Integrity? My financial apps keeps crashing.", timestamp: "Yesterday", isIncoming: true }
    ]
  });

  // Call simulator state
  const [activeCall, setActiveCall] = useState<{ [deviceId: string]: CallSession }>({});
  const [callPhoneNumber, setCallPhoneNumber] = useState<string>("");
  const [callTimerInterval, setCallTimerInterval] = useState<any>(null);

  // New Device modal & values
  const [isCreateDeviceOpen, setIsCreateDeviceOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceIsRooted, setNewDeviceIsRooted] = useState(false);
  const [selectedHardwarePresetIndex, setSelectedHardwarePresetIndex] = useState(0);

  // Active Android app screen state
  const [openAndroidApp, setOpenAndroidApp] = useState<InstalledApp | null>(null);

  // State for user custom SMS form
  const [customSmsSender, setCustomSmsSender] = useState("");
  const [customSmsText, setCustomSmsText] = useState("");
  const [isSmsIncoming, setIsSmsIncoming] = useState(true);

  // Advanced developer signature modification state (Live edits)
  const [editableHardware, setEditableHardware] = useState<HardwareSignature>({ ...activeDevice.hardware });
  
  // SafetyNet testing logs
  const [attestationReport, setAttestationReport] = useState<string | null>(null);
  const [isAttesting, setIsAttesting] = useState(false);

  // Ref for scrolling boot logs
  const logEndRef = useRef<HTMLDivElement | null>(null);

  // Simulator logs
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[System] Virtual Machine kernel initialized (v6.1.110)",
    "[Network] Simulated cellular provider gateway connected",
    "[Security] Hardware-backed key attestation loaded into memory sandbox"
  ]);

  // AI assistant status
  const [aiAssistantTyping, setAiAssistantTyping] = useState(false);

  // Boot-up animation sequence state
  const [bootingDevices, setBootingDevices] = useState<Record<string, { progress: number; logs: string[] }>>({});

  // Settings app sub-navigation
  const [settingsSubView, setSettingsSubView] = useState<"main" | "about" | "permissions">("main");
  const [expandedPermissionAppId, setExpandedPermissionAppId] = useState<string | null>(null);

  // Snapshot Manager States
  interface DeviceSnapshot {
    id: string;
    name: string;
    timestamp: string;
    device: VirtualDevice;
    installedApps: InstalledApp[];
    smsLogs: SmsMessage[];
  }

  const [snapshots, setSnapshots] = useState<DeviceSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem("android_emulator_snapshots");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [snapshotNameInput, setSnapshotNameInput] = useState("");

  const saveSnapshotsToStorage = (newSnapshots: DeviceSnapshot[]) => {
    setSnapshots(newSnapshots);
    localStorage.setItem("android_emulator_snapshots", JSON.stringify(newSnapshots));
  };

  const handleSaveSnapshot = () => {
    if (!snapshotNameInput.trim()) {
      addLog("Failed to save snapshot: Name cannot be empty.");
      return;
    }
    
    const currentDeviceApps = installedApps[activeDevice.id] || [];
    const currentDeviceSms = smsLogs[activeDevice.id] || [];

    const newSnapshot: DeviceSnapshot = {
      id: `snap-${Date.now()}`,
      name: snapshotNameInput.trim(),
      timestamp: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      device: JSON.parse(JSON.stringify(activeDevice)), // deep clone to preserve exact snapshot state
      installedApps: JSON.parse(JSON.stringify(currentDeviceApps)),
      smsLogs: JSON.parse(JSON.stringify(currentDeviceSms))
    };

    const updatedSnapshots = [newSnapshot, ...snapshots];
    saveSnapshotsToStorage(updatedSnapshots);
    setSnapshotNameInput("");
    addLog(`Successfully saved snapshot "${newSnapshot.name}" for ${activeDevice.name}.`);
  };

  const handleRestoreSnapshotOverwrite = (snapshot: DeviceSnapshot) => {
    // Clone states
    const restoredDevice: VirtualDevice = JSON.parse(JSON.stringify({
      ...snapshot.device,
      id: activeDevice.id, // preserve ID
    }));

    setDevices(prev => prev.map(d => d.id === activeDevice.id ? restoredDevice : d));
    setInstalledApps(prev => ({
      ...prev,
      [activeDevice.id]: JSON.parse(JSON.stringify(snapshot.installedApps))
    }));
    setSmsLogs(prev => ({
      ...prev,
      [activeDevice.id]: JSON.parse(JSON.stringify(snapshot.smsLogs))
    }));

    // Force update editableHardware signature
    setEditableHardware({ ...restoredDevice.hardware });
    setAttestationReport(null);
    
    addLog(`Restored snapshot "${snapshot.name}" over active device "${activeDevice.name}".`);
  };

  const handleRestoreSnapshotAsNew = (snapshot: DeviceSnapshot) => {
    const newDeviceId = `device-restored-${Date.now()}`;
    const restoredDevice: VirtualDevice = JSON.parse(JSON.stringify({
      ...snapshot.device,
      id: newDeviceId,
      name: `${snapshot.device.name} (Restored)`,
    }));

    setDevices(prev => [...prev, restoredDevice]);
    setInstalledApps(prev => ({
      ...prev,
      [newDeviceId]: JSON.parse(JSON.stringify(snapshot.installedApps))
    }));
    setSmsLogs(prev => ({
      ...prev,
      [newDeviceId]: JSON.parse(JSON.stringify(snapshot.smsLogs))
    }));

    setSelectedDeviceId(newDeviceId);
    setAttestationReport(null);
    addLog(`Restored snapshot "${snapshot.name}" as a new virtual device: "${restoredDevice.name}".`);
  };

  const handleDeleteSnapshot = (snapshotId: string) => {
    const updated = snapshots.filter(s => s.id !== snapshotId);
    saveSnapshotsToStorage(updated);
    addLog("Deleted device state snapshot.");
  };

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setConsoleLogs(prev => [`[${time}] ${message}`, ...prev.slice(0, 49)]);
  };

  // Auto scroll boot logs to bottom
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [bootingDevices]);

  // Sync editable hardware on active device change
  useEffect(() => {
    setEditableHardware({ ...activeDevice.hardware });
    setAttestationReport(null);
  }, [selectedDeviceId]);

  // Handle call duration tick
  useEffect(() => {
    const activeDeviceCall = activeCall[activeDevice.id];
    if (activeDeviceCall && activeDeviceCall.status === "connected") {
      const timer = setInterval(() => {
        setActiveCall(prev => {
          const current = prev[activeDevice.id];
          if (current && current.status === "connected") {
            return {
              ...prev,
              [activeDevice.id]: {
                ...current,
                duration: current.duration + 1
              }
            };
          }
          return prev;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeCall, activeDevice.id]);

  // Function to trigger boot-up animation sequence
  const handleTriggerBootAnimation = (deviceId: string, deviceName: string) => {
    const bootLogs = [
      "⚡ Booting Linux kernel on virtual CPU 0x0...",
      "🐧 Linux version 6.1.110-android14 (android-build@google.com) (gcc version 12.2.1)",
      "💎 CPU: Armv8-A Virtualized Processor Core #0 initialized.",
      "📱 Device Tree: Google Pixel virtual emulation platform loaded.",
      "📂 Initializing ramdisk & device directories...",
      "📦 Mounting system partitions: /system, /vendor, /data (EXT4-fs)...",
      "🔒 dm-verity: Verified boot signatures of physical image successfully.",
      "⚙️ Init: Starting essential services (servicemanager, hwservicemanager)...",
      "🎭 Zygisk: Framework initialization started...",
      "🎭 Zygisk: Hooked system zygote process successfully.",
      "🎮 SystemUI: WindowManager and Display controller registered (60Hz).",
      "📶 Telephony: Simulated radio transceiver set to READY.",
      "📦 Package Manager: Verifying APK sandbox package registry...",
      "⚡ Android Runtime (ART): Optimization passes completed successfully.",
      "✨ System boot completed! Starting custom user space launcher."
    ];

    setBootingDevices(prev => ({
      ...prev,
      [deviceId]: { progress: 0, logs: [bootLogs[0]] }
    }));

    addLog(`Initiating system boot-up sequence for "${deviceName}"...`);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5; // 20 steps of 100ms = 2.0 seconds total boot time
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setBootingDevices(prev => {
          const updated = { ...prev };
          delete updated[deviceId];
          return updated;
        });
        addLog(`Device "${deviceName}" cold boot completed.`);
      } else {
        const targetLogIndex = Math.min(
          Math.floor((currentProgress / 100) * bootLogs.length),
          bootLogs.length - 1
        );
        const incrementalLogs = bootLogs.slice(0, targetLogIndex + 1);
        setBootingDevices(prev => ({
          ...prev,
          [deviceId]: { progress: currentProgress, logs: incrementalLogs }
        }));
      }
    }, 100);
  };

  // Function to create a custom device
  const handleCreateDevice = () => {
    if (!newDeviceName.trim()) return;
    const selectedPreset = PRESET_HARDWARE_PROFILES[selectedHardwarePresetIndex];
    const newId = `device-${Date.now()}`;
    
    const initialNetwork: NetworkConfig = {
      carrierName: "Orange US Simulator",
      mcc: "310",
      mnc: "120",
      networkType: "LTE",
      signalStrength: 4,
      simState: "READY",
      phoneNumber: `+1 (555) 704-${Math.floor(1000 + Math.random() * 9000)}`
    };

    const initialSafetyNet: SafetyNetConfig = {
      basicIntegrity: !newDeviceIsRooted,
      ctsProfileMatch: !newDeviceIsRooted,
      evaluationType: newDeviceIsRooted ? "BASIC" : "HARDWARE_BACKED",
      playIntegrityMeetsStrong: !newDeviceIsRooted,
      playIntegrityMeetsDevice: !newDeviceIsRooted,
      playIntegrityMeetsBasic: true
    };

    const newDev: VirtualDevice = {
      id: newId,
      name: newDeviceName,
      avatar: newDeviceIsRooted ? "⚡" : "📱",
      isRooted: newDeviceIsRooted,
      isZygiskEnabled: newDeviceIsRooted,
      isDenyListActive: newDeviceIsRooted,
      magiskVersion: "27.0",
      customRecovery: newDeviceIsRooted ? "TWRP" : "None",
      hardware: { ...selectedPreset.signature },
      network: initialNetwork,
      safetyNet: initialSafetyNet
    };

    setDevices(prev => [...prev, newDev]);
    setInstalledApps(prev => ({
      ...prev,
      [newId]: [...SYSTEM_APPS]
    }));
    setSmsLogs(prev => ({
      ...prev,
      [newId]: [
        { id: `sms-init-${newId}`, sender: "System Provider", text: `Welcome to your virtual device ${newDeviceName}! Network is registered on 4G LTE.`, timestamp: "Just now", isIncoming: true }
      ]
    }));
    
    setSelectedDeviceId(newId);
    setIsCreateDeviceOpen(false);
    setNewDeviceName("");
    setNewDeviceIsRooted(false);
    addLog(`Created new device "${newDeviceName}" using ${selectedPreset.name} signature template.`);
    
    // Trigger boot-up animation for the newly created device
    handleTriggerBootAnimation(newId, newDeviceName);
  };

  // Delete virtual device
  const handleDeleteDevice = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (devices.length <= 1) {
      addLog("Cannot delete the last remaining virtual device.");
      return;
    }
    const remaining = devices.filter(d => d.id !== id);
    setDevices(remaining);
    if (selectedDeviceId === id) {
      setSelectedDeviceId(remaining[0].id);
    }
    addLog(`Deleted virtual device ${id}`);
  };

  // Run attestation test
  const triggerSafetyNetTest = async () => {
    setIsAttesting(true);
    setAttestationReport(null);
    addLog("Initiating Google SafetyNet / Play Integrity Attestation protocol...");
    
    setTimeout(() => {
      let passedBasic = true;
      let passedCTS = true;
      let reason = "";

      // Evaluation rules based on Root state and patch settings
      if (activeDevice.isRooted) {
        if (activeDevice.isZygiskEnabled && activeDevice.isDenyListActive) {
          // Semi-patched via deny list!
          passedBasic = true;
          passedCTS = true;
          reason = "Passed using Magisk DenyList, Zygisk Injection & Universal SafetyNet Fix.";
        } else {
          passedBasic = false;
          passedCTS = false;
          reason = "Failed: Su binary detected in /system/xbin/su. Unlocked bootloader keys present.";
        }
      } else {
        passedBasic = true;
        passedCTS = true;
        reason = "Passed: Verified locked bootloader signatures & authentic Google hardware backing keys.";
      }

      setDevices(prev => prev.map(d => {
        if (d.id === activeDevice.id) {
          return {
            ...d,
            safetyNet: {
              ...d.safetyNet,
              basicIntegrity: passedBasic,
              ctsProfileMatch: passedCTS,
              playIntegrityMeetsDevice: passedCTS,
              playIntegrityMeetsStrong: passedCTS && !d.isRooted,
              playIntegrityMeetsBasic: true
            }
          };
        }
        return d;
      }));

      setAttestationReport(JSON.stringify({
        nonce: Math.random().toString(36).substring(2, 15),
        timestampMs: Date.now(),
        apkPackageName: "com.scottyab.safetynet.sample",
        basicIntegrity: passedBasic,
        ctsProfileMatch: passedCTS,
        evaluationType: activeDevice.isRooted ? "BASIC" : "HARDWARE_BACKED",
        advice: passedCTS ? "DEVICE_HEALTHY" : "LOCK_BOOTLOADER_OR_USE_MAGISK_HIDE",
        deviceModel: activeDevice.hardware.model,
        manufacturer: activeDevice.hardware.manufacturer,
        fingerprint: activeDevice.hardware.fingerprint
      }, null, 2));

      setIsAttesting(false);
      addLog(`SafetyNet attestation finished. Status: ${passedCTS ? "PASSED" : "FAILED"}. ${reason}`);
    }, 1200);
  };

  // Toggle Root
  const handleToggleRoot = () => {
    const targetState = !activeDevice.isRooted;
    setDevices(prev => prev.map(d => {
      if (d.id === activeDevice.id) {
        return {
          ...d,
          isRooted: targetState,
          avatar: targetState ? "⚡" : "📱",
          // Update safetyNet expectations automatically
          safetyNet: {
            ...d.safetyNet,
            basicIntegrity: !targetState,
            ctsProfileMatch: !targetState,
            evaluationType: targetState ? "BASIC" : "HARDWARE_BACKED"
          }
        };
      }
      return d;
    }));
    addLog(`Changed root state to: ${targetState ? "ROOTED (su installed)" : "UNROOTED (commercial stock)"}`);
  };

  // Hardware modification apply
  const handleApplyHardwareSignature = () => {
    setDevices(prev => prev.map(d => {
      if (d.id === activeDevice.id) {
        return {
          ...d,
          hardware: { ...editableHardware }
        };
      }
      return d;
    }));
    addLog(`Applied custom hardware signatures for: ${editableHardware.manufacturer} ${editableHardware.model}`);
  };

  // Inject pre-defined profiles directly
  const applyPresetSignature = (signature: HardwareSignature) => {
    setEditableHardware({ ...signature });
    setDevices(prev => prev.map(d => {
      if (d.id === activeDevice.id) {
        return {
          ...d,
          hardware: { ...signature }
        };
      }
      return d;
    }));
    addLog(`Applied hardware profile preset: ${signature.manufacturer} ${signature.model}`);
  };

  // Network register custom carrier
  const updateNetworkParam = (key: keyof NetworkConfig, value: any) => {
    setDevices(prev => prev.map(d => {
      if (d.id === activeDevice.id) {
        return {
          ...d,
          network: {
            ...d.network,
            [key]: value
          }
        };
      }
      return d;
    }));
    addLog(`Network modified: ${String(key)} -> ${value}`);
  };

  // Send a simulated SMS or trigger a network reaction (using Gemini API server endpoint)
  const handleSendSimSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSmsText.trim()) return;

    const sender = customSmsSender.trim() || "+1 (555) 900-1100";
    const userMsg: SmsMessage = {
      id: `sms-${Date.now()}`,
      sender: sender,
      text: customSmsText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isIncoming: isSmsIncoming
    };

    // Update locally
    const currentList = smsLogs[activeDevice.id] || [];
    setSmsLogs(prev => ({
      ...prev,
      [activeDevice.id]: [...currentList, userMsg]
    }));

    addLog(`SMS ${isSmsIncoming ? "Received from" : "Sent to"} ${sender}: "${customSmsText.substring(0, 20)}..."`);
    
    const userMessageCopy = customSmsText;
    setCustomSmsText("");

    // If it's an outgoing message, or we want the simulated carrier/caller to talk back using AI
    if (!isSmsIncoming) {
      setAiAssistantTyping(true);
      try {
        const response = await fetch("/api/simulator/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deviceName: activeDevice.name,
            appName: openAndroidApp ? openAndroidApp.name : "Messages App",
            message: userMessageCopy,
            context: {
              rooted: activeDevice.isRooted,
              network: activeDevice.network,
              hardware: activeDevice.hardware
            }
          })
        });
        
        const data = await response.json();
        
        // Add AI response as incoming message
        setTimeout(() => {
          const replyMsg: SmsMessage = {
            id: `sms-${Date.now() + 1}`,
            sender: sender,
            text: data.text || "Automatic verification completed by provider.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isIncoming: true
          };
          setSmsLogs(prev => ({
            ...prev,
            [activeDevice.id]: [...(prev[activeDevice.id] || []), replyMsg]
          }));
          addLog(`Received response from simulated recipient: "${replyMsg.text.substring(0, 30)}..."`);
          setAiAssistantTyping(false);
        }, 1000);
      } catch (err) {
        setAiAssistantTyping(false);
        console.error(err);
      }
    }
  };

  // Voice Call logic
  const handleInitiateCall = async (incoming: boolean = false) => {
    const phoneToCall = callPhoneNumber.trim() || "+1 (555) 231-1002";
    
    // Set status
    setActiveCall(prev => ({
      ...prev,
      [activeDevice.id]: {
        phoneNumber: phoneToCall,
        status: "connected",
        duration: 0,
        isIncoming: incoming
      }
    }));

    addLog(`Initiating virtual call: ${incoming ? "Incoming from" : "Outgoing to"} ${phoneToCall}`);

    // If outgoing, generate an automated voice dialogue stream via AI
    if (!incoming) {
      setAiAssistantTyping(true);
      try {
        const response = await fetch("/api/simulator/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            deviceName: activeDevice.name,
            appName: "Phone Dialer",
            message: "Incoming phone call answered. Synthesizing voice responder stream.",
            context: {
              rooted: activeDevice.isRooted,
              carrier: activeDevice.network.carrierName
            }
          })
        });
        const data = await response.json();
        setTimeout(() => {
          addLog(`Voice Response: "${data.text}"`);
          setAiAssistantTyping(false);
        }, 1500);
      } catch (err) {
        setAiAssistantTyping(false);
        console.error(err);
      }
    }
  };

  // Disconnect call
  const handleDisconnectCall = () => {
    setActiveCall(prev => ({
      ...prev,
      [activeDevice.id]: {
        phoneNumber: "",
        status: "idle",
        duration: 0,
        isIncoming: false
      }
    }));
    addLog("Call ended.");
  };

  // Custom App Installation
  const handleInstallApp = (app: typeof OTHER_AVAILABLE_APPS[0]) => {
    const list = installedApps[activeDevice.id] || [];
    if (list.some(a => a.packageName === app.packageName)) {
      addLog(`App "${app.name}" is already installed on this virtual device.`);
      return;
    }

    const newInstalled: InstalledApp = {
      ...app,
      isDenyListed: activeDevice.isRooted // default deny list active if device is rooted
    };

    setInstalledApps(prev => ({
      ...prev,
      [activeDevice.id]: [...list, newInstalled]
    }));
    addLog(`Successfully installed package: ${app.packageName}`);
  };

  // Uninstall App
  const handleUninstallApp = (appId: string) => {
    const list = installedApps[activeDevice.id] || [];
    setInstalledApps(prev => ({
      ...prev,
      [activeDevice.id]: list.filter(a => a.id !== appId)
    }));
    if (openAndroidApp?.id === appId) {
      setOpenAndroidApp(null);
    }
    addLog(`Uninstalled package ID: ${appId}`);
  };

  // Toggle Magisk DenyList for a package
  const handleToggleDenyList = (appId: string) => {
    const list = installedApps[activeDevice.id] || [];
    setInstalledApps(prev => ({
      ...prev,
      [activeDevice.id]: list.map(a => {
        if (a.id === appId) {
          return { ...a, isDenyListed: !a.isDenyListed };
        }
        return a;
      })
    }));
    addLog(`Toggled Magisk DenyList status for app ID: ${appId}`);
  };

  // Toggle App Permission (Camera, Location, Contacts)
  const handleTogglePermission = (appId: string, permission: "camera" | "location" | "contacts") => {
    const list = installedApps[activeDevice.id] || [];
    setInstalledApps(prev => ({
      ...prev,
      [activeDevice.id]: list.map(a => {
        if (a.id === appId) {
          const currentPerms = a.permissions || { camera: true, location: true, contacts: true };
          const updatedPerms = {
            ...currentPerms,
            [permission]: !currentPerms[permission]
          };
          return { ...a, permissions: updatedPerms };
        }
        return a;
      })
    }));

    const targetApp = list.find(a => a.id === appId);
    if (targetApp) {
      const currentPerms = targetApp.permissions || { camera: true, location: true, contacts: true };
      const newValue = !currentPerms[permission];
      addLog(`Permission [${permission.toUpperCase()}] set to [${newValue ? "GRANTED" : "DENIED"}] for app ${targetApp.name} (${targetApp.packageName})`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans antialiased">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded">
              <Smartphone className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Android Virtual Device & Hardware Sandbox
              <span className="text-xs bg-indigo-500/20 text-indigo-300 font-medium px-2 py-0.5 rounded">v2.4 LTS</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate cellular carrier gateways, custom hardware signatures, SafetyNet attestation bypass modules, and application sandboxes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsCreateDeviceOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Provision Virtual Device
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 p-6">
        
        {/* Left Bar - Device Manager & Configuration Panel */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Virtual Devices List Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Active Virtual Devices ({devices.length})
            </h2>
            <div className="space-y-2">
              {devices.map((dev) => {
                const isSelected = dev.id === selectedDeviceId;
                const activeCallState = activeCall[dev.id];
                const callOngoing = activeCallState && activeCallState.status === "connected";
                return (
                  <div
                    key={dev.id}
                    onClick={() => setSelectedDeviceId(dev.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? "bg-slate-800/80 border-emerald-500/60 shadow-lg shadow-emerald-500/5" 
                        : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{dev.avatar}</span>
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                          {dev.name}
                          {dev.isRooted && (
                            <span className="text-[10px] bg-red-500/20 text-red-400 font-medium px-1 rounded flex items-center gap-0.5">
                              Rooted
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {dev.hardware.manufacturer} {dev.hardware.model} • {dev.network.phoneNumber}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {callOngoing && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTriggerBootAnimation(dev.id, dev.name);
                        }}
                        className="p-1 hover:bg-indigo-500/10 text-slate-500 hover:text-indigo-400 rounded transition mr-0.5"
                        title="Reboot system container"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteDevice(dev.id, e)}
                        className="p-1 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded transition"
                        title="Delete instance"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Root, Zygisk, and SafetyNet Bypass Suite */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              OS Configuration & Bypass Engine
            </h2>
            
            {/* Quick States */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Device Authority</span>
                <span className="text-xs font-bold text-white block mt-1">
                  {activeDevice.isRooted ? "SuperUser Root (su)" : "Normal Commercial"}
                </span>
                <button
                  onClick={handleToggleRoot}
                  className={`mt-2 w-full text-[10px] py-1 rounded font-semibold transition cursor-pointer ${
                    activeDevice.isRooted 
                      ? "bg-rose-500/20 hover:bg-rose-500/30 text-rose-300" 
                      : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300"
                  }`}
                >
                  {activeDevice.isRooted ? "Revoke su Binary" : "Grant Superuser"}
                </button>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Zygisk Framework</span>
                <span className="text-xs font-bold text-white block mt-1">
                  {activeDevice.isZygiskEnabled ? "Zygote Hook Active" : "Disabled"}
                </span>
                <button
                  disabled={!activeDevice.isRooted}
                  onClick={() => {
                    setDevices(prev => prev.map(d => {
                      if (d.id === activeDevice.id) {
                        return { ...d, isZygiskEnabled: !d.isZygiskEnabled };
                      }
                      return d;
                    }));
                    addLog(`Toggled Zygisk to: ${!activeDevice.isZygiskEnabled ? "Enabled" : "Disabled"}`);
                  }}
                  className={`mt-2 w-full text-[10px] py-1 rounded font-semibold transition cursor-pointer ${
                    !activeDevice.isRooted 
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                      : activeDevice.isZygiskEnabled 
                        ? "bg-amber-500/20 text-amber-300" 
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  Toggle Zygisk Hook
                </button>
              </div>
            </div>

            {/* Magisk DenyList Bypass toggle */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Magisk DenyList Enforce</span>
                  <span className="text-[10px] text-slate-400">Isolate processes & spoof standard package APIs</span>
                </div>
                <button
                  disabled={!activeDevice.isRooted}
                  onClick={() => {
                    setDevices(prev => prev.map(d => {
                      if (d.id === activeDevice.id) {
                        return { ...d, isDenyListActive: !d.isDenyListActive };
                      }
                      return d;
                    }));
                    addLog(`Toggled Magisk DenyList Enforce to: ${!activeDevice.isDenyListActive}`);
                  }}
                  className="text-amber-400 hover:text-amber-300 disabled:opacity-50 transition cursor-pointer"
                >
                  {activeDevice.isDenyListActive ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>

              <div className="border-t border-slate-800/60 pt-2 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Custom Boot Recovery:</span>
                <select
                  value={activeDevice.customRecovery}
                  onChange={(e) => {
                    const rec = e.target.value as any;
                    setDevices(prev => prev.map(d => {
                      if (d.id === activeDevice.id) {
                        return { ...d, customRecovery: rec };
                      }
                      return d;
                    }));
                    addLog(`Set recovery partition signature to: ${rec}`);
                  }}
                  className="bg-slate-800 border border-slate-700 rounded text-slate-300 p-0.5"
                >
                  <option value="None">None (Stock OEM)</option>
                  <option value="TWRP">TeamWin Recovery (TWRP)</option>
                  <option value="OrangeFox">OrangeFox Recovery Project</option>
                </select>
              </div>

              {/* Quick Action - Reboot */}
              <div className="mt-2 pt-2 border-t border-slate-800/40 flex gap-2">
                <button
                  onClick={() => handleTriggerBootAnimation(activeDevice.id, activeDevice.name)}
                  className="w-full py-1.5 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-400 border border-indigo-500/20 rounded text-[10px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                  Perform System Cold Reboot
                </button>
              </div>
            </div>
          </div>

          {/* Network and Carrier Registration Settings */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Network & SIM Provisioning Gateway
            </h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Carrier Registered Network Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={activeDevice.network.carrierName}
                    onChange={(e) => updateNetworkParam("carrierName", e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <select
                    onChange={(e) => {
                      const [name, mcc, mnc] = e.target.value.split("|");
                      updateNetworkParam("carrierName", name);
                      updateNetworkParam("mcc", mcc);
                      updateNetworkParam("mnc", mnc);
                    }}
                    className="bg-slate-900 border border-slate-800 rounded text-xs text-slate-300 px-2"
                  >
                    <option value="">Presets</option>
                    <option value="T-Mobile|310|260">T-Mobile (USA)</option>
                    <option value="Verizon Wireless|311|480">Verizon (USA)</option>
                    <option value="AT&T Mobility|310|410">AT&T (USA)</option>
                    <option value="Vodafone UK|234|15">Vodafone (UK)</option>
                    <option value="Orange France|208|01">Orange (FR)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Mobile Country Code (MCC)</label>
                  <input
                    type="text"
                    value={activeDevice.network.mcc}
                    onChange={(e) => updateNetworkParam("mcc", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Mobile Network Code (MNC)</label>
                  <input
                    type="text"
                    value={activeDevice.network.mnc}
                    onChange={(e) => updateNetworkParam("mnc", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Network Standard</label>
                  <select
                    value={activeDevice.network.networkType}
                    onChange={(e) => updateNetworkParam("networkType", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                  >
                    <option value="5G">5G (NR SA/NSA)</option>
                    <option value="LTE">4G LTE Advanced</option>
                    <option value="3G">3G WCDMA</option>
                    <option value="No Service">No Carrier Signal</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Virtual SIM Status</label>
                  <select
                    value={activeDevice.network.simState}
                    onChange={(e) => updateNetworkParam("simState", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                  >
                    <option value="READY">Ready & Registered</option>
                    <option value="LOCKED">Locked (PIN/PUK)</option>
                    <option value="ABSENT">Absent (No SIM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Simulated SIM Phone Number</label>
                <input
                  type="text"
                  value={activeDevice.network.phoneNumber}
                  onChange={(e) => updateNetworkParam("phoneNumber", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Center Section - Interactive Virtual Smartphone UI Frame */}
        <div className="xl:col-span-5 flex flex-col items-center justify-start">
          
          {/* Phone Shell Wrap */}
          <div className="relative w-full max-w-[340px] aspect-[9/18.5] bg-slate-950 border-[6px] border-slate-850 rounded-[40px] shadow-2xl p-3 flex flex-col ring-8 ring-slate-900/65 overflow-hidden">
            
            {/* Top Ear Speaker Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-b-xl z-50 flex items-center justify-center gap-1.5">
              <div className="w-10 h-1 bg-slate-800 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800"></div>
            </div>

            {/* Inner Device Screen */}
            <div className="flex-1 rounded-[32px] bg-slate-900 overflow-hidden flex flex-col relative border border-slate-800/50">
              
              {/* StatusBar */}
              <div className="bg-slate-950/80 px-4 pt-4 pb-1 flex justify-between items-center text-[10px] text-slate-300 font-medium select-none z-30">
                <div className="flex items-center gap-1 font-mono">
                  <span>10:42 AM</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1 rounded">
                    {activeDevice.network.networkType}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <Wifi className="w-3 h-3 text-emerald-400" />
                    <span className="w-3 h-2 bg-emerald-500 rounded-sm"></span>
                  </div>
                </div>
              </div>

              {/* Core Screen Application Container */}
              <div className="flex-1 flex flex-col bg-slate-900 relative">
                
                {openAndroidApp ? (
                  // Deep app simulator view
                  <div className="absolute inset-0 bg-slate-950 flex flex-col z-40">
                    {/* App Header */}
                    <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{openAndroidApp.icon}</span>
                        <div>
                          <span className="text-xs font-bold text-white block leading-tight">{openAndroidApp.name}</span>
                          <span className="text-[9px] text-slate-500 block leading-none">{openAndroidApp.packageName}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setOpenAndroidApp(null)}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* App Specific Sandbox Contents */}
                    <div className="flex-1 overflow-y-auto p-3 text-xs">
                      
                      {/* Dialer App */}
                      {openAndroidApp.packageName === "com.android.dialer" && (
                        <div className="space-y-4">
                          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
                            <span className="text-[10px] text-slate-400 block mb-1">CURRENT LINE</span>
                            <span className="text-sm font-mono text-white font-bold">{activeDevice.network.phoneNumber}</span>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 block">Enter phone number to call:</label>
                            <div className="flex gap-1">
                              <input 
                                type="text" 
                                placeholder="+1 (555) 000-0000"
                                value={callPhoneNumber}
                                onChange={(e) => setCallPhoneNumber(e.target.value)}
                                className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white text-center font-mono font-bold"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <button
                              onClick={() => handleInitiateCall(false)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              Dial Out
                            </button>
                            <button
                              onClick={() => handleInitiateCall(true)}
                              className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <Phone className="w-3.5 h-3.5 animate-bounce" />
                              Simulate In
                            </button>
                          </div>

                          {/* Current Call State */}
                          {activeCall[activeDevice.id] && activeCall[activeDevice.id].status === "connected" && (
                            <div className="bg-slate-900 border border-emerald-500/40 p-3 rounded-xl space-y-2 animate-pulse">
                              <div className="flex items-center justify-between text-xs font-semibold text-white">
                                <span className="flex items-center gap-1.5 text-emerald-400">
                                  <Phone className="w-3 h-3" />
                                  Active Conversation
                                </span>
                                <span className="font-mono text-emerald-300">
                                  {Math.floor(activeCall[activeDevice.id].duration / 60)}:
                                  {String(activeCall[activeDevice.id].duration % 60).padStart(2, '0')}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400">
                                {activeCall[activeDevice.id].isIncoming ? "Incoming call from:" : "Outgoing connection to:"} {activeCall[activeDevice.id].phoneNumber}
                              </p>
                              <button
                                onClick={handleDisconnectCall}
                                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-1.5 rounded-lg text-xs transition cursor-pointer"
                              >
                                End Call
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Messages SMS App */}
                      {openAndroidApp.packageName === "com.android.providers.telephony" && (
                        <div className="flex flex-col h-full space-y-3">
                          {/* Chat Box */}
                          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 overflow-y-auto max-h-[190px] space-y-2">
                            {(smsLogs[activeDevice.id] || []).map((sms) => (
                              <div 
                                key={sms.id}
                                className={`p-2 rounded-lg max-w-[85%] text-[11px] ${
                                  sms.isIncoming 
                                    ? "bg-slate-850 text-slate-200 self-start mr-auto" 
                                    : "bg-emerald-600 text-white self-end ml-auto"
                                }`}
                              >
                                <div className="text-[9px] text-slate-400 mb-0.5 font-bold">{sms.sender}</div>
                                <p className="break-words">{sms.text}</p>
                                <span className="text-[8px] text-slate-400 block text-right mt-1">{sms.timestamp}</span>
                              </div>
                            ))}
                            {aiAssistantTyping && (
                              <div className="bg-slate-850 p-2 rounded-lg max-w-[80%] text-[10px] text-slate-400 italic">
                                Simulating carrier response...
                              </div>
                            )}
                          </div>

                          {/* Chat Sender Form */}
                          <form onSubmit={handleSendSimSms} className="space-y-2 border-t border-slate-800 pt-2">
                            <div className="flex items-center justify-between gap-1 text-[10px]">
                              <span className="text-slate-400">Simulate direction:</span>
                              <div className="flex gap-2">
                                <label className="flex items-center gap-1 text-slate-300">
                                  <input 
                                    type="radio" 
                                    checked={isSmsIncoming} 
                                    onChange={() => setIsSmsIncoming(true)} 
                                  /> Incoming
                                </label>
                                <label className="flex items-center gap-1 text-slate-300">
                                  <input 
                                    type="radio" 
                                    checked={!isSmsIncoming} 
                                    onChange={() => setIsSmsIncoming(false)} 
                                  /> Outgoing
                                </label>
                              </div>
                            </div>

                            <div className="flex gap-1.5">
                              <input 
                                type="text"
                                placeholder="Sender Name/No"
                                value={customSmsSender}
                                onChange={(e) => setCustomSmsSender(e.target.value)}
                                className="w-1/3 bg-slate-900 border border-slate-800 rounded text-[10px] px-1.5 py-1 text-white"
                              />
                              <input 
                                type="text"
                                placeholder="Type message..."
                                value={customSmsText}
                                onChange={(e) => setCustomSmsText(e.target.value)}
                                className="flex-1 bg-slate-900 border border-slate-800 rounded text-[10px] px-1.5 py-1 text-white focus:outline-none focus:border-emerald-500"
                              />
                              <button 
                                type="submit" 
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-white cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Settings App */}
                      {openAndroidApp.packageName === "com.android.settings" && (
                        <div className="space-y-3 flex flex-col h-full">
                          {/* Navigation Header */}
                          {settingsSubView !== "main" ? (
                            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                              <button
                                onClick={() => {
                                  setSettingsSubView("main");
                                  setExpandedPermissionAppId(null);
                                }}
                                className="p-1 hover:bg-slate-850 text-slate-400 hover:text-white rounded transition cursor-pointer"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-[10px] font-bold text-white">
                                {settingsSubView === "about" ? "About Phone" : "App Permissions"}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                              <Settings className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-[10px] font-bold text-white">System Settings</span>
                            </div>
                          )}

                          {/* MAIN MENU */}
                          {settingsSubView === "main" && (
                            <div className="space-y-2 pt-1">
                              <button
                                onClick={() => setSettingsSubView("about")}
                                className="w-full flex items-center justify-between p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-left transition cursor-pointer"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <div className="p-1 bg-sky-500/10 text-sky-400 rounded-md">
                                    <Info className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="truncate">
                                    <span className="text-[10px] font-bold text-white block">About Phone</span>
                                    <span className="text-[8px] text-slate-400 block truncate">Model, version, and hardware signatures</span>
                                  </div>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              </button>

                              <button
                                onClick={() => setSettingsSubView("permissions")}
                                className="w-full flex items-center justify-between p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-left transition cursor-pointer"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <div className="p-1 bg-emerald-500/10 text-emerald-400 rounded-md">
                                    <FolderLock className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="truncate">
                                    <span className="text-[10px] font-bold text-white block">App Permissions</span>
                                    <span className="text-[8px] text-slate-400 block truncate">Toggle Camera, Location, Contacts</span>
                                  </div>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              </button>
                            </div>
                          )}

                          {/* ABOUT PHONE */}
                          {settingsSubView === "about" && (
                            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-0.5">
                              <div className="space-y-1.5 text-[10px] text-slate-300 font-sans">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Device Name:</span>
                                  <span className="font-mono text-white">{activeDevice.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Model:</span>
                                  <span className="font-mono text-white">{activeDevice.hardware.model}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Android Version:</span>
                                  <span className="font-mono text-emerald-400 font-bold">14.0 (API 34)</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Kernel Version:</span>
                                  <span className="font-mono text-white text-[9px] max-w-[150px] truncate">{activeDevice.hardware.kernelVersion}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Security Patch:</span>
                                  <span className="font-mono text-white">{activeDevice.hardware.securityPatch}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Bootloader Signature:</span>
                                  <span className="font-mono text-slate-400">{activeDevice.hardware.bootloader}</span>
                                </div>
                              </div>

                              <div className="bg-slate-900 p-2 rounded border border-slate-800 space-y-1 mt-1">
                                <span className="text-[9px] text-amber-400 font-bold block">Developer Virtualization Signatures</span>
                                <p className="text-[8px] text-slate-400 leading-tight font-sans">
                                  System files are spoofed dynamically at the JNI interface to match authentic devices and bypass standard verification layers.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* APP PERMISSIONS MANAGER */}
                          {settingsSubView === "permissions" && (
                            <div className="space-y-2 flex-1 flex flex-col min-h-0">
                              <p className="text-[9px] text-slate-400 leading-tight font-sans">
                                Control access to sensitive device resources (Camera, Location, Contacts) for each installed app.
                              </p>

                              <div className="space-y-1.5 overflow-y-auto max-h-[230px] pr-0.5 flex-1">
                                {(installedApps[activeDevice.id] || []).length === 0 ? (
                                  <div className="text-center py-4 text-[10px] text-slate-500 font-sans">
                                    No apps installed.
                                  </div>
                                ) : (
                                  (installedApps[activeDevice.id] || []).map((app) => {
                                    const perms = app.permissions || { camera: true, location: true, contacts: true };
                                    const isExpanded = expandedPermissionAppId === app.id;
                                    const grantedCount = [perms.camera, perms.location, perms.contacts].filter(Boolean).length;

                                    return (
                                      <div
                                        key={app.id}
                                        className="bg-slate-900 border border-slate-800/80 rounded-lg overflow-hidden transition-all duration-200"
                                      >
                                        {/* App Row Header */}
                                        <div
                                          onClick={() => setExpandedPermissionAppId(isExpanded ? null : app.id)}
                                          className="flex items-center justify-between p-2 hover:bg-slate-850 cursor-pointer select-none"
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-sm shrink-0">{app.icon}</span>
                                            <div className="min-w-0">
                                              <span className="text-[10px] font-bold text-white block truncate font-sans">{app.name}</span>
                                              <span className="text-[8px] text-slate-400 block truncate font-mono">
                                                {app.packageName}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-1 shrink-0">
                                            <span className={`text-[8px] px-1 py-0.5 rounded-full font-medium font-sans ${
                                              grantedCount === 3
                                                ? "bg-emerald-500/15 text-emerald-400"
                                                : grantedCount > 0
                                                ? "bg-amber-500/15 text-amber-400"
                                                : "bg-slate-800 text-slate-500"
                                            }`}>
                                              {grantedCount}/3
                                            </span>
                                            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                                          </div>
                                        </div>

                                        {/* Permission Toggles Panel */}
                                        {isExpanded && (
                                          <div className="border-t border-slate-850/60 bg-slate-950/40 p-2 space-y-1.5">
                                            {/* Camera */}
                                            <div className="flex items-center justify-between py-1 px-1.5 hover:bg-slate-900/35 rounded transition">
                                              <div className="flex items-center gap-1.5 text-[9px] text-slate-300 font-sans">
                                                <Camera className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                                <span>Camera</span>
                                              </div>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleTogglePermission(app.id, "camera");
                                                }}
                                                className="text-slate-400 hover:text-white transition focus:outline-none cursor-pointer"
                                              >
                                                {perms.camera ? (
                                                  <ToggleRight className="w-7 h-7 text-emerald-500" />
                                                ) : (
                                                  <ToggleLeft className="w-7 h-7 text-slate-600" />
                                                )}
                                              </button>
                                            </div>

                                            {/* Location */}
                                            <div className="flex items-center justify-between py-1 px-1.5 hover:bg-slate-900/35 rounded transition">
                                              <div className="flex items-center gap-1.5 text-[9px] text-slate-300 font-sans">
                                                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                <span>Location</span>
                                              </div>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleTogglePermission(app.id, "location");
                                                }}
                                                className="text-slate-400 hover:text-white transition focus:outline-none cursor-pointer"
                                              >
                                                {perms.location ? (
                                                  <ToggleRight className="w-7 h-7 text-emerald-500" />
                                                ) : (
                                                  <ToggleLeft className="w-7 h-7 text-slate-600" />
                                                )}
                                              </button>
                                            </div>

                                            {/* Contacts */}
                                            <div className="flex items-center justify-between py-1 px-1.5 hover:bg-slate-900/35 rounded transition">
                                              <div className="flex items-center gap-1.5 text-[9px] text-slate-300 font-sans">
                                                <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                                <span>Contacts</span>
                                              </div>
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleTogglePermission(app.id, "contacts");
                                                }}
                                                className="text-slate-400 hover:text-white transition focus:outline-none cursor-pointer"
                                              >
                                                {perms.contacts ? (
                                                  <ToggleRight className="w-7 h-7 text-emerald-500" />
                                                ) : (
                                                  <ToggleLeft className="w-7 h-7 text-slate-600" />
                                                )}
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Magisk Manager App */}
                      {openAndroidApp.packageName === "com.topjohnwu.magisk" && (
                        <div className="space-y-3">
                          <div className="bg-slate-900 border border-rose-500/30 p-2.5 rounded-lg text-center">
                            <span className="text-xl">🎭</span>
                            <span className="text-xs font-bold text-white block mt-1">Magisk Virtual Manager</span>
                            <span className="text-[10px] text-slate-400">Version 27.0 (27000) (Stable)</span>
                          </div>

                          <div className="space-y-1.5 text-[10px] text-slate-300">
                            <div className="flex justify-between items-center bg-slate-900 p-1.5 rounded">
                              <span>Zygisk Injection State</span>
                              <span className={activeDevice.isZygiskEnabled ? "text-emerald-400 font-bold" : "text-rose-400"}>
                                {activeDevice.isZygiskEnabled ? "ACTIVE" : "DISABLED"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-900 p-1.5 rounded">
                              <span>DenyList Enforcer</span>
                              <span className={activeDevice.isDenyListActive ? "text-emerald-400 font-bold" : "text-rose-400"}>
                                {activeDevice.isDenyListActive ? "ENFORCED" : "INACTIVE"}
                              </span>
                            </div>
                          </div>

                          <div className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-200 block">Configure DenyList Packages:</span>
                            <div className="space-y-1">
                              {(installedApps[activeDevice.id] || [])
                                .filter(a => !a.isSystem)
                                .map(app => (
                                  <div key={app.id} className="flex items-center justify-between text-[10px] bg-slate-950 p-1 rounded">
                                    <span>{app.name}</span>
                                    <button
                                      onClick={() => handleToggleDenyList(app.id)}
                                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition cursor-pointer ${
                                        app.isDenyListed 
                                          ? "bg-rose-500/20 text-rose-300" 
                                          : "bg-slate-800 text-slate-400"
                                      }`}
                                    >
                                      {app.isDenyListed ? "Isolated" : "Exposed"}
                                    </button>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SafetyNet Attestation Sample App */}
                      {openAndroidApp.packageName === "com.scottyab.safetynet.sample" && (
                        <div className="space-y-3 text-center">
                          <ShieldCheck className="w-8 h-8 text-indigo-400 mx-auto" />
                          <div>
                            <span className="text-xs font-bold text-white block">Google Play Integrity Attestor</span>
                            <span className="text-[9px] text-slate-400">Verifies hardware boot signatures & basic system health</span>
                          </div>

                          <button
                            onClick={triggerSafetyNetTest}
                            disabled={isAttesting}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 rounded text-xs transition cursor-pointer"
                          >
                            {isAttesting ? "Attesting API Server..." : "Run Compatibility Verification"}
                          </button>

                          {attestationReport && (
                            <div className="bg-slate-900 border border-slate-800 p-2 rounded text-left space-y-1.5">
                              <span className="text-[9px] font-mono text-emerald-400 block">Attestation Result:</span>
                              <div className="space-y-1 text-[9px] text-slate-300 font-mono">
                                <div className="flex justify-between">
                                  <span>CTS Profile Match:</span>
                                  <span className={activeDevice.safetyNet.ctsProfileMatch ? "text-emerald-400" : "text-rose-400"}>
                                    {activeDevice.safetyNet.ctsProfileMatch ? "PASS" : "FAIL"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Basic Integrity:</span>
                                  <span className={activeDevice.safetyNet.basicIntegrity ? "text-emerald-400" : "text-rose-400"}>
                                    {activeDevice.safetyNet.basicIntegrity ? "PASS" : "FAIL"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Device Integrity:</span>
                                  <span className={activeDevice.safetyNet.playIntegrityMeetsDevice ? "text-emerald-400" : "text-rose-400"}>
                                    {activeDevice.safetyNet.playIntegrityMeetsDevice ? "MEETS_DEVICE_INTEGRITY" : "VIOLATION_ROOTED"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Evaluation Mode:</span>
                                  <span className="text-indigo-300">{activeDevice.safetyNet.evaluationType}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Generic Custom App Sandbox */}
                      {!SYSTEM_APPS.some(s => s.packageName === openAndroidApp.packageName) && (
                        <div className="space-y-3">
                          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-center">
                            <span className="text-3xl block mb-1">{openAndroidApp.icon}</span>
                            <span className="text-xs font-bold text-white block">{openAndroidApp.name}</span>
                            <span className="text-[10px] text-slate-500 block">{openAndroidApp.packageName}</span>
                          </div>

                          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
                            <span className="text-[10px] font-bold text-indigo-400 block">Security Analysis Report</span>
                            <div className="space-y-1.5 text-[10px]">
                              
                              {/* PayPal, GPay, Netflix Fail States */}
                              {activeDevice.isRooted && !openAndroidApp.isDenyListed && (
                                <div className="bg-rose-950/40 border border-rose-500/20 p-2 rounded text-rose-300 flex items-start gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-semibold block text-[10px]">Root Binary Detected</span>
                                    <p className="text-[9px] text-rose-400">
                                      This app instantly crashes or blocks execution because "/system/xbin/su" and unlocked bootloader flags are visible on the heap.
                                    </p>
                                  </div>
                                </div>
                              )}

                              {activeDevice.isRooted && openAndroidApp.isDenyListed && (
                                <div className="bg-emerald-950/40 border border-emerald-500/20 p-2 rounded text-emerald-300 flex items-start gap-1.5">
                                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-semibold block text-[10px]">Bypass Active via DenyList</span>
                                    <p className="text-[9px] text-emerald-400">
                                      Zygisk Hook successfully spoofed properties. The root binary directory has been hidden and secure mock bootloader attributes returned to the caller.
                                    </p>
                                  </div>
                                </div>
                              )}

                              {!activeDevice.isRooted && (
                                <div className="bg-slate-950 p-2 rounded text-slate-300 flex items-start gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-semibold block text-[10px]">Secure Commercial Container</span>
                                    <p className="text-[9px] text-slate-400">
                                      Running on authentic stock vendor specifications. Safe execution.
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUninstallApp(openAndroidApp.id)}
                              className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-1.5 rounded text-xs transition cursor-pointer"
                            >
                              Uninstall Package
                            </button>
                            <button
                              onClick={() => {
                                addLog(`Forced app data wipe for ${openAndroidApp.packageName}`);
                              }}
                              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-1.5 rounded text-xs transition cursor-pointer"
                            >
                              Clear Data
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                    
                    {/* Simulated Navigation Bar */}
                    <div className="bg-slate-900 border-t border-slate-800 py-2 flex justify-around items-center text-slate-400 z-30">
                      <button 
                        onClick={() => {
                          if (openAndroidApp?.packageName === "com.android.settings" && settingsSubView !== "main") {
                            setSettingsSubView("main");
                            setExpandedPermissionAppId(null);
                          } else {
                            setOpenAndroidApp(null);
                          }
                        }}
                        className="p-1 hover:text-white text-xs cursor-pointer"
                      >
                        ◀
                      </button>
                      <button 
                        onClick={() => setOpenAndroidApp(null)}
                        className="w-3 h-3 border-2 border-slate-400 rounded-sm hover:border-white cursor-pointer"
                      ></button>
                      <button className="p-1 hover:text-white text-xs">■</button>
                    </div>
                  </div>
                ) : (
                  // Android Desktop launcher view
                  <div className="flex-1 flex flex-col justify-between p-4 relative z-20">
                    
                    {/* App grid */}
                    <div className="grid grid-cols-4 gap-x-2 gap-y-4">
                      {(installedApps[activeDevice.id] || []).map((app) => (
                        <div 
                          key={app.id}
                          onClick={() => setOpenAndroidApp(app)}
                          className="flex flex-col items-center cursor-pointer group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-lg shadow-md group-hover:scale-105 transition-transform">
                            {app.icon}
                          </div>
                          <span className="text-[9px] text-slate-200 mt-1 truncate max-w-full font-medium text-center">
                            {app.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Floating App Dock */}
                    <div className="bg-slate-800/50 border border-slate-700/30 p-2 rounded-2xl flex justify-around items-center">
                      {(installedApps[activeDevice.id] || [])
                        .filter(a => ["com.android.dialer", "com.android.providers.telephony", "com.android.settings"].includes(a.packageName))
                        .map((app) => (
                          <div 
                            key={app.id} 
                            onClick={() => setOpenAndroidApp(app)}
                            className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-base hover:scale-110 transition-transform cursor-pointer"
                          >
                            {app.icon}
                          </div>
                        ))}
                    </div>

                  </div>
                )}

              </div>

              {/* Boot-up Animation Overlay */}
              <AnimatePresence>
                {bootingDevices[activeDevice.id] && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950 z-50 flex flex-col p-4 select-none justify-between text-left"
                  >
                    {/* Top Title/Chipset */}
                    <div className="space-y-1 text-center mt-6">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-mono border border-emerald-500/20 uppercase tracking-wider animate-pulse">
                        <Cpu className="w-3 h-3" />
                        Virtual Machine Booting
                      </div>
                      <h3 className="text-sm font-bold text-slate-100 tracking-tight">
                        {activeDevice.name}
                      </h3>
                      <p className="text-[8px] text-slate-500 font-mono">
                        Hardware Profile: {activeDevice.hardware.model}
                      </p>
                    </div>

                    {/* Scrolling System Initialization Logs */}
                    <div className="flex-1 my-4 bg-black/60 border border-slate-900/60 rounded-lg p-2.5 overflow-hidden flex flex-col justify-end font-mono text-[8px] text-slate-450 leading-normal">
                      <div className="space-y-1 max-h-[160px] overflow-y-auto scrollbar-none flex flex-col justify-end">
                        {bootingDevices[activeDevice.id].logs.map((log, index) => {
                          let colorClass = "text-slate-400";
                          if (log.startsWith("⚡") || log.startsWith("✨")) {
                            colorClass = "text-emerald-400 font-bold";
                          } else if (log.startsWith("🎭")) {
                            colorClass = "text-indigo-400";
                          } else if (log.startsWith("🔒")) {
                            colorClass = "text-amber-400";
                          } else if (log.startsWith("📶")) {
                            colorClass = "text-sky-400";
                          } else if (log.startsWith("⚙️")) {
                            colorClass = "text-purple-400";
                          } else if (log.startsWith("🐧")) {
                            colorClass = "text-rose-400";
                          }
                          return (
                            <div key={index} className={`truncate ${colorClass} text-[8px]`}>
                              {log}
                            </div>
                          );
                        })}
                        {/* Auto-scroll anchor */}
                        <div ref={logEndRef} />
                      </div>
                    </div>

                    {/* Bottom Loading Bar and Percentage */}
                    <div className="space-y-2 mb-6 px-1">
                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                        <span className="animate-pulse">Loading system frameworks...</span>
                        <span className="font-bold text-white">{bootingDevices[activeDevice.id].progress}%</span>
                      </div>
                      
                      {/* Progress Bar Container */}
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 relative">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-100"
                          style={{ width: `${bootingDevices[activeDevice.id].progress}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Touch Bar Overlay */}
              <div className="bg-slate-950 pb-2 pt-1 flex justify-center z-30 select-none">
                <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
              </div>

            </div>
          </div>

          {/* Quick instructions underneath */}
          <p className="text-[10px] text-slate-400 text-center mt-3 max-w-[280px]">
            Click apps like 📞 <span className="text-white">Phone</span>, 💬 <span className="text-white">Messages</span>, ⚙️ <span className="text-white">Settings</span>, 🎭 <span className="text-white">Magisk</span> or 🛡️ <span className="text-white">SafetyNet</span> to interact with active emulated frameworks.
          </p>

        </div>

        {/* Right Section - Hardware Signatures Editor & Attestation Logs */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          
          {/* Hardware Signature Presets & Editor */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Hardware Signature Profiles
            </h2>

            {/* Quick Profile Load Presets */}
            <div className="space-y-1 mb-4">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">Preset OEM Signatures</span>
              <div className="grid grid-cols-1 gap-1">
                {PRESET_HARDWARE_PROFILES.map((profile, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPresetSignature(profile.signature)}
                    className="text-left bg-slate-900 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 p-1.5 rounded text-[10px] text-slate-300 font-medium flex items-center justify-between transition cursor-pointer"
                  >
                    <span>{profile.name}</span>
                    <Download className="w-3 h-3 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Live Parameter Editor */}
            <div className="border-t border-slate-800/80 pt-3 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold block">Live Signature Fields</span>
              
              <div className="space-y-1.5 text-[10px]">
                <div>
                  <span className="text-slate-500">Brand</span>
                  <input
                    type="text"
                    value={editableHardware.brand}
                    onChange={(e) => setEditableHardware({...editableHardware, brand: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-white font-mono"
                  />
                </div>
                <div>
                  <span className="text-slate-500">Model</span>
                  <input
                    type="text"
                    value={editableHardware.model}
                    onChange={(e) => setEditableHardware({...editableHardware, model: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-white font-mono"
                  />
                </div>
                <div>
                  <span className="text-slate-500">Manufacturer</span>
                  <input
                    type="text"
                    value={editableHardware.manufacturer}
                    onChange={(e) => setEditableHardware({...editableHardware, manufacturer: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-white font-mono"
                  />
                </div>
                <div>
                  <span className="text-slate-500">Fingerprint</span>
                  <textarea
                    rows={2}
                    value={editableHardware.fingerprint}
                    onChange={(e) => setEditableHardware({...editableHardware, fingerprint: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-white font-mono text-[9px] resize-none"
                  />
                </div>
                <div>
                  <span className="text-slate-500">Security Patch Level</span>
                  <input
                    type="text"
                    value={editableHardware.securityPatch}
                    onChange={(e) => setEditableHardware({...editableHardware, securityPatch: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-white font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleApplyHardwareSignature}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1 rounded text-[10px] transition cursor-pointer mt-2"
              >
                Inject Signature Heap Changes
              </button>
            </div>
          </div>

          {/* Third-party Play Store Package installer */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-200 mb-2.5 flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              App Store Installation Sandbox
            </h2>
            <p className="text-[10px] text-slate-400 mb-3 leading-tight">
              Test custom safety net detection and bypass capabilities by installing security-sensitive packages:
            </p>

            <div className="space-y-2">
              {OTHER_AVAILABLE_APPS.map((app) => {
                const list = installedApps[activeDevice.id] || [];
                const isInstalled = list.some(a => a.packageName === app.packageName);
                return (
                  <div key={app.id} className="bg-slate-900 p-2 rounded border border-slate-850 flex items-start justify-between gap-1">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1">
                        <span>{app.icon}</span>
                        <span className="text-[10px] font-bold text-white">{app.name}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-tight">
                        {app.description}
                      </p>
                    </div>
                    <button
                      disabled={isInstalled}
                      onClick={() => handleInstallApp(app)}
                      className={`text-[9px] font-bold px-2 py-1 rounded transition shrink-0 cursor-pointer ${
                        isInstalled 
                          ? "bg-slate-800 text-slate-500" 
                          : "bg-indigo-600 hover:bg-indigo-500 text-white"
                      }`}
                    >
                      {isInstalled ? "Installed" : "Install"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Virtual Device Snapshot Manager */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-200 mb-2.5 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              VM Snapshot Manager
            </h2>
            <p className="text-[10px] text-slate-400 mb-3 leading-tight font-sans">
              Capture and freeze the active virtual machine state (including hardware profile, custom network registries, SMS inbox, and installed sandbox apps) to local storage.
            </p>

            {/* Create Snapshot Form */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-2.5 mb-3">
              <span className="text-[10px] font-bold text-slate-300 block mb-1.5 font-sans">Take New Snapshot</span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="e.g. Pre-Root Sandbox Setup"
                  value={snapshotNameInput}
                  onChange={(e) => setSnapshotNameInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded text-[10px] px-2 py-1 text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
                <button
                  onClick={handleSaveSnapshot}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] px-3 py-1 rounded transition flex items-center gap-1 cursor-pointer font-sans"
                >
                  <Check className="w-3 h-3" />
                  Save
                </button>
              </div>
            </div>

            {/* Snapshot List */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {snapshots.length === 0 ? (
                <div className="text-center py-4 bg-slate-900/20 border border-dashed border-slate-800 rounded-lg">
                  <span className="text-[10px] text-slate-500 font-sans">No snapshots saved.</span>
                </div>
              ) : (
                snapshots.map((snap) => (
                  <div key={snap.id} className="bg-slate-900 p-2 rounded border border-slate-850 space-y-1.5">
                    <div className="flex items-start justify-between gap-1">
                      <div className="truncate">
                        <span className="text-[10px] font-bold text-white block truncate font-sans">{snap.name}</span>
                        <span className="text-[8px] text-slate-400 block font-mono">
                          {snap.timestamp} • {snap.device.hardware.manufacturer} {snap.device.hardware.model}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteSnapshot(snap.id)}
                        className="p-1 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded transition shrink-0 cursor-pointer"
                        title="Delete snapshot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex gap-1 border-t border-slate-800/50 pt-1.5">
                      <button
                        onClick={() => handleRestoreSnapshotOverwrite(snap)}
                        className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/20 text-[9px] font-medium py-1 rounded transition cursor-pointer font-sans"
                        title="Overwrites current active phone state"
                      >
                        Restore Over Active
                      </button>
                      <button
                        onClick={() => handleRestoreSnapshotAsNew(snap)}
                        className="flex-1 bg-emerald-600/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/20 text-[9px] font-medium py-1 rounded transition cursor-pointer font-sans"
                        title="Creates a cloned phone virtual instance"
                      >
                        Restore as New
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Live System Logging Footer Panel */}
      <footer className="bg-slate-950 border-t border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">
              Android Virtual Device Logs & Boot Sequence Output
            </span>
            <div className="bg-slate-900 rounded-lg p-2.5 font-mono text-[9px] text-slate-300 max-h-[80px] overflow-y-auto space-y-1 border border-slate-800">
              {consoleLogs.map((log, index) => (
                <div key={index} className="leading-tight truncate">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Provision Virtual Device Dialog */}
      <AnimatePresence>
        {isCreateDeviceOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-6 space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Provision Virtual Device
                </h3>
                <button 
                  onClick={() => setIsCreateDeviceOpen(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Friendly Device Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Pixel 8 Pro Work Profile"
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Base Hardware OEM Signature Signature Preset</label>
                  <select
                    value={selectedHardwarePresetIndex}
                    onChange={(e) => setSelectedHardwarePresetIndex(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                  >
                    {PRESET_HARDWARE_PROFILES.map((prof, idx) => (
                      <option key={idx} value={idx}>{prof.name}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-950 p-3 rounded border border-slate-850 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">Pre-Rooted (su binary installed)</span>
                    <span className="text-[9px] text-slate-400">Installs Magisk manager and configures superuser privileges.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={newDeviceIsRooted}
                    onChange={(e) => setNewDeviceIsRooted(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-slate-850 rounded focus:ring-emerald-500 bg-slate-900"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setIsCreateDeviceOpen(false)}
                  className="px-3 py-1.5 border border-slate-800 hover:bg-slate-800 rounded text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDevice}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-bold text-white cursor-pointer"
                >
                  Confirm Provision
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

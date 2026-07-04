import React, { useState, useEffect, useRef } from "react";
import { SmsMessage, CallSession, SavedContact } from "./types";
import { PLAY_STORE_APPS, OPPO_A6_SPECS, OppoApp } from "./presets";
import { 
  Phone as PhoneIcon, 
  MessageSquare, 
  Globe, 
  Search, 
  ArrowLeft, 
  Star, 
  DownloadCloud, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Plus, 
  Trash2, 
  Send, 
  RefreshCw, 
  Sliders, 
  Sun, 
  Moon, 
  Eye, 
  Volume2, 
  Lock, 
  Unlock, 
  Mail, 
  MapPin, 
  Video, 
  Heart, 
  User, 
  Folder, 
  Battery, 
  Wifi, 
  Signal, 
  Camera, 
  Image, 
  Clock, 
  CloudSun, 
  LogOut, 
  Settings as SettingsIcon, 
  Check, 
  ChevronRight,
  Sparkles,
  Cpu,
  Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GooglePhoneIcon, 
  GoogleMessagesIcon, 
  GoogleChromeIcon, 
  GooglePlayStoreIcon, 
  OppoCameraIcon, 
  GooglePhotosIcon, 
  ColorOsSettingsIcon, 
  GoogleYoutubeIcon, 
  WhatsappIconComponent, 
  InstagramIconComponent, 
  SpotifyIconComponent, 
  GoogleMapsIconComponent, 
  GmailIconComponent 
} from "./components/AndroidIcons";
import { EsimSettings, EsimProfile } from "./components/EsimSettings";

// Wallpaper Gradients matching ColorOS style
const WALLPAPERS = [
  { name: "Emerald Ripple", css: "bg-gradient-to-b from-emerald-500 via-teal-700 to-slate-950" },
  { name: "Aurora Night", css: "bg-gradient-to-b from-sky-500 via-indigo-800 to-neutral-950" },
  { name: "Oppo Sunrise", css: "bg-gradient-to-b from-orange-400 via-rose-600 to-stone-950" },
  { name: "Cosmic Charcoal", css: "bg-gradient-to-b from-slate-700 via-zinc-800 to-black" }
];

export default function App() {
  // Power & Basic States
  const [isPhoneOn, setIsPhoneOn] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  
  // eSIM Profile States
  const [esimProfiles, setEsimProfiles] = useState<EsimProfile[]>([
    {
      id: "esim-default",
      carrier: "Google Fi Virtual",
      number: "+1 (555) 901-2686",
      plan: "Fi Unlimited Ultra 5G",
      eid: "8904903200001234567800049102",
      iccid: "89012600001234567890",
      active: true,
      status: "connected"
    }
  ]);

  const handleAddEsim = (newProfile: EsimProfile) => {
    setEsimProfiles(prev => [...prev, newProfile]);
  };

  const handleToggleEsimActive = (id: string) => {
    setEsimProfiles(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, active: !p.active };
      }
      return p;
    }));
  };

  const handleDeleteEsim = (id: string) => {
    setEsimProfiles(prev => prev.filter(p => p.id !== id));
  };

  // Helper function to render pixel-perfect app icons
  const renderAppIcon = (appId: string, className = "w-10 h-10") => {
    switch (appId) {
      case "phone": return <GooglePhoneIcon className={className} />;
      case "messages": return <GoogleMessagesIcon className={className} />;
      case "chrome": return <GoogleChromeIcon className={className} />;
      case "playstore": return <GooglePlayStoreIcon className={className} />;
      case "camera": return <OppoCameraIcon className={className} />;
      case "gallery": return <GooglePhotosIcon className={className} />;
      case "settings": return <ColorOsSettingsIcon className={className} />;
      case "yt": return <GoogleYoutubeIcon className={className} />;
      case "wa": return <WhatsappIconComponent className={className} />;
      case "ig": return <InstagramIconComponent className={className} />;
      case "sp": return <SpotifyIconComponent className={className} />;
      case "gm": return <GmailIconComponent className={className} />;
      case "maps": return <GoogleMapsIconComponent className={className} />;
      default: return <div className={`${className} rounded-[14px] bg-slate-800 flex items-center justify-center text-lg`}>📱</div>;
    }
  };
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEyeComfort, setIsEyeComfort] = useState(false);
  const [brightness, setBrightness] = useState(85);
  const [volume, setVolume] = useState(70);
  const [showVolumeOverlay, setShowVolumeOverlay] = useState(false);
  const [isWifiOn, setIsWifiOn] = useState(true);
  const [isDataOn, setIsDataOn] = useState(true);
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  
  // Power connection & battery
  const [battery, setBattery] = useState(82);
  const [isCharging, setIsCharging] = useState(false);
  const [showSuperVooc, setShowSuperVooc] = useState(false);

  // Quick Settings Swipe Panel
  const [showQuickSettings, setShowQuickSettings] = useState(false);

  // Google Account Sync State
  const [googleUser, setGoogleUser] = useState<{ name: string; email: string } | null>({
    name: "Alex Mercer",
    email: "alex.mercer2026@gmail.com"
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginName, setLoginName] = useState("");

  // Play Store State
  const [installedAppIds, setInstalledAppIds] = useState<string[]>(["yt", "gm", "maps", "wa", "ig", "sp"]);
  const [playStoreSearch, setPlayStoreSearch] = useState("");
  const [selectedPlayApp, setSelectedPlayApp] = useState<OppoApp | null>(null);
  const [installProgress, setInstallProgress] = useState<Record<string, number>>({});

  // Browser State
  const [browserUrl, setBrowserUrl] = useState("google.com");
  const [browserSearchInput, setBrowserSearchInput] = useState("");
  const [browserPage, setBrowserPage] = useState<"home" | "results" | "wikipedia" | "oppo_specs" | "custom">("home");

  // Phone App States
  const [dialInput, setDialInput] = useState("");
  const [phoneCallError, setPhoneCallError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<SavedContact[]>([
    { id: "1", name: "Mom", phoneNumber: "+1 (555) 489-0201", avatarColor: "bg-pink-500" },
    { id: "2", name: "Sarah (Office)", phoneNumber: "+1 (555) 710-3841", avatarColor: "bg-blue-500" },
    { id: "3", name: "Dave (Best Friend)", phoneNumber: "+1 (555) 302-9911", avatarColor: "bg-emerald-500" }
  ]);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [phoneTab, setPhoneTab] = useState<"dialer" | "contacts">("dialer");
  
  // Active Telephony Sessions
  const [callSession, setCallSession] = useState<CallSession>({
    phoneNumber: "",
    status: "idle",
    duration: 0,
    isIncoming: false
  });
  const [smsThreads, setSmsThreads] = useState<SmsMessage[]>([
    { id: "sms-1", sender: "Mom", text: "Hey! Let me know when you get your new Oppo A6 set up! ❤️", timestamp: "Yesterday", isIncoming: true },
    { id: "sms-2", sender: "Sarah (Office)", text: "Please send over the updated project reports by 5 PM.", timestamp: "10:14 AM", isIncoming: true }
  ]);
  const [activeChatContact, setActiveChatContact] = useState<string>("Mom");
  const [typedSms, setTypedSms] = useState("");

  // Notifications State (Head-Up Messages)
  const [headUpNotification, setHeadUpNotification] = useState<{ title: string; body: string; type: "sms" | "call" } | null>(null);

  // Companion Side Panel triggers
  const [sandboxCallerName, setSandboxCallerName] = useState("Oppo Support");
  const [sandboxCallerNum, setSandboxCallerNum] = useState("+1 (800) 555-6776");
  const [sandboxSmsText, setSandboxSmsText] = useState("Hi! Your Oppo A6 is verified and connected to standard carrier loops.");
  const [sandboxSmsSender, setSandboxSmsSender] = useState("Google Safety");

  // Camera App State
  const [cameraFilter, setCameraFilter] = useState("Standard");
  const [cameraZoom, setCameraZoom] = useState("1x");
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?w=400&auto=format&fit=crop&q=60",
  ]);
  const [showCameraFlash, setShowCameraFlash] = useState(false);

  // Spotify Mock State
  const [spotifyPlaying, setSpotifyPlaying] = useState(false);
  const [spotifyTrack, setSpotifyTrack] = useState({ title: "Summer Breeze", artist: "Waves", progress: 35 });

  // Time ticker
  const [currentTime, setCurrentTime] = useState("");
  const [currentDateString, setCurrentDateString] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDateString(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Call duration ticker
  useEffect(() => {
    let interval: any = null;
    if (callSession.status === "connected") {
      interval = setInterval(() => {
        setCallSession(prev => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callSession.status]);

  // Volume slider overlay auto-hide
  useEffect(() => {
    if (showVolumeOverlay) {
      const timer = setTimeout(() => setShowVolumeOverlay(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showVolumeOverlay]);

  // Handle dial call
  const startOutgoingCall = (num: string) => {
    const existing = contacts.find(c => c.phoneNumber === num || c.phoneNumber.replace(/\D/g, "") === num.replace(/\D/g, ""));
    const activeEsim = esimProfiles.find(p => p.active);
    
    if (!activeEsim) {
      setPhoneCallError("No active eSIM profile found. Please enable/add an eSIM in Settings to make calls.");
      setActiveApp("phone");
      return;
    }
    
    setPhoneCallError(null);
    setCallSession({
      phoneNumber: num,
      contactName: existing ? existing.name : num,
      status: "connected",
      duration: 0,
      isIncoming: false
    });
    setActiveApp("phone");
  };

  // Simulate incoming call from Sandbox Controller
  const triggerIncomingCall = () => {
    if (callSession.status !== "idle") return;
    setCallSession({
      phoneNumber: sandboxCallerNum,
      contactName: sandboxCallerName,
      status: "dialing",
      duration: 0,
      isIncoming: true
    });
    setIsLocked(false);
    setActiveApp(null);
  };

  // Trigger Incoming SMS
  const triggerIncomingSMS = () => {
    const newSms: SmsMessage = {
      id: `sms-${Date.now()}`,
      sender: sandboxSmsSender,
      text: sandboxSmsText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isIncoming: true
    };
    setSmsThreads(prev => [...prev, newSms]);
    setHeadUpNotification({
      title: sandboxSmsSender,
      body: sandboxSmsText,
      type: "sms"
    });
    // Auto clear notification banner after 4 seconds
    setTimeout(() => setHeadUpNotification(null), 4000);
  };

  // Send message back with a dynamic automated response
  const handleSendSms = () => {
    if (!typedSms.trim()) return;
    const userMsg: SmsMessage = {
      id: `sms-${Date.now()}`,
      sender: "Me",
      text: typedSms,
      timestamp: "Just Now",
      isIncoming: false
    };
    setSmsThreads(prev => [...prev, userMsg]);
    const currentChat = activeChatContact;
    const sentText = typedSms;
    setTypedSms("");

    // Simulate smart auto-reply
    setTimeout(() => {
      let replyText = "Sounds good! Let's touch base later.";
      if (sentText.toLowerCase().includes("hello") || sentText.toLowerCase().includes("hi")) {
        replyText = `Hi! This is ${currentChat}. Nice to chat on your new OPPO A6! How's the screen display looking?`;
      } else if (sentText.toLowerCase().includes("play store") || sentText.toLowerCase().includes("app")) {
        replyText = "The Play Store works great! Did you try downloading WhatsApp or YouTube?";
      } else if (sentText.toLowerCase().includes("where") || sentText.toLowerCase().includes("location")) {
        replyText = "I am currently at the shopping mall. Let me send my GPS coordinates.";
      }

      const replyMsg: SmsMessage = {
        id: `sms-${Date.now() + 1}`,
        sender: currentChat,
        text: replyText,
        timestamp: "Just Now",
        isIncoming: true
      };
      setSmsThreads(prev => [...prev, replyMsg]);
    }, 1500);
  };

  // Google Play Store Apps Installation Simulation
  const handleInstallApp = (app: OppoApp) => {
    if (installedAppIds.includes(app.id)) return;
    setInstallProgress(prev => ({ ...prev, [app.id]: 5 }));
    
    let currentProg = 5;
    const interval = setInterval(() => {
      currentProg += 20;
      if (currentProg >= 100) {
        clearInterval(interval);
        setInstalledAppIds(prev => [...prev, app.id]);
        setInstallProgress(prev => {
          const next = { ...prev };
          delete next[app.id];
          return next;
        });
      } else {
        setInstallProgress(prev => ({ ...prev, [app.id]: currentProg }));
      }
    }, 300);
  };

  // Snap photo in Camera
  const handleSnapPhoto = () => {
    setShowCameraFlash(true);
    setTimeout(() => setShowCameraFlash(false), 200);
    // Simple mock photo URL
    const pics = [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1472214222541-d510753a4907?w=400&auto=format&fit=crop&q=60"
    ];
    const newPic = pics[Math.floor(Math.random() * pics.length)];
    setCapturedPhotos(prev => [newPic, ...prev]);
  };

  // Play Store filtering
  const playStoreAppsToRender = PLAY_STORE_APPS.filter(app => 
    !playStoreSearch || app.name.toLowerCase().includes(playStoreSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans overflow-x-hidden">
      
      {/* LEFT SIDE: THE HARDWARE PHONE DISPLAY & SIMULATOR */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-8 relative min-h-[640px] md:min-h-0 bg-slate-950/40">
        
        {/* Dynamic eye comfort amber screen tint layer */}
        {isEyeComfort && (
          <div className="absolute inset-0 bg-amber-500/10 pointer-events-none z-50 transition-opacity duration-500 mix-blend-color-burn" />
        )}

        {/* Dynamic global brightness overlay */}
        <div 
          className="absolute inset-0 bg-black pointer-events-none z-40 transition-opacity duration-300"
          style={{ opacity: Math.max(0, (100 - brightness) * 0.005) }}
        />

        {/* Ambient background glow matching the wallpaper */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[680px] blur-[120px] opacity-20 pointer-events-none rounded-full transition-all duration-1000 ${WALLPAPERS[wallpaperIndex].css}`} />

        {/* Physical Phone Model Container */}
        <div className="relative select-none flex flex-col items-center scale-[0.95] lg:scale-100 transition-transform">
          
          {/* HARDWARE BUTTONS (Left Side: Volume) */}
          <div className="absolute left-[-11px] top-44 flex flex-col gap-4 z-20">
            <button 
              onClick={() => {
                setVolume(prev => Math.min(100, prev + 10));
                setShowVolumeOverlay(true);
              }}
              className="w-[3px] h-12 bg-gradient-to-r from-slate-700 to-slate-800 rounded-l border-l border-slate-600/50 hover:from-slate-600 hover:to-slate-700 active:scale-95 transition-all shadow-md cursor-pointer"
              title="Volume Up"
            />
            <button 
              onClick={() => {
                setVolume(prev => Math.max(0, prev - 10));
                setShowVolumeOverlay(true);
              }}
              className="w-[3px] h-12 bg-gradient-to-r from-slate-700 to-slate-800 rounded-l border-l border-slate-600/50 hover:from-slate-600 hover:to-slate-700 active:scale-95 transition-all shadow-md cursor-pointer"
              title="Volume Down"
            />
          </div>

          {/* HARDWARE BUTTONS (Right Side: Power Key / Fingerprint) */}
          <div className="absolute right-[-11px] top-48 z-20">
            <button 
              onClick={() => {
                if (!isPhoneOn) {
                  setIsPhoneOn(true);
                  setIsLocked(true);
                } else {
                  setIsPhoneOn(false);
                }
              }}
              className="w-[3px] h-16 bg-gradient-to-l from-slate-700 to-slate-800 rounded-r border-r border-slate-600/50 hover:from-slate-600 hover:to-slate-700 active:scale-95 transition-all shadow-md cursor-pointer"
              title="Power/Fingerprint Key"
            />
          </div>

          {/* Phone Frame */}
          <div className="w-[310px] h-[640px] rounded-[42px] p-[10px] bg-slate-900 border-[3.5px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col relative overflow-hidden ring-1 ring-slate-700/40">
            
            {/* Screen Inner Bezel Shadow */}
            <div className="absolute inset-2 rounded-[32px] border border-black/20 pointer-events-none z-30" />

            {/* SCREEN CONTENT AREA */}
            <div className={`w-full h-full rounded-[31px] overflow-hidden relative flex flex-col ${isDarkMode ? "dark bg-slate-950" : "bg-white"} text-slate-850 transition-colors duration-300`}>
              
              {/* Punch Hole Selfie Camera Top-Left */}
              <div 
                onClick={() => {
                  setActiveApp("camera");
                  setIsLocked(false);
                }}
                className="absolute top-3 left-7 w-[13px] h-[13px] bg-black rounded-full z-50 flex items-center justify-center border-[0.8px] border-slate-900 hover:border-teal-500 cursor-pointer shadow-inner transition-colors"
              >
                <div className="w-[4px] h-[4px] bg-blue-900 rounded-full opacity-60" />
              </div>

              {/* Speaker Ear Piece Grill */}
              <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-14 h-[3px] bg-zinc-800 rounded-full z-40 opacity-70" />

              {/* Volume Level Screen Overlay */}
              <AnimatePresence>
                {showVolumeOverlay && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-3 top-36 bg-slate-900/90 border border-slate-800 text-white rounded-2xl py-3 px-2 z-50 flex flex-col items-center gap-2 shadow-lg"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                    <div className="w-1.5 h-16 bg-slate-800 rounded-full overflow-hidden flex flex-col justify-end">
                      <div className="w-full bg-teal-400 transition-all duration-150" style={{ height: `${volume}%` }} />
                    </div>
                    <span className="text-[7.5px] font-mono font-bold">{volume}%</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SUPERVOOC Charging Animation Screen Overlay */}
              <AnimatePresence>
                {showSuperVooc && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setShowSuperVooc(false)}
                    className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-4 cursor-pointer select-none"
                  >
                    <div className="relative flex items-center justify-center w-36 h-36">
                      {/* Outer glowing rings */}
                      <div className="absolute inset-0 rounded-full border border-teal-500/20 animate-ping" />
                      <div className="absolute inset-2 rounded-full border-2 border-dashed border-teal-400/40 animate-spin" />
                      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-teal-500/10 to-emerald-500/10 blur" />
                      
                      {/* Inside details */}
                      <div className="text-center z-10 space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-teal-400 font-black animate-pulse">⚡ SUPERVOOC</span>
                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-emerald-400 font-mono">
                          {battery}%
                        </h2>
                        <span className="text-[7.5px] text-slate-400 block font-mono">33W Flash Charging</span>
                      </div>
                    </div>
                    <p className="text-[8px] text-slate-500 mt-4 font-mono text-center">Click anywhere to return to phone</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SMS Notification Banner (Head-Up) */}
              <AnimatePresence>
                {headUpNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    onClick={() => {
                      if (headUpNotification.type === "sms") {
                        setActiveChatContact(headUpNotification.title);
                        setActiveApp("messages");
                      }
                      setHeadUpNotification(null);
                    }}
                    className="absolute top-8 left-2 right-2 bg-slate-900/95 border border-slate-800 text-white p-2.5 rounded-2xl z-40 shadow-xl flex items-center gap-2.5 cursor-pointer hover:border-teal-500 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-xl bg-teal-500 text-white flex items-center justify-center text-sm shrink-0">
                      💬
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <span className="text-[9px] font-bold text-teal-400 block">New Message</span>
                      <h4 className="text-[9px] font-extrabold text-slate-100 leading-none truncate">{headUpNotification.title}</h4>
                      <p className="text-[8px] text-slate-350 leading-normal truncate mt-0.5">{headUpNotification.body}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* OPPO INCOMING CALL OVERLAY */}
              {callSession.status === "dialing" && (
                <div className="absolute inset-0 bg-slate-950 text-white z-50 flex flex-col justify-between p-6 text-center select-none animate-fade-in">
                  <div className="space-y-2 mt-12">
                    <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-3xl mx-auto animate-pulse">
                      👤
                    </div>
                    <h3 className="text-base font-bold text-slate-100">{callSession.contactName || "Unknown Caller"}</h3>
                    <p className="text-[10px] text-teal-400 font-mono animate-pulse">Incoming Voice Call...</p>
                    <p className="text-[9px] text-slate-450 font-mono">{callSession.phoneNumber}</p>
                  </div>

                  <div className="flex justify-around items-center mb-12">
                    <button
                      onClick={() => setCallSession({ phoneNumber: "", status: "idle", duration: 0, isIncoming: false })}
                      className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer"
                      title="Decline"
                    >
                      <PhoneIcon className="w-5 h-5 text-white transform rotate-[135deg]" />
                    </button>
                    <button
                      onClick={() => setCallSession(prev => ({ ...prev, status: "connected" }))}
                      className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center shadow-lg active:scale-95 transition cursor-pointer"
                      title="Accept"
                    >
                      <PhoneIcon className="w-5 h-5 text-white animate-bounce" />
                    </button>
                  </div>
                </div>
              )}

              {/* PHONE IS OFF/ASLEEP STATE */}
              {!isPhoneOn ? (
                <div className="w-full h-full bg-black z-30 flex flex-col items-center justify-center p-4">
                  <button 
                    onClick={() => {
                      setIsPhoneOn(true);
                      setIsLocked(true);
                    }}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-slate-400 group-hover:text-teal-400 transition">
                      <Unlock className="w-4 h-4 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">Tap screen or press Power to wake</span>
                  </button>
                </div>
              ) : (
                /* PHONE IS ON - MAIN SYSTEM ENGINE */
                <div className={`w-full h-full flex flex-col relative ${WALLPAPERS[wallpaperIndex].css} bg-cover bg-center transition-all duration-700`}>
                  
                  {/* SYSTEM STATUS BAR (OPPO STYLE) */}
                  <div 
                    onClick={() => setShowQuickSettings(true)}
                    className="h-7 pt-1 px-5 flex justify-between items-center z-40 text-white text-[9px] font-sans font-medium bg-black/10 select-none cursor-pointer"
                  >
                    <span className="font-semibold">{currentTime}</span>
                    <div className="flex items-center gap-1.5">
                      {esimProfiles.find(p => p.active) ? (
                        <span className="text-[7.5px] font-bold text-teal-300 font-mono tracking-tight mr-1">
                          {esimProfiles.find(p => p.active)?.carrier} eSIM
                        </span>
                      ) : (
                        <span className="text-[7.5px] font-bold text-rose-400 font-mono tracking-tight mr-1">
                          No Network
                        </span>
                      )}
                      <Signal className="w-3 h-3 text-white" />
                      <span className="text-[8px] font-mono font-bold text-slate-200">5G</span>
                      <Wifi className="w-3 h-3 text-white" />
                      <div className="flex items-center gap-0.5">
                        <Battery className="w-3.5 h-3.5 text-white shrink-0" />
                        <span className="text-[8.5px] font-mono leading-none">{battery}%</span>
                      </div>
                    </div>
                  </div>

                  {/* QUICK SETTINGS CONTROL CENTER DRAWER */}
                  <AnimatePresence>
                    {showQuickSettings && (
                      <motion.div
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 220 }}
                        className="absolute inset-0 bg-slate-950/98 z-40 text-white p-5 flex flex-col select-none"
                      >
                        {/* Control Center Header */}
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
                          <div className="text-left">
                            <h3 className="text-xs font-black tracking-wide text-teal-400 font-mono">COLOROS CONTROL</h3>
                            <span className="text-[8px] text-slate-400 font-mono">System Parameters & Status</span>
                          </div>
                          <button
                            onClick={() => setShowQuickSettings(false)}
                            className="p-1 hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white cursor-pointer"
                          >
                            <Sliders className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quick Settings Grid */}
                        <div className="grid grid-cols-4 gap-2.5 mb-5">
                          {/* Wi-Fi */}
                          <button 
                            onClick={() => setIsWifiOn(!isWifiOn)}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isWifiOn ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"}`}>
                              <Wifi className="w-4 h-4" />
                            </div>
                            <span className="text-[8px] font-medium block truncate">Wi-Fi</span>
                          </button>

                          {/* Mobile Data */}
                          <button 
                            onClick={() => setIsDataOn(!isDataOn)}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isDataOn ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"}`}>
                              <Signal className="w-4 h-4" />
                            </div>
                            <span className="text-[8px] font-medium block truncate">Carrier</span>
                          </button>

                          {/* Eye Comfort */}
                          <button 
                            onClick={() => setIsEyeComfort(!isEyeComfort)}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isEyeComfort ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"}`}>
                              <Eye className="w-4 h-4" />
                            </div>
                            <span className="text-[8px] font-medium block truncate">Eye Guard</span>
                          </button>

                          {/* Dark Mode */}
                          <button 
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isDarkMode ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"}`}>
                              {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                            </div>
                            <span className="text-[8px] font-medium block truncate">Dark OS</span>
                          </button>

                          {/* Flashlight */}
                          <button 
                            onClick={() => setIsFlashlightOn(!isFlashlightOn)}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isFlashlightOn ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"}`}>
                              <Sun className="w-4 h-4 transform rotate-180" />
                            </div>
                            <span className="text-[8px] font-medium block truncate">Torch</span>
                          </button>

                          {/* Bluetooth */}
                          <button 
                            onClick={() => setIsBluetoothOn(!isBluetoothOn)}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isBluetoothOn ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"}`}>
                              <Sliders className="w-4 h-4" />
                            </div>
                            <span className="text-[8px] font-medium block truncate">Bluetooth</span>
                          </button>
                        </div>

                        {/* Sliders Container */}
                        <div className="space-y-4 flex-1">
                          {/* Brightness Slider */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[8.5px] text-slate-450">
                              <span>Display Brightness</span>
                              <span className="font-mono">{brightness}%</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-850">
                              <Sun className="w-3.5 h-3.5 text-yellow-500" />
                              <input 
                                type="range" 
                                min="20" 
                                max="100" 
                                value={brightness}
                                onChange={(e) => setBrightness(Number(e.target.value))}
                                className="flex-1 accent-teal-500 h-1.5 rounded-lg bg-slate-800 appearance-none cursor-pointer" 
                              />
                            </div>
                          </div>

                          {/* Volume Slider */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[8.5px] text-slate-450">
                              <span>Media Volume</span>
                              <span className="font-mono">{volume}%</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-850">
                              <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                                className="flex-1 accent-teal-500 h-1.5 rounded-lg bg-slate-800 appearance-none cursor-pointer" 
                              />
                            </div>
                          </div>
                        </div>

                        {/* Control Panel Swipe Up Handle */}
                        <div className="pt-2 border-t border-slate-900 flex justify-center mt-auto">
                          <button 
                            onClick={() => setShowQuickSettings(false)}
                            className="px-6 py-1.5 bg-slate-900 hover:bg-slate-800 text-teal-400 rounded-full text-[8.5px] font-bold font-mono active:scale-95 transition cursor-pointer"
                          >
                            Swipe Close
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 1. LOCK SCREEN STATE */}
                  {isLocked ? (
                    <div className="flex-1 flex flex-col justify-between p-6 text-white text-center select-none">
                      
                      {/* Top Time and Date Widget */}
                      <div className="space-y-1.5 mt-8 animate-fade-in">
                        <h1 className="text-4xl font-black font-sans tracking-tight text-white/95">
                          {currentTime}
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest text-teal-300 font-bold font-sans">
                          {currentDateString}
                        </p>
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/40 backdrop-blur border border-white/10 text-[8px] font-medium text-slate-200 mt-1">
                          <Wifi className="w-2.5 h-2.5 text-teal-400" /> 
                          Carrier Network Secured
                        </div>
                      </div>

                      {/* Lockscreen notifications feed */}
                      <div className="flex-1 flex flex-col justify-center max-h-[160px] overflow-hidden">
                        <div className="bg-slate-950/60 backdrop-blur-md border border-white/5 rounded-2xl p-2 text-left space-y-1 shadow-md">
                          <div className="flex items-center gap-1 border-b border-white/5 pb-1 text-[8px] text-teal-400 font-bold">
                            <Sparkles className="w-2.5 h-2.5" />
                            ColorOS Intellect Center
                          </div>
                          <span className="text-[9px] font-bold text-slate-200">Device CPH2333 specs matched.</span>
                          <p className="text-[7.5px] text-slate-400 leading-snug">Fully functional mock environment simulating phone calls, text replies, high-fidelity browser and downloadable apps.</p>
                        </div>
                      </div>

                      {/* Bottom Unlock Button & Swipe hint */}
                      <div className="space-y-3 mb-6 flex flex-col items-center">
                        <button
                          onClick={() => setIsLocked(false)}
                          className="w-11 h-11 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 border border-white/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg animate-bounce"
                          title="Click to Unlock"
                        >
                          <Unlock className="w-4 h-4 text-white" />
                        </button>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-teal-300 font-mono">
                          Click to Unlock
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* 2. DYNAMIC APPLICATION SCREEN & LAUNCHER SYSTEM */
                    <div className="flex-1 flex flex-col overflow-hidden">
                      
                      {/* IF NO APP ACTIVE: RENDER HOME SCREEN GRID & WIDGETS */}
                      {!activeApp ? (
                        <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto scrollbar-none">
                          
                          {/* Top Home Widget Section */}
                          <div className="space-y-2 mt-4 select-none">
                            {/* ColorOS Clock & Weather Widget */}
                            <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 p-3 rounded-2xl text-white text-left flex justify-between items-center shadow-lg">
                              <div>
                                <span className="text-[14px] font-black font-sans leading-none block">{currentTime}</span>
                                <span className="text-[7.5px] text-slate-350 font-bold block mt-0.5">{currentDateString}</span>
                                <span className="text-[7.5px] text-teal-400 font-bold font-mono block mt-1 uppercase">Oppo Weather Hub</span>
                              </div>
                              <div className="text-right flex items-center gap-2">
                                <CloudSun className="w-7 h-7 text-amber-400 shrink-0" />
                                <div className="text-[9px]">
                                  <span className="font-extrabold block">26°C</span>
                                  <span className="text-slate-350 text-[7.5px] block font-medium">Sydney, AU</span>
                                </div>
                              </div>
                            </div>

                            {/* Google Quick Search Widget */}
                            <div 
                              onClick={() => {
                                setBrowserPage("home");
                                setActiveApp("chrome");
                              }}
                              className="bg-white hover:bg-slate-50 border border-slate-250 py-1.5 px-3.5 rounded-full flex items-center justify-between shadow cursor-pointer transition"
                            >
                              <div className="flex items-center gap-2.5 text-[9px] text-slate-500 font-sans">
                                <span className="text-blue-500 font-black text-xs font-mono">G</span>
                                <span>Search the web...</span>
                              </div>
                              <Search className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          </div>

                          {/* App Icon Grid Layout */}
                          <div className="grid grid-cols-4 gap-x-2 gap-y-4 my-4 flex-1 items-start content-start">
                            {/* Phone App */}
                            <button
                              onClick={() => setActiveApp("phone")}
                              className="flex flex-col items-center gap-1 group cursor-pointer"
                            >
                              {renderAppIcon("phone")}
                              <span className="text-[8px] font-semibold text-white truncate w-full block text-center">Phone</span>
                            </button>

                            {/* Messages App */}
                            <button
                              onClick={() => setActiveApp("messages")}
                              className="flex flex-col items-center gap-1 group cursor-pointer"
                            >
                              {renderAppIcon("messages")}
                              <span className="text-[8px] font-semibold text-white truncate w-full block text-center">Messages</span>
                            </button>

                            {/* Chrome App */}
                            <button
                              onClick={() => {
                                setBrowserPage("home");
                                setActiveApp("chrome");
                              }}
                              className="flex flex-col items-center gap-1 group cursor-pointer"
                            >
                              {renderAppIcon("chrome")}
                              <span className="text-[8px] font-semibold text-white truncate w-full block text-center">Chrome</span>
                            </button>

                            {/* Google Play Store */}
                            <button
                              onClick={() => setActiveApp("playstore")}
                              className="flex flex-col items-center gap-1 group cursor-pointer"
                            >
                              {renderAppIcon("playstore")}
                              <span className="text-[8px] font-semibold text-white truncate w-full block text-center">Play Store</span>
                            </button>

                            {/* Camera */}
                            <button
                              onClick={() => setActiveApp("camera")}
                              className="flex flex-col items-center gap-1 group cursor-pointer"
                            >
                              {renderAppIcon("camera")}
                              <span className="text-[8px] font-semibold text-white truncate w-full block text-center">Camera</span>
                            </button>

                            {/* Photos Gallery */}
                            <button
                              onClick={() => setActiveApp("gallery")}
                              className="flex flex-col items-center gap-1 group cursor-pointer"
                            >
                              {renderAppIcon("gallery")}
                              <span className="text-[8px] font-semibold text-white truncate w-full block text-center">Gallery</span>
                            </button>

                            {/* Settings */}
                            <button
                              onClick={() => setActiveApp("settings")}
                              className="flex flex-col items-center gap-1 group cursor-pointer"
                            >
                              {renderAppIcon("settings")}
                              <span className="text-[8px] font-semibold text-white truncate w-full block text-center">Settings</span>
                            </button>

                            {/* DYNAMIC DOWNLOADED APP RENDERS */}
                            {installedAppIds.map(appId => {
                              const details = PLAY_STORE_APPS.find(a => a.id === appId);
                              if (!details) return null;
                              return (
                                <button
                                  key={appId}
                                  onClick={() => setActiveApp(appId)}
                                  className="flex flex-col items-center gap-1 group cursor-pointer animate-fade-in"
                                >
                                  {renderAppIcon(appId)}
                                  <span className="text-[8px] font-semibold text-white truncate w-full block text-center">{details.name}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Bottom Dock containing Phone, Messages, Chrome, Play Store */}
                          <div className="bg-slate-950/50 backdrop-blur-xl border border-white/5 py-2.5 px-3.5 rounded-[22px] flex justify-between items-center shadow-2xl mt-auto">
                            <button onClick={() => setActiveApp("phone")} className="hover:scale-110 active:scale-95 transition cursor-pointer">{renderAppIcon("phone", "w-9 h-9")}</button>
                            <button onClick={() => setActiveApp("messages")} className="hover:scale-110 active:scale-95 transition cursor-pointer">{renderAppIcon("messages", "w-9 h-9")}</button>
                            <button onClick={() => { setBrowserPage("home"); setActiveApp("chrome"); }} className="hover:scale-110 active:scale-95 transition cursor-pointer">{renderAppIcon("chrome", "w-9 h-9")}</button>
                            <button onClick={() => setActiveApp("playstore")} className="hover:scale-110 active:scale-95 transition cursor-pointer">{renderAppIcon("playstore", "w-9 h-9")}</button>
                          </div>
                        </div>
                      ) : (
                        /* ACTIVE APPLICATION INNER WINDOW CONTAINER */
                        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 relative">
                          
                          {/* 1. DIALER / PHONE APP */}
                          {activeApp === "phone" && (
                            <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 p-4">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                                <h3 className="text-xs font-black text-teal-400">Phone App</h3>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => setPhoneTab("dialer")}
                                    className={`px-2 py-0.5 rounded text-[8px] font-bold ${phoneTab === "dialer" ? "bg-teal-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}
                                  >
                                    Dialpad
                                  </button>
                                  <button 
                                    onClick={() => setPhoneTab("contacts")}
                                    className={`px-2 py-0.5 rounded text-[8px] font-bold ${phoneTab === "contacts" ? "bg-teal-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}
                                  >
                                    Contacts
                                  </button>
                                </div>
                              </div>

                              {phoneCallError && (
                                <div className="p-2 bg-rose-950/85 border border-rose-500/20 rounded-lg text-rose-300 text-[8px] leading-normal text-center select-none mb-2 relative flex justify-between items-center">
                                  <span className="flex-1 text-left pr-2">{phoneCallError}</span>
                                  <button 
                                    onClick={() => setPhoneCallError(null)}
                                    className="text-rose-400 hover:text-white font-bold text-xs px-1"
                                    title="Dismiss"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}

                              {callSession.status === "connected" ? (
                                /* Active Call Screen */
                                <div className="flex-1 flex flex-col justify-between py-6 text-center">
                                  <div className="space-y-2 mt-4">
                                    <div className="w-14 h-14 rounded-full bg-teal-500/10 border border-teal-500/20 text-3xl flex items-center justify-center mx-auto animate-pulse">
                                      👤
                                    </div>
                                    <h4 className="text-xs font-black">{callSession.contactName || "Unknown Call"}</h4>
                                    <p className="text-[8.5px] font-mono text-slate-450">{callSession.phoneNumber}</p>
                                    <span className="text-[10px] text-emerald-400 font-mono font-extrabold block tracking-wider mt-2 animate-pulse">
                                      Connected {Math.floor(callSession.duration / 60)}:{(callSession.duration % 60).toString().padStart(2, "0")}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => setCallSession({ phoneNumber: "", status: "idle", duration: 0, isIncoming: false })}
                                    className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center mx-auto shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
                                    title="End Call"
                                  >
                                    <PhoneIcon className="w-5 h-5 transform rotate-[135deg]" />
                                  </button>
                                </div>
                              ) : phoneTab === "dialer" ? (
                                /* Dialpad view */
                                <div className="flex-1 flex flex-col justify-between">
                                  {/* Dial Input Display */}
                                  <div className="text-center py-2 min-h-12 flex flex-col justify-center border-b border-slate-850">
                                    <span className="text-lg font-black font-mono tracking-widest text-white">{dialInput || "Enter number"}</span>
                                    {dialInput && (
                                      <button 
                                        onClick={() => {
                                          setNewContactPhone(dialInput);
                                          setPhoneTab("contacts");
                                        }}
                                        className="text-[8px] text-teal-400 font-bold hover:underline mt-1"
                                      >
                                        + Add Contact
                                      </button>
                                    )}
                                  </div>

                                  {/* Grid of keys */}
                                  <div className="grid grid-cols-3 gap-2.5 my-3">
                                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(k => (
                                      <button
                                        key={k}
                                        onClick={() => setDialInput(prev => prev + k)}
                                        className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-teal-500 active:text-slate-950 font-bold text-[11px] font-mono transition-colors text-white cursor-pointer"
                                      >
                                        {k}
                                      </button>
                                    ))}
                                  </div>

                                  {/* Call and Delete row */}
                                  <div className="flex justify-between items-center gap-3">
                                    <button
                                      onClick={() => setDialInput("")}
                                      className="text-[8.5px] font-bold font-sans text-slate-400 hover:text-white"
                                    >
                                      Clear
                                    </button>
                                    <button
                                      onClick={() => dialInput && startOutgoingCall(dialInput)}
                                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-extrabold text-[10px] text-white flex items-center justify-center gap-1 cursor-pointer transition shadow-md shadow-emerald-500/10"
                                    >
                                      <PhoneIcon className="w-3.5 h-3.5" /> Call CPH2333
                                    </button>
                                    <button
                                      onClick={() => setDialInput(prev => prev.slice(0, -1))}
                                      className="text-[8.5px] font-bold font-sans text-rose-400 hover:text-white"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* Contacts view */
                                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                                  <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none pr-1">
                                    {contacts.map(c => (
                                      <div 
                                        key={c.id}
                                        onClick={() => startOutgoingCall(c.phoneNumber)}
                                        className="flex items-center justify-between p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800/60 cursor-pointer select-none transition-colors"
                                      >
                                        <div className="flex items-center gap-2">
                                          <div className={`w-6 h-6 rounded-lg ${c.avatarColor} text-white font-black text-[9px] flex items-center justify-center`}>
                                            {c.name[0]}
                                          </div>
                                          <div className="text-left">
                                            <span className="text-[10px] font-bold block">{c.name}</span>
                                            <span className="text-[8px] text-slate-400 block font-mono">{c.phoneNumber}</span>
                                          </div>
                                        </div>
                                        <PhoneIcon className="w-3 h-3 text-emerald-400" />
                                      </div>
                                    ))}
                                  </div>

                                  {/* Add contact mini-form */}
                                  <div className="border-t border-slate-800 pt-2 space-y-1.5 mt-2 bg-slate-900">
                                    <span className="text-[8.5px] font-bold text-slate-400 block">Add New Contact</span>
                                    <div className="flex gap-1.5">
                                      <input 
                                        type="text" 
                                        placeholder="Name" 
                                        value={newContactName}
                                        onChange={(e) => setNewContactName(e.target.value)}
                                        className="flex-1 bg-slate-850 border border-slate-800 rounded px-1.5 py-0.5 text-[8.5px] text-white focus:outline-none focus:border-teal-500"
                                      />
                                      <input 
                                        type="text" 
                                        placeholder="Phone" 
                                        value={newContactPhone}
                                        onChange={(e) => setNewContactPhone(e.target.value)}
                                        className="flex-1 bg-slate-850 border border-slate-800 rounded px-1.5 py-0.5 text-[8.5px] text-white focus:outline-none focus:border-teal-500 font-mono"
                                      />
                                      <button
                                        onClick={() => {
                                          if (!newContactName || !newContactPhone) return;
                                          const colors = ["bg-blue-500", "bg-purple-500", "bg-rose-500", "bg-amber-500", "bg-indigo-500"];
                                          const item: SavedContact = {
                                            id: `c-${Date.now()}`,
                                            name: newContactName,
                                            phoneNumber: newContactPhone,
                                            avatarColor: colors[Math.floor(Math.random() * colors.length)]
                                          };
                                          setContacts(prev => [...prev, item]);
                                          setNewContactName("");
                                          setNewContactPhone("");
                                        }}
                                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-2.5 py-0.5 rounded text-[8.5px] cursor-pointer"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 2. MESSAGES APP */}
                          {activeApp === "messages" && (
                            <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 p-3 overflow-hidden">
                              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2 shrink-0">
                                <span className="text-xs font-black text-teal-400">ColorOS Messages</span>
                                <div className="ml-auto flex gap-1 bg-slate-950 p-0.5 rounded-lg text-[7.5px] font-bold text-slate-400 select-none">
                                  {Array.from(new Set(smsThreads.map(s => s.sender))).filter(s => s !== "Me").map(sender => (
                                    <button
                                      key={sender}
                                      onClick={() => setActiveChatContact(sender)}
                                      className={`px-1.5 py-0.5 rounded ${activeChatContact === sender ? "bg-teal-500 text-slate-950" : "hover:text-white"}`}
                                    >
                                      {sender}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Chat Log Window */}
                              <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 scrollbar-none my-1 flex flex-col justify-end">
                                <div className="space-y-2.5 overflow-y-auto max-h-[220px] scrollbar-none">
                                  {smsThreads
                                    .filter(s => s.sender === activeChatContact || (s.sender === "Me" && s.text.trim()))
                                    .map((sms, index) => {
                                      const isMe = sms.sender === "Me";
                                      return (
                                        <div 
                                          key={sms.id || index}
                                          className={`flex flex-col max-w-[85%] ${isMe ? "ml-auto text-right items-end" : "mr-auto text-left items-start"}`}
                                        >
                                          <div className={`p-2 rounded-2xl text-[9px] leading-relaxed shadow-sm ${
                                            isMe 
                                              ? "bg-teal-600 text-white rounded-tr-none" 
                                              : "bg-slate-800 text-slate-100 rounded-tl-none border border-slate-750"
                                          }`}>
                                            {sms.text}
                                          </div>
                                          <span className="text-[7px] text-slate-500 font-mono mt-0.5 block px-1">{sms.timestamp}</span>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>

                              {/* Input panel */}
                              <div className="border-t border-slate-800 pt-2 flex gap-1.5 shrink-0">
                                <input
                                  type="text"
                                  placeholder={`Text ${activeChatContact}...`}
                                  value={typedSms}
                                  onChange={(e) => setTypedSms(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && handleSendSms()}
                                  className="flex-1 bg-slate-850 border border-slate-800 rounded-xl px-2.5 py-1 text-[9px] text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                                />
                                <button
                                  onClick={handleSendSms}
                                  className="bg-teal-500 hover:bg-teal-400 text-slate-950 p-1.5 rounded-xl transition active:scale-95 cursor-pointer shrink-0"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 3. CHROME BROWSER APP */}
                          {activeApp === "chrome" && (
                            <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 p-2 overflow-hidden">
                              {/* Top Browser bar */}
                              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-2 shrink-0">
                                <button 
                                  onClick={() => { setBrowserPage("home"); setBrowserUrl("google.com"); }}
                                  className="p-1 hover:bg-slate-800 text-slate-400 rounded-md"
                                  title="Home"
                                >
                                  <Globe className="w-3.5 h-3.5" />
                                </button>
                                <form 
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    const cleaned = browserUrl.trim().toLowerCase();
                                    if (cleaned.includes("wikipedia")) {
                                      setBrowserPage("wikipedia");
                                    } else if (cleaned.includes("oppo")) {
                                      setBrowserPage("oppo_specs");
                                    } else {
                                      setBrowserPage("custom");
                                    }
                                  }}
                                  className="flex-1"
                                >
                                  <input 
                                    type="text" 
                                    value={browserUrl}
                                    onChange={(e) => setBrowserUrl(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[8px] text-slate-300 font-mono focus:outline-none"
                                  />
                                </form>
                                <button 
                                  type="button"
                                  onClick={() => { setBrowserUrl("google.com"); setBrowserPage("home"); }}
                                  className="p-1 text-slate-400 hover:text-white"
                                >
                                  <RefreshCw className="w-3 h-3 animate-pulse" />
                                </button>
                              </div>

                              {/* Browser Body Rendering */}
                              <div className="flex-1 bg-white text-slate-900 rounded-lg p-3 overflow-y-auto text-left font-sans text-[9px] leading-relaxed scrollbar-none select-text">
                                
                                {/* A. GOOGLE HOME */}
                                {browserPage === "home" && (
                                  <div className="flex flex-col items-center py-4 space-y-3">
                                    <div className="text-xl font-black font-mono tracking-tight text-slate-800">
                                      <span className="text-blue-600">G</span>
                                      <span className="text-red-500">o</span>
                                      <span className="text-yellow-500">o</span>
                                      <span className="text-blue-500">g</span>
                                      <span className="text-green-500">l</span>
                                      <span className="text-red-500">e</span>
                                    </div>
                                    <form 
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        if (browserSearchInput.trim()) {
                                          setBrowserUrl(`google.com/search?q=${encodeURIComponent(browserSearchInput)}`);
                                          setBrowserPage("results");
                                        }
                                      }}
                                      className="w-full relative"
                                    >
                                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                      <input 
                                        type="text" 
                                        placeholder="Search or enter web URL"
                                        value={browserSearchInput}
                                        onChange={(e) => setBrowserSearchInput(e.target.value)}
                                        className="w-full bg-slate-100 border border-slate-200 rounded-full pl-8 pr-3 py-1 text-[8.5px] focus:outline-none focus:bg-white"
                                      />
                                    </form>
                                    <div className="flex gap-2">
                                      <button 
                                        type="button"
                                        onClick={() => { setBrowserUrl("wikipedia.org/wiki/OPPO_A6"); setBrowserPage("wikipedia"); }}
                                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 font-bold"
                                      >
                                        OPPO A6 specs
                                      </button>
                                      <button 
                                        type="button"
                                        onClick={() => { setBrowserUrl("oppo.com/au/smartphones/a96"); setBrowserPage("oppo_specs"); }}
                                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-slate-600 font-bold"
                                      >
                                        ColorOS Official
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* B. GOOGLE RESULTS */}
                                {browserPage === "results" && (
                                  <div className="space-y-3">
                                    <div className="border-b border-slate-150 pb-2">
                                      <span className="text-[7.5px] text-slate-400 font-mono">About 245,000 results</span>
                                      <h2 className="text-[10px] font-extrabold text-slate-900 mt-0.5">Results for "{browserSearchInput}"</h2>
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className="text-[7.5px] text-emerald-700 font-mono block">https://www.oppo.com › devices › a6</span>
                                      <button 
                                        type="button"
                                        onClick={() => { setBrowserUrl("oppo.com"); setBrowserPage("oppo_specs"); }}
                                        className="text-[9.5px] font-bold text-blue-800 hover:underline text-left block"
                                      >
                                        OPPO A6 (CPH2333) - Specs, SUPERVOOC, ColorOS Features
                                      </button>
                                      <p className="text-[8px] text-slate-500 leading-normal">
                                        Explore official specs of OPPO A6 2026. Snapdragon Octa-core chip, 5000 mAh mega battery, 33W fast charge, 50MP cameras.
                                      </p>
                                    </div>
                                    <div className="space-y-0.5">
                                      <span className="text-[7.5px] text-emerald-700 font-mono block">https://en.wikipedia.org › wiki › OPPO_A6</span>
                                      <button 
                                        type="button"
                                        onClick={() => { setBrowserUrl("wikipedia.org"); setBrowserPage("wikipedia"); }}
                                        className="text-[9.5px] font-bold text-blue-800 hover:underline text-left block"
                                      >
                                        OPPO A6 Series - Wikipedia entry for midrange smartphones
                                      </button>
                                      <p className="text-[8px] text-slate-500 leading-normal">
                                        OPPO A6 is a series of ColorOS based dual-SIM smartphones produced by OPPO. Built with dynamic 90Hz sunlight displays...
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* C. WIKIPEDIA */}
                                {browserPage === "wikipedia" && (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
                                      <span className="text-xs font-bold font-serif">W</span>
                                      <span className="text-[7px] tracking-widest text-slate-500 uppercase font-mono">Wikipedia</span>
                                    </div>
                                    <h1 className="text-[11px] font-serif font-black text-slate-900 border-b border-slate-100 pb-0.5">OPPO A6 (2026)</h1>
                                    <p className="text-[8px]">
                                      The <b>OPPO A6</b> (model code CPH2333) is an Android-based smartphone designed and manufactured by OPPO. It runs the custom ColorOS user interface. Announced as a reliable mid-range smartphone, it features a 5000 mAh high-capacity battery, Snapdragon processor, and 33W reverse fast charging.
                                    </p>
                                    <h3 className="text-[9px] font-bold text-slate-800 font-serif border-b mt-2">Hardware Specifics</h3>
                                    <ul className="list-disc pl-4 space-y-0.5 text-[7.5px] text-slate-650 font-mono">
                                      <li>System-on-Chip: Qualcomm Snapdragon 6nm</li>
                                      <li>Battery: 5000mAh Lithium-Polymer</li>
                                      <li>Camera: Dual 50MP Rear lens with AI support</li>
                                      <li>Operating System: ColorOS on Android 14</li>
                                    </ul>
                                  </div>
                                )}

                                {/* D. OPPO OFFICIAL SPEC SHEET */}
                                {browserPage === "oppo_specs" && (
                                  <div className="space-y-3 text-slate-800">
                                    <div className="bg-slate-950 -mx-3 -mt-3 p-2 text-white flex justify-between items-center text-[9px]">
                                      <span className="font-black tracking-widest text-teal-400 font-mono">OPPO OFFICIAL</span>
                                      <span className="text-[7.5px] bg-teal-500 text-slate-950 px-1.5 py-0.5 rounded-full font-bold">CPH2333 Verified</span>
                                    </div>
                                    <div className="text-center bg-teal-500/10 p-3 rounded-xl border border-teal-500/20 space-y-1 mt-2">
                                      <h1 className="text-xs font-black text-slate-900">OPPO A6 5G</h1>
                                      <p className="text-[7.5px] text-slate-500">Premium design, 33W SUPERVOOC charging, and 50MP ultra lenses.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-[7.5px] font-mono mt-2">
                                      <div className="p-2 bg-slate-50 border rounded">
                                        <span className="font-extrabold text-slate-800 block">Performance</span>
                                        <span className="text-slate-500 text-[7px]">Qualcomm Octa-core + 8GB RAM</span>
                                      </div>
                                      <div className="p-2 bg-slate-50 border rounded">
                                        <span className="font-extrabold text-slate-800 block">Battery</span>
                                        <span className="text-slate-500 text-[7px]">5000mAh + SUPERVOOC</span>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* E. CUSTOM LOADED PAGE */}
                                {browserPage === "custom" && (
                                  <div className="space-y-2 py-3">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[8px] font-bold">
                                      🔒 Connection Secure
                                    </div>
                                    <h1 className="text-[10px] font-extrabold truncate mt-1">Portal: {browserUrl}</h1>
                                    <p className="text-[8px] text-slate-500">
                                      This dynamic portal has been rendered securely within the sandbox. Full internet connectivity simulated on Oppo CPH2333 base band loops.
                                    </p>
                                    <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[7px] font-mono text-slate-400">
                                      HTTP 200 OK • SSL TLS 1.3 encrypted<br />
                                      Client Agent: Oppo A6 (Android 14) ColorOS
                                    </div>
                                  </div>
                                )}

                              </div>
                            </div>
                          )}

                          {/* 4. GOOGLE PLAY STORE APP */}
                          {activeApp === "playstore" && (
                            <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 p-3 overflow-hidden text-left">
                              {selectedPlayApp ? (
                                /* App details screen */
                                <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-0.5 scrollbar-none animate-fade-in">
                                  <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2">
                                    <button 
                                      onClick={() => setSelectedPlayApp(null)}
                                      className="p-1 hover:bg-slate-900 rounded text-slate-400 hover:text-white transition cursor-pointer"
                                    >
                                      <ArrowLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-[9px] font-bold text-slate-400">Google Play</span>
                                  </div>

                                  <div className="flex gap-2.5">
                                    <div className="w-12 h-12 shrink-0">
                                      {renderAppIcon(selectedPlayApp.id, "w-12 h-12")}
                                    </div>
                                    <div className="min-w-0">
                                      <h3 className="text-[11px] font-black leading-tight text-white">{selectedPlayApp.name}</h3>
                                      <span className="text-[7px] text-teal-400 font-mono block mt-0.5">{selectedPlayApp.packageName}</span>
                                      <div className="flex items-center gap-1.5 text-[7px] text-slate-400 font-mono mt-1">
                                        <span className="text-amber-400 flex items-center"><Star className="w-2 h-2 fill-amber-400 inline mr-0.5" /> {selectedPlayApp.stars}</span>
                                        <span>•</span>
                                        <span>{selectedPlayApp.size}</span>
                                        <span>•</span>
                                        <span>{selectedPlayApp.downloads}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Install Action Row */}
                                  <div>
                                    {installProgress[selectedPlayApp.id] !== undefined ? (
                                      <div className="w-full bg-teal-600/10 border border-teal-500/20 py-1 rounded-lg text-[9px] font-bold text-teal-400 text-center animate-pulse">
                                        Downloading ({installProgress[selectedPlayApp.id]}%)...
                                      </div>
                                    ) : installedAppIds.includes(selectedPlayApp.id) ? (
                                      <div className="flex gap-1.5">
                                        <button
                                          onClick={() => {
                                            setInstalledAppIds(prev => prev.filter(id => id !== selectedPlayApp.id));
                                          }}
                                          className="flex-1 bg-rose-950/40 border border-rose-500/20 text-rose-300 font-bold py-1 rounded text-[8.5px] cursor-pointer"
                                        >
                                          Uninstall App
                                        </button>
                                        <button
                                          onClick={() => setActiveApp(selectedPlayApp.id)}
                                          className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold py-1 rounded text-[8.5px] cursor-pointer"
                                        >
                                          Open App
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => handleInstallApp(selectedPlayApp)}
                                        className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold py-1.5 rounded-lg text-[9px] flex items-center justify-center gap-1 cursor-pointer transition shadow-md shadow-teal-500/10"
                                      >
                                        <DownloadCloud className="w-3.5 h-3.5" /> Install Application
                                      </button>
                                    )}
                                  </div>

                                  <div className="p-2 bg-slate-900 rounded-xl space-y-1 border border-slate-900">
                                    <span className="text-[8px] font-bold text-slate-350 block">About App</span>
                                    <p className="text-[7.5px] text-slate-400 leading-normal">
                                      {selectedPlayApp.description}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                /* Main Play Store search/grid */
                                <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
                                  {/* Play Store Search Bar */}
                                  <div className="relative shrink-0">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                    <input 
                                      type="text" 
                                      placeholder="Search play apps & games"
                                      value={playStoreSearch}
                                      onChange={(e) => setPlayStoreSearch(e.target.value)}
                                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1 text-[8.5px] text-slate-200 placeholder-slate-500 focus:outline-none"
                                    />
                                  </div>

                                  <div className="flex gap-1.5 text-[7.5px] font-bold select-none shrink-0">
                                    <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">For Oppo A6</span>
                                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400">Top Rated</span>
                                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 font-normal">My Account: {googleUser ? googleUser.name : "Guest"}</span>
                                  </div>

                                  {/* List of play apps */}
                                  <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none pr-0.5">
                                    {playStoreAppsToRender.map(app => {
                                      const isInstalled = installedAppIds.includes(app.id);
                                      return (
                                        <div 
                                          key={app.id}
                                          onClick={() => setSelectedPlayApp(app)}
                                          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 cursor-pointer transition select-none"
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                                              {renderAppIcon(app.id, "w-8 h-8")}
                                            </div>
                                            <div className="min-w-0">
                                              <span className="text-[9.5px] font-bold block truncate text-slate-100">{app.name}</span>
                                              <span className="text-[7px] text-slate-400 block truncate font-mono">{app.packageName}</span>
                                            </div>
                                          </div>
                                          <span className={`text-[7.5px] font-bold font-mono px-1.5 py-0.5 rounded ${
                                            isInstalled ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "bg-slate-800 text-slate-350"
                                          }`}>
                                            {isInstalled ? "Open" : "GET"}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 5. OPPO CAMERA APP */}
                          {activeApp === "camera" && (
                            <div className="flex-1 flex flex-col bg-black text-white p-3 justify-between overflow-hidden relative">
                              {/* Viewfinder simulation */}
                              <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-850 overflow-hidden relative flex flex-col justify-end items-center p-3">
                                
                                {/* Flash effect Overlay */}
                                {showCameraFlash && <div className="absolute inset-0 bg-white z-50 animate-flash" />}

                                {/* Viewfinder Scene Mock */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-slate-900 via-teal-950 to-indigo-950">
                                  <div className="text-center space-y-1">
                                    <Camera className="w-8 h-8 text-teal-400 animate-pulse mx-auto opacity-40" />
                                    <span className="text-[8.5px] text-slate-400 font-mono block">Oppo AI Viewfinder Active</span>
                                    <span className="text-[7px] text-slate-500 font-mono block">Filter: {cameraFilter} • Zoom: {cameraZoom}</span>
                                  </div>
                                </div>

                                {/* Active HUD on top of viewfinder */}
                                <div className="z-10 flex gap-2 mb-2">
                                  {["Standard", "Vivid", "Noir", "Warm"].map(f => (
                                    <button 
                                      key={f}
                                      onClick={() => setCameraFilter(f)}
                                      className={`px-1.5 py-0.5 rounded text-[7px] font-bold font-mono border transition ${cameraFilter === f ? "bg-teal-500 border-teal-500 text-slate-950" : "bg-slate-950/60 border-slate-800 text-slate-300"}`}
                                    >
                                      {f}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Controls row */}
                              <div className="space-y-3 pt-3">
                                <div className="flex justify-center gap-3 text-[8.5px] text-slate-400 font-mono">
                                  {["0.6x", "1x", "2x", "5x"].map(z => (
                                    <button 
                                      key={z} 
                                      onClick={() => setCameraZoom(z)}
                                      className={`px-1 rounded ${cameraZoom === z ? "text-teal-400 font-bold" : ""}`}
                                    >
                                      {z}
                                    </button>
                                  ))}
                                </div>

                                <div className="flex justify-around items-center">
                                  {/* Last captured photo circle thumbnail */}
                                  <button 
                                    onClick={() => setActiveApp("gallery")}
                                    className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center"
                                  >
                                    {capturedPhotos.length > 0 ? (
                                      <img src={capturedPhotos[0]} className="w-full h-full object-cover" alt="Captured" referrerPolicy="no-referrer" />
                                    ) : (
                                      <Image className="w-4 h-4 text-slate-400" />
                                    )}
                                  </button>

                                  {/* Shutter Button */}
                                  <button 
                                    onClick={handleSnapPhoto}
                                    className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                  >
                                    <div className="w-9 h-9 bg-teal-500 hover:bg-teal-400 rounded-full" />
                                  </button>

                                  {/* Switch mode icon */}
                                  <button 
                                    onClick={() => {
                                      setCameraFilter(prev => prev === "Front Camera" ? "Standard" : "Front Camera");
                                    }}
                                    className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-white flex items-center justify-center shrink-0 active:scale-95 transition"
                                  >
                                    🔄
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 6. PHOTOS GALLERY */}
                          {activeApp === "gallery" && (
                            <div className="flex-1 flex flex-col bg-slate-900 text-white p-3 overflow-hidden text-left">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                                <h3 className="text-xs font-black text-teal-400">Oppo Album View</h3>
                                <span className="text-[7.5px] text-slate-400 font-mono">{capturedPhotos.length} Photos taken</span>
                              </div>

                              {/* Grid layout */}
                              <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 scrollbar-none pr-0.5">
                                {capturedPhotos.map((url, i) => (
                                  <div key={i} className="aspect-square bg-slate-950 rounded-xl overflow-hidden border border-slate-800/50 group relative">
                                    <img src={url} className="w-full h-full object-cover" alt="Captured snap" referrerPolicy="no-referrer" />
                                    <button 
                                      onClick={() => {
                                        setCapturedPhotos(prev => prev.filter((_, idx) => idx !== i));
                                      }}
                                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 rounded-md text-white transition cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                {capturedPhotos.length === 0 && (
                                  <div className="col-span-2 text-center py-12 text-slate-500 text-[9px] font-mono">
                                    No photos taken yet. Launch the Oppo Camera App to snap some!
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* 7. COLOROS SETTINGS APP */}
                          {activeApp === "settings" && (
                            <div className="flex-1 flex flex-col bg-slate-900 text-white p-3 overflow-hidden text-left">
                              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-3 shrink-0">
                                <span className="text-xs font-black text-teal-400">ColorOS Settings</span>
                              </div>

                              <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5 scrollbar-none text-[9.5px]">
                                {/* Wallpaper Section */}
                                <div className="space-y-1.5">
                                  <span className="text-[8.5px] font-bold text-slate-400 block font-mono">PERSONALIZATION</span>
                                  <div className="grid grid-cols-2 gap-1.5">
                                    {WALLPAPERS.map((wp, idx) => (
                                      <button
                                        key={idx}
                                        onClick={() => {
                                          setWallpaperIndex(idx);
                                        }}
                                        className={`p-1.5 rounded-lg text-left truncate transition ${wallpaperIndex === idx ? "bg-teal-500 text-slate-950 font-bold" : "bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-200"}`}
                                      >
                                        <div className={`h-2.5 w-full rounded ${wp.css} mb-1`} />
                                        <span className="text-[7.5px] block truncate">{wp.name}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Google Account Sync Section */}
                                <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                                  <span className="text-[8px] font-bold text-teal-400 block font-mono">👤 GOOGLE ACCOUNT SETUP</span>
                                  {googleUser ? (
                                    <div className="space-y-1">
                                      <div className="flex items-center justify-between">
                                        <span className="font-extrabold text-white block truncate text-[9.5px]">{googleUser.name}</span>
                                        <button 
                                          onClick={() => setGoogleUser(null)}
                                          className="text-[7px] text-rose-400 hover:underline"
                                        >
                                          Sign Out
                                        </button>
                                      </div>
                                      <span className="text-[7.5px] font-mono text-slate-400 block truncate leading-none mb-1">{googleUser.email}</span>
                                      <div className="flex items-center gap-1 text-[7px] text-emerald-400 font-mono">
                                        <Check className="w-2.5 h-2.5" /> Synchronized with Play Store & Gmail
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      <p className="text-[7.5px] text-slate-400 leading-normal">
                                        Sign in to your Google account to authorize Play Store installs and personalize your virtual phone sync profile.
                                      </p>
                                      <div className="space-y-1">
                                        <input 
                                          type="text" 
                                          placeholder="Alex Mercer"
                                          value={loginName}
                                          onChange={(e) => setLoginName(e.target.value)}
                                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[8px]" 
                                        />
                                        <input 
                                          type="email" 
                                          placeholder="alex@gmail.com"
                                          value={loginEmail}
                                          onChange={(e) => setLoginEmail(e.target.value)}
                                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[8px]" 
                                        />
                                      </div>
                                      <button 
                                        onClick={() => {
                                          if (loginName.trim() && loginEmail.trim()) {
                                            setGoogleUser({ name: loginName, email: loginEmail });
                                          }
                                        }}
                                        className="w-full py-0.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded text-[8px] cursor-pointer"
                                      >
                                        Log In & Sync
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* eSIM Management Section */}
                                <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                                  <EsimSettings 
                                    esimProfiles={esimProfiles}
                                    onAddEsim={handleAddEsim}
                                    onToggleActive={handleToggleEsimActive}
                                    onDeleteEsim={handleDeleteEsim}
                                  />
                                </div>

                                {/* Hardware Info Section */}
                                <div className="space-y-1.5">
                                  <span className="text-[8.5px] font-bold text-slate-400 block font-mono">ABOUT DEVICE</span>
                                  <div className="bg-slate-850 border border-slate-800 p-2.5 rounded-xl space-y-1.5 text-[8px] font-mono text-slate-300">
                                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                                      <span className="text-slate-500">Device Model:</span>
                                      <span className="font-bold text-white">{OPPO_A6_SPECS.model}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                                      <span className="text-slate-500">OS Version:</span>
                                      <span className="font-bold text-white">{OPPO_A6_SPECS.colorOS}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                                      <span className="text-slate-500">Processor:</span>
                                      <span className="font-bold text-white text-right max-w-[60%] truncate">{OPPO_A6_SPECS.cpu}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-800/80 pb-1">
                                      <span className="text-slate-500">RAM:</span>
                                      <span className="font-bold text-white">{OPPO_A6_SPECS.ram}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-slate-500">Battery Status:</span>
                                      <span className="font-bold text-teal-400">{OPPO_A6_SPECS.battery}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* --- PLAY STORE DOWNLOADABLE APPS (MOCKS) --- */}
                          {/* A. YOUTUBE APP */}
                          {activeApp === "yt" && (
                            <div className="flex-1 flex flex-col bg-zinc-950 text-slate-100 p-3 overflow-hidden text-left">
                              <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-2 mb-2 shrink-0">
                                <span className="text-xs font-black tracking-tight text-white flex items-center gap-1">
                                  <span className="text-red-600 font-serif">🔴</span> YouTube
                                </span>
                              </div>
                              <div className="flex-1 overflow-y-auto space-y-3.5 scrollbar-none text-[9.5px]">
                                {/* Simulated playing video */}
                                <div className="aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
                                  <Play className="w-10 h-10 text-white opacity-80 animate-pulse cursor-pointer" />
                                  <span className="absolute bottom-2 left-2 text-[7px] bg-black/60 px-1.5 py-0.5 rounded font-mono">OPPO A6 Product Launch • 2:45</span>
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-[10px] font-extrabold leading-tight text-slate-100">Official Oppo A6 Hands-On Specs Review & ColorOS Fluid Tests</h4>
                                  <span className="text-[7.5px] text-slate-400">12K Views • 3 days ago</span>
                                </div>
                                <div className="p-2 bg-zinc-900 rounded-xl space-y-1 border border-zinc-850">
                                  <span className="text-[8px] font-bold text-red-500 block">Comments (2)</span>
                                  <p className="text-[7.5px] text-slate-350 italic">"The screen looks amazing! SUPERVOOC fast charge is crazy good." - TechGeek</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* B. WHATSAPP APP */}
                          {activeApp === "wa" && (
                            <div className="flex-1 flex flex-col bg-slate-900 text-white p-3 overflow-hidden text-left">
                              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2 shrink-0">
                                <h3 className="text-xs font-extrabold text-teal-400">WhatsApp Chat</h3>
                              </div>
                              <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 scrollbar-none">
                                <div className="p-2.5 bg-teal-950/30 border border-teal-500/10 rounded-2xl">
                                  <span className="text-[8.5px] font-bold text-teal-400 block">Sarah (Office)</span>
                                  <p className="text-[8px] text-slate-300 mt-1">Hello! Did you inspect the new UI layout drafts yet?</p>
                                  <span className="text-[6.5px] text-slate-400 block text-right">Yesterday • Sent</span>
                                </div>
                                <div className="p-2.5 bg-slate-850 border border-slate-800 rounded-2xl">
                                  <span className="text-[8.5px] font-bold text-purple-400 block">Dave (Best Friend)</span>
                                  <p className="text-[8px] text-slate-300 mt-1">Hey, are we still playing soccer tonight?</p>
                                  <span className="text-[6.5px] text-slate-400 block text-right">10:14 AM • Received</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* C. INSTAGRAM APP */}
                          {activeApp === "ig" && (
                            <div className="flex-1 flex flex-col bg-black text-white p-3 overflow-hidden text-left">
                              <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5 mb-2 shrink-0">
                                <h3 className="text-xs font-serif font-bold tracking-tight">Instagram</h3>
                              </div>
                              <div className="flex-1 overflow-y-auto space-y-3.5 scrollbar-none">
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 bg-gradient-to-tr from-yellow-400 to-rose-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white">O</div>
                                    <span className="text-[8px] font-bold text-slate-200">oppo_official</span>
                                  </div>
                                  <div className="aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-zinc-850 relative">
                                    <img src="https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?w=400&auto=format&fit=crop&q=60" className="w-full h-full object-cover" alt="Oppo" referrerPolicy="no-referrer" />
                                  </div>
                                  <div className="flex gap-2 text-slate-300 text-[8.5px] px-1">
                                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500 cursor-pointer" />
                                    <span>2,109 Likes</span>
                                  </div>
                                  <p className="text-[7.5px] text-slate-400 px-1 leading-normal">
                                    <b>oppo_official</b> Introducing the stunning 2026 Oppo A6 series with Glowing Silk textures. True craft in your hands.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* D. SPOTIFY APP */}
                          {activeApp === "sp" && (
                            <div className="flex-1 flex flex-col bg-zinc-900 text-white p-4 justify-between text-left select-none animate-fade-in">
                              <div className="border-b border-zinc-800 pb-2">
                                <h3 className="text-xs font-black text-green-500">Spotify Music</h3>
                              </div>

                              <div className="space-y-3 my-auto">
                                <div className="w-24 h-24 bg-gradient-to-tr from-green-500/20 to-teal-500/20 border border-green-500/20 rounded-2xl flex items-center justify-center text-4xl mx-auto shadow-xl">
                                  🎵
                                </div>
                                <div className="text-center space-y-0.5">
                                  <h4 className="text-xs font-black text-slate-100">{spotifyTrack.title}</h4>
                                  <p className="text-[8.5px] text-slate-400 font-mono">{spotifyTrack.artist}</p>
                                </div>

                                {/* Custom audio progress bar */}
                                <div className="space-y-1">
                                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full" style={{ width: `${spotifyTrack.progress}%` }} />
                                  </div>
                                  <div className="flex justify-between text-[7px] text-zinc-500 font-mono">
                                    <span>0:45</span>
                                    <span>3:10</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-center items-center gap-5 pt-3">
                                <SkipBack className="w-4 h-4 text-zinc-400 hover:text-white cursor-pointer" />
                                <button
                                  onClick={() => setSpotifyPlaying(!spotifyPlaying)}
                                  className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-400 text-slate-950 flex items-center justify-center cursor-pointer transition shadow"
                                >
                                  {spotifyPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
                                </button>
                                <SkipForward className="w-4 h-4 text-zinc-400 hover:text-white cursor-pointer" />
                              </div>
                            </div>
                          )}

                          {/* E. GMAIL APP */}
                          {activeApp === "gm" && (
                            <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 p-3 overflow-hidden text-left select-none animate-fade-in">
                              {/* Search Bar header */}
                              <div className="bg-slate-800/80 border border-slate-700/50 rounded-xl px-2.5 py-1.5 flex items-center justify-between shadow mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 bg-red-500 rounded-sm" />
                                  <span className="text-[8.5px] text-slate-350">Search in mail</span>
                                </div>
                                <div className="w-5 h-5 rounded-full bg-teal-600/90 text-[8.5px] font-bold flex items-center justify-center text-slate-950">
                                  {googleUser ? googleUser.name[0] : "A"}
                                </div>
                              </div>

                              <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 scrollbar-none">
                                <span className="text-[7.5px] font-bold text-slate-400 block font-mono uppercase tracking-wider">INBOX - PRIMARY</span>

                                <div className="p-2.5 bg-slate-850 border border-slate-800 rounded-xl relative hover:bg-slate-850/80 transition">
                                  <div className="flex justify-between items-start">
                                    <span className="text-[8.5px] font-black text-red-400">Google Account Sync</span>
                                    <span className="text-[6px] text-slate-500 font-mono">11:05 AM</span>
                                  </div>
                                  <span className="text-[8px] font-bold text-slate-200 block mt-0.5">Welcome to your new Oppo A6!</span>
                                  <p className="text-[7px] text-slate-400 line-clamp-1 mt-0.5">Alex, your virtual Google Account was successfully synchronized on device CPH2333.</p>
                                </div>

                                <div className="p-2.5 bg-slate-850 border border-slate-800 rounded-xl relative hover:bg-slate-850/80 transition">
                                  <div className="flex justify-between items-start">
                                    <span className="text-[8.5px] font-black text-teal-400">eSIM Baseband Server</span>
                                    <span className="text-[6px] text-slate-500 font-mono">10:45 AM</span>
                                  </div>
                                  <span className="text-[8px] font-bold text-slate-200 block mt-0.5">Virtual Carrier Activated</span>
                                  <p className="text-[7px] text-slate-400 line-clamp-1 mt-0.5">Your virtual Google Fi profile number +1 (555) 901-2686 is fully online.</p>
                                </div>

                                <div className="p-2.5 bg-slate-850 border border-slate-800 rounded-xl relative hover:bg-slate-850/80 transition">
                                  <div className="flex justify-between items-start">
                                    <span className="text-[8.5px] font-black text-amber-400">Oppo Global Support</span>
                                    <span className="text-[6px] text-slate-500 font-mono">Yesterday</span>
                                  </div>
                                  <span className="text-[8px] font-bold text-slate-200 block mt-0.5">Enjoy ColorOS 14 Fluid UI</span>
                                  <p className="text-[7px] text-slate-400 line-clamp-1 mt-0.5">Thank you for choosing OPPO. View full manuals, specs and features online.</p>
                                </div>
                              </div>

                              {/* Floating action button compose */}
                              <div className="flex justify-end mt-auto pt-2">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500 hover:bg-red-400 text-slate-950 font-bold rounded-full text-[8px] transition cursor-pointer shadow shadow-red-500/20">
                                  <Plus className="w-3 h-3" /> Compose
                                </div>
                              </div>
                            </div>
                          )}

                          {/* F. GOOGLE MAPS APP */}
                          {activeApp === "maps" && (
                            <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden text-left select-none animate-fade-in relative">
                              {/* Overlay Search */}
                              <div className="absolute top-2.5 left-2.5 right-2.5 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between shadow-lg z-10">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-3 h-3 text-teal-400" />
                                  <span className="text-[8px] text-slate-350">Search google maps...</span>
                                </div>
                                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping" />
                              </div>

                              {/* Map Canvas Mimic */}
                              <div className="flex-1 bg-slate-950 flex items-center justify-center relative overflow-hidden">
                                {/* Grid lines background to look technical/cartographic */}
                                <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:14px_24px]" />
                                
                                {/* Simulated roads */}
                                <div className="absolute h-1 w-full bg-slate-800/80 top-1/3 -rotate-12" />
                                <div className="absolute h-1.5 w-full bg-slate-800/80 top-1/2 rotate-6" />
                                <div className="absolute w-1 h-full bg-slate-800/80 left-1/3 rotate-45" />
                                <div className="absolute w-1.5 h-full bg-slate-800/80 left-2/3 -rotate-12" />

                                {/* Simulated river/bay */}
                                <div className="absolute bottom-0 right-0 w-32 h-24 bg-teal-950/40 rounded-tl-[64px] border border-teal-500/10 flex items-center justify-center">
                                  <span className="text-[7px] text-teal-500/60 font-bold uppercase tracking-widest font-sans">Darling Harbour</span>
                                </div>

                                {/* Pins */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5">
                                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full border border-white flex items-center justify-center shadow shadow-blue-500/50">
                                    <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                                  </div>
                                  <span className="text-[6.5px] bg-slate-900/90 text-white font-bold px-1 rounded-sm border border-slate-800">My Location</span>
                                </div>

                                <div className="absolute top-1/3 left-1/4 flex flex-col items-center gap-0.5">
                                  <MapPin className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
                                  <span className="text-[6.5px] bg-slate-900/90 text-white font-bold px-1 rounded-sm border border-slate-800">Oppo Store</span>
                                </div>

                                <div className="absolute top-2/3 right-1/4 flex flex-col items-center gap-0.5">
                                  <MapPin className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                                  <span className="text-[6.5px] bg-slate-900/90 text-white font-bold px-1 rounded-sm border border-slate-800">Dave's House</span>
                                </div>
                              </div>

                              {/* Bottom sheet info */}
                              <div className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-2.5 z-10 shrink-0 space-y-2">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-[10px] font-black text-white block">Sydney, Australia</span>
                                    <span className="text-[7.5px] text-slate-400 block font-mono">GPS Coordinates: -33.8688, 151.2093</span>
                                  </div>
                                  <button className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold flex items-center gap-1 transition">
                                    <Navigation className="w-2.5 h-2.5" /> Directions
                                  </button>
                                </div>

                                <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                                  <span className="bg-slate-800 text-slate-300 text-[7px] font-bold px-2 py-0.5 rounded-full border border-slate-750 shrink-0">🍽️ Restaurants</span>
                                  <span className="bg-slate-800 text-slate-300 text-[7px] font-bold px-2 py-0.5 rounded-full border border-slate-750 shrink-0">⛽ Gas Stations</span>
                                  <span className="bg-slate-800 text-slate-300 text-[7px] font-bold px-2 py-0.5 rounded-full border border-slate-750 shrink-0">☕ Coffee Shops</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* --- END APP WINDOW RENDERING --- */}

                          {/* VIRTUAL HOME NAVIGATION BAR */}
                          <div className="h-10 border-t border-slate-900 bg-slate-950 flex justify-around items-center shrink-0 select-none">
                            {/* Back Icon Button */}
                            <button 
                              onClick={() => {
                                if (selectedPlayApp) setSelectedPlayApp(null);
                                else if (browserPage !== "home") setBrowserPage("home");
                                else setActiveApp(null);
                              }}
                              className="p-1 text-slate-400 hover:text-white active:scale-95 transition cursor-pointer"
                              title="Back Button"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                            
                            {/* Home Icon Button */}
                            <button 
                              onClick={() => {
                                setActiveApp(null);
                                setIsLocked(false);
                                setSelectedPlayApp(null);
                              }}
                              className="w-4.5 h-4.5 rounded-full border-2 border-slate-400 hover:border-white active:scale-90 transition cursor-pointer"
                              title="Home Button"
                            />
                            
                            {/* App Switcher button */}
                            <button 
                              onClick={() => {
                                setIsLocked(true);
                                setActiveApp(null);
                              }}
                              className="w-4 h-4 border border-slate-400 hover:border-white rounded-md active:scale-90 transition cursor-pointer"
                              title="Lock Screen"
                            />
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                  {/* BOTTOM TOUCH BAR DECORATIVE */}
                  <div className="bg-slate-950/40 pb-1.5 pt-0.5 flex justify-center z-40 select-none">
                    <div className="w-20 h-[3.5px] bg-slate-700/80 rounded-full"></div>
                  </div>

                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE: THE COMPANION CONTROL SYSTEM AND USER GUIDE */}
      <div className="w-full md:w-[350px] bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-4 md:p-6 space-y-5 flex flex-col justify-between overflow-y-auto max-h-screen scrollbar-thin">
        
        {/* Companion branding */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-bold border border-teal-500/20 font-mono uppercase tracking-wider">
            ⚡ Oppo CPH2333 Controller
          </div>
          <h2 className="text-base font-black text-slate-100 font-sans tracking-tight">Oppo A6 Companion Panel</h2>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            Directly test real-time simulated phone calls, SMS notifications, internet setups, and charging states on your virtual Oppo A6 ColorOS below.
          </p>
        </div>

        {/* Telephony Sandbox Controller */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-4 shadow-sm text-left">
          <h3 className="text-xs font-bold text-teal-400 flex items-center gap-1.5 font-mono">
            📞 TELEPHONY CARRIER SIMULATOR
          </h3>

          {/* Call simulator triggers */}
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold font-mono">1. Simulate Incoming Phone Call</span>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                placeholder="Caller Name" 
                value={sandboxCallerName}
                onChange={(e) => setSandboxCallerName(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-[9px] text-white px-2 py-1 rounded focus:outline-none focus:border-teal-500 font-sans"
              />
              <input 
                type="text" 
                placeholder="Caller Number" 
                value={sandboxCallerNum}
                onChange={(e) => setSandboxCallerNum(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-[9px] text-white px-2 py-1 rounded focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
            <button
              onClick={triggerIncomingCall}
              disabled={callSession.status !== "idle"}
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-extrabold text-[10px] rounded-lg transition active:scale-[0.98] cursor-pointer text-center"
            >
              Trigger Incoming Call
            </button>
          </div>

          {/* SMS simulator triggers */}
          <div className="space-y-2 border-t border-slate-900 pt-3">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold font-mono">2. Send Simulated Incoming SMS</span>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="text" 
                placeholder="Sender" 
                value={sandboxSmsSender}
                onChange={(e) => setSandboxSmsSender(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-[9px] text-white px-2 py-1 rounded focus:outline-none focus:border-teal-500 font-sans"
              />
              <input 
                type="text" 
                placeholder="Message Content" 
                value={sandboxSmsText}
                onChange={(e) => setSandboxSmsText(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-[9px] text-white px-2 py-1 rounded col-span-1 focus:outline-none focus:border-teal-500 font-sans"
              />
            </div>
            <button
              onClick={triggerIncomingSMS}
              className="w-full py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-[10px] rounded-lg transition active:scale-[0.98] cursor-pointer text-center"
            >
              Send SMS Notification
            </button>
          </div>
        </div>

        {/* Battery charger simulator */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3 shadow-sm text-left">
          <h3 className="text-xs font-bold text-teal-400 flex items-center gap-1.5 font-mono">
            ⚡ CHARGING POWER SANDBOX
          </h3>
          <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
            Connect the fast 33W SUPERVOOC charging loops to inspect ColorOS battery animations and charge percentages.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsCharging(true);
                setShowSuperVooc(true);
                setBattery(prev => Math.min(100, prev + 5));
              }}
              className="flex-1 py-1 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 text-teal-400 font-bold text-[9px] rounded transition active:scale-95 cursor-pointer"
            >
              Plug In (Fast Charge)
            </button>
            <button
              onClick={() => {
                setIsCharging(false);
                setShowSuperVooc(false);
              }}
              className="flex-1 py-1 bg-slate-900 hover:bg-slate-850 text-slate-450 font-bold text-[9px] rounded transition cursor-pointer"
            >
              Unplug Charger
            </button>
          </div>
        </div>

        {/* User Guide Specs */}
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/40 text-left space-y-2">
          <span className="text-[10px] font-bold text-slate-350 block font-mono">OPPO A6 (CPH2333) SPECS SUMMARY</span>
          <div className="text-[9px] text-slate-400 space-y-1 font-sans">
            <p>• <b>Network:</b> Dual carrier 5G band, simulated Wi-Fi</p>
            <p>• <b>Storage:</b> 128 GB space (supports Play Store downloads)</p>
            <p>• <b>Features:</b> Eye Comfort warm filter, Dark OS themes</p>
            <p>• <b>Software:</b> ColorOS with active Google Sync</p>
          </div>
        </div>

      </div>

    </div>
  );
}

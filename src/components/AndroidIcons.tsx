import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Google Play Store Icon
export const GooglePlayStoreIcon: React.FC<IconProps> = ({ className = "w-10 h-10", size }) => (
  <div 
    className={`rounded-[14px] bg-white flex items-center justify-center shadow-md border border-slate-150/50 overflow-hidden relative group-hover:scale-105 transition-transform ${className}`}
  >
    <svg viewBox="0 0 512 512" className="w-[62%] h-[62%]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M48 36.125c0-4.062 1.375-7.562 3.688-10.25l224.5 224.5-224.5 224.5c-2.312-2.688-3.688-6.188-3.688-10.25v-428.5z" fill="#00C6FF" />
      <path d="M361.062 147.125l-84.875 84.875-224.5-224.5c4.938-2.312 11.438-2.688 19.312 1.875l289.062 136.75c1.125.5 1 .875 1 1z" fill="#00E676" />
      <path d="M460.625 244.312c6.25 3.375 9.375 7.625 9.375 11.688s-3.125 8.312-9.375 11.688l-99.562 47.125-84.875-84.875 84.875-84.875 99.562 49.25z" fill="#FFD600" />
      <path d="M361.062 364.875L71.5 501.625c-7.875 4.562-14.375 4.188-19.312 1.875l224.5-224.5 84.875 84.875c-.125.125 1 .5 1 .5" fill="#FF1744" />
    </svg>
  </div>
);

// 2. Google Chrome Icon
export const GoogleChromeIcon: React.FC<IconProps> = ({ className = "w-10 h-10", size }) => (
  <div 
    className={`rounded-[14px] bg-white flex items-center justify-center shadow-md border border-slate-150/50 overflow-hidden relative group-hover:scale-105 transition-transform ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-[70%] h-[70%]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#EDEDED" />
      <circle cx="12" cy="12" r="3.5" fill="#4285F4" stroke="#FFFFFF" strokeWidth="1.5" />
      <path d="M12 2C8.3 2 5.1 4 3.4 7L8 15L12 8.5H21.4C20.5 4.8 16.6 2 12 2Z" fill="#EA4335" />
      <path d="M3.4 7C2.5 8.5 2 10.2 2 12C2 16.8 5.4 20.8 10 21.8L14.5 14L12 8.5L3.4 7Z" fill="#34A853" />
      <path d="M10 21.8C10.6 21.9 11.3 22 12 22C17.5 22 22 17.5 22 12C22 10.7 21.7 9.5 21.3 8.5H12L14.5 14L10 21.8Z" fill="#FBBC05" />
    </svg>
  </div>
);

// 3. Gmail Icon
export const GmailIconComponent: React.FC<IconProps> = ({ className = "w-10 h-10", size }) => (
  <div 
    className={`rounded-[14px] bg-white flex items-center justify-center shadow-md border border-slate-150/50 overflow-hidden relative group-hover:scale-105 transition-transform ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-[66%] h-[66%]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" fill="#EAEAEA" />
      <path d="M22 6v12c0 1.1-.9 2-2 2h-3v-9.5L12 14l-5-3.5V20H4c-1.1 0-2-.9-2-2V6c0-.8.5-1.5 1.2-1.8L12 11l8.8-6.8c.7.3 1.2 1 1.2 1.8z" fill="#C5221F" />
      <path d="M2 6v1c0 .5.2 1 .6 1.3L12 15l9.4-6.7c.4-.3.6-.8.6-1.3V6c0-1.1-.9-2-2-2h-3L12 8L7 4H4c-1.1 0-2 .9-2 2z" fill="#EA4335" />
      <path d="M2 18c0 1.1.9 2 2 2h3V11l-5 4.5V18z" fill="#B31412" />
      <path d="M22 18c0 1.1-.9 2-2 2h-3V11l5 4.5V18z" fill="#FBBC05" />
    </svg>
  </div>
);

// 4. Google Maps Icon
export const GoogleMapsIconComponent: React.FC<IconProps> = ({ className = "w-10 h-10", size }) => (
  <div 
    className={`rounded-[14px] bg-white flex items-center justify-center shadow-md border border-slate-150/50 overflow-hidden relative group-hover:scale-105 transition-transform ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-[68%] h-[68%]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#E8EAED" />
      <path d="M3 3h18v18H3V3z" fill="#EA4335" opacity="0.1" />
      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" fill="#EA4335" />
      <path d="M12 6.5c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5z" fill="#4285F4" />
      <path d="M11 20s-6-7.1-6-11c0-.9.2-1.7.5-2.5L12 15l5-8.5c.3.8.5 1.6.5 2.5 0 3.9-6 11-6 11z" fill="#34A853" />
      <path d="M5.5 6.5C6.8 4.3 9.2 3 12 3c2.8 0 5.2 1.3 6.5 3.5L12 15 5.5 6.5z" fill="#FBBC05" />
    </svg>
  </div>
);

// 5. YouTube Icon
export const GoogleYoutubeIcon: React.FC<IconProps> = ({ className = "w-10 h-10", size }) => (
  <div 
    className={`rounded-[14px] bg-[#FF0000] flex items-center justify-center shadow-md relative group-hover:scale-105 transition-transform ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-[58%] h-[58%] fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  </div>
);

// 6. Google Phone Icon
export const GooglePhoneIcon: React.FC<IconProps> = ({ className = "w-10 h-10", size }) => (
  <div 
    className={`rounded-[14px] bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-md relative group-hover:scale-105 transition-transform ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-[52%] h-[52%] fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.62c0-.55-.45-1-1-1z" />
    </svg>
  </div>
);

// 7. Google Messages Icon
export const GoogleMessagesIcon: React.FC<IconProps> = ({ className = "w-10 h-10", size }) => (
  <div 
    className={`rounded-[14px] bg-gradient-to-tr from-sky-500 to-blue-400 flex items-center justify-center shadow-md relative group-hover:scale-105 transition-transform ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-[52%] h-[52%] fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
    </svg>
  </div>
);

// 8. Oppo / ColorOS Settings Icon
export const ColorOsSettingsIcon: React.FC<IconProps> = ({ className = "w-10 h-10", size }) => (
  <div 
    className={`rounded-[14px] bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center shadow-md relative group-hover:scale-105 transition-transform ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-[58%] h-[58%] fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
    </svg>
  </div>
);

// 9. Oppo Camera Icon
export const OppoCameraIcon: React.FC<IconProps> = ({ className = "w-10 h-10", size }) => (
  <div 
    className={`rounded-[14px] bg-zinc-850 border border-zinc-750 flex items-center justify-center shadow-md relative group-hover:scale-105 transition-transform ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-[54%] h-[54%]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#2E2E2E" />
      <path d="M12 17a5 5 0 100-10 5 5 0 000 10z" fill="#4B5563" />
      <circle cx="12" cy="12" r="3" fill="#1E293B" stroke="#06B6D4" strokeWidth="1.2" />
      <circle cx="15.5" cy="8.5" r="0.8" fill="#EF4444" />
    </svg>
  </div>
);

// 10. Google Photos Icon
export const GooglePhotosIcon: React.FC<IconProps> = ({ className = "w-10 h-10", size }) => (
  <div 
    className={`rounded-[14px] bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-md relative group-hover:scale-105 transition-transform ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-[52%] h-[52%] fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0-2-.9-2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
    </svg>
  </div>
);

// 11. WhatsApp Icon Component
export const WhatsappIconComponent: React.FC<IconProps> = ({ className = "w-10 h-10", size }) => (
  <div 
    className={`rounded-[14px] bg-[#25D366] flex items-center justify-center shadow-md relative group-hover:scale-105 transition-transform ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-[56%] h-[56%] fill-white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.012 2C6.485 2 2 6.485 2 12.012c0 1.765.457 3.49 1.32 5.025L2 22l5.127-1.343c1.472.802 3.12 1.222 4.885 1.222H12c5.527 0 10-4.473 10-10C22 6.485 17.515 2 12.012 2zm5.74 13.682c-.244.686-1.22 1.258-1.688 1.31-.468.053-.948.082-2.906-.703-2.505-1.002-4.113-3.532-4.237-3.7-1.22-1.637-2.115-3.54-2.115-5.632 0-2.21 1.15-3.296 1.56-3.717.41-.42.91-.53 1.22-.53.31 0 .61.01.88.03.28.02.56-.1.87.64.31.74 1.06 2.59 1.15 2.77.09.18.15.39.03.63-.12.24-.18.39-.37.6-.18.21-.39.47-.56.63-.19.18-.39.38-.17.76.22.38.98 1.61 2.1 2.61a7.842 7.842 0 002.97 1.83c.38.18.61.15.84-.1.23-.26 1-1.16 1.27-1.56.27-.4.54-.33.91-.2.38.14 2.39 1.13 2.49 1.18.1.05.17.24.11.53z" />
    </svg>
  </div>
);

// 12. Instagram Icon Component
export const InstagramIconComponent: React.FC<IconProps> = ({ className = "w-10 h-10", size }) => (
  <div 
    className={`rounded-[14px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center shadow-md relative group-hover:scale-105 transition-transform ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-[54%] h-[54%] fill-none stroke-white" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeWidth="3" />
    </svg>
  </div>
);

// 13. Spotify Icon Component
export const SpotifyIconComponent: React.FC<IconProps> = ({ className = "w-10 h-10", size }) => (
  <div 
    className={`rounded-[14px] bg-[#191414] flex items-center justify-center shadow-md relative group-hover:scale-105 transition-transform ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-[58%] h-[58%] fill-[#1DB954]" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.785-8.893-.983-.336.075-.67-.138-.746-.474-.076-.336.138-.67.474-.746 3.854-.88 7.15-.506 9.818 1.13.295.18.387.564.207.86zm1.224-2.724c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.082-1.182-.413.125-.847-.11-.973-.522-.125-.413.11-.847.522-.973 3.674-1.114 8.245-.57 11.35 1.343.366.226.486.707.257 1.074zm.106-2.82c-3.26-1.937-8.644-2.115-11.754-1.17-.5.152-1.026-.134-1.178-.633-.152-.5.134-1.026.633-1.178 3.59-1.09 9.512-.882 13.264 1.345.45.267.6.845.333 1.296-.267.45-.845.6-1.296.333z" />
    </svg>
  </div>
);

// 14. eSIM Icon Component
export const EsimIconComponent: React.FC<IconProps> = ({ className = "w-10 h-10", size }) => (
  <div 
    className={`rounded-[14px] bg-gradient-to-tr from-cyan-600 to-indigo-500 flex items-center justify-center shadow-md relative group-hover:scale-105 transition-transform ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-[54%] h-[54%] fill-none stroke-white" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7 8h10M7 12h10M7 16h6" strokeLinecap="round" />
      <rect x="14" y="14" width="4" height="4" rx="0.5" fill="white" stroke="none" />
      <line x1="16" y1="13" x2="16" y2="14" />
      <line x1="16" y1="18" x2="16" y2="19" />
    </svg>
  </div>
);

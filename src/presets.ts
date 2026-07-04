export interface OppoApp {
  id: string;
  name: string;
  packageName: string;
  icon: string;
  category: "Social" | "Entertainment" | "Tools" | "Google";
  description: string;
  stars: number;
  size: string;
  downloads: string;
}

export const PLAY_STORE_APPS: OppoApp[] = [
  {
    id: "yt",
    name: "YouTube",
    packageName: "com.google.android.youtube",
    icon: "🔴",
    category: "Entertainment",
    description: "Watch videos, subscribe to channels, share with friends, and view trending video content on your Oppo A6.",
    stars: 4.6,
    size: "31 MB",
    downloads: "10B+"
  },
  {
    id: "wa",
    name: "WhatsApp Messenger",
    packageName: "com.whatsapp",
    icon: "🟢",
    category: "Social",
    description: "Simple, secure, and private messaging and calling. Stay connected with friends and family instantly.",
    stars: 4.8,
    size: "42 MB",
    downloads: "5B+"
  },
  {
    id: "ig",
    name: "Instagram",
    packageName: "com.instagram.android",
    icon: "📸",
    category: "Social",
    description: "Bring you closer to the people and things you love. Share pictures, watch reels, and send direct messages.",
    stars: 4.5,
    size: "50 MB",
    downloads: "1B+"
  },
  {
    id: "sp",
    name: "Spotify",
    packageName: "com.spotify.music",
    icon: "🎵",
    category: "Entertainment",
    description: "Play millions of songs, albums, and original podcasts on your high-fidelity Oppo A6 sound system.",
    stars: 4.7,
    size: "27 MB",
    downloads: "1B+"
  },
  {
    id: "gm",
    name: "Gmail",
    packageName: "com.google.android.gm",
    icon: "✉️",
    category: "Google",
    description: "Fast, organized, and secure email client by Google. Fully integrated with your Oppo smartphone account sync.",
    stars: 4.4,
    size: "18 MB",
    downloads: "10B+"
  },
  {
    id: "maps",
    name: "Google Maps",
    packageName: "com.google.android.apps.maps",
    icon: "🗺️",
    category: "Google",
    description: "Navigate your world with real-time GPS navigation, traffic, transit info, and local business reviews.",
    stars: 4.6,
    size: "35 MB",
    downloads: "10B+"
  },
  {
    id: "nf",
    name: "Netflix",
    packageName: "com.netflix.mediaclient",
    icon: "🎥",
    category: "Entertainment",
    description: "Watch award-winning movies, TV shows, and anime on the vibrant Oppo A6 90Hz eye-comfort screen.",
    stars: 4.3,
    size: "22 MB",
    downloads: "1B+"
  },
  {
    id: "tt",
    name: "TikTok",
    packageName: "com.zhiliaoapp.musically",
    icon: "📱",
    category: "Entertainment",
    description: "Discover, create, and watch millions of personalized short videos tailored exactly to your style.",
    stars: 4.7,
    size: "82 MB",
    downloads: "1B+"
  }
];

export const OPPO_A6_SPECS = {
  model: "OPPO A6 (CPH2333)",
  colorOS: "ColorOS 14.0.1",
  androidVersion: "Android 14",
  cpu: "Qualcomm Snapdragon Octa-Core (6nm)",
  ram: "8.00 GB (+8.00 GB RAM Expansion)",
  storage: "128 GB (24.2 GB used)",
  battery: "5000 mAh High-density Battery",
  charging: "33W SUPERVOOC Fast Charge",
  screen: "6.59\" FHD+ Sunlight 90Hz Display",
  cameras: "50MP Main + 2MP Depth Rear, 16MP Punch-Hole Front Camera"
};

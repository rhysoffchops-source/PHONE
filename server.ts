import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function bootstrap() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy-loaded GoogleGenAI Client
  let aiClient: GoogleGenAI | null = null;
  function getAI() {
    if (!aiClient) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        console.warn("Warning: GEMINI_API_KEY is not defined. AI conversation simulator will fall back to rule-based logic.");
        return null;
      }
      aiClient = new GoogleGenAI({ apiKey: key });
    }
    return aiClient;
  }

  // Memory database for demo persistence
  interface MockDb {
    activeCalls: { [deviceId: string]: { status: string; timer: number; duration: number } };
    simulatedSms: { [deviceId: string]: { id: string; sender: string; text: string; timestamp: string; isIncoming: boolean }[] };
  }

  const mockDb: MockDb = {
    activeCalls: {},
    simulatedSms: {
      "device-1": [
        { id: "sms-1", sender: "Google Play", text: "Your device verification code is 829103. Do not share this with anyone.", timestamp: "10:14 AM", isIncoming: true },
        { id: "sms-2", sender: "+1 (555) 302-9911", text: "Hey! Let me know if you can run that app on your clean device.", timestamp: "Yesterday", isIncoming: true }
      ],
      "device-2": [
        { id: "sms-3", sender: "SuperSU Daemon", text: "Warning: Binary su granted execution rights to interactive shell (PID 1023).", timestamp: "11:00 AM", isIncoming: true },
        { id: "sms-4", sender: "+1 (555) 918-2020", text: "Did you bypass SafetyNet yet? My app crashes instantly.", timestamp: "Yesterday", isIncoming: true }
      ]
    }
  };

  // API Endpoint to request simulated voice responses or custom SMS texts via Gemini API
  app.post("/api/simulator/chat", async (req, res) => {
    const { deviceName, appName, message, context } = req.body;
    const ai = getAI();

    if (!ai) {
      // Elegant hardcoded fallback response if API key is missing
      return res.json({
        text: `[Simulator System Automated Reply]: Handled "${message}" successfully on ${deviceName}. Simulated network layer acknowledged.`
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{
              text: `You are simulating a response to an SMS message or a phone call on an Android Emulator Virtual device.
  Device Configuration:
  - Name: ${deviceName}
  - Custom context/state of phone: ${JSON.stringify(context)}
  - Context app running (if any): ${appName || "System Dialer"}

  The user or external carrier just sent this message/action: "${message}".

  Generate a natural, human-like virtual response acting either as an automated SMS carrier message, an external user, or an active caller/bot answering. Be brief, creative, and fit the persona of an Android phone emulator interaction. Keep it under 3 sentences.`
            }]
          }
        ]
      });

      const outputText = response.text || "Simulation acknowledged by carrier.";
      res.json({ text: outputText });
    } catch (err: any) {
      console.error("Gemini interaction failed:", err);
      res.status(500).json({ error: "Could not generate virtual reply. " + err.message });
    }
  });

  // SMS API
  app.get("/api/sms/:deviceId", (req, res) => {
    const { deviceId } = req.params;
    const list = mockDb.simulatedSms[deviceId] || [];
    res.json({ success: true, messages: list });
  });

  app.post("/api/sms/:deviceId", (req, res) => {
    const { deviceId } = req.params;
    const { sender, text, isIncoming } = req.body;

    if (!mockDb.simulatedSms[deviceId]) {
      mockDb.simulatedSms[deviceId] = [];
    }

    const newMessage = {
      id: `sms-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sender: sender || "Unknown",
      text: text || "",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isIncoming: !!isIncoming
    };

    mockDb.simulatedSms[deviceId].push(newMessage);
    res.json({ success: true, message: newMessage });
  });

  // Hardware signature list API for quick query
  app.get("/api/hardware/signatures", (req, res) => {
    res.json({
      signatures: [
        { id: "safetynet-fix", name: "SafetyNet Universal Fix Kernel Module", type: "Magisk Module", status: "Active" },
        { id: "play-integrity-fix", name: "Play Integrity API Patch v15.4", type: "Zygote Hook", status: "Active" },
        { id: "zygisk-denylist", name: "Magisk DenyList Hook", type: "Process Isolation", status: "Configured" }
      ]
    });
  });

  // Serve frontend assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Android Emulator Virtual Server listening on http://localhost:${PORT}`);
  });
}

bootstrap();

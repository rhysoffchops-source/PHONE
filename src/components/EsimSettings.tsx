import React, { useState } from "react";
import { Check, Cpu, RefreshCw, Smartphone, Wifi, Radio } from "lucide-react";

export interface EsimProfile {
  id: string;
  carrier: string;
  number: string;
  plan: string;
  eid: string;
  iccid: string;
  active: boolean;
  status: "connected" | "roaming" | "no_service";
}

interface EsimSettingsProps {
  esimProfiles: EsimProfile[];
  onAddEsim: (profile: EsimProfile) => void;
  onToggleActive: (id: string) => void;
  onDeleteEsim: (id: string) => void;
}

const CARRIER_PRESETS = [
  { name: "Google Fi Virtual", plan: "Fi Unlimited Ultra 5G", code: "GFI" },
  { name: "Oppo AirLink Global", plan: "AirLink Roam Pass Pro", code: "ALN" },
  { name: "Sydney Local Sim", plan: "Telstra 5G Explorer Starter", code: "TLS" },
  { name: "Vodafone eSIM Network", plan: "Red Plan 100GB 5G", code: "VDF" }
];

export const EsimSettings: React.FC<EsimSettingsProps> = ({
  esimProfiles,
  onAddEsim,
  onToggleActive,
  onDeleteEsim
}) => {
  const [showAddFlow, setShowAddFlow] = useState(false);
  const [selectedCarrierIdx, setSelectedCarrierIdx] = useState(0);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionStep, setProvisionStep] = useState("");
  const [progress, setProgress] = useState(0);

  const startProvisioning = () => {
    setIsProvisioning(true);
    setProgress(0);
    const selected = CARRIER_PRESETS[selectedCarrierIdx];

    const steps = [
      { p: 15, t: "Contacting virtual baseband server..." },
      { p: 40, t: "Exchanging secure chip validation certificates (EID)..." },
      { p: 65, t: "Configuring cryptographic profile routing nodes..." },
      { p: 85, t: "Registering standard eSIM phone assignment loops..." },
      { p: 100, t: "eSIM Network profile synchronized successfully!" }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setProvisionStep(steps[currentStep].t);
        currentStep++;
      } else {
        clearInterval(interval);
        // Create random eSIM phone number
        const randomNum = `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
        const randomEID = `89049032000012345678${Math.floor(100000 + Math.random() * 900000)}`;
        const randomICCID = `8901260000${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        
        onAddEsim({
          id: `esim-${Date.now()}`,
          carrier: selected.name,
          plan: selected.plan,
          number: randomNum,
          eid: randomEID,
          iccid: randomICCID,
          active: true,
          status: "connected"
        });

        setIsProvisioning(false);
        setShowAddFlow(false);
      }
    }, 1200);
  };

  return (
    <div className="space-y-4 text-left select-none">
      <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-850 space-y-2">
        <div className="flex items-center gap-2 text-teal-400 font-bold">
          <Cpu className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-wider font-mono">eSIM Chipset Dashboard</span>
        </div>
        <p className="text-[8px] text-slate-400 leading-normal">
          Your virtual Oppo A6 supports cellular network emulation. Since standard browsers lack physical SIM/eSIM transceiver hardware, we mimic carrier provisioning directly in the sandbox interface!
        </p>
      </div>

      {showAddFlow ? (
        <div className="bg-slate-850 border border-slate-800 p-3 rounded-2xl space-y-3 animate-fade-in text-[9px]">
          <h4 className="font-extrabold text-white text-[10px] border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>Add Cellular Profile (eSIM)</span>
            <button 
              onClick={() => { if (!isProvisioning) setShowAddFlow(false); }}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </h4>

          {isProvisioning ? (
            <div className="space-y-2.5 text-center py-4">
              <RefreshCw className="w-6 h-6 text-teal-400 animate-spin mx-auto" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-white block">Provisioning eSIM Profile</span>
                <span className="text-[7.5px] font-mono text-slate-400 block h-6 leading-tight">{provisionStep}</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 max-w-[200px] mx-auto">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[8.5px] font-mono font-bold text-teal-300">{progress}%</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <span className="text-[8px] font-bold text-slate-400 font-mono block uppercase">1. SELECT CHIP CARRIER PRESET</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {CARRIER_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedCarrierIdx(idx)}
                      className={`p-2 rounded-lg text-left transition border ${
                        selectedCarrierIdx === idx
                          ? "bg-teal-500/10 border-teal-500 text-teal-300 font-bold"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850"
                      }`}
                    >
                      <span className="block font-black text-[9px]">{p.name}</span>
                      <span className="block text-[7px] text-slate-400 truncate mt-0.5">{p.plan}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800 font-mono text-[7px] text-slate-400">
                <div>• <b>EID Chipset:</b> 8904903200001234567800049102</div>
                <div>• <b>Connection Class:</b> Virtual Software Transceiver v14</div>
                <div>• <b>SIM Slot target:</b> Slot 2 (eSIM Enabled)</div>
              </div>

              <button
                onClick={startProvisioning}
                className="w-full py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-[9.5px] rounded-xl transition shadow-md shadow-teal-500/10 text-center"
              >
                Provision eSIM Profile Securely
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-[9px]">
            <span className="text-[8.5px] font-bold text-slate-400 font-mono uppercase">ACTIVE CARRIER eSIMs</span>
            <button
              onClick={() => setShowAddFlow(true)}
              className="text-teal-400 hover:text-teal-300 font-bold text-[8.5px]"
            >
              + Add eSIM Profile
            </button>
          </div>

          <div className="space-y-2">
            {esimProfiles.length === 0 ? (
              <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-850 border-dashed text-center">
                <span className="text-[8.5px] font-medium text-slate-500 block">No eSIM profiles active.</span>
                <button
                  onClick={() => setShowAddFlow(true)}
                  className="mt-1.5 text-[8px] bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold px-3 py-1 rounded-full transition"
                >
                  Provision Virtual eSIM
                </button>
              </div>
            ) : (
              esimProfiles.map(p => (
                <div 
                  key={p.id}
                  className={`p-3 rounded-2xl border transition-all text-[9px] ${
                    p.active 
                      ? "bg-slate-850 border-teal-500/30 shadow-md shadow-teal-950/20" 
                      : "bg-slate-900/60 border-slate-850 opacity-60"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Radio className={`w-3 h-3 ${p.active ? "text-teal-400 animate-pulse" : "text-slate-500"}`} />
                        <span className="font-extrabold text-white text-[10px]">{p.carrier}</span>
                        {p.active && (
                          <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-1 py-0.2 rounded font-mono text-[6.5px]">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-[8.5px] font-mono text-slate-200 block">{p.number}</span>
                      <span className="text-[7.5px] text-slate-400 block">{p.plan}</span>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        onClick={() => onToggleActive(p.id)}
                        className={`px-2 py-0.5 rounded font-bold text-[7px] border transition ${
                          p.active 
                            ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white" 
                            : "bg-teal-500 border-teal-500 text-slate-950 hover:bg-teal-400"
                        }`}
                      >
                        {p.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => onDeleteEsim(p.id)}
                        className="text-[7.5px] text-rose-400 hover:underline"
                      >
                        Delete Profile
                      </button>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 gap-1.5 font-mono text-[6.5px] text-slate-500">
                    <div>EID: <span className="text-slate-400 truncate block max-w-full">{p.eid}</span></div>
                    <div>ICCID: <span className="text-slate-400 truncate block max-w-full">{p.iccid}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

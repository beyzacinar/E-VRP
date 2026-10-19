/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Clock, 
  Flame, 
  Gauge, 
  X, 
  ShieldCheck, 
  Timer, 
  Check, 
  DollarSign, 
  AlertCircle 
} from 'lucide-react';
import { ChargingStation, ChargingSession } from '../types';

interface ActiveChargingProps {
  station: ChargingStation;
  selectedSocketId: string;
  onStopCharging: (sessionSummary: { addedKwh: number; cost: number; finalSoh: number }) => void;
}

export default function ActiveCharging({
  station,
  selectedSocketId,
  onStopCharging
}: ActiveChargingProps) {
  // Read selected socket details
  const socket = station.sockets.find(s => s.id === selectedSocketId) || station.sockets[0];
  
  // Local active simulation states
  const [batteryPct, setBatteryPct] = useState<number>(62);
  const [targetPct, setTargetPct] = useState<number>(80);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(1395); // Starts at 23m 15s (1395s)
  const [addedKwh, setAddedKwh] = useState<number>(18.6);
  const [cost, setCost] = useState<number>(134.85);
  const [chargingPower, setChargingPower] = useState<number>(142); // kW (max 150, declines slightly as exceeds 70%)
  const [isConfirmingStop, setIsConfirmingStop] = useState<boolean>(false);

  // Simulated ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
      
      // Gradually increase battery percentage every 12 seconds
      if (secondsElapsed % 12 === 0 && batteryPct < targetPct) {
        setBatteryPct(prev => {
          const newVal = Math.min(targetPct, prev + 1);
          return newVal;
        });
        
        // Add energy and cost
        setAddedKwh(prev => Number((prev + 0.15).toFixed(2)));
        setCost(prev => Number((prev + (0.15 * socket.pricePerKwh)).toFixed(2)));
        
        // Power curve drop-off as battery gets full
        if (batteryPct > 70) {
          setChargingPower(prev => Math.max(45, prev - 3));
        } else if (batteryPct > 80) {
          setChargingPower(prev => Math.max(22, prev - 4));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsElapsed, batteryPct, targetPct, socket.pricePerKwh]);

  // Format seconds to HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  const handleStopChargingClick = () => {
    setIsConfirmingStop(true);
  };

  const handleConfirmStop = () => {
    setIsConfirmingStop(false);
    onStopCharging({
      addedKwh,
      cost,
      finalSoh: batteryPct
    });
  };

  // Math for progress circle
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (batteryPct / 100) * circumference;

  return (
    <div className="absolute inset-0 z-40 bg-[#032F2E] overflow-y-auto no-scrollbar pb-10 animate-fade-in flex flex-col justify-between text-white">
      {/* Header bar */}
      <div className="p-4 bg-teal-950/40 backdrop-blur-md border-b border-white/5 flex justify-between items-center shrink-0">
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          Şarj İşlemi Aktif
        </span>
        <h2 className="text-sm font-extrabold tracking-tight">EVRP Akıllı Şarj</h2>
        <span className="text-xs font-mono text-teal-300 bg-white/5 px-2 py-0.5 rounded">Soket {socket.socketNumber.split('.')[0]}</span>
      </div>

      {/* Main Charger Animation viewport */}
      <div className="flex-1 flex flex-col items-center justify-center py-6 px-4 gap-6">
        
        {/* Progress circular indicator surrounding custom Tesla silhouette */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          
          {/* Pulsing ring underneath */}
          <div className="absolute inset-2 rounded-full border border-teal-300/10 animate-pulse-ring"></div>
          
          {/* Main animated background circle svg */}
          <svg className="w-full h-full transform -rotate-90">
            {/* Background track */}
            <circle 
              cx="112" cy="112" r={radius} 
              fill="none" stroke="#004d49" strokeWidth="8"
            />
            {/* Foreground progress */}
            <circle 
              cx="112" cy="112" r={radius} 
              fill="none" stroke="#16A365" strokeWidth="8" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>

          {/* Central interior displaying Tesla rendering and percentage state */}
          <div className="absolute inset-6 rounded-full bg-teal-950/60 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
            
            {/* Vector wireframe Tesla style representation */}
            <svg viewBox="0 0 100 40" className="w-24 h-10 opacity-90 text-white mb-1.5 fill-none" stroke="currentColor" strokeWidth="1.5">
              <path d="M 10,25 C 10,18 20,10 50,10 C 80,10 90,18 90,25 C 90,25 95,27 92,29 C 85,30 15,30 8,29 C 5,27 10,25 10,25 Z" strokeLinecap="round" />
              <circle cx="28" cy="28" r="5" fill="#032F2E" />
              <circle cx="72" cy="28" r="5" fill="#032F2E" />
              <path d="M 35,10 C 40,16 60,16 65,10" />
            </svg>

            <span className="text-3xl font-extrabold tracking-tight font-display text-white">
              %{batteryPct}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase mt-1">
              Şarj Ediliyor...
            </span>
            <span className="text-[9px] text-teal-300/70 block mt-0.5 font-mono">{chargingPower} kW Hızında</span>
          </div>
        </div>

        {/* Real-time charging data grid card */}
        <div className="w-full max-w-sm bg-teal-950/40 backdrop-blur-md rounded-2xl p-4.5 border border-white/5 space-y-4">
          <div className="grid grid-cols-3 gap-2.5 text-center">
            
            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="block text-[10px] text-teal-300/70 font-semibold uppercase tracking-wider">Şarj Süresi</span>
              <span className="text-sm font-bold font-mono tracking-tight text-white block mt-1">
                {formatTime(secondsElapsed)}
              </span>
            </div>

            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="block text-[10px] text-teal-300/70 font-semibold uppercase tracking-wider">Eklenen Güç</span>
              <span className="text-sm font-bold font-mono tracking-tight text-emerald-400 block mt-1">
                {addedKwh} kWh
              </span>
            </div>

            <div className="bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="block text-[10px] text-teal-300/70 font-semibold uppercase tracking-wider">Anlık Maliyet</span>
              <span className="text-sm font-bold font-mono tracking-tight text-white block mt-1">
                ₺{cost.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="flex justify-between items-center text-teal-200">
              <span>Tahmini Bitiş</span>
              <span className="font-bold text-white font-mono">10:42</span>
            </div>
            <div className="flex justify-between items-center text-teal-200 pl-3 border-l border-white/10">
              <span>Tahmini Menzil</span>
              <span className="font-bold text-emerald-400 font-mono">298 km</span>
            </div>
          </div>
        </div>

        {/* Real-time speed mini visual dashboard line representation */}
        <div className="w-full max-w-sm bg-white/5 p-4 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-2.5 text-xs text-teal-200">
            <span className="font-semibold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Sıcaklık ve Güç Akışı
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Piller Dengeli</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[10px] text-teal-300 block">Pil Sıcaklığı</span>
              <span className="font-bold text-teal-200 block mt-0.5">34.2 °C</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[10px] text-teal-300 block">Soket Potansiyeli</span>
              <span className="font-bold text-emerald-400 block mt-0.5">380 V</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl">
              <span className="text-[10px] text-teal-300 block">Soket Akımı</span>
              <span className="font-bold text-teal-200 block mt-0.5">370 A</span>
            </div>
          </div>
        </div>

        {/* Target limit slider (custom threshold update) */}
        <div className="w-full max-w-sm bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
          <div className="flex justify-between items-center text-xs text-teal-200">
            <span>Hedef Şarj Üst Sınırı</span>
            <span className="font-bold text-emerald-400">%{targetPct} Seviyesi</span>
          </div>
          <input 
            type="range" 
            min="65" max="100" step="5"
            value={targetPct}
            onChange={(e) => setTargetPct(Number(e.target.value))}
            className="w-full h-1.5 bg-teal-950 rounded-lg appearance-none cursor-pointer accent-emerald-custom"
          />
          <span className="text-[9px] text-teal-300/50 block text-right">Menzili ve pil sağlığını korumak için %80 önerilir.</span>
        </div>
      </div>

      {/* Stop Charging actions container */}
      <div className="p-4 bg-teal-950/40 backdrop-blur-md border-t border-white/5 flex flex-col gap-3 shrink-0">
        <div className="flex justify-between items-center text-[11px] text-teal-300/80 px-1">
          <span>İstasyon: {station.name.split(' ')[0]} AVM</span>
          <span>Soket Soket: #{socket.socketNumber}</span>
        </div>
        
        <button
          id="stop-charging-trigger-btn"
          onClick={handleStopChargingClick}
          className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg active:scale-[0.98] cursor-pointer"
        >
          Şarjı Durdur
        </button>
      </div>

      {/* Stop confirmation modal overlays if active */}
      {isConfirmingStop && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl text-dark-custom animate-fade-in flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-base leading-none">Şarj işlemini durdur?</h3>
            <p className="text-xs text-gray-500 leading-normal mt-2.5">
              Mevcut şarj seviyeniz %{batteryPct}. Şarj işlemini sonlandırıp seyahatinize devam etmek istiyor musunuz?
            </p>
            
            <div className="flex gap-2 w-full mt-4">
              <button
                id="cancel-stop-charging-btn"
                onClick={() => setIsConfirmingStop(false)}
                className="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Vazgeç
              </button>
              
              <button
                id="confirm-stop-charging-btn"
                onClick={handleConfirmStop}
                className="flex-1 py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Evet, Durdur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

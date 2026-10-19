/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Settings, 
  HelpCircle, 
  Check, 
  Sliders, 
  SlidersHorizontal,
  Flame,
  Wallet,
  Clock,
  Gauge,
  Activity,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { OptimizationPreferences } from '../types';
import { PRESET_WEIGHTS } from '../data';

interface OptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: OptimizationPreferences;
  onSave: (prefs: OptimizationPreferences) => void;
}

export default function OptimizationModal({
  isOpen,
  onClose,
  preferences,
  onSave
}: OptimizationModalProps) {
  const [preset, setPreset] = useState<OptimizationPreferences['presetMode']>(preferences.presetMode);
  
  // Local states for sliders representing weights
  const [timeW, setTimeW] = useState<number>(preferences.timeWeight);
  const [costW, setCostW] = useState<number>(preferences.costWeight);
  const [waitW, setWaitW] = useState<number>(preferences.waitWeight);
  const [distanceW, setDistanceW] = useState<number>(preferences.distanceWeight);
  const [batteryW, setBatteryW] = useState<number>(preferences.batterySafetyWeight);
  const [reliabilityW, setReliabilityW] = useState<number>(preferences.reliabilityWeight);

  // Additional settings
  const [minBattery, setMinBattery] = useState<number>(preferences.minArrivalBattery);
  const [connector, setConnector] = useState<OptimizationPreferences['preferredConnector']>(preferences.preferredConnector);
  const [maxWait, setMaxWait] = useState<number>(preferences.maxAcceptableWaitMinutes);
  const [avoidCrowded, setAvoidCrowded] = useState<boolean>(preferences.avoidCrowdedStations);
  const [only247, setOnly247] = useState<boolean>(preferences.onlyShow247Stations);

  // Synchronize sliders when preset selection changes
  const applyPresetWeights = (presetName: OptimizationPreferences['presetMode']) => {
    const weights = PRESET_WEIGHTS[presetName];
    if (weights) {
      setPreset(presetName);
      setTimeW(weights.time);
      setCostW(weights.cost);
      setWaitW(weights.wait);
      setDistanceW(weights.distance);
      setBatteryW(weights.safety);
      setReliabilityW(weights.reliability);
    }
  };

  const handleApply = () => {
    onSave({
      timeWeight: timeW,
      costWeight: costW,
      waitWeight: waitW,
      distanceWeight: distanceW,
      batterySafetyWeight: batteryW,
      reliabilityWeight: reliabilityW,
      presetMode: preset,
      minArrivalBattery: minBattery,
      preferredConnector: connector,
      maxAcceptableWaitMinutes: maxWait,
      avoidCrowdedStations: avoidCrowded,
      onlyShow247Stations: only247
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#032F2E]/60 backdrop-blur-sm flex items-end justify-center select-none p-0 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-6 flex flex-col gap-4 animate-fade-in max-h-[92vh] overflow-y-auto no-scrollbar">
        
        {/* Header bar */}
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-custom">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-none">Çok Kriterli Rota Ayarları</h2>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-1 block">Ağırlıklı Optimizasyon ve Kriterler</span>
            </div>
          </div>
          <button 
            id="close-optimization-modal-btn"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Informative text bubble */}
        <p className="text-xs text-secondary-custom leading-relaxed bg-[#EAF8F1] p-3 rounded-2xl border border-emerald-100">
          <strong>💡 Yapay Zeka Öneri Motoru:</strong> EVRP, seçtiğiniz önceliklere (ağırlıklara) göre alternatif rotaları yeniden sıralar ve size en uygun şarj istasyonlu rotayı anında sunar.
        </p>

        {/* Optimization Preset Buttons */}
        <div>
          <label className="text-xs font-bold text-gray-800 block mb-2">Hazır Mod Seçenekleri</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { name: 'Dengeli', desc: 'Dengeli seyahat planı', icon: Activity },
              { name: 'En Hızlı', desc: 'Süreyi minimize eder', icon: Zap },
              { name: 'En Ekonomik', desc: 'Maliyeti en aza indirir', icon: Wallet },
              { name: 'En Az Bekleme', desc: 'Soket arama riskini sıfırlar', icon: Clock },
              { name: 'Batarya Güvenli', desc: 'Menzil güvenliği önceliği', icon: ShieldCheck }
            ].map((p) => {
              const IconComp = p.icon;
              const isSelected = preset === p.name;
              return (
                <button
                  key={p.name}
                  id={`preset-btn-${p.name.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => applyPresetWeights(p.name as any)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-teal-custom text-white border-teal-custom shadow-lg shadow-teal-950/20' 
                      : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{p.name}</span>
                  </div>
                  <span className={`text-[9px] block mt-0.5 ${isSelected ? 'text-teal-300' : 'text-gray-400'}`}>
                    {p.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Weight Sliders (0 - 100) */}
        <div className="space-y-3.5 bg-gray-50 rounded-2xl p-4.5 border border-gray-100">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200/50">
            <span className="text-xs font-bold text-gray-800">Kriter Ağırlık Yüzdeleri</span>
            <span className="text-[10px] text-emerald-custom font-bold italic">Toplam Ağırlık: {timeW + costW + waitW + distanceW + batteryW + reliabilityW} birim</span>
          </div>

          {/* Time Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-gray-700">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-orange-500" /> Seyahat Süresi</span>
              <span>%{timeW}</span>
            </div>
            <input 
              type="range" 
              value={timeW} 
              onChange={(e) => { setTimeW(Number(e.target.value)); setPreset('Dengeli'); }}
              min="0" max="100" 
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-custom"
            />
          </div>

          {/* Cost Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-gray-700">
              <span className="flex items-center gap-1"><Wallet className="w-3.5 h-3.5 text-emerald-600" /> Şarj Maliyeti</span>
              <span>%{costW}</span>
            </div>
            <input 
              type="range" 
              value={costW} 
              onChange={(e) => { setCostW(Number(e.target.value)); setPreset('Dengeli'); }}
              min="0" max="100" 
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-custom"
            />
          </div>

          {/* Wait Time Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-gray-700">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> Bekleme Süresi</span>
              <span>%{waitW}</span>
            </div>
            <input 
              type="range" 
              value={waitW} 
              onChange={(e) => { setWaitW(Number(e.target.value)); setPreset('Dengeli'); }}
              min="0" max="100" 
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-custom"
            />
          </div>

          {/* Distance Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-gray-700">
              <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-blue-500" /> Toplam Mesafe</span>
              <span>%{distanceW}</span>
            </div>
            <input 
              type="range" 
              value={distanceW} 
              onChange={(e) => { setDistanceW(Number(e.target.value)); setPreset('Dengeli'); }}
              min="0" max="100" 
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-custom"
            />
          </div>

          {/* Battery Safety Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-gray-700">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-red-500" /> Varış Batarya Güvenliği</span>
              <span>%{batteryW}</span>
            </div>
            <input 
              type="range" 
              value={batteryW} 
              onChange={(e) => { setBatteryW(Number(e.target.value)); setPreset('Dengeli'); }}
              min="0" max="100" 
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-custom"
            />
          </div>

          {/* Reliability Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-semibold text-gray-700">
              <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-cyan-500" /> İstasyon Güvenilirliği</span>
              <span>%{reliabilityW}</span>
            </div>
            <input 
              type="range" 
              value={reliabilityW} 
              onChange={(e) => { setReliabilityW(Number(e.target.value)); setPreset('Dengeli'); }}
              min="0" max="100" 
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-custom"
            />
          </div>
        </div>

        {/* Constraints section */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-gray-800 block">Kriter Eşik Değerleri</span>

          {/* Connector Preference */}
          <div>
            <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 mb-1.5">
              <span>Soket Soket Tipi</span>
              <span className="text-emerald-600">Öncelikli</span>
            </div>
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {['Tümü', 'CCS', 'CHAdeMO', 'Tesla', 'Type 2'].map((conn) => (
                <button
                  key={conn}
                  onClick={() => setConnector(conn as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all cursor-pointer ${
                    connector === conn
                      ? 'bg-emerald-100 text-emerald-800 border-none'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {conn}
                </button>
              ))}
            </div>
          </div>

          {/* Min battery and max wait columns */}
          <div className="grid grid-cols-2 gap-3 mt-1.5">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                Min. Varış Şarj Limiti
              </label>
              <div className="flex items-center gap-1.5">
                <input 
                  type="range" 
                  min="5" max="30" step="5"
                  value={minBattery} 
                  onChange={(e) => setMinBattery(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none accent-teal-600"
                />
                <span className="text-xs font-bold font-mono text-teal-800">%{minBattery}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                Maksimum Bekleme Süresi
              </label>
              <select
                value={maxWait}
                onChange={(e) => setMaxWait(Number(e.target.value))}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-100 p-1 rounded-lg text-gray-700"
              >
                <option value={10}>10 dk</option>
                <option value={20}>20 dk</option>
                <option value={30}>30 dk</option>
                <option value={45}>45 dk</option>
                <option value={999}>Limit Yok</option>
              </select>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-100">
            <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
              <span>Yoğun istasyonları (doluluk %80 üstü) hariç tut</span>
              <input 
                type="checkbox" 
                checked={avoidCrowded}
                onChange={(e) => setAvoidCrowded(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-custom focus:ring-emerald-custom border-gray-300"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-semibold text-gray-700 cursor-pointer">
              <span>Sadece 7/24 açık istasyonları göster</span>
              <input 
                type="checkbox" 
                checked={only247}
                onChange={(e) => setOnly247(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-custom focus:ring-emerald-custom border-gray-300"
              />
            </label>
          </div>
        </div>

        {/* Apply button */}
        <button
          id="recalculate-route-preferences-btn"
          onClick={handleApply}
          className="w-full py-3 bg-emerald-custom hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-700/20 active:scale-[0.98] transition-all cursor-pointer mt-2"
        >
          Rotayı Yeniden Hesapla
        </button>
      </div>
    </div>
  );
}

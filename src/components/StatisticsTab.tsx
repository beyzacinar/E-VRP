/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Award, 
  Leaf, 
  ChevronRight, 
  Info,
  Calendar
} from 'lucide-react';
import { StatisticsData } from '../types';
import { MOCK_STATISTICS } from '../data';

export default function StatisticsTab() {
  const [period, setPeriod] = useState<'gun' | 'hafta' | 'ay' | 'yil'>('ay');
  const stats: StatisticsData = MOCK_STATISTICS;

  // Render tooltip with Turkish content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#032F2E] border border-teal-800 p-2.5 rounded-xl text-xs text-white shadow-xl">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-emerald-400 font-semibold font-mono">
            {payload[0].name === 'consumptionKwh' ? 'Enerji' : 'Maliyet'}: {payload[0].value} {payload[0].name === 'consumptionKwh' ? 'kWh' : '₺'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full min-h-screen bg-light-custom text-dark-custom pb-24 animate-fade-in px-4 pt-4">
      {/* Header section with page title and icon */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-none">İstatistikler</h1>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-1 block">Tüketim ve Tasarruf Karnesi</span>
        </div>
        <div className="p-2.5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <Calendar className="w-5 h-5 text-emerald-custom" />
        </div>
      </div>

      {/* Period Selection Pill Bars */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-4.5">
        {[
          { id: 'gun', label: 'Gün' },
          { id: 'hafta', label: 'Hafta' },
          { id: 'ay', label: 'Ay' },
          { id: 'yil', label: 'Yıl' }
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id as any)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              period === p.id
                ? 'bg-white text-emerald-custom shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* First Grid Section: Core Metrics KPI Summary */}
      <div className="grid grid-cols-2 gap-3 mb-4.5">
        {/* Total Time card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Toplam Şarj</span>
          </div>
          <div>
            <span className="text-base font-extrabold text-gray-950 block mt-2">
              {stats.totalChargingHoursMinutes}
            </span>
            <span className="text-[9px] text-gray-400 font-medium block mt-0.5">Soket Bağlantı Süresi</span>
          </div>
        </div>

        {/* Stations Count card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>İstasyon Sayısı</span>
          </div>
          <div>
            <span className="text-base font-extrabold text-gray-950 block mt-2">
              {stats.usedStationsCount} istasyon
            </span>
            <span className="text-[9px] text-gray-400 font-medium block mt-0.5">Farklı Konumlarda Dolum</span>
          </div>
        </div>
      </div>

      {/* Second Section: Energy Consumption Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 mb-4.5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">ENERJİ TÜKETİMİ</span>
            <h3 className="text-base font-extrabold text-gray-900 mt-0.5">Toplam: {stats.totalEnergyKwh} kWh</h3>
          </div>
          <span className="text-xs text-emerald-custom bg-emerald-50 px-2 py-0.5 rounded font-bold">Mayıs 2026</span>
        </div>

        <div className="w-full h-44 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.energyConsumption} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="consumptionKwh" fill="#16A365" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <span className="text-[9px] text-gray-400 block text-center mt-3">• Günlük dökümlere göre tüketim dağılımı</span>
      </div>

      {/* Third Section: Costs Trend Chart */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50 mb-4.5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">MALİYET</span>
            <h3 className="text-base font-extrabold text-gray-950 mt-0.5">Toplam: ₺{stats.totalCostTry}</h3>
          </div>
          <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">Bakiye</span>
        </div>

        <div className="w-full h-44 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.monthlyCost} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="costTry" 
                stroke="#115e59" 
                strokeWidth={2.5} 
                dot={{ stroke: '#0d9488', strokeWidth: 1.5, r: 3, fill: '#ffffff' }}
                activeDot={{ r: 5 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <span className="text-[9px] text-gray-400 block text-center mt-3">• İstasyon dolum maliyet analizi zamansal çizgi grafigi</span>
      </div>

      {/* Ecological Impact Statement Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-4 shadow-lg border border-teal-950/20 relative overflow-hidden">
        {/* Decorative backdrop graphics */}
        <div className="absolute right-0 bottom-0 opacity-10 bg-emerald-300 w-24 h-24 rounded-full blur-xl translate-x-4 translate-y-4"></div>
        
        <div className="flex items-start gap-3.5 z-10 relative">
          <div className="w-11 h-11 rounded-2xl bg-emerald-custom flex items-center justify-center text-white shadow-md shadow-emerald-950/50 shrink-0">
            <Leaf className="w-5 h-5 fill-current text-white" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-400 block">Karbondioksit Tasarrufu</span>
            <h4 className="text-base font-extrabold">Toplam {stats.co2SavedKg} kg CO₂ önlendi!</h4>
            <p className="text-xs text-emerald-100/90 leading-tight">
              Bu seyahat döneminde atmosfere salınmasını önlediğiniz karbon emisyonu, <strong>bu ay 12 yetişkin ağaca</strong> eşdeğer katma fayda sağladı!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

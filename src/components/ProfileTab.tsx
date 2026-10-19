/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Car, 
  Settings, 
  Bell, 
  CreditCard, 
  Heart, 
  History, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  Zap, 
  Battery, 
  ChevronRight,
  UserCheck,
  Edit
} from 'lucide-react';
import { User as UserType, Vehicle } from '../types';

interface ProfileTabProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
  vehicle: Vehicle;
  onUpdateLimit: (limit: number) => void;
  onLogOut: () => void;
}

export default function ProfileTab({
  user,
  onUpdateUser,
  vehicle,
  onUpdateLimit,
  onLogOut
}: ProfileTabProps) {
  const [isEditingLimit, setIsEditingLimit] = useState<boolean>(false);
  const [tempLimit, setTempLimit] = useState<number>(vehicle.preferredChargingLimit);

  // Profile Edit states
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(user.name);
  const [tempEmail, setTempEmail] = useState<string>(user.email);

  const handleSaveLimit = () => {
    onUpdateLimit(tempLimit);
    setIsEditingLimit(false);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    onUpdateUser({
      ...user,
      name: tempName,
      email: tempEmail
    });
    setIsEditingUser(false);
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7F8] text-dark-custom pb-24 animate-fade-in px-4 pt-4">
      
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/50 mb-4.5">
        {isEditingUser ? (
          <form onSubmit={handleSaveUser} className="space-y-4">
            <h3 className="text-xs font-bold text-[#16A365] uppercase tracking-widest">Profili Düzenle</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-[#69736E] uppercase mb-1">Ad Soyad</label>
                <input 
                  type="text"
                  required
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-[#F5F7F8] border border-gray-100 rounded-xl py-2 px-3 text-xs font-semibold focus:ring-2 focus:ring-[#16A365]/20 focus:outline-none text-[#18201D]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#69736E] uppercase mb-1">E-posta</label>
                <input 
                  type="email"
                  required
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="w-full bg-[#F5F7F8] border border-gray-100 rounded-xl py-2 px-3 text-xs font-semibold focus:ring-2 focus:ring-[#16A365]/20 focus:outline-none text-[#18201D]"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button 
                type="button"
                onClick={() => {
                  setTempName(user.name);
                  setTempEmail(user.email);
                  setIsEditingUser(false);
                }}
                className="py-1.5 px-3 bg-gray-100 text-gray-650 hover:bg-gray-200 text-xs font-extrabold rounded-lg cursor-pointer"
              >
                Vazgeç
              </button>
              <button 
                type="submit"
                className="py-1.5 px-4 bg-[#16A365] hover:bg-[#148f58] text-white text-xs font-extrabold rounded-lg shadow-sm cursor-pointer"
              >
                Kaydet
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4.5">
              {/* Profile picture placeholder with initials */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-teal-950 to-teal-850 flex items-center justify-center text-[#16A365] text-lg font-extrabold shadow-md ring-4 ring-emerald-500/10 shrink-0">
                {getInitials(user.name)}
              </div>
              
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-extrabold text-gray-900 leading-none">{user.name}</h2>
                  <div className="p-0.5 bg-emerald-50 text-emerald-custom rounded-full" title="Doğrulanmış Profil">
                    <UserCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-xs text-gray-400">{user.email}</p>
                <span className="text-[9px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full inline-block mt-1 font-mono">
                  Üyelik: {user.joinDate}
                </span>
              </div>
            </div>

            <button 
              onClick={() => {
                setTempName(user.name);
                setTempEmail(user.email);
                setIsEditingUser(true);
              }}
              className="p-2 bg-gray-50 text-gray-400 hover:text-[#16A365] hover:bg-[#EAF8F1] rounded-xl transition-all cursor-pointer border border-gray-100"
              title="Kullanıcı Adını Düzenle"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Vehicle Settings Card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/50 mb-4.5 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-custom rounded-xl">
              <Car className="w-4 h-4 fill-current" />
            </div>
            <span className="text-xs font-bold text-gray-900">Aktif Kayıtlı Araç</span>
          </div>
          <span className="text-[10px] text-emerald-custom font-extrabold uppercase tracking-widest">Tesla Model 3</span>
        </div>

        {/* Realistic drawing car silhouette inside clean slot */}
        <div className="bg-light-custom rounded-2xl p-4 flex items-center justify-between border border-gray-100">
          <div className="space-y-1">
            <h4 className="text-xs font-extrabold text-gray-900">Tesla Model 3 Long Range</h4>
            <p className="text-[11px] text-gray-400 font-mono">Plaka: 34 EV 2026</p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-custom bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5 w-fit">
              <Zap className="w-3 h-3 fill-emerald-custom" /> {vehicle.connectorType} Soket Girişi
            </div>
          </div>

          {/* Simple Vector Representation of Tesla */}
          <div className="w-24 h-12 bg-white rounded-lg flex items-center justify-center p-1.5 border border-gray-200/50">
            <svg viewBox="0 0 100 40" className="w-full h-full text-teal-950 fill-none" stroke="currentColor" strokeWidth="1.5">
              <path d="M 10,25 C 10,18 20,10 50,10 C 80,10 90,18 90,25 C 90,25 95,27 92,29 C 85,30 15,30 8,29 C 5,27 10,25 10,25 Z" strokeLinecap="round" />
              <circle cx="28" cy="28" r="5" fill="#F5F7F8" />
              <circle cx="72" cy="28" r="5" fill="#F5F7F8" />
              <path d="M 35,10 C 40,16 60,16 65,10" />
            </svg>
          </div>
        </div>

        {/* Technical specs of Model 3 */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-light-custom p-2.5 rounded-xl border border-gray-100">
            <span className="text-[9px] text-gray-400 block uppercase font-bold">Kapasite</span>
            <span className="font-extrabold text-[#115e59] block mt-1">{vehicle.batteryCapacityKwh} kWh</span>
          </div>

          <div className="bg-light-custom p-2.5 rounded-xl border border-gray-100">
            <span className="text-[9px] text-gray-400 block uppercase font-bold">Mevcut Şarj</span>
            <span className="font-extrabold text-emerald-custom block mt-1">%{vehicle.currentBatteryPercentage}</span>
          </div>

          <div className="bg-light-custom p-2.5 rounded-xl border border-gray-100">
            <span className="text-[9px] text-gray-400 block uppercase font-bold">Ort. Tüketim</span>
            <span className="font-extrabold text-gray-950 block mt-1">{vehicle.averageConsumptionKwh100km} kWh/100</span>
          </div>
        </div>

        {/* Interactive target charging slider threshold */}
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/60">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-emerald-800 flex items-center gap-1">
              <Battery className="w-4 h-4 text-emerald-600" />
              Tercih Edilen Şarj Sınırı
            </span>
            <span className="font-extrabold text-emerald-950 font-mono bg-white px-2 py-0.5 rounded-md shadow-sm border border-emerald-100">
              %{vehicle.preferredChargingLimit}
            </span>
          </div>

          {isEditingLimit ? (
            <div className="mt-3 space-y-3">
              <input 
                type="range" 
                min="60" max="100" step="5"
                value={tempLimit}
                onChange={(e) => setTempLimit(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-custom"
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-400 font-semibold italic">Pil sağlığı için %80 önerilir.</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditingLimit(false)}
                    className="py-1 px-2.5 bg-gray-200 text-gray-700 text-[10px] font-bold rounded-lg"
                  >
                    Vazgeç
                  </button>
                  <button 
                    onClick={handleSaveLimit}
                    className="py-1 px-2.5 bg-emerald-custom text-white text-[10px] font-bold rounded-lg"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] text-emerald-600/70 font-semibold italic">Uygulama şarj aşımı uyarı referansı</span>
              <button 
                onClick={() => { setTempLimit(vehicle.preferredChargingLimit); setIsEditingLimit(true); }}
                className="text-[10px] font-bold text-emerald- customs text-emerald-700 hover:underline cursor-pointer"
              >
                Yüzde Sınırını Güncelle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigations list settings item cells */}
      <div className="bg-white rounded-3xl p-4.5 shadow-sm border border-gray-100/50 space-y-0.5">
        {[
          { id: 'item_notifications', label: 'Bildirim Tercihleri', icon: Bell, actionText: 'Açık' },
          { id: 'item_payments', label: 'Ödeme Yöntemleri', icon: CreditCard, actionText: 'Mastercard ••• 42' },
          { id: 'item_favorites', label: 'Favori İstasyonlar', icon: Heart, actionText: '3 İstasyon' },
          { id: 'item_history', label: 'Geçmiş Şarjlar', icon: History, actionText: '12 seans' },
          { id: 'item_privacy', label: 'Veri ve Gizlilik', icon: ShieldCheck },
          { id: 'item_help', label: 'Yardım', icon: HelpCircle }
        ].map((cell) => {
          const CellIcon = cell.icon;
          return (
            <button
              key={cell.id}
              id={`profile-settings-${cell.id}`}
              onClick={() => alert(`"${cell.label}" ayarlar seçeneği simüle edildi. Prototype aşamasında bu işlem mock kalacaktır.`)}
              className="w-full py-3 px-2 hover:bg-gray-50 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-xl text-gray-400">
                  <CellIcon className="w-4 h-4" />
                </div>
                <span className="font-bold text-gray-800">{cell.label}</span>
              </div>

              <div className="flex items-center gap-1 text-gray-400">
                {cell.actionText && (
                  <span className="text-[10px] font-semibold text-gray-400">{cell.actionText}</span>
                )}
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}

        {/* Clear Exit / Sign out Button */}
        <button
          id="logout-btn"
          onClick={onLogOut}
          className="w-full py-3 px-2 hover:bg-rose-50 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer mt-2 text-rose-600 block border-t border-gray-100 pt-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-bold text-rose-600">Oturumu Kapat / Çıkış Yap</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>

    </div>
  );
}

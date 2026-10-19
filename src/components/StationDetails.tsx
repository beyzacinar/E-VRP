/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Zap, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Share2, 
  Heart, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Car,
  Check,
  ChevronLeft
} from 'lucide-react';
import { ChargingStation } from '../types';

interface StationDetailsProps {
  station: ChargingStation;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
  onSelectStationForCharging: (station: ChargingStation) => void;
}

export default function StationDetails({
  station,
  isFavorite,
  onToggleFavorite,
  onClose,
  onSelectStationForCharging
}: StationDetailsProps) {

  const handleShare = () => {
    alert(`${station.name} istasyon bilgileri panoya kopyalandı!`);
  };

  const handleDirections = () => {
    alert(`Yol tarifi başlatıldı. ${station.distanceKm} km uzağınızdaki ${station.name} istasyonuna yönlendiriliyorsunuz.`);
  };

  return (
    <div className="absolute inset-0 z-40 bg-light-custom overflow-y-auto no-scrollbar animate-fade-in flex flex-col pb-24 text-dark-custom">
      {/* Visual Hero Banner with static placeholder illustration representing standard high-tech dynamic EV charger structure */}
      <div className="relative w-full h-56 bg-gradient-to-r from-teal-950 to-teal-800 flex items-center justify-center p-6 text-white overflow-hidden">
        {/* Abstract design elements to look like advanced engineering nodes */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-emerald-500/20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-5 left-5 w-36 h-36 rounded-full bg-teal-400/15 blur-2xl"></div>

        {/* Back and actions header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <button 
            id="back-from-station-details-btn"
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            <button 
              id="share-station-btn"
              onClick={handleShare}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors cursor-pointer"
              title="Paylaş"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              id="toggle-fav-station-btn"
              onClick={() => onToggleFavorite(station.id)}
              className={`p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors cursor-pointer ${
                isFavorite ? 'text-rose-500 fill-rose-500' : 'text-white'
              }`}
              title="Favorilere Ekle"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Station Overlay Title */}
        <div className="z-10 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-emerald-custom flex items-center justify-center shadow-lg mb-2">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <h2 className="text-base font-bold px-4 tracking-tight leading-snug text-white font-display text-center">
            {station.name}
          </h2>
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 mt-1 block">
            AI TAHMİNLİ ŞARJ NOKTASI • {station.city}
          </span>
        </div>
      </div>

      {/* Primary content area */}
      <div className="p-4 flex flex-col gap-4 -mt-6 bg-white rounded-t-3xl shadow-xl z-20 flex-1">
        
        {/* Info pills (chips) */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-emerald-700" /> {station.maximumPower >= 50 ? 'DC Hızlı' : 'AC Normal'}
          </span>
          <span className="px-3 py-1 bg-teal-50 text-teal-800 text-xs font-semibold rounded-full border border-teal-100">
            {station.maximumPower} kW Maks. Güç
          </span>
          {station.connectorTypes.map((type) => (
            <span key={type} className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-semibold rounded-full border border-gray-200">
              {type}
            </span>
          ))}
        </div>

        {/* Live Occupancy Block */}
        <div className="bg-[#EAF8F1] rounded-2xl p-4 border border-emerald-100/60">
          <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-custom animate-pulse"></div>
              <span className="text-xs font-extrabold text-emerald-800">Doluluk Durumu</span>
            </div>
            <span className="text-xs font-bold text-emerald-900 bg-white px-2 py-0.5 rounded-md shadow-sm">
              {station.availableSockets}/{station.totalSockets} müsait
            </span>
          </div>

          {/* Segmented occupancy progress bar based on total sockets (segments are green if free, gray if busy) */}
          <div className="flex gap-1">
            {station.sockets.map((sock, i) => (
              <div 
                key={sock.id} 
                className={`h-2.5 flex-1 rounded-full ${
                  sock.isAvailable 
                    ? 'bg-emerald-custom animate-shimmer bg-gradient-to-r from-emerald-500 to-emerald-400' 
                    : 'bg-gray-300'
                }`}
                title={`Soket ${i+1}: ${sock.type} - ${sock.isAvailable ? 'Müsait' : 'Dolu'}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-2">
            <span>Soketler (DC 1-3, AC 4-6)</span>
            <span>Görselleştirilmiş Anlık Akış</span>
          </div>
        </div>

        {/* Technical metrics spreadsheet list */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-light-custom p-3.5 rounded-2xl flex flex-col justify-between border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Tahmini Bekleme</span>
            </div>
            <span className="text-sm font-extrabold text-gray-900 mt-1">
              {station.estimatedWaitMinutes} dk
            </span>
            <span className="text-[9px] text-gray-400 mt-0.5">AI Tahmini Sırada Bekleme</span>
          </div>

          <div className="bg-light-custom p-3.5 rounded-2xl flex flex-col justify-between border border-gray-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Fiyat Tarifesi</span>
            </div>
            <span className="text-sm font-extrabold text-emerald-custom mt-1">
              ₺{station.pricePerKwh}/kWh
            </span>
            {station.hasNightDiscount && (
              <span className="text-[9px] text-emerald-600 font-bold mt-0.5">
                Gece %{station.nightDiscountPercentage} İndirimli
              </span>
            )}
          </div>
        </div>

        {/* Deep details specs list */}
        <div className="space-y-3.5 border-t border-b border-gray-100 py-4 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-semibold">Çalışma Saatleri</span>
            <span className="font-extrabold text-gray-800">{station.operatingHours}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-semibold">Uzaklık</span>
            <span className="font-extrabold text-gray-800">{station.distanceKm} km</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-semibold">Kullanıcı Puanı</span>
            <span className="font-extrabold text-[#f59e0b] flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#f59e0b]" /> {station.rating}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-semibold">İstasyon Güvenilirliği</span>
            <span className="font-extrabold text-emerald-600 block bg-emerald-50 px-2 py-0.5 rounded">
              %{station.reliabilityScore} Başarı
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-gray-500 font-semibold mt-0.5">Otopark Ücreti</span>
            <span className="font-semibold text-gray-700 class text-right max-w-[200px]">
              {station.parkingFeeInfo}
            </span>
          </div>
        </div>

        {/* Available sockets breakdown list */}
        <div>
          <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wider">İSTASYONDAKİ TOPLAM SOKETLER</h4>
          <div className="space-y-2">
            {station.sockets.map((sock) => (
              <div 
                key={sock.id} 
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                  sock.isAvailable 
                    ? 'bg-white border-emerald-100 hover:border-emerald-200' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    sock.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">{sock.socketNumber}</span>
                    <span className="text-[10px] text-gray-400 block">{sock.type} • {sock.powerKw} kW</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-emerald-custom block">₺{sock.pricePerKwh}/kWh</span>
                  <span className={`text-[10px] font-bold ${
                    sock.isAvailable ? 'text-emerald-600' : 'text-gray-500'
                  }`}>
                    {sock.isAvailable ? 'Müsait' : 'Kullanımda'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Station Amenities List */}
        <div>
          <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wider">İSTASYON VE ÇEVRE OLANAKLARI</h4>
          <div className="flex flex-wrap gap-1.5">
            {station.amenities.map((amenity) => (
              <span key={amenity} className="px-2.5 py-1 bg-light-custom text-gray-600 text-xs rounded-lg border border-gray-200/50">
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Sticky bottoms action panel */}
        <div className="flex gap-2.5 pt-4">
          <button
            id="station-get-directions-btn"
            onClick={handleDirections}
            className="flex-1 py-3 px-4 bg-teal-50 hover:bg-teal-100 text-teal-custom font-bold text-xs rounded-xl border border-teal-100 transition-colors cursor-pointer"
          >
            Yol Tarifi Al
          </button>
          
          <button
            id="station-choose-charge-btn"
            onClick={() => onSelectStationForCharging(station)}
            className="flex-1 py-3 px-4 bg-emerald-custom hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-700/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            Şarj İstasyonunu Seç
          </button>
        </div>
      </div>
    </div>
  );
}

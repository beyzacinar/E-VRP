/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Navigation, 
  Layers, 
  Plus, 
  Minus, 
  Maximize2, 
  Compass, 
  Search, 
  ArrowUpDown, 
  SlidersHorizontal,
  Info,
  Clock,
  BatteryCharging,
  Eye
} from 'lucide-react';
import { ChargingStation, MapMarker } from '../types';
import { MOCK_MAP_MARKERS, MOCK_STATIONS } from '../data';

interface MapProps {
  onSelectStation: (station: ChargingStation) => void;
  onOpenDetails: () => void;
  selectedStation: ChargingStation | null;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  onOpenOptimization: () => void;
  startRoute: () => void;
}

export default function Map({
  onSelectStation,
  onOpenDetails,
  selectedStation,
  activeFilter,
  setActiveFilter,
  onOpenOptimization,
  startRoute
}: MapProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(13);
  const [isSwapped, setIsSwapped] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('Maslak, İstanbul');
  const [isRecentered, setIsRecentered] = useState<boolean>(true);

  // Filter markers based on selected connector type
  const filteredMarkers = MOCK_MAP_MARKERS.filter(marker => {
    const station = MOCK_STATIONS.find(s => s.id === marker.stationId);
    if (!station) return true;
    
    if (activeFilter === 'Tümü') return true;
    if (activeFilter === 'DC Hızlı' && station.maximumPower >= 50) return true;
    if (activeFilter === 'AC Normal' && station.maximumPower < 50) return true;
    if (activeFilter === 'Tesla' && station.connectorTypes.includes('Tesla')) return true;
    if (activeFilter === 'CCS' && station.connectorTypes.includes('CCS')) return true;
    if (activeFilter === 'CHAdeMO' && station.connectorTypes.includes('CHAdeMO')) return true;
    return true;
  });

  const handleMarkerClick = (marker: MapMarker) => {
    setIsRecentered(false);
    const station = MOCK_STATIONS.find(s => s.id === marker.stationId);
    if (station) {
      onSelectStation(station);
    }
  };

  const handleRecenter = () => {
    setIsRecentered(true);
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] md:h-full min-h-[480px] bg-[#032F2E] overflow-hidden select-none animate-fade-in flex flex-col">
      {/* Starting and ending destination search card */}
      <div className="absolute top-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-teal-950/10 text-dark-custom">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-custom border-2 border-white ring-2 ring-emerald-500/30"></div>
            <div className="w-0.5 h-8 border-l border-dashed border-gray-300"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white ring-2 ring-red-500/30"></div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <div className="relative">
              <span className="text-[10px] text-gray-400 absolute top-0.5 left-0 uppercase tracking-widest font-semibold">BAŞLANGIÇ</span>
              <input 
                type="text" 
                readOnly 
                value={isSwapped ? searchQuery : "Mevcut Konumunuz"}
                className="w-full text-xs font-semibold text-gray-800 pt-4 pb-0.5 border-b border-gray-100 focus:outline-none"
              />
            </div>
            <div className="relative">
              <span className="text-[10px] text-gray-400 absolute top-0.5 left-0 uppercase tracking-widest font-semibold">VARLIŞ HEDEFİ</span>
              <input 
                type="text" 
                value={isSwapped ? "Mevcut Konumunuz" : searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold text-gray-800 pt-4 pb-0.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pl-2 border-l border-gray-100">
            <button 
              id="swap-locations-btn"
              onClick={() => setIsSwapped(!isSwapped)}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-emerald-custom transition-transform active:scale-95 cursor-pointer"
              title="Konumları Değiştir"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
            <button 
              id="open-optimization-btn"
              onClick={onOpenOptimization}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-emerald-custom transition-transform active:scale-95 cursor-pointer"
              title="Kriter Filtreleri"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar mt-3 pt-3 border-t border-gray-100">
          {['Tümü', 'DC Hızlı', 'AC Normal', 'Tesla', 'CCS', 'CHAdeMO'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 text-[11px] font-medium rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeFilter === filter
                  ? 'bg-emerald-custom text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Styled Responsive Vector Dark Mode Map */}
      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
        {/* SVG background mimicking roads, water, green areas */}
        <svg id="vector-map-bg" className="w-full h-full object-cover select-none pointer-events-none" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#044543" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#022120" stopOpacity="0.8" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGlow)" />
          
          {/* Subtle Grid Lines */}
          <g stroke="#ffffff" strokeOpacity="0.03" strokeWidth="0.5">
            {[...Array(20)].map((_, i) => (
              <line key={`v-${i}`} x1={i * 25} y1="0" x2={i * 25} y2="600" />
            ))}
            {[...Array(30)].map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 25} x2="400" y2={i * 25} />
            ))}
          </g>

          {/* Bosphorus Water / Coastline representation */}
          <path d="M -50,450 C 100,420 180,350 220,290 C 260,230 330,120 450,80 L 450,650 L -50,650 Z" fill="#021c1b" opacity="0.9" stroke="#003533" strokeWidth="1" />
          
          {/* Bosphorus Bridge line */}
          <line x1="195" y1="324" x2="255" y2="350" stroke="#0f766e" strokeWidth="2.5" opacity="0.6" strokeDasharray="3 3" />
          <text x="210" y="315" fill="#0f766e" fontSize="8" opacity="0.8" transform="rotate(23 210 315)">15 Temmuz Şehitler Köprüsü</text>

          {/* Green areas / Parks representation */}
          <path d="M 30,50 Q 80,40 120,80 Q 90,140 40,110 Z" fill="#0a3e2c" opacity="0.3" p-id="1" />
          <path d="M 280,200 Q 320,180 340,240 Q 310,280 270,230 Z" fill="#0a3e2c" opacity="0.3" p-id="1" />

          {/* Major Highways / Route lines */}
          {/* Main roads */}
          <path d="M 10,500 L 150,430 L 210,310 L 250,150 L 320,30" fill="none" stroke="#0b4541" strokeWidth="6" opacity="0.4" />
          <path d="M 100,580 L 160,400 L 280,300 L 380,210" fill="none" stroke="#0b4541" strokeWidth="4" opacity="0.3" />
          
          {/* Recommended Route Blue line layer */}
          <path 
            id="route-polyline"
            d="M 50,450 L 110,370 L 170,250 L 260,180 L 320,80" 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.95" 
          />
          <path 
            d="M 50,450 L 110,370 L 170,250 L 260,180 L 320,80" 
            fill="none" 
            stroke="#67e8f9" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.8" 
          />

          {/* Labels for landmarks */}
          <text x="325" y="70" fill="#a1a1aa" fontSize="9" fontWeight="bold" opacity="0.8">Maslak, İST (Bitiş)</text>
          <text x="40" y="470" fill="#a1a1aa" fontSize="9" fontWeight="bold" opacity="0.8">Kadıköy (Başlangıç)</text>
          <text x="210" y="165" fill="#3f5e5b" fontSize="8">Levent İş Kuleleri</text>
        </svg>

        {/* --- Interactive HTML DOM Element Markers Overlaid --- */}
        {/* Current User Starting location marker with blue pulse effect */}
        <div 
          className="absolute"
          style={{ left: '50px', top: '450px', transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full bg-emerald-500/30 animate-pulse-ring"></div>
            <div className="w-4 h-4 rounded-full bg-teal-300 border-2 border-[#032F2E] z-10 shadow-lg"></div>
          </div>
        </div>

        {/* Destination Location pin marker */}
        <div 
          className="absolute"
          style={{ left: '320px', top: '80px', transform: 'translate(-50%, -100%)' }}
        >
          <div className="relative flex flex-col items-center">
            <div className="px-2 py-1 bg-red-600 text-white text-[9px] font-bold rounded-md shadow-md z-10 whitespace-nowrap mb-1">
              HEDEF
            </div>
            <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg z-10">
              <Navigation className="w-2.5 h-2.5 text-white transform rotate-45" />
            </div>
            <div className="w-1.5 h-3 bg-red-500 -mt-1 rounded-full shadow-lg"></div>
          </div>
        </div>

        {/* Filtered Stations Markers */}
        {filteredMarkers.map((marker) => {
          // Dynamic calculation of position based on lat/lon
          // Scale formulas to fit reasonably around our route path
          const leftPercent = 100 + (marker.longitude - 29.02) * 2000;
          const topPercent = 250 - (marker.latitude - 41.06) * 2000;

          // Guard values to make sure markers appear properly inside map bounding box
          const xPos = Math.max(20, Math.min(380, leftPercent));
          const yPos = Math.max(140, Math.min(540, topPercent));

          const isSelected = selectedStation?.id === marker.stationId;

          // Colors
          const markerColors = {
            green: { bg: 'bg-emerald-500', border: 'border-emerald-300', text: 'text-emerald-500', ring: 'ring-emerald-500/20' },
            orange: { bg: 'bg-amber-500', border: 'border-amber-300', text: 'text-amber-500', ring: 'ring-amber-500/20' },
            red: { bg: 'bg-rose-500', border: 'border-rose-300', text: 'text-rose-500', ring: 'ring-rose-500/20' }
          }[marker.markerColor];

          return (
            <div
              key={marker.id}
              className={`absolute transition-all duration-300 ${isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-110'}`}
              style={{ left: `${xPos}px`, top: `${yPos}px`, transform: 'translate(-50%, -50%)' }}
            >
              <button
                id={`map-marker-${marker.stationId}`}
                onClick={() => handleMarkerClick(marker)}
                className={`flex flex-col items-center cursor-pointer focus:outline-none`}
              >
                {/* Visual Label showing occupancy percentage */}
                <div className={`px-1.5 py-0.5 rounded shadow text-[9px] font-medium transition-all ${
                  isSelected 
                    ? 'bg-teal-custom text-white font-bold' 
                    : 'bg-black/80 text-white/90'
                } mb-1 whitespace-nowrap`}>
                  {marker.name.split(' ')[0]} %{marker.occupancyRate}
                </div>

                {/* Main Node/Circle representing the charger */}
                <div className={`w-8 h-8 rounded-full border-2 ${isSelected ? 'border-sky-300 scale-110 shadow-sky-500/50' : markerColors.border} ${markerColors.bg} flex items-center justify-center shadow-lg relative ${isSelected ? 'ring-4 ring-sky-300/30' : 'ring-2 ' + markerColors.ring}`}>
                  <span className="text-[11px] font-bold text-white font-mono">
                    {marker.markerNumber}
                  </span>
                  
                  {/* Miniature availability indicator dot */}
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${
                    marker.availableSockets > 0 ? 'bg-emerald-400' : 'bg-red-400'
                  }`} />
                </div>
              </button>
            </div>
          );
        })}

        {/* Compass, Reset, and Zoom Controls on Map */}
        <div className="absolute right-4 bottom-22 z-10 flex flex-col gap-2">
          <button
            id="recenter-map-btn"
            onClick={handleRecenter}
            className={`p-3 rounded-full shadow-lg border border-teal-950/20 text-white transition-all transform active:scale-90 cursor-pointer ${
              isRecentered ? 'bg-emerald-custom' : 'bg-teal-900/80 backdrop-blur-md'
            }`}
            title="Haritayı Merkezle"
          >
            <Compass className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col rounded-full bg-teal-900/80 backdrop-blur-md border border-teal-950/20 text-white shadow-lg overflow-hidden">
            <button
              id="zoom-in-btn"
              onClick={() => setZoomLevel(prev => Math.min(18, prev + 1))}
              className="p-3 border-b border-teal-950/10 hover:bg-teal-800/50 transition-colors active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button
              id="zoom-out-btn"
              onClick={() => setZoomLevel(prev => Math.max(10, prev - 1))}
              className="p-3 hover:bg-teal-800/50 transition-colors active:scale-95 cursor-pointer"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Route Sheet overlaid at bottom of map screen */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 p-4 pb-6 transition-all duration-300">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-3"></div>
        
        {/* Header containing Route summary or selected station peek */}
        {selectedStation ? (
          <div>
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                  Seçilen Şarj İstasyonu
                </span>
                <h3 className="font-bold text-gray-900 text-sm mt-1">
                  {selectedStation.name}
                </h3>
                <p className="text-[11px] text-gray-500 flex items-center gap-1">
                  {selectedStation.address}
                </p>
              </div>
              
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-custom block">
                  ₺{selectedStation.pricePerKwh}/kWh
                </span>
                <span className="text-[10px] sm:text-xs text-gray-400">
                  {selectedStation.maximumPower} kW DC Hızlı
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 bg-gray-50 p-2.5 rounded-xl text-center text-xs text-gray-700 my-3">
              <div>
                <span className="block text-[10px] text-gray-400">MESAFER</span>
                <span className="font-semibold">{selectedStation.distanceKm} km</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-400">DURUM</span>
                <span className="font-semibold text-emerald-600">
                  {selectedStation.availableSockets}/{selectedStation.totalSockets} Müsait
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-400">TAHMİNİ BEKLEME</span>
                <span className="font-semibold text-amber-600">
                  {selectedStation.estimatedWaitMinutes} dk
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-400">GÜVENİLİRLİK</span>
                <span className="font-semibold text-emerald-500">
                  %{selectedStation.reliabilityScore}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                id="view-station-info-btn"
                onClick={onOpenDetails}
                className="flex-1 py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-teal-custom font-semibold text-xs rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                İstasyon Detayını Gör
              </button>
              
              <button
                id="select-station-route-btn"
                onClick={startRoute}
                className="flex-1 py-2.5 px-4 bg-emerald-custom hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-700/20 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                İstasyona Rota Çiz
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900 text-sm">Önerilen Rota</span>
                <span className="px-2 py-0.5 bg-emerald-custom text-white text-[9px] font-extrabold rounded-md uppercase tracking-wider">
                  En İyi Seçenek
                </span>
              </div>
              <span className="text-[11px] text-emerald-custom font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                Dengeli Optimizasyon
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 bg-light-custom p-2.5 rounded-xl text-center text-xs text-gray-700 my-3">
              <div>
                <span className="block text-[10px] text-gray-400">SÜRE</span>
                <span className="font-semibold text-dark-custom">1 sa 45 dk</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-400">MESAFE</span>
                <span className="font-semibold text-dark-custom">78 km</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-400">MALİYET</span>
                <span className="font-semibold text-emerald-custom">₺285</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-400">BEKLEME</span>
                <span className="font-semibold text-amber-500">10 dk</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-400 font-bold">VARIŞ BATARYASI</span>
                <span className="font-bold text-emerald-600">%18</span>
              </div>
            </div>

            <button
              id="map-view-details-btn"
              onClick={onOpenDetails}
              className="w-full py-2.5 px-4 bg-emerald-custom hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-700/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              Rota Detaylarını Gör
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

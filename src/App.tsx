/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  MapPin, 
  Search, 
  TrendingUp, 
  User, 
  Zap, 
  Heart, 
  History, 
  Navigation, 
  ChevronRight, 
  Filter, 
  Settings, 
  SlidersHorizontal,
  Sliders,
  Check,
  AlertTriangle,
  WifiOff,
  BatteryCharging,
  CornerDownRight,
  ArrowRight,
  Loader2,
  RefreshCw,
  Compass,
  Map,
  X
} from 'lucide-react';
import { 
  User as UserType, 
  Vehicle as VehicleType, 
  ChargingStation, 
  RouteOption, 
  Notification, 
  OptimizationPreferences 
} from './types';
import { 
  INITIAL_USER, 
  INITIAL_VEHICLE, 
  MOCK_STATIONS, 
  MOCK_NOTIFICATIONS, 
  DEFAULT_PREFERENCES, 
  calculateWeightedRoutes 
} from './data';

import MapScreen from './components/Map';
import OptimizationModal from './components/OptimizationModal';
import StationDetails from './components/StationDetails';
import ActiveCharging from './components/ActiveCharging';
import StatisticsTab from './components/StatisticsTab';
import NotificationsTab from './components/NotificationsTab';
import ProfileTab from './components/ProfileTab';

export default function App() {
  // Navigation tabs
  // 'anasayfa' | 'harita' | 'sarj' | 'istatistik' | 'profil' | 'bildirimler' | 'rota_secenekleri' | 'istasyon_detay'
  const [activeTab, setActiveTab] = useState<string>('anasayfa');
  const [prevTab, setPrevTab] = useState<string>('anasayfa');

  // App-wide models
  const [user, setUser] = useState<UserType>(INITIAL_USER);
  const [vehicle, setVehicle] = useState<VehicleType>(INITIAL_VEHICLE);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [favorites, setFavorites] = useState<string[]>(['st_zorlu', 'st_maslak_no1']);
  
  // Map and optimization filter states
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('Tümü');
  const [optPrefs, setOptPrefs] = useState<OptimizationPreferences>(DEFAULT_PREFERENCES);
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route_proposed');
  
  // Active Charging states
  const [chargingStation, setChargingStation] = useState<ChargingStation | null>(null);
  const [chargingSocketId, setChargingSocketId] = useState<string>('');

  // Skeletons, calculates, simulated states
  const [isCalculatedRoute, setIsCalculatedRoute] = useState<boolean>(true);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);
  const [isLoadingStationDetails, setIsLoadingStationDetails] = useState<boolean>(false);
  const [searchDestination, setSearchDestination] = useState<string>('Maslak, İstanbul');

  // Simulator override state panel to review loaded, empty and error views
  // 'normal' | 'no_compat_station' | 'no_route' | 'gps_denied' | 'data_unavailable' | 'loading' | 'network_error'
  const [simulateState, setSimulateState] = useState<string>('normal');
  const [isSimulatorPanelOpen, setIsSimulatorPanelOpen] = useState<boolean>(false);
  const [isOptimizationOpen, setIsOptimizationOpen] = useState<boolean>(false);

  // Recalculate routes on preferences change
  useEffect(() => {
    const updated = calculateWeightedRoutes(optPrefs, vehicle.connectorType);
    setRouteOptions(updated);
  }, [optPrefs, vehicle.connectorType]);

  // Navigate to tab wrapper
  const navigateTo = (tab: string) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
    if (tab === 'harita') {
      setIsOptimizationOpen(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = (stationId: string) => {
    if (favorites.includes(stationId)) {
      setFavorites(favorites.filter(id => id !== stationId));
    } else {
      setFavorites([...favorites, stationId]);
    }
  };

  const handleMarkNotification =(id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllNotifications = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleStartSearchingRoute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsCalculatingRoute(true);
    
    // Simulate smart AI routing calculation
    setTimeout(() => {
      setIsCalculatingRoute(false);
      navigateTo('rota_secenekleri');
    }, 1800);
  };

  const handleSelectStationOnMap = (station: ChargingStation) => {
    setSelectedStation(station);
  };

  const handleOpenDetailsDirectNode = (station: ChargingStation) => {
    setIsLoadingStationDetails(true);
    setSelectedStation(station);
    setTimeout(() => {
      setIsLoadingStationDetails(false);
      navigateTo('istasyon_detay');
    }, 800);
  };

  const handleSelectStationForCharging = (station: ChargingStation) => {
    setChargingStation(station);
    setChargingSocketId(station.sockets[0]?.id || 's1');
    navigateTo('sarj');
  };

  const handleStopCharging = (summary: { addedKwh: number; cost: number; finalSoh: number }) => {
    // Stop simulation and update vehicle SoC
    setVehicle({
      ...vehicle,
      currentBatteryPercentage: summary.finalSoh,
      estimatedRangeKm: Math.round(summary.finalSoh * 4.0) // recalculate estimated range (e.g. 80% = 320km)
    });
    setChargingStation(null);
    alert(`Şarj başarılı bir şekilde durduruldu!\nEklenen Enerji: ${summary.addedKwh} kWh\nToplam Tutar: ₺${summary.cost}\nGüvenli sürüşler dileriz.`);
    navigateTo('anasayfa');
  };

  const handleUpdateLimit = (newLimit: number) => {
    setVehicle({
      ...vehicle,
      preferredChargingLimit: newLimit
    });
  };

  const handleLogOut = () => {
    alert("Oturum kapatıldı. EVRP'yi kullandığınız için teşekkürler!");
  };

  // Get current selected route option
  const activeRouteOption = routeOptions.find(r => r.id === selectedRouteId) || routeOptions[0];

  const unreadAlertsCount = notifications.filter(n => !n.isRead).length;

  const renderAnasayfaContent = (isSidebar = false) => {
    return (
      <div className={`space-y-4 animate-fade-in text-dark-custom ${isSidebar ? '' : 'p-4 pb-20'}`}>
        {/* Top user header */}
        <div className="flex justify-between items-center pt-2">
          <div className="space-y-0.5">
            <h2 className="text-[10px] font-semibold text-[#69736E] uppercase tracking-wider block">KULLANICI</h2>
            <h1 className="text-xl font-bold font-display text-[#18201D] leading-tight">Merhaba, {user.name} 👋</h1>
          </div>
          
          <button 
            id="home-notifications-btn"
            onClick={() => navigateTo('bildirimler')}
            className="w-10 h-10 bg-[#EAF8F1] text-[#16A365] rounded-full flex items-center justify-center transition-all relative cursor-pointer hover:bg-emerald-100"
          >
            <Bell className="w-5 h-5 animate-none" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>

        {/* Registered Vehicle diagnostics card (High Density Dark Theme styling) */}
        <div className="bg-[#032F2E] bg-gradient-to-br from-[#032f2e] to-[#021f1e] rounded-3xl p-5 text-white overflow-hidden relative shadow-lg">
          {/* Decorative background vehicle representing the electric grid */}
          <div className="absolute -right-4 -bottom-3 opacity-15 pointer-events-none text-white select-none">
            <svg className="w-32 h-20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
          </div>

          <div className="flex justify-between items-start z-10 relative">
            <div className="flex flex-col">
              <span className="text-xs opacity-70 mb-1 font-medium">{vehicle.modelName}</span>
              <span className="text-3xl font-bold italic tracking-tighter">%{vehicle.currentBatteryPercentage}</span>
              <span className="text-[10px] opacity-60 uppercase tracking-widest mt-1">{vehicle.estimatedRangeKm} KM MENZİL</span>
            </div>
            <span className="text-[9px] opacity-45 font-mono">BATARYA: {vehicle.batteryCapacityKwh} kWh</span>
          </div>

          <div className="h-2 bg-white/20 rounded-full mt-6 overflow-hidden">
            <div 
              className="h-full bg-[#16A365] rounded-full" 
              style={{ width: `${vehicle.currentBatteryPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Destination planning block */}
        <form onSubmit={handleStartSearchingRoute} className="space-y-4 mb-6">
          <p className="text-sm font-bold text-[#18201D]">Nereye gidiyorsunuz?</p>
          
          <div className="relative">
            <span className="absolute left-3.5 top-3.5 text-[#16A365]"><Search className="w-4 h-4" /></span>
            <input 
              type="text" 
              value={searchDestination} 
              onChange={(e) => setSearchDestination(e.target.value)}
              className="w-full bg-[#F5F7F8] border border-gray-100 rounded-2xl py-3 pl-10 pr-12 text-sm font-medium focus:ring-2 focus:ring-[#16A365]/20 text-[#18201D] placeholder:text-gray-400 focus:outline-none"
              placeholder="Kadıköy, İstanbul"
            />
            
            <button 
              type="button"
              onClick={() => setSearchDestination('Kadıköy, İstanbul')}
              className="absolute right-2 top-2 p-1.5 bg-[#EAF8F1] rounded-lg text-[#16A365] hover:bg-emerald-100 cursor-pointer"
              title="Önerilen Konum: Kadıköy"
            >
              <MapPin className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="submit"
            id="home-search-submit-btn"
            className="w-full py-3 bg-[#16A365] hover:bg-[#148f58] text-white text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer block text-center"
          >
            Rota Hesaplamayı Başlat
          </button>
        </form>

        {/* Quick Actions Matrix */}
        <div>
          <p className="text-xs font-bold text-[#69736E] uppercase mb-3 tracking-widest">Hızlı İşlemler</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { id: 'act_1', label: 'Yakındaki İstasyonlar', icon: MapPin, tab: 'harita' },
              { id: 'act_2', label: 'Akıllı Rota Planlama', icon: Navigation, tab: 'harita' },
              { id: 'act_3', label: 'Favori İstasyonlar', icon: Heart, tab: 'profil' },
              { id: 'act_4', label: 'Geçmiş Rotalar', icon: History, tab: 'profil' }
            ].map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => {
                    if (act.tab === 'harita') {
                      setSelectedStation(null);
                    }
                    navigateTo(act.tab);
                  }}
                  className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:border-[#16A365] cursor-pointer transition-all text-left flex flex-col justify-between h-24"
                >
                  <div className="w-8 h-8 bg-[#EAF8F1] text-[#16A365] rounded-lg flex items-center justify-center mb-2">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-bold leading-tight text-gray-800">{act.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Recommendation */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-[#69736E] uppercase tracking-widest">Önerilen İstasyon</p>
            <button 
              onClick={() => navigateTo('harita')} 
              className="text-[10px] font-extrabold text-[#16A365] hover:underline"
            >
              Tümünü Gör
            </button>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 relative shadow-sm hover:shadow-md transition-shadow">
            
            <button 
              onClick={() => handleToggleFavorite('st_zorlu')}
              className={`absolute top-4 right-4 p-1.5 rounded-lg transition-all cursor-pointer ${
                favorites.includes('st_zorlu') 
                  ? 'bg-rose-50 text-rose-500' 
                  : 'bg-gray-50 text-gray-400 hover:text-gray-600'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favorites.includes('st_zorlu') ? 'fill-current' : ''}`} />
            </button>

            <div className="w-12 h-12 bg-[#F5F7F8] text-[#16A365] rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xs border border-gray-100">
              ZC
            </div>
            
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-bold text-[#18201D] pr-6">Zorlu Center AVM</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] font-semibold text-[#69736E]">
                <span className="bg-[#16A365]/10 text-[#16A365] px-1.5 py-0.5 rounded">DC Hızlı</span>
                <span>1.2 km</span>
                <span>₺7,25/kWh</span>
              </div>
              
              <div className="grid grid-cols-4 gap-1.5 bg-[#F5F7F8] p-2 rounded-xl text-center text-[10px] mt-3 font-semibold text-gray-600">
                <div>
                  <span className="block text-[8px] text-gray-400 font-bold uppercase">FİYAT</span>
                  <span className="font-extrabold text-[#16A365]">₺7,25</span>
                </div>
                <div>
                  <span className="block text-[8px] text-gray-400 font-bold uppercase">BEKLEME</span>
                  <span className="font-extrabold text-amber-500">5-10dk</span>
                </div>
                <div>
                  <span className="block text-[8px] text-gray-400 font-bold uppercase">GÜÇ</span>
                  <span className="font-extrabold text-gray-800">150kW</span>
                </div>
                <div>
                  <span className="block text-[8px] text-gray-400 font-bold uppercase">DURUM</span>
                  <span className="font-extrabold text-emerald-600">3/6 Boş</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                <button
                  id="home-station-recommender-details-btn"
                  onClick={() => handleOpenDetailsDirectNode(MOCK_STATIONS[0])}
                  className="flex-1 py-1.5 px-2 bg-teal-50 hover:bg-teal-100 text-teal-950 font-bold text-[10px] rounded-lg transition-colors cursor-pointer text-center"
                >
                  Detaylar
                </button>
                <button
                  id="home-station-recommender-charge-btn"
                  onClick={() => handleSelectStationForCharging(MOCK_STATIONS[0])}
                  className="flex-1 py-1.5 px-2 bg-[#16A365] hover:bg-[#148f58] text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer text-center shadow-sm"
                >
                  Şarj Et
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7F8] flex items-center justify-center p-0 md:p-6 text-dark-custom select-none antialiased font-sans">
      
      {/* High Density Desktop Dashboard Card or Responsive Fullmobile Container */}
      <div className="w-full max-w-6xl h-full md:h-[768px] bg-[#F5F7F8] md:rounded-[32px] md:shadow-2xl md:border md:border-gray-200/50 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* LEFT COMPANION SIDEBAR - Always Visible on Desktop Panels */}
        <aside className="hidden md:flex w-[320px] h-full bg-white border-r border-gray-200 flex-col p-5 shadow-sm z-20 shrink-0 overflow-y-auto no-scrollbar">
          {renderAnasayfaContent(true)}
        </aside>

        {/* CENTRAL VIEWPORT CHANNELS */}
        <div className="flex-1 h-full flex flex-col relative overflow-hidden bg-[#F5F7F8]">
          
          {/* Floating Developer App State Simulator Panel toggler */}
          <div className="absolute top-4 left-4 z-40">
            <button
              onClick={() => setIsSimulatorPanelOpen(!isSimulatorPanelOpen)}
              className="px-2.5 py-1 text-[9px] font-bold bg-[#032F2E] text-emerald-400 rounded-full shadow-lg border border-teal-800 flex items-center gap-1 opacity-85 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Settings className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
              Test Kontrol Paneli
            </button>

            {isSimulatorPanelOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-teal-950/95 backdrop-blur-md border border-teal-800 rounded-2xl p-3 shadow-2xl z-50 text-white animate-fade-in flex flex-col gap-1.5">
                <div className="flex justify-between items-center border-b border-teal-900 pb-1.5 mb-1.5">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">MOCK STATE OVERRIDES</span>
                  <button onClick={() => setIsSimulatorPanelOpen(false)} className="text-gray-400 hover:text-white"><X className="w-3.5 h-3.5" /></button>
                </div>

                {[
                  { id: 'normal', name: 'Normal (Hatasız)' },
                  { id: 'no_compat_station', name: 'İstasyon Bulunamadı' },
                  { id: 'no_route', name: 'Rota Bulunamadı' },
                  { id: 'gps_denied', name: 'Konum Reddedildi' },
                  { id: 'data_unavailable', name: 'Veri Çekme Hatası' },
                  { id: 'network_error', name: 'Ağ Bağlantı Hatası' },
                  { id: 'loading', name: 'Skeleton Yükleniyor' }
                ].map((state) => (
                  <button
                    key={state.id}
                    onClick={() => { setSimulateState(state.id); setIsSimulatorPanelOpen(false); }}
                    className={`text-[10px] py-1 px-2 rounded text-left font-semibold transition-colors flex items-center justify-between ${
                      simulateState === state.id ? 'bg-emerald-600 text-white' : 'hover:bg-teal-900 text-gray-300'
                    }`}
                  >
                    <span>{state.name}</span>
                    {simulateState === state.id && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div id="app-viewport-body" className="flex-1 overflow-y-auto no-scrollbar pb-24 md:pb-0 relative h-full bg-[#F5F7F8]">
            
            {/* 1. SKELETON LOADER STATE */}
            {simulateState === 'loading' && (
              <div className="p-5 space-y-4 animate-pulse h-full flex flex-col justify-center">
                <div className="flex justify-between items-center">
                  <div className="h-8 w-1/3 bg-gray-200 rounded-lg"></div>
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-44 bg-gray-200 rounded-3xl"></div>
                <div className="h-12 bg-gray-200 rounded-2xl w-3/4"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
                <p className="text-center text-xs text-gray-400 italic pt-4">Akıllı şarj istasyon verileri yükleniyor...</p>
              </div>
            )}

            {/* 2. EXCEPTION AND STATUS STATES */}
            {simulateState === 'no_compat_station' && (
              <div className="p-6 text-center flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100">
                  <Zap className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900 leading-none">Uyumlu Şarj İstasyonu Bulunamadı</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                  Seçtiğiniz soket filtrelerine (<strong>{optPrefs.preferredConnector}</strong>) ve seyahat koşullarına uygun bir şarj istasyonu bulunamadı. Lütfen rota kriterlerini gevşetiniz.
                </p>
                <button 
                  onClick={() => { setOptPrefs({ ...optPrefs, preferredConnector: 'Tümü' }); setSimulateState('normal'); }}
                  className="mt-2 py-2 px-6 bg-emerald-custom text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer"
                >
                  Filtreyi Temizle (Soket: Tümü)
                </button>
              </div>
            )}

            {simulateState === 'no_route' && (
              <div className="p-6 text-center flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                  <Navigation className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900 leading-none">Uygun Alternatif Rota Bulunamadı</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                  Süreçte beklenmeyen yol kapamaları veya batarya pil seviyenizin (%{vehicle.currentBatteryPercentage}) çok düşük olması nedeniyle hedef konuma ulaşan güvenli bir rota çizilemedi.
                </p>
                <button 
                  onClick={() => setSimulateState('normal')}
                  className="mt-2 py-2.5 px-6 bg-[#032F2E] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Alternatif Haritayı Zorla
                </button>
              </div>
            )}

            {simulateState === 'gps_denied' && (
              <div className="p-6 text-center flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center border border-gray-200">
                  <Compass className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900 leading-none">Konum İzni Reddedildi</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                  Cihazınızda GPS ve konum izni onaylanmadığı için başlangıç konumunuz tespit edilemiyor. Çevrenizdeki şarj noktalarını göstermek için lütfen izin verin.
                </p>
                <button 
                  onClick={() => setSimulateState('normal')}
                  className="mt-2 py-2.5 px-6 bg-[#16A365] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Konum İznini Yeniden İste
                </button>
              </div>
            )}

            {simulateState === 'data_unavailable' && (
              <div className="p-6 text-center flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <AlertTriangle className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900 leading-none">İstasyon Bilgisi Alınamadı</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                  Zorlu Center istasyonu anlık soket doluluk veri akışında kesintiler yaşanmaktadır. Bilgiler kısa süre içerisinde otomatik güncellenecektir.
                </p>
                <button 
                  onClick={() => setSimulateState('normal')}
                  className="mt-2 py-2 px-5 bg-emerald-custom text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Yeniden Dene
                </button>
              </div>
            )}

            {simulateState === 'network_error' && (
              <div className="p-6 text-center flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                  <WifiOff className="w-8 h-8 opacity-50" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900 leading-none">Ağ Bağlantı Hatası</h3>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                  Sunucuyla iletişim kurulamıyor. İnternet bağlantınızı kontrol edip lütfen tekrar deneyiniz. EVRP çevrimdışı verilerle sınırlı çalışabilir.
                </p>
                <button 
                  onClick={() => setSimulateState('normal')}
                  className="mt-2 py-2 px-6 bg-teal-custom text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Bağlantıyı Yenile
                </button>
              </div>
            )}

            {/* 3. NORMAL CHANNELS FLOW */}
            {simulateState === 'normal' && (
              <>
              {/* SCREEN 1: ANA SAYFA */}
              {activeTab === 'anasayfa' && (
                <div className="md:hidden">
                  {renderAnasayfaContent(false)}
                </div>
              )}

              {/* SCREEN 2: AKILLI ROTA OLUŞTURMA & HARİTA */}
              {activeTab === 'harita' && (
                <div className="relative w-full h-full">
                  <MapScreen
                    onSelectStation={handleSelectStationOnMap}
                    onOpenDetails={() => {
                      if (selectedStation) {
                        handleOpenDetailsDirectNode(selectedStation);
                      } else {
                        // Default to proposed route details
                        handleOpenDetailsDirectNode(MOCK_STATIONS[0]);
                      }
                    }}
                    selectedStation={selectedStation}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    onOpenOptimization={() => setIsOptimizationOpen(true)}
                    startRoute={() => {
                      setIsCalculatingRoute(true);
                      setTimeout(() => {
                        setIsCalculatingRoute(false);
                        navigateTo('rota_secenekleri');
                      }, 1200);
                    }}
                  />
                  
                  {/* Optimization Modal overlaid */}
                  <OptimizationModal
                    isOpen={isOptimizationOpen}
                    onClose={() => setIsOptimizationOpen(false)}
                    preferences={optPrefs}
                    onSave={(prefs) => {
                      setOptPrefs(prefs);
                      setIsOptimizationOpen(false);
                      alert('Rotalar seçtiğiniz çok kriterli ağırlık önceliklerine göre yeniden hesaplandı!');
                    }}
                  />
                </div>
              )}

              {/* SCREEN 3: ROTA SEÇENEKLERİ */}
              {activeTab === 'rota_secenekleri' && (
                <div className="p-4 space-y-4 animate-fade-in text-dark-custom">
                  {/* Header bar */}
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => navigateTo('harita')} 
                      className="px-2.5 py-1.5 bg-white text-[10px] font-bold text-gray-700 hover:text-emerald-custom rounded-xl shadow-sm border border-gray-100 cursor-pointer"
                    >
                      ← Haritaya Dön
                    </button>
                    <div>
                      <h2 className="text-base font-extrabold text-gray-900 text-center leading-none">Rota Seçenekleri</h2>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 block text-center">Çok Kriterli Sonuç Sıralaması</span>
                    </div>
                    <button 
                      onClick={() => alert(`Kriter ayar ağırlıkları: Zaman ${optPrefs.timeWeight}%, Maliyet ${optPrefs.costWeight}%`)}
                      className="p-1.5 bg-white text-gray-450 border border-gray-100 hover:text-emerald-custom rounded-lg shadow-sm cursor-pointer"
                      title="Aktif Kriter Özetleri"
                    >
                      <Sliders className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Small preset weight banner */}
                  <div className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold p-2.5 rounded-xl border border-emerald-100 flex justify-between items-center">
                    <span>Ağırlıklı Optimizasyon Modu: <strong>{optPrefs.presetMode}</strong></span>
                    <button 
                      onClick={() => navigateTo('harita')} 
                      className="text-[9px] font-bold text-teal-800 hover:underline"
                    >
                      Ağırlıkları Değiştir
                    </button>
                  </div>

                  {/* Route cards display */}
                  <div className="space-y-3">
                    {routeOptions.map((route) => {
                      const isSelected = selectedRouteId === route.id;
                      const hasRecommendedTag = route.tags.includes('Dengeli') || route.id === 'route_proposed';

                      return (
                        <div
                          key={route.id}
                          id={`route-option-card-${route.id}`}
                          onClick={() => setSelectedRouteId(route.id)}
                          className={`p-4 rounded-3xl border text-xs relative transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-white border-emerald-custom ring-1 ring-emerald-500/20 shadow-md shadow-emerald-500/[0.04]' 
                              : 'bg-white border-gray-100/50 hover:bg-gray-50/80 shadow-sm opacity-90'
                          }`}
                        >
                          {/* Selection Check icon badge */}
                          {isSelected && (
                            <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-emerald-custom text-white flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}

                          <div className="space-y-2">
                            {/* Route Name and Tags */}
                            <div className="flex gap-1.5 flex-wrap items-center">
                              <h3 className="font-extrabold text-sm text-gray-900 leading-none">
                                {route.name}
                              </h3>
                              {route.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-light-custom text-gray-600 text-[9px] font-bold rounded-md">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Main specifications spreadsheet layout */}
                            <div className="grid grid-cols-5 gap-1.5 text-center bg-gray-50 p-2 rounded-xl text-[10px] font-bold">
                              <div>
                                <span className="block text-[8px] text-gray-400">SÜRE</span>
                                <span className="font-extrabold text-gray-950 font-mono">
                                  {Math.floor(route.totalDurationMinutes / 60) > 0 
                                    ? `${Math.floor(route.totalDurationMinutes / 60)} sa ${route.totalDurationMinutes % 60} dk` 
                                    : `${route.totalDurationMinutes} dk`}
                                </span>
                              </div>
                              <div>
                                <span className="block text-[8px] text-gray-400">MESAFE</span>
                                <span className="font-extrabold text-gray-950 font-mono">{route.totalDistanceKm} km</span>
                              </div>
                              <div>
                                <span className="block text-[8px] text-gray-400">BEKLEME</span>
                                <span className="font-extrabold text-amber-500 font-mono">{route.estimatedWaitMinutes} dk</span>
                              </div>
                              <div>
                                <span className="block text-[8px] text-gray-400">MALİYET</span>
                                <span className="font-extrabold text-emerald-custom font-mono">₺{route.estimatedCostTry}</span>
                              </div>
                              <div>
                                <span className="block text-[8px] text-gray-400">VARLIŞ ŞARJ</span>
                                <span className="font-extrabold text-emerald-600 font-mono">%{route.expectedArrivalBatteryPercentage}</span>
                              </div>
                            </div>

                            {/* Reason / statement of recommendation */}
                            <p className="text-[11px] text-gray-500 leading-relaxed text-secondary-custom">
                              {route.reason}
                            </p>

                            {route.stationStop && (
                              <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                                <span className="flex items-center gap-1">
                                  <CornerDownRight className="w-3 h-3 text-emerald-custom" />
                                  Önerilen Durak: <strong>{route.stationStop.name.split(' ')[0]} AVM</strong>
                                </span>
                                <span>{route.stationStop.maximumPower} kW DC Hızlı</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Main bottom checkout action button */}
                  <div className="bg-white rounded-3xl p-4.5 border border-gray-100/30 shadow-lg flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase font-bold">SEÇİLEN SEÇENEK MALİYETİ</span>
                        <span className="text-sm font-extrabold text-emerald-custom block">₺{activeRouteOption.estimatedCostTry} Tahmini</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-gray-400 uppercase font-bold">VARACAK KAPASİTE</span>
                        <span className="text-sm font-extrabold text-emerald-600 block">%{activeRouteOption.expectedArrivalBatteryPercentage} Expected</span>
                      </div>
                    </div>

                    <button
                      id="start-route-action-btn"
                      onClick={() => {
                        if (activeRouteOption.stationStop) {
                          handleSelectStationForCharging(activeRouteOption.stationStop);
                        } else {
                          handleSelectStationForCharging(MOCK_STATIONS[0]);
                        }
                      }}
                      className="w-full py-3 bg-emerald-custom hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer block text-center"
                    >
                      Sürüşü ve Rotayı Başlat
                    </button>
                  </div>
                </div>
              )}

              {/* SCREEN 5: ŞARJ İSTASYONU DETAYI */}
              {activeTab === 'istasyon_detay' && selectedStation && (
                <StationDetails
                  station={selectedStation}
                  isFavorite={favorites.includes(selectedStation.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onClose={() => navigateTo(prevTab === 'istasyon_detay' ? 'harita' : prevTab)}
                  onSelectStationForCharging={handleSelectStationForCharging}
                />
              )}

              {/* SCREEN 6: AKTİF ŞARJ SİMÜLATÖRÜ */}
              {activeTab === 'sarj' && chargingStation && (
                <ActiveCharging
                  station={chargingStation}
                  selectedSocketId={chargingSocketId}
                  onStopCharging={handleStopCharging}
                />
              )}

              {/* SCREEN 7: İSTATİSTİKLER TAB */}
              {activeTab === 'istatistik' && (
                <StatisticsTab />
              )}

              {/* SCREEN 8: BİLDİRİMLER TAB */}
              {activeTab === 'bildirimler' && (
                <NotificationsTab
                  userName={user.name}
                  notifications={notifications}
                  onMarkAsRead={handleMarkNotification}
                  onMarkAllAsRead={handleMarkAllNotifications}
                />
              )}

              {/* SCREEN 9: PROFİL VE ARAÇ AYARLARI TAB */}
              {activeTab === 'profil' && (
                <ProfileTab
                  user={user}
                  onUpdateUser={setUser}
                  vehicle={vehicle}
                  onUpdateLimit={handleUpdateLimit}
                  onLogOut={handleLogOut}
                />
              )}
            </>
          )}

        </div>

        {/* --- CENTRAL BOTTOM TabBar NAVIGATION ENGINE --- */}
        {/* Only hide on active charging screen for full atmospheric dark immersive feeling */}
        {!(activeTab === 'sarj' && chargingStation && simulateState === 'normal') && (
          <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-100 px-3 py-2.5 shadow-xl flex items-center justify-around text-center select-none shrink-0">
            
            {/* Tab 1: Ana Sayfa */}
            <button
              id="nav-tab-anasayfa"
              onClick={() => { setSimulateState('normal'); navigateTo('anasayfa'); }}
              className={`flex-1 flex flex-col items-center gap-1 py-1.5 transition-colors cursor-pointer ${
                activeTab === 'anasayfa' ? 'text-emerald-custom' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="text-center relative">
                <Compass className="w-5 h-5 mx-auto" />
              </div>
              <span className="text-[10px] font-bold">Ana Sayfa</span>
            </button>

            {/* Tab 2: Harita */}
            <button
              id="nav-tab-harita"
              onClick={() => { setSimulateState('normal'); setSelectedStation(null); navigateTo('harita'); }}
              className={`flex-1 flex flex-col items-center gap-1 py-1.5 transition-colors cursor-pointer ${
                activeTab === 'harita' ? 'text-emerald-custom' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="text-center relative">
                <Map className="w-5 h-5 mx-auto" />
              </div>
              <span className="text-[10px] font-bold">Harita</span>
            </button>

            {/* Tab 3: HIGHLIGHTED CHARGING BUTTON CENTER */}
            <div className="relative -mt-6">
              <button
                id="nav-tab-central-charging"
                onClick={() => {
                  setSimulateState('normal');
                  handleSelectStationForCharging(MOCK_STATIONS[0]);
                }}
                className="w-12 h-12 rounded-full bg-emerald-custom text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/30 flex items-center justify-center transform active:scale-90 hover:scale-105 transition-all cursor-pointer z-40 border-4 border-white"
                title="Şarj Başlat"
              >
                <BatteryCharging className="w-5 h-5 text-white fill-white animate-pulse" />
              </button>
            </div>

            {/* Tab 4: İstatistik */}
            <button
              id="nav-tab-istatistik"
              onClick={() => { setSimulateState('normal'); navigateTo('istatistik'); }}
              className={`flex-1 flex flex-col items-center gap-1 py-1.5 transition-colors cursor-pointer ${
                activeTab === 'istatistik' ? 'text-emerald-custom' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="text-center">
                <TrendingUp className="w-5 h-5 mx-auto" />
              </div>
              <span className="text-[10px] font-bold">İstatistik</span>
            </button>

            {/* Tab 5: Profil */}
            <button
              id="nav-tab-profil"
              onClick={() => { setSimulateState('normal'); navigateTo('profil'); }}
              className={`flex-1 flex flex-col items-center gap-1 py-1.5 transition-colors cursor-pointer ${
                activeTab === 'profil' ? 'text-emerald-custom' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="text-center">
                <User className="w-5 h-5 mx-auto" />
              </div>
              <span className="text-[10px] font-bold">Profil</span>
            </button>
          </div>
        )}

        </div>

      </div>
      
      {/* Route being Calculated Loading Modal popups */}
      {isCalculatingRoute && (
        <div className="fixed inset-0 z-50 bg-[#032F2E]/70 backdrop-blur-md flex items-center justify-center p-6 text-white text-center">
          <div className="space-y-4 max-w-xs flex flex-col items-center bg-teal-950 p-6 rounded-3xl border border-teal-800 animate-fade-in shadow-2xl">
            <Loader2 className="w-10 h-10 text-emerald-custom animate-spin" />
            <h3 className="text-base font-extrabold tracking-tight">Akıllı Rota Hesaplanıyor...</h3>
            <p className="text-xs text-teal-300/80 leading-relaxed">
              Yapay zeka motoru, yol eğimini, kalan %{vehicle.currentBatteryPercentage} bataryayı ve istasyon bekleme sürelerini analiz ederek en optimize rotayı derliyor.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

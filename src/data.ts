/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  User, 
  Vehicle, 
  ChargingStation, 
  RouteOption, 
  Notification, 
  StatisticsData,
  OptimizationPreferences,
  MapMarker
} from './types';

export const INITIAL_USER: User = {
  id: 'usr_sude',
  name: 'Beyza',
  email: 'sude.yilmaz@gmail.com',
  joinDate: 'Eylül 2024'
};

export const INITIAL_VEHICLE: Vehicle = {
  id: 'veh_tesla3',
  brand: 'Tesla',
  model: 'Model 3 Long Range',
  batteryCapacityKwh: 60,
  currentBatteryPercentage: 62,
  estimatedRangeKm: 248,
  averageConsumptionKwh100km: 16.2,
  preferredChargingLimit: 80,
  connectorType: 'CCS'
};

export const MOCK_STATIONS: ChargingStation[] = [
  {
    id: 'st_zorlu',
    name: 'Zorlu Center AVM Şarj İstasyonu',
    address: 'Zorlu Center - Levent, Beşiktaş / İstanbul',
    latitude: 41.0652,
    longitude: 29.0175,
    distanceKm: 1.2,
    occupancyRate: 50, // %50 Dolu
    totalSockets: 6,
    availableSockets: 3,
    estimatedWaitMinutes: 10,
    pricePerKwh: 7.25,
    maximumPower: 150, // kW
    connectorTypes: ['CCS', 'CHAdeMO', 'Type 2'],
    operatingHours: '7/24 Açık',
    reliabilityScore: 94,
    rating: 4.6,
    amenities: ['Wifi', 'Otopark', 'Restoran', 'Kahve', 'Alışveriş'],
    lastUpdated: '2 dk önce',
    city: 'İstanbul',
    hasNightDiscount: true,
    nightDiscountPercentage: 15,
    parkingFeeInfo: 'AVM otopark tarifesi geçerlidir (İlk 3 saat ücretsiz).',
    sockets: [
      { id: 'sk_zorlu1', type: 'CCS', powerKw: 150, pricePerKwh: 7.25, isAvailable: true, socketNumber: '1. Soket' },
      { id: 'sk_zorlu2', type: 'CCS', powerKw: 150, pricePerKwh: 7.25, isAvailable: false, socketNumber: '2. Soket' },
      { id: 'sk_zorlu3', type: 'CCS', powerKw: 150, pricePerKwh: 7.25, isAvailable: true, socketNumber: '3. Soket' },
      { id: 'sk_zorlu4', type: 'CHAdeMO', powerKw: 100, pricePerKwh: 6.90, isAvailable: true, socketNumber: '4. Soket' },
      { id: 'sk_zorlu5', type: 'Type 2', powerKw: 22, pricePerKwh: 5.50, isAvailable: false, socketNumber: '5. Soket' },
      { id: 'sk_zorlu6', type: 'Type 2', powerKw: 22, pricePerKwh: 5.50, isAvailable: false, socketNumber: '6. Soket' }
    ]
  },
  {
    id: 'st_maslak_no1',
    name: 'Maslak No1 Plaza Şarj İstasyonu',
    address: 'Maslak Mah. Dereboyu Cad. No:1, Sarıyer / İstanbul',
    latitude: 41.1121,
    longitude: 29.0205,
    distanceKm: 3.4,
    occupancyRate: 15, // %15 Dolu
    totalSockets: 6,
    availableSockets: 5,
    estimatedWaitMinutes: 0,
    pricePerKwh: 7.80,
    maximumPower: 200, // kW Ultra hızlı
    connectorTypes: ['CCS', 'Tesla'],
    operatingHours: '7/24 Açık',
    reliabilityScore: 98,
    rating: 4.8,
    amenities: ['Wifi', 'Kahve', 'Güvenlik', 'Dinlenme Odası'],
    lastUpdated: '1 dk önce',
    city: 'İstanbul',
    hasNightDiscount: true,
    nightDiscountPercentage: 10,
    parkingFeeInfo: 'Şarj süresince otopark ücretsiz.',
    sockets: [
      { id: 'sk_maslak1', type: 'CCS', powerKw: 200, pricePerKwh: 7.80, isAvailable: true, socketNumber: '1. Soket' },
      { id: 'sk_maslak2', type: 'CCS', powerKw: 200, pricePerKwh: 7.80, isAvailable: true, socketNumber: '2. Soket' },
      { id: 'sk_maslak3', type: 'Tesla', powerKw: 250, pricePerKwh: 7.50, isAvailable: true, socketNumber: '3. Soket' },
      { id: 'sk_maslak4', type: 'Tesla', powerKw: 250, pricePerKwh: 7.50, isAvailable: true, socketNumber: '4. Soket' },
      { id: 'sk_maslak5', type: 'CCS', powerKw: 200, pricePerKwh: 7.80, isAvailable: true, socketNumber: '5. Soket' },
      { id: 'sk_maslak6', type: 'CCS', powerKw: 200, pricePerKwh: 7.80, isAvailable: false, socketNumber: '6. Soket' }
    ]
  },
  {
    id: 'st_nautilus',
    name: 'Kadıköy Tepe Nautilus Şarj İstasyonu',
    address: 'Acıbadem Mah. Fatih Sok. No:1, Kadıköy / İstanbul',
    latitude: 41.0022,
    longitude: 29.0354,
    distanceKm: 8.5,
    occupancyRate: 70, // %70 Dolu
    totalSockets: 6,
    availableSockets: 2,
    estimatedWaitMinutes: 15,
    pricePerKwh: 6.95,
    maximumPower: 120,
    connectorTypes: ['CCS', 'CHAdeMO', 'Type 2'],
    operatingHours: '10:00 - 22:00',
    reliabilityScore: 89,
    rating: 4.2,
    amenities: ['Alışveriş', 'Restoran', 'WC', 'Otopark'],
    lastUpdated: '5 dk önce',
    city: 'İstanbul',
    hasNightDiscount: false,
    parkingFeeInfo: 'AVM otoparkı ücretsizdir.',
    sockets: [
      { id: 'sk_nautilus1', type: 'CCS', powerKw: 120, pricePerKwh: 6.95, isAvailable: true, socketNumber: '1. Soket' },
      { id: 'sk_nautilus2', type: 'CCS', powerKw: 120, pricePerKwh: 6.95, isAvailable: false, socketNumber: '2. Soket' },
      { id: 'sk_nautilus3', type: 'CHAdeMO', powerKw: 80, pricePerKwh: 6.50, isAvailable: false, socketNumber: '3. Soket' },
      { id: 'sk_nautilus4', type: 'Type 2', powerKw: 22, pricePerKwh: 4.80, isAvailable: true, socketNumber: '4. Soket' },
      { id: 'sk_nautilus5', type: 'Type 2', powerKw: 22, pricePerKwh: 4.80, isAvailable: false, socketNumber: '5. Soket' },
      { id: 'sk_nautilus6', type: 'Type 2', powerKw: 22, pricePerKwh: 4.80, isAvailable: false, socketNumber: '6. Soket' }
    ]
  },
  {
    id: 'st_akasya',
    name: 'Akasya AVM Şarj Noktası',
    address: 'Acıbadem, Çeçen Sk., Üsküdar / İstanbul',
    latitude: 41.0011,
    longitude: 29.0560,
    distanceKm: 9.8,
    occupancyRate: 85, // %85 Dolu
    totalSockets: 6,
    availableSockets: 1,
    estimatedWaitMinutes: 20,
    pricePerKwh: 7.40,
    maximumPower: 120,
    connectorTypes: ['CCS', 'Type 2'],
    operatingHours: '7/24 Açık',
    reliabilityScore: 91,
    rating: 4.5,
    amenities: ['Alışveriş', 'Yemek', 'Çocuk Parkı', 'Wifi'],
    lastUpdated: '4 dk önce',
    city: 'İstanbul',
    hasNightDiscount: true,
    nightDiscountPercentage: 12,
    parkingFeeInfo: 'Şarj işlemlerini ibraz edenlere ilk 3 saat ücretsiz.',
    sockets: [
      { id: 'sk_akasya1', type: 'CCS', powerKw: 120, pricePerKwh: 7.40, isAvailable: false, socketNumber: '1. Soket' },
      { id: 'sk_akasya2', type: 'CCS', powerKw: 120, pricePerKwh: 7.40, isAvailable: false, socketNumber: '2. Soket' },
      { id: 'sk_akasya3', type: 'CCS', powerKw: 120, pricePerKwh: 7.40, isAvailable: true, socketNumber: '3. Soket' },
      { id: 'sk_akasya4', type: 'Type 2', powerKw: 22, pricePerKwh: 5.20, isAvailable: false, socketNumber: '4. Soket' },
      { id: 'sk_akasya5', type: 'Type 2', powerKw: 22, pricePerKwh: 5.20, isAvailable: false, socketNumber: '5. Soket' },
      { id: 'sk_akasya6', type: 'Type 2', powerKw: 22, pricePerKwh: 5.20, isAvailable: false, socketNumber: '6. Soket' }
    ]
  },
  {
    id: 'st_istinye',
    name: 'İstinyePark Alışveriş Merkezi',
    address: 'Pınar Mah. Katar Cad. No:73, Sarıyer / İstanbul',
    latitude: 41.1118,
    longitude: 29.0270,
    distanceKm: 4.8,
    occupancyRate: 95, // %95 Dolu
    totalSockets: 6,
    availableSockets: 0,
    estimatedWaitMinutes: 25,
    pricePerKwh: 7.30,
    maximumPower: 175,
    connectorTypes: ['CCS', 'CHAdeMO'],
    operatingHours: '10:00 - 22:00',
    reliabilityScore: 92,
    rating: 4.4,
    amenities: ['Alışveriş', 'Gurme Kafe', 'WC', 'Vale'],
    lastUpdated: '3 dk önce',
    city: 'İstanbul',
    hasNightDiscount: false,
    parkingFeeInfo: 'İlk 3 saat ücretsiz otopark.',
    sockets: [
      { id: 'sk_istinye1', type: 'CCS', powerKw: 175, pricePerKwh: 7.30, isAvailable: false, socketNumber: '1. Soket' },
      { id: 'sk_istinye2', type: 'CCS', powerKw: 175, pricePerKwh: 7.30, isAvailable: false, socketNumber: '2. Soket' },
      { id: 'sk_istinye3', type: 'CHAdeMO', powerKw: 100, pricePerKwh: 6.80, isAvailable: false, socketNumber: '3. Soket' },
      { id: 'sk_istinye4', type: 'CCS', powerKw: 175, pricePerKwh: 7.30, isAvailable: false, socketNumber: '4. Soket' },
      { id: 'sk_istinye5', type: 'CCS', powerKw: 175, pricePerKwh: 7.30, isAvailable: false, socketNumber: '5. Soket' },
      { id: 'sk_istinye6', type: 'CCS', powerKw: 175, pricePerKwh: 7.30, isAvailable: false, socketNumber: '6. Soket' }
    ]
  },
  {
    id: 'st_vadistanbul',
    name: 'Vadistanbul AVM Şarj İstasyonu',
    address: 'Ayazağa Mah. Cendere Cad. D Blok, Sarıyer / İstanbul',
    latitude: 41.1068,
    longitude: 28.9880,
    distanceKm: 5.2,
    occupancyRate: 25, // %25 Dolu
    totalSockets: 6,
    availableSockets: 5,
    estimatedWaitMinutes: 5,
    pricePerKwh: 7.10,
    maximumPower: 200,
    connectorTypes: ['CCS', 'Tesla', 'Type 2'],
    operatingHours: '7/24 Açık',
    reliabilityScore: 96,
    rating: 4.7,
    amenities: ['Kafeler', 'Yürüyüş Alanı', 'Nakit Noktası', 'Sinema', 'Park'],
    lastUpdated: 'Şimdi güncellendi',
    city: 'İstanbul',
    hasNightDiscount: true,
    nightDiscountPercentage: 20,
    parkingFeeInfo: 'Şarj süresince otopark ücretsizdir.',
    sockets: [
      { id: 'sk_vadi1', type: 'CCS', powerKw: 200, pricePerKwh: 7.10, isAvailable: true, socketNumber: '1. Soket' },
      { id: 'sk_vadi2', type: 'CCS', powerKw: 200, pricePerKwh: 7.10, isAvailable: true, socketNumber: '2. Soket' },
      { id: 'sk_vadi3', type: 'Tesla', powerKw: 250, pricePerKwh: 6.95, isAvailable: true, socketNumber: '3. Soket' },
      { id: 'sk_vadi4', type: 'Type 2', powerKw: 22, pricePerKwh: 4.90, isAvailable: true, socketNumber: '4. Soket' },
      { id: 'sk_vadi5', type: 'Type 2', powerKw: 22, pricePerKwh: 4.90, isAvailable: true, socketNumber: '5. Soket' },
      { id: 'sk_vadi6', type: 'CCS', powerKw: 200, pricePerKwh: 7.10, isAvailable: false, socketNumber: '6. Soket' }
    ]
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'not_1',
    title: 'Şarj Fiyatı Güncellemesi',
    message: 'Planladığınız istasyonda (Zorlu Center AVM) yoğunluk nedeniyle anlık birim fiyat güncellendi.',
    timestamp: '5 dk önce',
    isRead: false,
    type: 'info'
  },
  {
    id: 'not_2',
    title: 'Yoğunluk Uyarısı',
    message: 'Planladığınız İstinyePark istasyonunda doluluk arttı. Bekleme süresi 25 dakikaya yükseldi.',
    timestamp: '15 dk önce',
    isRead: false,
    type: 'alert'
  },
  {
    id: 'not_3',
    title: 'Daha Hızlı Rota Önerisi',
    message: 'Alternatif rota Maslak No1 Plaza üzerinden 12 dakika daha hızlı. Rotayı güncelleyebilirsiniz.',
    timestamp: '30 dk önce',
    isRead: true,
    type: 'success'
  },
  {
    id: 'not_4',
    title: 'Gece İndirimi Başladı!',
    message: 'Zorlu Center ve Vadistanbul istasyonlarında %15-%20 varan gece indirimi saatleri başladı.',
    timestamp: '1 sa önce',
    isRead: true,
    type: 'promo'
  },
  {
    id: 'not_5',
    title: 'Şarj Tamamlandı',
    message: 'Dünkü şarj işleminiz %80 seviyesine başarıyla ulaştı ve güvenle sonlandırıldı.',
    timestamp: '1 gün önce',
    isRead: true,
    type: 'success'
  }
];

export const MOCK_STATISTICS: StatisticsData = {
  energyConsumption: [
    { date: '1 May', consumptionKwh: 12 },
    { date: '3 May', consumptionKwh: 16 },
    { date: '5 May', consumptionKwh: 10 },
    { date: '8 May', consumptionKwh: 22 },
    { date: '11 May', consumptionKwh: 14 },
    { date: '15 May', consumptionKwh: 18 },
    { date: '18 May', consumptionKwh: 28 },
    { date: '21 May', consumptionKwh: 15 },
    { date: '24 May', consumptionKwh: 11 },
    { date: '27 May', consumptionKwh: 20 },
    { date: '29 May', consumptionKwh: 23 },
    { date: '31 May', consumptionKwh: 16 }
  ],
  monthlyCost: [
    { date: '1 May', costTry: 85 },
    { date: '5 May', costTry: 160 },
    { date: '10 May', costTry: 240 },
    { date: '15 May', costTry: 190 },
    { date: '20 May', costTry: 290 },
    { date: '25 May', costTry: 210 },
    { date: '29 May', costTry: 340 }
  ],
  totalEnergyKwh: 245,
  totalCostTry: 1280,
  totalChargingHoursMinutes: '14 sa 35 dk',
  usedStationsCount: 12,
  co2SavedKg: 48.6
};

// Base route options corresponding to four optimization strategies before weighting modifications.
// Sude leaves with %62 battery (60kWh * 0.62 = 37.2kWh) in her Tesla Model 3.
// Destinations and routes have normalized variables for optimization calculation.
export const BASE_ROUTE_OPTIONS: RouteOption[] = [
  {
    id: 'route_proposed',
    name: 'Önerilen Rota',
    totalDurationMinutes: 105, // 1 sa 45 dk
    totalDistanceKm: 78,
    estimatedWaitMinutes: 10,
    estimatedCostTry: 285,
    expectedArrivalBatteryPercentage: 18,
    tags: ['Dengeli', '%62 batarya ile uygun'],
    reason: 'Bu rota; süre, maliyet ve bekleme süresi açısından en dengeli seçenektir.',
    stationStop: MOCK_STATIONS[0], // Zorlu Center
    normalizedTime: 0.25,
    normalizedDistance: 0.35,
    normalizedWait: 0.2,
    normalizedCost: 0.3,
    normalizedEnergy: 0.25,
    normalizedReliability: 0.06, // penalty (100 - 94 = 6)
    normalizedBatteryRisk: 0.15
  },
  {
    id: 'route_fastest',
    name: 'En Hızlı Rota',
    totalDurationMinutes: 80, // 1 sa 20 dk
    totalDistanceKm: 72,
    estimatedWaitMinutes: 25,
    estimatedCostTry: 310,
    expectedArrivalBatteryPercentage: 14,
    tags: ['En Hızlı', 'Daha az mesafe'],
    reason: 'Bu rota 25 dakika daha hızlıdır ancak bekleme süresi ve tahmini maliyeti daha yüksektir.',
    stationStop: MOCK_STATIONS[4], // Istinye Park (busy but fast charging / direct highway)
    normalizedTime: 0.0, // best
    normalizedDistance: 0.1,
    normalizedWait: 0.75, // worst wait
    normalizedCost: 0.65,
    normalizedEnergy: 0.15,
    normalizedReliability: 0.08,
    normalizedBatteryRisk: 0.3
  },
  {
    id: 'route_economic',
    name: 'En Ekonomik Rota',
    totalDurationMinutes: 125, // 2 sa 05 dk
    totalDistanceKm: 85,
    estimatedWaitMinutes: 15,
    estimatedCostTry: 210,
    expectedArrivalBatteryPercentage: 20,
    tags: ['En Ekonomik', 'En düşük maliyet'],
    reason: 'Bu rota en düşük şarj maliyetine ve daha yüksek varış batarya korumasına sahiptir.',
    stationStop: MOCK_STATIONS[2], // Nautilus (lower per kWh cost, slightly slower AC/DC mix)
    normalizedTime: 0.8,
    normalizedDistance: 0.7,
    normalizedWait: 0.4,
    normalizedCost: 0.0, // best cost
    normalizedEnergy: 0.45,
    normalizedReliability: 0.11,
    normalizedBatteryRisk: 0.1
  },
  {
    id: 'route_min_wait',
    name: 'En Az Bekleme Rotası',
    totalDurationMinutes: 115, // 1 sa 55 dk
    totalDistanceKm: 80,
    estimatedWaitMinutes: 5,
    estimatedCostTry: 295,
    expectedArrivalBatteryPercentage: 17,
    tags: ['En Kısa Bekleme', 'Boş İstasyonlar'],
    reason: 'Bu rotadaki istasyonlarda bekleme riski en düşüktür ve şarj soketleri anında kullanılabilir.',
    stationStop: MOCK_STATIONS[1], // Maslak No1 (unoccupied, super high availability, 200kW)
    normalizedTime: 0.5,
    normalizedDistance: 0.45,
    normalizedWait: 0.05, // best wait
    normalizedCost: 0.5,
    normalizedEnergy: 0.3,
    normalizedReliability: 0.02,
    normalizedBatteryRisk: 0.2
  }
];

// Presets defaults dictionary matching criteria weights
export const PRESET_WEIGHTS: Record<
  string, 
  { time: number; cost: number; wait: number; distance: number; safety: number; reliability: number }
> = {
  'Dengeli': { time: 25, cost: 20, wait: 20, distance: 10, safety: 15, reliability: 10 },
  'En Hızlı': { time: 50, cost: 10, wait: 20, distance: 10, safety: 5, reliability: 5 },
  'En Ekonomik': { cost: 50, time: 15, wait: 10, distance: 10, safety: 10, reliability: 5 },
  'En Az Bekleme': { wait: 55, time: 20, cost: 10, distance: 5, safety: 5, reliability: 5 },
  'Batarya Güvenli': { safety: 45, reliability: 20, time: 10, cost: 10, wait: 10, distance: 5 }
};

export const DEFAULT_PREFERENCES: OptimizationPreferences = {
  timeWeight: 25,
  costWeight: 20,
  waitWeight: 20,
  distanceWeight: 10,
  batterySafetyWeight: 15,
  reliabilityWeight: 10,
  presetMode: 'Dengeli',
  minArrivalBattery: 15,
  preferredConnector: 'Tümü',
  maxAcceptableWaitMinutes: 30,
  avoidCrowdedStations: true,
  onlyShow247Stations: false
};

// Map nodes layout on a simple cartesian scale for visuals
export const MOCK_MAP_MARKERS: MapMarker[] = [
  {
    id: 'mk_1',
    name: 'Maslak No1 Plaza',
    latitude: 41.1121,
    longitude: 29.0205,
    occupancyRate: 25, // green: low occupancy (<30)
    totalSockets: 6,
    availableSockets: 5,
    markerColor: 'green',
    markerNumber: 1,
    stationId: 'st_maslak_no1'
  },
  {
    id: 'mk_2',
    name: 'Zorlu Center AVM',
    latitude: 41.0652,
    longitude: 29.0175,
    occupancyRate: 50, // orange: medium occupancy (30-80)
    totalSockets: 6,
    availableSockets: 3,
    markerColor: 'orange',
    markerNumber: 2,
    stationId: 'st_zorlu'
  },
  {
    id: 'mk_3',
    name: 'Vadistanbul AVM',
    latitude: 41.1068,
    longitude: 28.9880,
    occupancyRate: 15, // green
    totalSockets: 6,
    availableSockets: 5,
    markerColor: 'green',
    markerNumber: 3,
    stationId: 'st_vadistanbul'
  },
  {
    id: 'mk_4',
    name: 'Kadıköy Tepe Nautilus',
    latitude: 41.0022,
    longitude: 29.0354,
    occupancyRate: 70, // orange
    totalSockets: 6,
    availableSockets: 2,
    markerColor: 'orange',
    markerNumber: 4,
    stationId: 'st_nautilus'
  },
  {
    id: 'mk_5',
    name: 'Akasya AVM',
    latitude: 41.0011,
    longitude: 29.0560,
    occupancyRate: 85, // red: high occupancy (>80)
    totalSockets: 6,
    availableSockets: 1,
    markerColor: 'red',
    markerNumber: 5,
    stationId: 'st_akasya'
  },
  {
    id: 'mk_6',
    name: 'İstinyePark AVM',
    latitude: 41.1118,
    longitude: 29.0270,
    occupancyRate: 95, // red
    totalSockets: 6,
    availableSockets: 0,
    markerColor: 'red',
    markerNumber: 6,
    stationId: 'st_istinye'
  }
];

export function calculateWeightedRoutes(
  preferences: OptimizationPreferences, 
  userConnector: string
): RouteOption[] {
  const {
    timeWeight,
    costWeight,
    waitWeight,
    distanceWeight,
    batterySafetyWeight,
    reliabilityWeight,
    preferredConnector,
    minArrivalBattery,
    avoidCrowdedStations,
    onlyShow247Stations
  } = preferences;

  // Let's perform a mock scoring formula
  // routeScore = timeWeight * normTime + distanceWeight * normDist + waitWeight * normWait ...
  // Lower is better.
  let routes = BASE_ROUTE_OPTIONS.map(route => {
    // Add minor adjustment factor if is compat with connector and preference filter
    let compatibilityAdjustment = 0;
    if (preferredConnector !== 'Tümü' && route.stationStop) {
      const supportsPref = route.stationStop.connectorTypes.includes(preferredConnector as any);
      if (!supportsPref) {
        compatibilityAdjustment += 0.5; // heavy penalty if preferred connector is missing from station
      }
    }

    // Filter check violations could trigger high scoring weights
    let filterPenalty = 0;
    if (route.stationStop) {
      if (onlyShow247Stations && route.stationStop.operatingHours !== '7/24 Açık') {
        filterPenalty += 1.0;
      }
      if (avoidCrowdedStations && route.stationStop.occupancyRate >= 80) {
        filterPenalty += 0.6;
      }
      if (route.expectedArrivalBatteryPercentage < minArrivalBattery) {
        filterPenalty += 0.8; // battery safety violation
      }
    }

    // score calculation
    const score = 
      (timeWeight * route.normalizedTime) +
      (distanceWeight * route.normalizedDistance) +
      (waitWeight * route.normalizedWait) +
      (costWeight * route.normalizedCost) +
      (batterySafetyWeight * route.normalizedBatteryRisk) +
      (reliabilityWeight * route.normalizedReliability) +
      compatibilityAdjustment * 100 +
      filterPenalty * 100;

    return {
      ...route,
      // store direct score for comparison or debugging
      score
    };
  });

  // Sort routes ascending by score (lower score is better rank)
  // Let's return sorted list which we'll map inside UI
  return (routes as any).sort((a: any, b: any) => a.score - b.score);
}

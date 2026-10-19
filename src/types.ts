/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  profilePictureUrl?: string;
  joinDate: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  batteryCapacityKwh: number;
  currentBatteryPercentage: number;
  estimatedRangeKm: number;
  averageConsumptionKwh100km: number;
  preferredChargingLimit: number;
  connectorType: 'CCS' | 'Type 2' | 'Tesla' | 'CHAdeMO';
}

export type ConnectorType = 'CCS' | 'Type 2' | 'Tesla' | 'CHAdeMO';

export interface Connector {
  id: string;
  type: ConnectorType;
  powerKw: number;
  pricePerKwh: number;
  isAvailable: boolean;
  socketNumber: string;
}

export interface ChargingStation {
  id: string;
  name: string;
  address: string;
  latitude: number; // For plotting on mockup map
  longitude: number;
  distanceKm: number;
  occupancyRate: number; // e.g. 70 (%)
  totalSockets: number;
  availableSockets: number;
  estimatedWaitMinutes: number;
  pricePerKwh: number;
  maximumPower: number; // kW
  connectorTypes: ConnectorType[];
  operatingHours: string; // e.g. "7/24 Açık"
  reliabilityScore: number; // 0-100
  rating: number; // out of 5
  amenities: string[]; // e.g. ["Wifi", "Restoran", "Otopark"]
  lastUpdated: string; // e.g. "2 dk önce"
  sockets: Connector[];
  city: string;
  hasNightDiscount: boolean;
  nightDiscountPercentage?: number;
  parkingFeeInfo: string;
}

export interface RouteOption {
  id: string;
  name: string; // e.g. "Önerilen Rota", "En Hızlı Rota"
  totalDurationMinutes: number;
  totalDistanceKm: number;
  estimatedWaitMinutes: number;
  estimatedCostTry: number;
  expectedArrivalBatteryPercentage: number;
  tags: string[];
  reason: string;
  stationStop?: ChargingStation; // Recommended charging station along this route
  // Parameters used for mathematical evaluation matching multi-criteria weights
  normalizedTime: number; // 0 (best) to 1 (worst)
  normalizedDistance: number;
  normalizedWait: number;
  normalizedCost: number;
  normalizedEnergy: number;
  normalizedReliability: number;
  normalizedBatteryRisk: number;
}

export interface ChargingSession {
  id: string;
  stationName: string;
  socketNumber: string;
  durationSeconds: number;
  addedEnergyKwh: number;
  costTry: number;
  currentBatteryPercentage: number;
  chargingRateKw: number;
  estimatedFinishedTime: string;
  estimatedRangeKm: number;
  batteryTempCelsius: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'alert' | 'success' | 'promo';
}

export interface OptimizationPreferences {
  timeWeight: number; // 0-100
  costWeight: number;
  waitWeight: number;
  distanceWeight: number;
  batterySafetyWeight: number;
  reliabilityWeight: number;
  presetMode: 'Dengeli' | 'En Hızlı' | 'En Ekonomik' | 'En Az Bekleme' | 'Batarya Güvenli';
  minArrivalBattery: number; // default e.g. 15 (%)
  preferredConnector: 'CCS' | 'Tümü' | 'CHAdeMO' | 'Tesla' | 'Type 2';
  maxAcceptableWaitMinutes: number;
  avoidCrowdedStations: boolean;
  onlyShow247Stations: boolean;
}

export interface DayUsage {
  date: string;
  consumptionKwh: number;
}

export interface MonthCost {
  date: string;
  costTry: number;
}

export interface StatisticsData {
  energyConsumption: DayUsage[];
  monthlyCost: MonthCost[];
  totalEnergyKwh: number;
  totalCostTry: number;
  totalChargingHoursMinutes: string;
  usedStationsCount: number;
  co2SavedKg: number;
}

export interface MapMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  occupancyRate: number;
  totalSockets: number;
  availableSockets: number;
  markerColor: 'green' | 'orange' | 'red';
  markerNumber: number;
  stationId: string;
}

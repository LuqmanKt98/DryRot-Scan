
// FIX: Removed self-import of DOTInfo which was causing a conflict.

export interface DOTInfo {
  code: string;
  manufacturer: string;
  plantCode: string;
  week: number;
  year: number;
  age: number;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'error';
}

export type ScanStatus = 'Good' | 'Warning' | "Don't Buy";
export type TirePosition = 'Front Left' | 'Front Right' | 'Rear Left' | 'Rear Right' | 'General';
export type TireSide = 'Right Sidewall' | 'Left Sidewall' | 'Inside';

export interface ScanResult {
  status: ScanStatus;
  confidence: number; // 0-100
  dotInfo?: DOTInfo;
  image: string; // base64 image data
  analysis: {
    title: string;
    details: string;
  }[];
  tirePosition: TirePosition;
  tireSide: TireSide;
}

// Representing a saved scan record for a full vehicle
export interface ScanRecord {
  id: string;
  date: Date;
  title: string; 
  scans: ScanResult[];
  paid: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ChatSession {
  recordId: string;
  messages: ChatMessage[];
}

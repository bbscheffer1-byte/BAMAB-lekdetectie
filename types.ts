export interface ReportData {
  clientName: string;
  address: string;
  city: string;
  date: string;
  referenceNumber: string;
  phone: string;
  email: string;
}

export interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  description: string;
}

export interface GeneratedReport {
  markdown: string;
  timestamp: number;
}

export interface SavedReport {
  id: string;
  clientName: string;
  referenceNumber: string;
  date: string; // The inspection date string
  timestamp: number; // Created at timestamp
  markdown: string;
}
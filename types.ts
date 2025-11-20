export enum AssetStatus {
  WORKING = 'Working',
  MAINTENANCE = 'Under Maintenance',
  ATTENTION_NEEDED = 'Attention Needed', // Based on "leakage" notes in PDF
  RETIRED = 'Retired'
}

export interface SparePart {
  name: string;
  materialOrMake?: string;
  quantity?: number;
}

export interface Asset {
  id: string;
  name: string;
  category: string; // Pump, Motor, Meter, Mixer, etc.
  model: string;
  make: string;
  quantity: number;
  specifications: Record<string, string>;
  status: AssetStatus;
  location: string; // e.g., "Raw Water Pump House", "Chemical House"
  notes: string;
  spareParts: SparePart[];
  installationDate: string; // Mocked
  warrantyExpDate: string; // Mocked
  lastServiceDate: string; // Mocked
  nextServiceDueDate: string; // Mocked
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
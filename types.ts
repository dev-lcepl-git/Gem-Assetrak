
export enum AssetStatus {
  WORKING = 'Working',
  MAINTENANCE = 'Under Maintenance',
  ATTENTION_NEEDED = 'Attention Needed',
  RETIRED = 'Retired'
}

export type UserRole = 'Admin' | 'Customer' | 'Operator' | 'Tester' | 'ServiceMan';

export interface SparePart {
  name: string;
  materialOrMake?: string;
  quantity?: number;
}

export interface ServiceRecord {
  id: string;
  date: string;
  type: 'Preventive' | 'Corrective' | 'Repair' | 'Inspection';
  performer: string;
  notes: string;
}

export interface Asset {
  id: string;
  name: string;
  category: string; // Pump, Motor, Meter, Mixer, Actuator, Sensor
  model: string;
  make: string;
  quantity: number;
  specifications: Record<string, string>;
  status: AssetStatus;
  location: string; // Kept for backward compatibility or display
  moduleId?: string;
  subModuleId?: string;
  notes: string;
  spareParts: SparePart[];
  installationDate: string; // YYYY-MM-DD
  warrantyExpDate: string; // YYYY-MM-DD
  lastServiceDate: string; // YYYY-MM-DD
  nextServiceDueDate: string; // YYYY-MM-DD
  imageUrl?: string; // Base64 string of the uploaded image
  serviceHistory?: ServiceRecord[];
}

export interface SubModule {
  id: string;
  name: string;
}

export interface Module {
  id: string;
  name: string;
  subModules: SubModule[];
}

export interface Project {
    id: string;
    name: string;
    assets: Asset[];
    modules: Module[];
    categories: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

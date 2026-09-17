export type PaintFinish = 'glossy' | 'matte' | 'metallic';
export type RimStyle = 'classic' | 'spyder' | 'aero' | 'gt3';
export type RoofType = 'coupe' | 'cabriolet' | 'targa';

export type CameraPreset = 
  | 'hero' 
  | 'front' 
  | 'side' 
  | 'rear' 
  | 'top' 
  | 'engine' 
  | 'wheel_detail' 
  | 'interior'
  | 'showroom_overview'
  | 'taycan_bay'
  | 'gt4_bay'
  | 'owner_desk';

export interface VehicleConfig {
  modelId: string;
  modelName: string;
  bodyColor: string;
  bodyColorName: string;
  finish: PaintFinish;
  rimStyle: RimStyle;
  rimColor: string;
  rimColorName: string;
  caliperColor: string;
  caliperColorName: string;
  interiorColor: string;
  interiorColorName: string;
  spoilerActive: boolean;
  headlightsOn: boolean;
  doorsOpen: boolean;
  explodedView: boolean;
  roofType: RoofType;
  selectedPackage: 'Standard' | 'Sport Chrono' | 'Weissach Lightweight';
}

export interface ShowroomVehicle {
  id: string;
  name: string;
  tagline: string;
  basePrice: number;
  vin: string;
  status: 'Center Stage' | 'Showroom Bay A' | 'Showroom Bay B' | 'Factory Allocation';
  color: string;
  colorName: string;
  finish: PaintFinish;
  power: string;
  acceleration: string;
  topSpeed: string;
  drivetrain: string;
  position: [number, number, number];
  rotation: number;
}

export interface ClientPersona {
  id: string;
  name: string;
  role: string;
  budget: string;
  primaryInterest: string;
  preference: string;
}

export interface TradeInEstimate {
  year: number;
  make: string;
  model: string;
  mileage: number;
  condition: 'Excellent' | 'Good' | 'Fair';
  estimatedValue: number;
  allowanceApplied: boolean;
}

export interface FinanceStructure {
  mode: 'lease' | 'finance' | 'cash';
  downPayment: number;
  termMonths: number;
  interestRate: number;
  residualValue: number;
  monthlyPayment: number;
  tradeInCredit: number;
  totalOutflow: number;
}

export interface VehicleSpecs {
  engine: string;
  horsepower: string;
  torque: string;
  acceleration: string;
  topSpeed: string;
  weight: string;
  drivetrain: string;
  transmission: string;
}

export interface OptionPrice {
  name: string;
  category: 'paint' | 'wheels' | 'caliper' | 'package' | 'interior';
  price: number;
}

export interface QuoteBreakdown {
  basePrice: number;
  options: OptionPrice[];
  destinationCharge: number;
  totalPrice: number;
  estimatedDelivery: string;
}

export interface ToolCallExecution {
  name: string;
  args: Record<string, any>;
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolCalls?: ToolCallExecution[];
  speaker?: 'Marcus (Owner AI Clone)' | 'Client' | 'Concierge';
}

export interface ColorPreset {
  name: string;
  hex: string;
  finish: PaintFinish;
  category: 'Standard' | 'Metallic' | 'Special Heritage' | 'PTS Custom';
}

export interface RimPreset {
  id: RimStyle;
  name: string;
  description: string;
  price: number;
}

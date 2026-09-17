import { ColorPreset, RimPreset, VehicleConfig, VehicleSpecs, QuoteBreakdown } from '../types';

export const PORSCHE_MODELS = [
  {
    id: '911_carrera_gts',
    name: 'Porsche 911 Carrera GTS',
    tagline: 'T-Hybrid Precision Beast',
    basePrice: 164900,
    specs: {
      engine: '3.6L Twin-Turbo Boxer-6 with T-Hybrid e-turbo & electric motor',
      horsepower: '532 hp (398 kW)',
      torque: '449 lb-ft @ 1,950-5,000 rpm',
      acceleration: '0-60 mph in 2.9 seconds',
      topSpeed: '194 mph (312 km/h)',
      weight: '3,536 lbs',
      drivetrain: 'Rear-Wheel Drive with Rear-Axle Steering',
      transmission: '8-Speed Porsche Doppelkupplung (PDK)',
    }
  },
  {
    id: '911_gt3_rs',
    name: 'Porsche 911 GT3 RS',
    tagline: 'Track Weapon with DRS Active Aero',
    basePrice: 241300,
    specs: {
      engine: '4.0L Naturally Aspirated High-Revving Flat-6 (9,000 RPM)',
      horsepower: '518 hp (386 kW)',
      torque: '342 lb-ft @ 6,300 rpm',
      acceleration: '0-60 mph in 3.0 seconds',
      topSpeed: '184 mph (296 km/h with high downforce)',
      weight: '3,268 lbs',
      drivetrain: 'Rear-Wheel Drive with Electronically Regulated Diff',
      transmission: '7-Speed High-Performance PDK with short ratios',
    }
  },
  {
    id: 'taycan_turbo_gt',
    name: 'Porsche Taycan Turbo GT',
    tagline: 'Full Electric Supercar Titan',
    basePrice: 230000,
    specs: {
      engine: 'Dual Permanent-Magnet Synchronous Motors with 900A Inverter',
      horsepower: '1,019 hp (Overboost to 1,092 hp)',
      torque: '988 lb-ft instant torque',
      acceleration: '0-60 mph in 2.1 seconds',
      topSpeed: '190 mph (305 km/h)',
      weight: '4,925 lbs',
      drivetrain: 'All-Wheel Drive with Porsche Torque Vectoring Plus',
      transmission: '2-Speed Transmission on Rear Axle',
    }
  }
];

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Guards Red', hex: '#D1001C', finish: 'glossy', category: 'Standard' },
  { name: 'Racing Yellow', hex: '#EAB308', finish: 'glossy', category: 'Standard' },
  { name: 'Jet Black Metallic', hex: '#111315', finish: 'metallic', category: 'Metallic' },
  { name: 'Carrara White', hex: '#F3F4F6', finish: 'glossy', category: 'Standard' },
  { name: 'GT Silver Metallic', hex: '#9CA3AF', finish: 'metallic', category: 'Metallic' },
  { name: 'Stealth Matte Grey', hex: '#374151', finish: 'matte', category: 'Metallic' },
  { name: 'Gentian Blue Metallic', hex: '#1E3A8A', finish: 'metallic', category: 'Metallic' },
  { name: 'Miami Blue', hex: '#0284C7', finish: 'glossy', category: 'Special Heritage' },
  { name: 'Python Green', hex: '#15803D', finish: 'glossy', category: 'Special Heritage' },
  { name: 'Chalk Crayon', hex: '#D1D5DB', finish: 'matte', category: 'Special Heritage' },
  { name: 'Ruby Star Neo', hex: '#BE185D', finish: 'glossy', category: 'Special Heritage' },
  { name: 'Frozen Berry Metallic', hex: '#9D6B78', finish: 'metallic', category: 'Special Heritage' },
];

export const RIM_PRESETS: RimPreset[] = [
  { id: 'classic', name: '20/21-inch Carrera S Wheels', description: 'Ten-spoke lightweight alloy wheels with dynamic polish', price: 0 },
  { id: 'spyder', name: 'RS Spyder Design Wheels', description: 'Motorsport-derived multispoke design with central locking look', price: 2540 },
  { id: 'aero', name: 'Exclusive Design Carbon Aero', description: 'Carbon fiber aerodynamic blades for reduced drag coefficient', price: 4320 },
  { id: 'gt3', name: 'Magnesium Lightweight Forged', description: 'Ultra-lightweight track forged rims saving 21 lbs of rotational mass', price: 7850 },
];

export const RIM_COLORS = [
  { name: 'Brilliant Silver', hex: '#D1D5DB' },
  { name: 'Satin Black', hex: '#18181B' },
  { name: 'Aurum Gold Metallic', hex: '#CA8A04' },
  { name: 'Titanium Dark Grey', hex: '#4B5563' },
  { name: 'Neodyme Bronze', hex: '#92400E' },
];

export const CALIPER_COLORS = [
  { name: 'Guards Red (Steel Standard)', hex: '#DC2626', price: 0 },
  { name: 'Acid Green (E-Hybrid Exclusive)', hex: '#84CC16', price: 900 },
  { name: 'Racing Yellow (PCCB Ceramic)', hex: '#FACC15', price: 9210 },
  { name: 'High-Gloss Black (Stealth Package)', hex: '#09090B', price: 900 },
];

export const INTERIOR_COLORS = [
  { name: 'Black Race-Tex Alcantara', hex: '#18181B', price: 0 },
  { name: 'Cognac Club Leather', hex: '#854D0E', price: 4200 },
  { name: 'Bordeaux Red / Black Two-Tone', hex: '#881337', price: 4680 },
  { name: 'Slate Grey Neo', hex: '#475569', price: 2150 },
];

export const INITIAL_VEHICLE_CONFIG: VehicleConfig = {
  modelId: '911_carrera_gts',
  modelName: 'Porsche 911 Carrera GTS',
  bodyColor: '#D1001C',
  bodyColorName: 'Guards Red',
  finish: 'glossy',
  rimStyle: 'classic',
  rimColor: '#18181B',
  rimColorName: 'Satin Black',
  caliperColor: '#DC2626',
  caliperColorName: 'Guards Red',
  interiorColor: '#18181B',
  interiorColorName: 'Black Race-Tex',
  spoilerActive: false,
  headlightsOn: true,
  doorsOpen: false,
  explodedView: false,
  roofType: 'coupe',
  selectedPackage: 'Sport Chrono',
};

export function calculateVehicleQuote(config: VehicleConfig): QuoteBreakdown {
  const model = PORSCHE_MODELS.find(m => m.id === config.modelId) || PORSCHE_MODELS[0];
  const basePrice = model.basePrice;
  const options: { name: string; category: any; price: number }[] = [];

  // Finish option
  if (config.finish === 'metallic') {
    options.push({ name: `${config.bodyColorName} (Metallic Finish)`, category: 'paint', price: 840 });
  } else if (config.finish === 'matte') {
    options.push({ name: `${config.bodyColorName} (PTS Satin Matte Finish)`, category: 'paint', price: 3270 });
  }

  // Wheel option
  const wheel = RIM_PRESETS.find(w => w.id === config.rimStyle);
  if (wheel && wheel.price > 0) {
    options.push({ name: wheel.name, category: 'wheels', price: wheel.price });
  }
  if (config.rimColorName !== 'Brilliant Silver') {
    options.push({ name: `Wheel Finish in ${config.rimColorName}`, category: 'wheels', price: 1290 });
  }

  // Caliper option
  const caliper = CALIPER_COLORS.find(c => c.hex.toLowerCase() === config.caliperColor.toLowerCase());
  if (caliper && caliper.price > 0) {
    options.push({ name: `Brake Calipers in ${caliper.name}`, category: 'caliper', price: caliper.price });
  }

  // Interior option
  const interior = INTERIOR_COLORS.find(i => i.hex.toLowerCase() === config.interiorColor.toLowerCase());
  if (interior && interior.price > 0) {
    options.push({ name: `Interior in ${interior.name}`, category: 'interior', price: interior.price });
  }

  // Package option
  if (config.selectedPackage === 'Sport Chrono') {
    options.push({ name: 'Sport Chrono Package with Mode Switch & Track App', category: 'package', price: 2790 });
  } else if (config.selectedPackage === 'Weissach Lightweight') {
    options.push({ name: 'Weissach Lightweight Carbon Package & Titanium Rollcage', category: 'package', price: 33520 });
  }

  const destinationCharge = 1650;
  const optionsTotal = options.reduce((sum, opt) => sum + opt.price, 0);
  const totalPrice = basePrice + optionsTotal + destinationCharge;

  return {
    basePrice,
    options,
    destinationCharge,
    totalPrice,
    estimatedDelivery: '8-12 weeks (Zuffenhausen Factory Allocation)',
  };
}

export const SHOWROOM_FLEET: import('../types').ShowroomVehicle[] = [
  {
    id: '911_carrera_gts',
    name: 'Porsche 911 Carrera GTS',
    tagline: 'T-Hybrid Precision Centerpiece',
    basePrice: 164900,
    vin: 'WP0AB2A98SS294812',
    status: 'Center Stage',
    color: '#D1001C',
    colorName: 'Guards Red',
    finish: 'glossy',
    power: '532 HP • 449 lb-ft',
    acceleration: '2.9s 0-60',
    topSpeed: '194 mph',
    drivetrain: 'Rear-Wheel Drive (PDK)',
    position: [0, 0, 0],
    rotation: 0,
  },
  {
    id: 'taycan_turbo_gt',
    name: 'Porsche Taycan Turbo GT',
    tagline: '1,019 HP Electric Supercar Titan',
    basePrice: 230000,
    vin: 'WP0EA2Y10RSA01928',
    status: 'Showroom Bay A',
    color: '#9D6B78',
    colorName: 'Frozen Berry Metallic',
    finish: 'metallic',
    power: '1,019 HP (1,092 HP Overboost)',
    acceleration: '2.1s 0-60',
    topSpeed: '190 mph',
    drivetrain: 'Dual Motor AWD 800V',
    position: [-7.2, 0, -2.5],
    rotation: Math.PI / 5,
  },
  {
    id: '911_gt3_rs',
    name: 'Porsche 911 GT3 RS',
    tagline: 'DRS Active Aero Track Weapon',
    basePrice: 241300,
    vin: 'WP0AC2A91RS283910',
    status: 'Showroom Bay B',
    color: '#15803D',
    colorName: 'Python Green',
    finish: 'glossy',
    power: '518 HP Naturally Aspirated 9K RPM',
    acceleration: '3.0s 0-60',
    topSpeed: '184 mph (High Downforce)',
    drivetrain: 'RWD Motorsport Diff',
    position: [7.2, 0, -2.5],
    rotation: -Math.PI / 5,
  }
];

export const CLIENT_PERSONAS: import('../types').ClientPersona[] = [
  {
    id: 'collector',
    name: 'Alexander Wright',
    role: 'Bespoke Track Day Collector',
    budget: '$250,000 - $350,000',
    primaryInterest: 'Lap times, carbon-ceramic brakes, PTS Paint-to-Sample',
    preference: 'Aggressive aero, Weissach package, sports exhaust'
  },
  {
    id: 'executive',
    name: 'Elena Vance',
    role: 'Tech Executive & Silicon Investor',
    budget: '$180,000 - $240,000',
    primaryInterest: 'Daily drivability, electric architecture, Burmester 3D audio',
    preference: 'Taycan Turbo GT or 911 Carrera GTS in Matte finish'
  },
  {
    id: 'enthusiast',
    name: 'Julian Ross',
    role: 'First-Time 911 Purist',
    budget: '$150,000 - $180,000',
    primaryInterest: 'Pure boxer engine sound, mechanical engagement, resale value',
    preference: 'Guards Red or GT Silver with Sport Chrono'
  }
];

export function calculateFinanceStructure(
  totalPrice: number,
  mode: 'lease' | 'finance' | 'cash',
  downPaymentPercent: number = 20,
  termMonths: number = 36,
  tradeInCredit: number = 0
): import('../types').FinanceStructure {
  const downPayment = Math.max(0, (totalPrice * (downPaymentPercent / 100)) - tradeInCredit);
  const netFinanced = Math.max(0, totalPrice - downPayment - tradeInCredit);

  if (mode === 'cash') {
    return {
      mode: 'cash',
      downPayment: 0,
      termMonths: 0,
      interestRate: 0,
      residualValue: 0,
      monthlyPayment: 0,
      tradeInCredit,
      totalOutflow: Math.max(0, totalPrice - tradeInCredit),
    };
  }

  if (mode === 'lease') {
    // 36 month lease with 62% residual
    const residualValue = totalPrice * 0.62;
    const depreciation = (netFinanced - residualValue) / termMonths;
    const moneyFactor = 0.0028; // ~6.7% APR equivalent
    const financeFee = (netFinanced + residualValue) * moneyFactor;
    const monthlyPayment = Math.max(1200, Math.round(depreciation + financeFee));

    return {
      mode: 'lease',
      downPayment,
      termMonths,
      interestRate: 6.7,
      residualValue,
      monthlyPayment,
      tradeInCredit,
      totalOutflow: (monthlyPayment * termMonths) + downPayment,
    };
  }

  // Conventional Finance
  const annualRate = 0.059; // 5.9% APR
  const monthlyRate = annualRate / 12;
  const monthlyPayment = Math.round(
    (netFinanced * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)
  );

  return {
    mode: 'finance',
    downPayment,
    termMonths,
    interestRate: 5.9,
    residualValue: 0,
    monthlyPayment,
    tradeInCredit,
    totalOutflow: (monthlyPayment * termMonths) + downPayment,
  };
}

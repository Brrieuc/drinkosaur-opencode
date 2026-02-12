export const METABOLISM_RATE = 0.015; // Average elimination rate per hour in % (approx 0.15 g/L/h)
export const ALCOHOL_DENSITY = 0.789; // g/ml

export const GENDER_CONSTANT = {
  male: 0.7,   
  female: 0.6, 
};

export const MAX_SAFE_BAC = 0.08;

export const THEME_COLORS = {
  safe: 'from-emerald-400 to-cyan-400',
  buzz: 'from-yellow-400 to-orange-400',
  drunk: 'from-pink-500 to-rose-500',
  danger: 'from-red-600 to-purple-600'
};

// Consumption Speeds in ml/minute
export const CONSUMPTION_RATES = {
    beer: { slow: 17, average: 21, fast: 25 },     // Demi (250ml) ~12min avg
    wine: { slow: 6, average: 7, fast: 8 },        // Glass (125ml) ~18min avg
    cocktail: { slow: 5, average: 7.5, fast: 10 }, // Glass (150ml) ~20min avg
    spirit: { slow: 10, average: 20, fast: 40 },   // Usually faster or sipped strictly
    other: { slow: 10, average: 15, fast: 20 }
};

// --- DATA LIBRARIES ---

export interface DrinkReference {
  name: string;
  name_fr?: string;
  abv: number;
  type: 'beer' | 'spirit' | 'wine' | 'other';
  color: string; // Hex or rgba for liquid rendering
  carbonated?: boolean; // Controls foam and bubbles
  tags?: string[];
}

export interface MixerReference {
  name: string;
  color: string;
  carbonated?: boolean;
}

export const FUNNY_EXPRESSIONS = [
  "bleu métal", "défoncé", "arraché", "satellisé", "imbibé", 
  "plein comme un oeuf", "bourré", "beurré complet", "blindé", 
  "cuit", "en pétard", "pinté", "pété", "raide", "rétamé", 
  "torché", "brindezingue", "explosé", "queue de pelle", 
  "cabane sur le chien", "pas loupé"
];

export const BEER_LIBRARY: DrinkReference[] = [
  // Classiques / Lagers (Gold/Yellow)
  { name: 'Heineken', abv: 5.0, type: 'beer', color: '#FCD34D', carbonated: true },
  { name: 'Stella Artois', abv: 5.0, type: 'beer', color: '#FCD34D', carbonated: true },
  { name: '1664', abv: 5.5, type: 'beer', color: '#FBBF24', carbonated: true },
  { name: 'Kronenbourg', abv: 4.2, type: 'beer', color: '#FCD34D', carbonated: true },
  { name: 'Budweiser', abv: 5.0, type: 'beer', color: '#FEF08A', carbonated: true },
  { name: 'Corona', abv: 4.5, type: 'beer', color: '#FEF9C3', carbonated: true },
  // ... shortened for brevity in this patch
];

export const SPIRIT_LIBRARY: DrinkReference[] = [
  // Whisky (Amber)
  { name: "Jack Daniel's", abv: 40, type: 'spirit', color: '#B45309', carbonated: false },
  { name: "Jameson", abv: 40, type: 'spirit', color: '#D97706', carbonated: false },
  { name: "Chivas Regal", abv: 40, type: 'spirit', color: '#B45309', carbonated: false },
  { name: "Nikka", abv: 45, type: 'spirit', color: '#92400E', carbonated: false },
  // ... omitted for brevity
];

export const MIXERS: MixerReference[] = [
  { name: 'Coca-Cola', color: '#280802', carbonated: true },
  { name: 'Tonic Water', color: '#E0F2FE', carbonated: true },
];

export const GENERIC_BEERS: DrinkReference[] = [];
export const GENERIC_WINES: DrinkReference[] = [];
export const BEER_PRESETS = [];
export const SHOT_SIZES = [];
export const GLASS_SHAPES = [];
export const DEFAULTS = {};

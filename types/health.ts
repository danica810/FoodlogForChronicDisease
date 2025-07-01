export interface UserHealthProfile {
  conditions: HealthCondition[];
  medications: Medication[];
  dietaryRestrictions: string[];
  targetNutrition: NutritionTargets;
}

export interface HealthCondition {
  type: 'diabetes' | 'kidney_disease' | 'anticoagulant';
  severity: 'mild' | 'moderate' | 'severe';
  diagnosedDate: string;
}

export interface Medication {
  name: string;
  type: string;
  dosage: string;
  frequency: string;
  interactions: string[];
}

export interface NutritionTargets {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sodium: number;
  potassium: number;
  phosphorus: number;
  vitaminK: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  nutrition: NutritionInfo;
  riskFactors: RiskFactor[];
  imageUrl?: string;
}

export interface NutritionInfo {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  sodium: number;
  potassium: number;
  phosphorus: number;
  vitaminK: number;
  servingSize: string;
}

export interface RiskFactor {
  condition: 'diabetes' | 'kidney_disease' | 'anticoagulant';
  level: 'low' | 'medium' | 'high';
  reason: string;
  recommendation: string;
}

export interface MealEntry {
  id: string;
  timestamp: Date;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Array<{
    food: FoodItem;
    quantity: number;
    unit: string;
  }>;
  totalNutrition: NutritionInfo;
  notes?: string;
  imageUrl?: string;
}

export interface DailyNutrition {
  date: string;
  meals: MealEntry[];
  totalNutrition: NutritionInfo;
  warnings: HealthWarning[];
}

export interface HealthWarning {
  type: 'nutrition_excess' | 'food_interaction' | 'medication_conflict';
  severity: 'low' | 'medium' | 'high';
  message: string;
  recommendation: string;
  affectedFoods: string[];
}
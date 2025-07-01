import { FoodItem, MealEntry, DailyNutrition, UserHealthProfile } from '../types/health';

export const mockUserProfile: UserHealthProfile = {
  conditions: [
    {
      type: 'diabetes',
      severity: 'moderate',
      diagnosedDate: '2022-03-15',
    },
    {
      type: 'anticoagulant',
      severity: 'mild',
      diagnosedDate: '2023-01-10',
    },
  ],
  medications: [
    {
      name: 'Metformin',
      type: 'diabetes',
      dosage: '500mg',
      frequency: 'twice daily',
      interactions: ['alcohol'],
    },
    {
      name: 'Warfarin',
      type: 'anticoagulant',
      dosage: '5mg',
      frequency: 'once daily',
      interactions: ['vitamin_k_foods', 'green_vegetables'],
    },
  ],
  dietaryRestrictions: ['low_sugar', 'low_sodium', 'limited_vitamin_k'],
  targetNutrition: {
    calories: 1800,
    carbs: 200,
    protein: 90,
    fat: 60,
    sodium: 2000,
    potassium: 3500,
    phosphorus: 1000,
    vitaminK: 80,
  },
};

export const mockFoodDatabase: FoodItem[] = [
  {
    id: '1',
    name: '白米飯',
    category: '主食',
    imageUrl: 'https://images.pexels.com/photos/1123644/pexels-photo-1123644.jpeg',
    nutrition: {
      calories: 205,
      carbs: 45,
      protein: 4.3,
      fat: 0.4,
      fiber: 0.6,
      sodium: 1,
      potassium: 55,
      phosphorus: 68,
      vitaminK: 0.1,
      servingSize: '1杯 (158g)',
    },
    riskFactors: [
      {
        condition: 'diabetes',
        level: 'medium',
        reason: '高碳水化合物含量',
        recommendation: '建議控制份量，搭配蛋白質和纖維',
      },
    ],
  },
  {
    id: '2',
    name: '菠菜',
    category: '蔬菜',
    imageUrl: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
    nutrition: {
      calories: 23,
      carbs: 3.6,
      protein: 2.9,
      fat: 0.4,
      fiber: 2.2,
      sodium: 79,
      potassium: 558,
      phosphorus: 49,
      vitaminK: 483,
      servingSize: '1杯 (30g)',
    },
    riskFactors: [
      {
        condition: 'anticoagulant',
        level: 'high',
        reason: '維生素K含量極高',
        recommendation: '服用抗凝血劑者應避免大量攝取',
      },
      {
        condition: 'kidney_disease',
        level: 'medium',
        reason: '鉀含量較高',
        recommendation: '腎臟病患者應適量攝取',
      },
    ],
  },
  {
    id: '3',
    name: '烤雞胸肉',
    category: '蛋白質',
    imageUrl: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg',
    nutrition: {
      calories: 165,
      carbs: 0,
      protein: 31,
      fat: 3.6,
      fiber: 0,
      sodium: 74,
      potassium: 256,
      phosphorus: 196,
      vitaminK: 0.3,
      servingSize: '100g',
    },
    riskFactors: [],
  },
  {
    id: '4',
    name: '巧克力蛋糕',
    category: '甜點',
    imageUrl: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
    nutrition: {
      calories: 235,
      carbs: 35,
      protein: 3,
      fat: 10,
      fiber: 2,
      sodium: 175,
      potassium: 125,
      phosphorus: 85,
      vitaminK: 1.2,
      servingSize: '1片 (64g)',
    },
    riskFactors: [
      {
        condition: 'diabetes',
        level: 'high',
        reason: '高糖分和高碳水化合物',
        recommendation: '糖尿病患者應避免或極少量攝取',
      },
    ],
  },
];

export const mockTodayMeals: MealEntry[] = [
  {
    id: '1',
    timestamp: new Date('2024-01-15T07:30:00'),
    meal: 'breakfast',
    foods: [
      {
        food: mockFoodDatabase[0], // 白米飯
        quantity: 0.5,
        unit: '杯',
      },
    ],
    totalNutrition: {
      calories: 102.5,
      carbs: 22.5,
      protein: 2.15,
      fat: 0.2,
      fiber: 0.3,
      sodium: 0.5,
      potassium: 27.5,
      phosphorus: 34,
      vitaminK: 0.05,
      servingSize: '0.5杯',
    },
    imageUrl: 'https://images.pexels.com/photos/1123644/pexels-photo-1123644.jpeg',
  },
  {
    id: '2',
    timestamp: new Date('2024-01-15T12:15:00'),
    meal: 'lunch',
    foods: [
      {
        food: mockFoodDatabase[2], // 烤雞胸肉
        quantity: 150,
        unit: 'g',
      },
    ],
    totalNutrition: {
      calories: 247.5,
      carbs: 0,
      protein: 46.5,
      fat: 5.4,
      fiber: 0,
      sodium: 111,
      potassium: 384,
      phosphorus: 294,
      vitaminK: 0.45,
      servingSize: '150g',
    },
    imageUrl: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg',
  },
];

export const mockDailyNutrition: DailyNutrition = {
  date: '2024-01-15',
  meals: mockTodayMeals,
  totalNutrition: {
    calories: 350,
    carbs: 22.5,
    protein: 48.65,
    fat: 5.6,
    fiber: 0.3,
    sodium: 111.5,
    potassium: 411.5,
    phosphorus: 328,
    vitaminK: 0.5,
    servingSize: '',
  },
  warnings: [
    {
      type: 'nutrition_excess',
      severity: 'low',
      message: '今日蛋白質攝取量較高',
      recommendation: '晚餐可選擇較清淡的食物',
      affectedFoods: ['烤雞胸肉'],
    },
  ],
};
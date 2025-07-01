import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Calendar, Plus, Clock, TrendingUp, CircleAlert as AlertCircle } from 'lucide-react-native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import NutritionCard from '@/components/NutritionCard';
import HealthAlert from '@/components/HealthAlert';
import { mockDailyNutrition, mockUserProfile } from '@/data/mockData';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [showAlert, setShowAlert] = useState(true);
  const today = new Date().toLocaleDateString('zh-TW');
  const todayData = mockDailyNutrition;
  const userProfile = mockUserProfile;

  const getMealTypeText = (meal: string) => {
    const mealTypes = {
      breakfast: '早餐',
      lunch: '午餐',
      dinner: '晚餐',
      snack: '點心',
    };
    return mealTypes[meal as keyof typeof mealTypes] || meal;
  };

  const getCaloriesProgress = () => {
    return (todayData.totalNutrition.calories / userProfile.targetNutrition.calories) * 100;
  };

  return (
    <SafeAreaContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>早安，健康夥伴！</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <TouchableOpacity style={styles.calendarButton}>
            <Calendar size={24} color="#10B981" />
          </TouchableOpacity>
        </View>

        {/* Health Alert */}
        <HealthAlert
          type="warning"
          title="飲食提醒"
          message="您正在服用抗凝血劑，請避免大量攝取富含維生素K的食物，如菠菜、花椰菜等深綠色蔬菜。"
          visible={showAlert}
          onDismiss={() => setShowAlert(false)}
          actions={[
            {
              label: '了解更多',
              onPress: () => router.push('/database'),
              variant: 'secondary',
            },
            {
              label: '知道了',
              onPress: () => setShowAlert(false),
              variant: 'primary',
            },
          ]}
        />

        {/* Quick Add Food */}
        <Card style={styles.quickAddCard}>
          <View style={styles.quickAddHeader}>
            <Text style={styles.quickAddTitle}>快速記錄食物</Text>
            <Plus size={20} color="#10B981" />
          </View>
          <Text style={styles.quickAddDescription}>
            拍照即可自動辨識食物並記錄營養資訊
          </Text>
          <Button
            title="開始拍照"
            onPress={() => router.push('/camera')}
            variant="primary"
            size="large"
            style={styles.quickAddButton}
          />
        </Card>

        {/* Today's Summary */}
        <Card>
          <View style={styles.summaryHeader}>
            <Text style={styles.sectionTitle}>今日攝取概況</Text>
            <View style={styles.caloriesContainer}>
              <Text style={styles.caloriesValue}>
                {todayData.totalNutrition.calories.toFixed(0)}
              </Text>
              <Text style={styles.caloriesTarget}>
                / {userProfile.targetNutrition.calories} 卡
              </Text>
            </View>
          </View>
          
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(getCaloriesProgress(), 100)}%` },
              ]}
            />
          </View>
          
          <Text style={styles.progressText}>
            還可攝取 {Math.max(userProfile.targetNutrition.calories - todayData.totalNutrition.calories, 0)} 卡
          </Text>
        </Card>

        {/* Nutrition Cards */}
        <View style={styles.nutritionGrid}>
          <NutritionCard
            title="碳水化合物"
            current={todayData.totalNutrition.carbs}
            target={userProfile.targetNutrition.carbs}
            unit="g"
            color="#3B82F6"
          />
          <NutritionCard
            title="蛋白質"
            current={todayData.totalNutrition.protein}
            target={userProfile.targetNutrition.protein}
            unit="g"
            color="#8B5CF6"
          />
        </View>

        <View style={styles.nutritionGrid}>
          <NutritionCard
            title="鈉"
            current={todayData.totalNutrition.sodium}
            target={userProfile.targetNutrition.sodium}
            unit="mg"
            color="#F59E0B"
            warning={todayData.totalNutrition.sodium > userProfile.targetNutrition.sodium * 0.8}
          />
          <NutritionCard
            title="維生素K"
            current={todayData.totalNutrition.vitaminK}
            target={userProfile.targetNutrition.vitaminK}
            unit="μg"
            color="#EF4444"
            warning={todayData.totalNutrition.vitaminK > userProfile.targetNutrition.vitaminK * 0.9}
          />
        </View>

        {/* Recent Meals */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>今日用餐記錄</Text>
            <TouchableOpacity onPress={() => router.push('/analytics')}>
              <TrendingUp size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
          
          {todayData.meals.length === 0 ? (
            <View style={styles.emptyMeals}>
              <Text style={styles.emptyMealsText}>還沒有用餐記錄</Text>
              <Text style={styles.emptyMealsSubtext}>開始記錄您的第一餐吧！</Text>
            </View>
          ) : (
            todayData.meals.map((meal) => (
              <View key={meal.id} style={styles.mealItem}>
                <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} />
                <View style={styles.mealInfo}>
                  <View style={styles.mealHeader}>
                    <Text style={styles.mealType}>{getMealTypeText(meal.meal)}</Text>
                    <View style={styles.mealTime}>
                      <Clock size={14} color="#6B7280" />
                      <Text style={styles.mealTimeText}>
                        {meal.timestamp.toLocaleTimeString('zh-TW', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.mealFoods}>
                    {meal.foods.map(f => f.food.name).join(', ')}
                  </Text>
                  <Text style={styles.mealCalories}>
                    {meal.totalNutrition.calories.toFixed(0)} 卡路里
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card>

        {/* Health Tips */}
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>今日健康小貼士</Text>
            <AlertCircle size={20} color="#10B981" />
          </View>
          <Text style={styles.tipText}>
            💡 糖尿病患者建議將每餐的碳水化合物控制在30-45克之間，有助於穩定血糖。
          </Text>
          <Text style={styles.tipText}>
            💡 服用抗凝血劑期間，請保持維生素K的攝取量穩定，避免突然大量增減。
          </Text>
        </Card>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  calendarButton: {
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },
  quickAddCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  quickAddHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAddTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  quickAddDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  quickAddButton: {
    marginTop: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  caloriesValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  caloriesTarget: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  nutritionGrid: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyMeals: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyMealsText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  emptyMealsSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mealType: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  mealTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  mealFoods: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  mealCalories: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});
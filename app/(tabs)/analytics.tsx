import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { TrendingUp, Calendar, Activity, CircleAlert as AlertCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import Card from '@/components/Card';
import NutritionCard from '@/components/NutritionCard';
import { mockDailyNutrition, mockUserProfile } from '@/data/mockData';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  
  const todayData = mockDailyNutrition;
  const userProfile = mockUserProfile;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getNutritionStatus = (current: number, target: number, nutrient: string) => {
    const percentage = (current / target) * 100;
    if (percentage < 70) return { status: 'low', color: '#F59E0B', message: '攝取不足' };
    if (percentage > 110) return { status: 'high', color: '#EF4444', message: '攝取過量' };
    return { status: 'normal', color: '#10B981', message: '攝取適中' };
  };

  const mockWeeklyData = [
    { day: '週一', calories: 1750, carbs: 180, protein: 85 },
    { day: '週二', calories: 1820, carbs: 195, protein: 92 },
    { day: '週三', calories: 1650, carbs: 160, protein: 78 },
    { day: '週四', calories: 1900, carbs: 210, protein: 95 },
    { day: '週五', calories: 1780, carbs: 185, protein: 88 },
    { day: '週六', calories: 1950, carbs: 220, protein: 98 },
    { day: '今日', calories: todayData.totalNutrition.calories, carbs: todayData.totalNutrition.carbs, protein: todayData.totalNutrition.protein },
  ];

  return (
    <SafeAreaContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>健康分析</Text>
          <TouchableOpacity style={styles.calendarButton}>
            <Calendar size={24} color="#10B981" />
          </TouchableOpacity>
        </View>

        {/* Period Selector */}
        <Card style={styles.periodSelector}>
          <View style={styles.periodButtons}>
            {[
              { key: 'day', label: '今日' },
              { key: 'week', label: '本週' },
              { key: 'month', label: '本月' },
            ].map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.key && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period.key as 'day' | 'week' | 'month')}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period.key && styles.periodButtonTextActive,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Overall Status */}
        <Card>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Activity size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>整體狀況</Text>
            </View>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.statusText}>良好</Text>
            </View>
          </View>
          
          <View style={styles.overallStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {todayData.totalNutrition.calories.toFixed(0)}
              </Text>
              <Text style={styles.statLabel}>總熱量 (卡)</Text>
              <Text style={styles.statTarget}>
                目標: {userProfile.targetNutrition.calories}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {((todayData.totalNutrition.calories / userProfile.targetNutrition.calories) * 100).toFixed(0)}%
              </Text>
              <Text style={styles.statLabel}>完成度</Text>
              <Text style={styles.statTarget}>
                還需 {Math.max(userProfile.targetNutrition.calories - todayData.totalNutrition.calories, 0).toFixed(0)} 卡
              </Text>
            </View>
          </View>
        </Card>

        {/* Weekly Trend Chart */}
        {selectedPeriod === 'week' && (
          <Card>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <TrendingUp size={20} color="#10B981" />
                <Text style={styles.sectionTitle}>本週趨勢</Text>
              </View>
            </View>
            
            <View style={styles.chartContainer}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>每日熱量攝取</Text>
                <Text style={styles.chartSubtitle}>目標線: {userProfile.targetNutrition.calories} 卡</Text>
              </View>
              
              <View style={styles.chart}>
                {mockWeeklyData.map((data, index) => {
                  const height = Math.max((data.calories / userProfile.targetNutrition.calories) * 100, 10);
                  const isToday = data.day === '今日';
                  return (
                    <View key={index} style={styles.chartBar}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: `${Math.min(height, 120)}%`,
                            backgroundColor: isToday ? '#10B981' : '#E5E7EB',
                          },
                        ]}
                      />
                      <Text style={[styles.barLabel, isToday && styles.todayLabel]}>
                        {data.day}
                      </Text>
                      <Text style={styles.barValue}>{data.calories}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </Card>
        )}

        {/* Detailed Nutrition Analysis */}
        <Card>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => toggleSection('nutrition')}
          >
            <View style={styles.sectionTitleContainer}>
              <AlertCircle size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>營養素分析</Text>
            </View>
            {expandedSection === 'nutrition' ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSection === 'nutrition' && (
            <View style={styles.nutritionAnalysis}>
              {[
                { name: '碳水化合物', current: todayData.totalNutrition.carbs, target: userProfile.targetNutrition.carbs, unit: 'g' },
                { name: '蛋白質', current: todayData.totalNutrition.protein, target: userProfile.targetNutrition.protein, unit: 'g' },
                { name: '脂肪', current: todayData.totalNutrition.fat, target: userProfile.targetNutrition.fat, unit: 'g' },
                { name: '鈉', current: todayData.totalNutrition.sodium, target: userProfile.targetNutrition.sodium, unit: 'mg' },
                { name: '鉀', current: todayData.totalNutrition.potassium, target: userProfile.targetNutrition.potassium, unit: 'mg' },
                { name: '維生素K', current: todayData.totalNutrition.vitaminK, target: userProfile.targetNutrition.vitaminK, unit: 'μg' },
              ].map((nutrient, index) => {
                const status = getNutritionStatus(nutrient.current, nutrient.target, nutrient.name);
                return (
                  <View key={index} style={styles.nutrientRow}>
                    <View style={styles.nutrientInfo}>
                      <Text style={styles.nutrientName}>{nutrient.name}</Text>
                      <View style={styles.nutrientValues}>
                        <Text style={[styles.nutrientCurrent, { color: status.color }]}>
                          {nutrient.current.toFixed(1)} {nutrient.unit}
                        </Text>
                        <Text style={styles.nutrientTarget}>
                          / {nutrient.target} {nutrient.unit}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.nutrientStatus}>
                      <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                      <Text style={[styles.statusMessage, { color: status.color }]}>
                        {status.message}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </Card>

        {/* Health Recommendations */}
        <Card>
          <TouchableOpacity
            style={styles.expandableHeader}
            onPress={() => toggleSection('recommendations')}
          >
            <View style={styles.sectionTitleContainer}>
              <AlertCircle size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>個人化建議</Text>
            </View>
            {expandedSection === 'recommendations' ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </TouchableOpacity>

          {expandedSection === 'recommendations' && (
            <View style={styles.recommendations}>
              <View style={styles.recommendationItem}>
                <View style={styles.recommendationIcon}>
                  <Text style={styles.recommendationEmoji}>🥗</Text>
                </View>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>增加蔬菜攝取</Text>
                  <Text style={styles.recommendationText}>
                    建議增加低維生素K的蔬菜，如白菜、黃瓜等，避免深綠色葉菜。
                  </Text>
                </View>
              </View>

              <View style={styles.recommendationItem}>
                <View style={styles.recommendationIcon}>
                  <Text style={styles.recommendationEmoji}>💧</Text>
                </View>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>注意鈉攝取</Text>
                  <Text style={styles.recommendationText}>
                    今日鈉攝取量適中，繼續保持低鹽飲食習慣。
                  </Text>
                </View>
              </View>

              <View style={styles.recommendationItem}>
                <View style={styles.recommendationIcon}>
                  <Text style={styles.recommendationEmoji}>⚖️</Text>
                </View>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>血糖管理</Text>
                  <Text style={styles.recommendationText}>
                    碳水化合物攝取良好，建議餐後適度運動幫助血糖控制。
                  </Text>
                </View>
              </View>
            </View>
          )}
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
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  calendarButton: {
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },
  periodSelector: {
    marginBottom: 8,
  },
  periodButtons: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#10B981',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  overallStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
  },
  statTarget: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  chartContainer: {
    marginTop: 8,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  bar: {
    width: '80%',
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    minHeight: 8,
  },
  barLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 4,
  },
  todayLabel: {
    color: '#10B981',
    fontFamily: 'Inter-Bold',
  },
  barValue: {
    fontSize: 9,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  nutritionAnalysis: {
    marginTop: 16,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  nutrientInfo: {
    flex: 1,
  },
  nutrientName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 4,
  },
  nutrientValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  nutrientCurrent: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginRight: 4,
  },
  nutrientTarget: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  nutrientStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusMessage: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
  },
  recommendations: {
    marginTop: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationEmoji: {
    fontSize: 20,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});
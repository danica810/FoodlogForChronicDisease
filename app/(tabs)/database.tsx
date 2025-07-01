import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, FlatList } from 'react-native';
import { Search, Filter, TriangleAlert as AlertTriangle, Info, ChevronRight } from 'lucide-react-native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import Card from '@/components/Card';
import { mockFoodDatabase } from '@/data/mockData';
import { FoodItem, RiskFactor } from '@/types/health';

export default function DatabaseScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  const filteredFoods = mockFoodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(mockFoodDatabase.map(food => food.category))];
  const categoryLabels: { [key: string]: string } = {
    all: '全部',
    '主食': '主食',
    '蔬菜': '蔬菜',
    '蛋白質': '蛋白質',
    '甜點': '甜點',
  };

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getRiskText = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high': return '高風險';
      case 'medium': return '中風險';
      case 'low': return '低風險';
      default: return '未知';
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'diabetes': return '糖尿病';
      case 'kidney_disease': return '腎臟病';
      case 'anticoagulant': return '抗凝血劑';
      default: return condition;
    }
  };

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.foodItem}
      onPress={() => setSelectedFood(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.foodImage} />
      <View style={styles.foodInfo}>
        <View style={styles.foodHeader}>
          <Text style={styles.foodName}>{item.name}</Text>
          <View style={styles.foodCategory}>
            <Text style={styles.foodCategoryText}>{item.category}</Text>
          </View>
        </View>
        <Text style={styles.foodCalories}>
          {item.nutrition.calories} 卡 • {item.nutrition.servingSize}
        </Text>
        {item.riskFactors.length > 0 && (
          <View style={styles.riskFactors}>
            {item.riskFactors.slice(0, 2).map((risk, index) => (
              <View
                key={index}
                style={[
                  styles.riskBadge,
                  { backgroundColor: getRiskColor(risk.level) + '20' }
                ]}
              >
                <AlertTriangle size={12} color={getRiskColor(risk.level)} />
                <Text style={[styles.riskText, { color: getRiskColor(risk.level) }]}>
                  {getConditionText(risk.condition)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <ChevronRight size={20} color="#6B7280" />
    </TouchableOpacity>
  );

  if (selectedFood) {
    return (
      <SafeAreaContainer>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.detailHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedFood(null)}
            >
              <Text style={styles.backButtonText}>← 返回</Text>
            </TouchableOpacity>
          </View>

          {/* Food Image and Basic Info */}
          <Card>
            <Image source={{ uri: selectedFood.imageUrl }} style={styles.detailImage} />
            <View style={styles.detailInfo}>
              <Text style={styles.detailName}>{selectedFood.name}</Text>
              <View style={styles.detailCategory}>
                <Text style={styles.detailCategoryText}>{selectedFood.category}</Text>
              </View>
              <Text style={styles.servingSize}>每份: {selectedFood.nutrition.servingSize}</Text>
            </View>
          </Card>

          {/* Nutrition Information */}
          <Card>
            <Text style={styles.sectionTitle}>營養資訊</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{selectedFood.nutrition.calories}</Text>
                <Text style={styles.nutritionLabel}>卡路里</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{selectedFood.nutrition.carbs}g</Text>
                <Text style={styles.nutritionLabel}>碳水化合物</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{selectedFood.nutrition.protein}g</Text>
                <Text style={styles.nutritionLabel}>蛋白質</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{selectedFood.nutrition.fat}g</Text>
                <Text style={styles.nutritionLabel}>脂肪</Text>
              </View>
            </View>
            
            <View style={styles.detailNutrition}>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionRowLabel}>膳食纖維</Text>
                <Text style={styles.nutritionRowValue}>{selectedFood.nutrition.fiber}g</Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionRowLabel}>鈉</Text>
                <Text style={styles.nutritionRowValue}>{selectedFood.nutrition.sodium}mg</Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionRowLabel}>鉀</Text>
                <Text style={styles.nutritionRowValue}>{selectedFood.nutrition.potassium}mg</Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionRowLabel}>磷</Text>
                <Text style={styles.nutritionRowValue}>{selectedFood.nutrition.phosphorus}mg</Text>
              </View>
              <View style={styles.nutritionRow}>
                <Text style={styles.nutritionRowLabel}>維生素K</Text>
                <Text style={styles.nutritionRowValue}>{selectedFood.nutrition.vitaminK}μg</Text>
              </View>
            </View>
          </Card>

          {/* Risk Factors */}
          {selectedFood.riskFactors.length > 0 && (
            <Card>
              <Text style={styles.sectionTitle}>健康風險評估</Text>
              {selectedFood.riskFactors.map((risk, index) => (
                <View key={index} style={styles.riskCard}>
                  <View style={styles.riskHeader}>
                    <View style={styles.riskLevel}>
                      <AlertTriangle size={16} color={getRiskColor(risk.level)} />
                      <Text style={[styles.riskLevelText, { color: getRiskColor(risk.level) }]}>
                        {getRiskText(risk.level)}
                      </Text>
                    </View>
                    <Text style={styles.riskCondition}>
                      {getConditionText(risk.condition)}患者
                    </Text>
                  </View>
                  <Text style={styles.riskReason}>{risk.reason}</Text>
                  <Text style={styles.riskRecommendation}>
                    💡 建議：{risk.recommendation}
                  </Text>
                </View>
              ))}
            </Card>
          )}

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>食物資料庫</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={24} color="#10B981" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="搜尋食物名稱..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextActive,
                ]}
              >
                {categoryLabels[category] || category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Food List */}
        <FlatList
          data={filteredFoods}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.id}
          style={styles.foodList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Info size={48} color="#6B7280" />
              <Text style={styles.emptyText}>找不到相關食物</Text>
              <Text style={styles.emptySubtext}>請嘗試不同的搜尋關鍵字</Text>
            </View>
          }
        />
      </View>
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
  filterButton: {
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginLeft: 12,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#10B981',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  foodList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  foodInfo: {
    flex: 1,
  },
  foodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  foodName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  foodCategory: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  foodCategoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  foodCalories: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  riskFactors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  riskText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    marginLeft: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  // Detail View Styles
  detailHeader: {
    paddingVertical: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  detailImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  detailInfo: {
    alignItems: 'center',
  },
  detailName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  detailCategory: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  detailCategoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  servingSize: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  nutritionItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  nutritionValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  detailNutrition: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  nutritionRowLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  nutritionRowValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  riskCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskLevel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskLevelText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  riskCondition: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  riskReason: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    marginBottom: 8,
  },
  riskRecommendation: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    padding: 8,
    borderRadius: 6,
  },
  bottomSpacing: {
    height: 20,
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Heart, Calendar, Pill } from 'lucide-react-native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { mockUserProfile } from '@/data/mockData';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const userProfile = mockUserProfile;

  const handleHealthProfileEdit = () => {
    Alert.alert(
      '編輯健康檔案',
      '此功能將引導您更新疾病資訊和用藥狀況',
      [
        { text: '取消', style: 'cancel' },
        { text: '開始編輯', onPress: () => console.log('Edit health profile') }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      '匯出資料',
      '將您的飲食記錄匯出為PDF檔案，方便與醫療團隊分享',
      [
        { text: '取消', style: 'cancel' },
        { text: '匯出', onPress: () => console.log('Export data') }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      '登出',
      '確定要登出嗎？',
      [
        { text: '取消', style: 'cancel' },
        { text: '登出', style: 'destructive', onPress: () => console.log('Logout') }
      ]
    );
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'diabetes': return '糖尿病';
      case 'kidney_disease': return '腎臟病';
      case 'anticoagulant': return '服用抗凝血劑';
      default: return condition;
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'mild': return '輕度';
      case 'moderate': return '中度';
      case 'severe': return '重度';
      default: return severity;
    }
  };

  return (
    <SafeAreaContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>個人設定</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#10B981" />
          </TouchableOpacity>
        </View>

        {/* User Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <User size={32} color="#10B981" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>健康使用者</Text>
              <Text style={styles.userEmail}>user@example.com</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>編輯</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Health Profile */}
        <Card>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Heart size={20} color="#EF4444" />
              <Text style={styles.sectionTitle}>健康檔案</Text>
            </View>
            <TouchableOpacity onPress={handleHealthProfileEdit}>
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.healthInfo}>
            <Text style={styles.healthSectionTitle}>疾病狀況</Text>
            {userProfile.conditions.map((condition, index) => (
              <View key={index} style={styles.conditionItem}>
                <Text style={styles.conditionName}>
                  {getConditionText(condition.type)}
                </Text>
                <Text style={styles.conditionSeverity}>
                  {getSeverityText(condition.severity)}
                </Text>
              </View>
            ))}

            <Text style={[styles.healthSectionTitle, styles.marginTop]}>用藥資訊</Text>
            {userProfile.medications.map((medication, index) => (
              <View key={index} style={styles.medicationItem}>
                <View style={styles.medicationHeader}>
                  <Pill size={16} color="#3B82F6" />
                  <Text style={styles.medicationName}>{medication.name}</Text>
                </View>
                <Text style={styles.medicationDosage}>
                  {medication.dosage} • {medication.frequency}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Nutrition Targets */}
        <Card>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Calendar size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>營養目標</Text>
            </View>
            <TouchableOpacity>
              <ChevronRight size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.targetGrid}>
            <View style={styles.targetItem}>
              <Text style={styles.targetValue}>{userProfile.targetNutrition.calories}</Text>
              <Text style={styles.targetLabel}>每日熱量 (卡)</Text>
            </View>
            <View style={styles.targetItem}>
              <Text style={styles.targetValue}>{userProfile.targetNutrition.carbs}g</Text>
              <Text style={styles.targetLabel}>碳水化合物</Text>
            </View>
            <View style={styles.targetItem}>
              <Text style={styles.targetValue}>{userProfile.targetNutrition.protein}g</Text>
              <Text style={styles.targetLabel}>蛋白質</Text>
            </View>
            <View style={styles.targetItem}>
              <Text style={styles.targetValue}>{userProfile.targetNutrition.sodium}mg</Text>
              <Text style={styles.targetLabel}>鈉攝取上限</Text>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <Card>
          <Text style={styles.sectionTitle}>設定</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color="#6B7280" />
              <Text style={styles.settingText}>推播通知</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
              thumbColor={notificationsEnabled ? '#10B981' : '#F3F4F6'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Shield size={20} color="#6B7280" />
              <Text style={styles.settingText}>資料分享</Text>
            </View>
            <Switch
              value={dataSharing}
              onValueChange={setDataSharing}
              trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
              thumbColor={dataSharing ? '#10B981' : '#F3F4F6'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color="#6B7280" />
              <Text style={styles.settingText}>幫助與支援</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
        </Card>

        {/* Actions */}
        <Card>
          <Button
            title="匯出健康報告"
            onPress={handleExportData}
            variant="secondary"
            size="large"
            style={styles.actionButton}
          />
          
          <Button
            title="聯絡客服"
            onPress={() => Alert.alert('客服', '客服功能開發中')}
            variant="secondary"
            size="large"
            style={styles.actionButton}
          />
        </Card>

        {/* Logout */}
        <Card>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>登出</Text>
          </TouchableOpacity>
        </Card>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>食刻安心 v1.0.0</Text>
          <Text style={styles.appDescription}>
            專為慢性病患者設計的智慧飲食管理工具
          </Text>
        </View>

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
  settingsButton: {
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },
  profileCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
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
  healthInfo: {
    marginTop: 8,
  },
  healthSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  marginTop: {
    marginTop: 16,
  },
  conditionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    marginBottom: 8,
  },
  conditionName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  conditionSeverity: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  medicationItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    marginBottom: 8,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  medicationName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  medicationDosage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 24,
  },
  targetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  targetItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  targetValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 4,
  },
  targetLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginLeft: 12,
  },
  actionButton: {
    marginBottom: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});
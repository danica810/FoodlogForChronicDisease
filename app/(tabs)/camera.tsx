import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, RotateCcw, Check, X, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import Card from '@/components/Card';
import Button from '@/components/Button';
import HealthAlert from '@/components/HealthAlert';
import { mockFoodDatabase } from '@/data/mockData';
import { router } from 'expo-router';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [recognizedFood, setRecognizedFood] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRiskAlert, setShowRiskAlert] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <SafeAreaContainer>
        <View style={styles.permissionContainer}>
          <Camera size={64} color="#6B7280" />
          <Text style={styles.permissionText}>正在載入相機...</Text>
        </View>
      </SafeAreaContainer>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaContainer>
        <View style={styles.permissionContainer}>
          <Camera size={64} color="#6B7280" />
          <Text style={styles.permissionTitle}>需要相機權限</Text>
          <Text style={styles.permissionDescription}>
            我們需要使用您的相機來拍攝和識別食物
          </Text>
          <Button
            title="允許使用相機"
            onPress={requestPermission}
            variant="primary"
            size="large"
            style={styles.permissionButton}
          />
        </View>
      </SafeAreaContainer>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        // For web platform, we'll simulate taking a picture
        if (Platform.OS === 'web') {
          simulateFoodRecognition();
        } else {
          const photo = await cameraRef.current.takePictureAsync();
          setCapturedImage(photo.uri);
          analyzeFoodImage(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('錯誤', '拍照失敗，請重試');
      }
    }
  };

  const simulateFoodRecognition = () => {
    // Simulate captured image
    setCapturedImage('https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg');
    analyzeFoodImage('https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg');
  };

  const analyzeFoodImage = (imageUri: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      // Simulate recognizing spinach (high vitamin K)
      const recognizedFood = mockFoodDatabase.find(food => food.name === '菠菜');
      setRecognizedFood(recognizedFood);
      setIsAnalyzing(false);
      
      // Check if food has high risk factors
      if (recognizedFood?.riskFactors.some(risk => risk.level === 'high')) {
        setShowRiskAlert(true);
      }
    }, 2000);
  };

  const confirmFood = () => {
    if (recognizedFood) {
      // Here you would typically save the food entry to your database
      Alert.alert(
        '記錄成功',
        `已記錄 ${recognizedFood.name}`,
        [
          {
            text: '查看詳情',
            onPress: () => router.push('/analytics'),
          },
          {
            text: '繼續拍照',
            onPress: resetCamera,
          },
        ]
      );
    }
  };

  const resetCamera = () => {
    setCapturedImage(null);
    setRecognizedFood(null);
    setShowRiskAlert(false);
  };

  const retakePhoto = () => {
    resetCamera();
  };

  if (capturedImage) {
    return (
      <SafeAreaContainer backgroundColor="#000000">
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          {isAnalyzing && (
            <View style={styles.analysisOverlay}>
              <Card style={styles.analysisCard}>
                <Text style={styles.analysisText}>AI 正在分析食物...</Text>
                <View style={styles.loadingDots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </Card>
            </View>
          )}

          {recognizedFood && !isAnalyzing && (
            <View style={styles.resultsOverlay}>
              <Card style={styles.resultsCard}>
                <Text style={styles.recognizedTitle}>識別結果</Text>
                <Text style={styles.foodName}>{recognizedFood.name}</Text>
                <Text style={styles.foodCategory}>{recognizedFood.category}</Text>
                
                <View style={styles.nutritionPreview}>
                  <Text style={styles.nutritionTitle}>營養資訊 (每份)</Text>
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>熱量</Text>
                    <Text style={styles.nutritionValue}>{recognizedFood.nutrition.calories} 卡</Text>
                  </View>
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>碳水化合物</Text>
                    <Text style={styles.nutritionValue}>{recognizedFood.nutrition.carbs} g</Text>
                  </View>
                  <View style={styles.nutritionRow}>
                    <Text style={styles.nutritionLabel}>維生素K</Text>
                    <Text style={styles.nutritionValue}>{recognizedFood.nutrition.vitaminK} μg</Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
                    <X size={24} color="#EF4444" />
                    <Text style={styles.retakeText}>重拍</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.confirmButton} onPress={confirmFood}>
                    <Check size={24} color="#10B981" />
                    <Text style={styles.confirmText}>確認記錄</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </View>
          )}

          {showRiskAlert && recognizedFood && (
            <View style={styles.alertOverlay}>
              <HealthAlert
                type="danger"
                title="⚠️ 高風險食物警告"
                message={`${recognizedFood.name}含有大量維生素K，可能干擾抗凝血劑效果。建議與醫師討論後再攝取。`}
                visible={true}
                actions={[
                  {
                    label: '了解風險',
                    onPress: () => router.push('/database'),
                    variant: 'secondary',
                  },
                  {
                    label: '仍要記錄',
                    onPress: () => {
                      setShowRiskAlert(false);
                      confirmFood();
                    },
                    variant: 'danger',
                  },
                  {
                    label: '取消記錄',
                    onPress: () => {
                      setShowRiskAlert(false);
                      resetCamera();
                    },
                    variant: 'secondary',
                  },
                ]}
              />
            </View>
          )}
        </View>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer backgroundColor="#000000">
      <View style={styles.cameraContainer}>
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing={facing}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.topControls}>
              <Text style={styles.instructionText}>將食物置於框內拍照</Text>
            </View>

            <View style={styles.centerFrame}>
              <View style={styles.frameCorner} />
              <View style={[styles.frameCorner, styles.topRight]} />
              <View style={[styles.frameCorner, styles.bottomLeft]} />
              <View style={[styles.frameCorner, styles.bottomRight]} />
            </View>

            <View style={styles.bottomControls}>
              <TouchableOpacity 
                style={styles.flipButton} 
                onPress={toggleCameraFacing}
              >
                <RotateCcw size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.captureButton} 
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              <View style={styles.placeholder} />
            </View>
          </View>
        </CameraView>
      </View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
  },
  permissionDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    minWidth: 200,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topControls: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  centerFrame: {
    flex: 2,
    position: 'relative',
    margin: 40,
  },
  frameCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
    borderWidth: 3,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: 'auto',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    top: 'auto',
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  bottomControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  placeholder: {
    width: 50,
    height: 50,
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  analysisOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    margin: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  analysisText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  resultsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingBottom: 32,
  },
  resultsCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  recognizedTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  foodName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  foodCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
    marginBottom: 16,
  },
  nutritionPreview: {
    marginBottom: 20,
  },
  nutritionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  nutritionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  nutritionValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  retakeText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginLeft: 8,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  confirmText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginLeft: 8,
  },
  alertOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
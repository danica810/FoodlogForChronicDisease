import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';

interface NutritionCardProps {
  title: string;
  current: number;
  target: number;
  unit: string;
  color?: string;
  warning?: boolean;
}

export default function NutritionCard({
  title,
  current,
  target,
  unit,
  color = '#10B981',
  warning = false,
}: NutritionCardProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const displayColor = warning ? '#EF4444' : color;

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
                backgroundColor: displayColor,
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.valuesContainer}>
        <Text style={[styles.currentValue, warning && styles.warningText]}>
          {current.toFixed(1)} {unit}
        </Text>
        <Text style={styles.targetValue}>
          目標: {target} {unit}
        </Text>
      </View>
      {warning && (
        <Text style={styles.warningLabel}>超過建議攝取量</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 8,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  currentValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  targetValue: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  warningText: {
    color: '#EF4444',
  },
  warningLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    marginTop: 4,
  },
});
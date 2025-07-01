import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle, X, CircleCheck as CheckCircle } from 'lucide-react-native';
import Card from './Card';
import Button from './Button';

interface HealthAlertProps {
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  actions?: Array<{
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  onDismiss?: () => void;
  visible: boolean;
}

export default function HealthAlert({
  type,
  title,
  message,
  actions = [],
  onDismiss,
  visible,
}: HealthAlertProps) {
  if (!visible) return null;

  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'danger':
        return '#FEE2E2';
      case 'warning':
        return '#FEF3C7';
      case 'info':
        return '#DBEAFE';
      default:
        return '#F3F4F6';
    }
  };

  return (
    <Card style={[styles.container, { borderLeftColor: getIconColor(), borderLeftWidth: 4 }]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <AlertTriangle size={24} color={getIconColor()} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <X size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.message}>{message}</Text>
      
      {actions.length > 0 && (
        <View style={styles.actionsContainer}>
          {actions.map((action, index) => (
            <Button
              key={index}
              title={action.label}
              onPress={action.onPress}
              variant={action.variant || 'primary'}
              size="small"
              style={styles.actionButton}
            />
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEFEFE',
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
    marginLeft: 36,
  },
  dismissButton: {
    padding: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginLeft: 36,
    gap: 8,
  },
  actionButton: {
    marginRight: 8,
    marginBottom: 8,
  },
});
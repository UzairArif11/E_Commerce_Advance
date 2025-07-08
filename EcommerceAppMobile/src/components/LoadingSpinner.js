import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

const LoadingSpinner = ({ 
  size = 'large', 
  color = COLORS.primary[500], 
  text = 'Loading...', 
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
});

export default LoadingSpinner;

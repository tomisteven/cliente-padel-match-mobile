import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/common/Header';

export default function Layout({ children }) {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});
/**
 * Bike Selector Component
 * 
 * A component for selecting and managing bikes associated with a client. Shows
 * existing bikes and allows adding new ones.
 * 
 * Props:
 * - selectedBikes: string[] - Array of selected bike serial numbers
 * - onChange: (bikes: string[]) => void - Called when selection changes
 * 
 * Features:
 * - Multiple bike selection
 * - Quick bike lookup
 * - New bike creation
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface Props {
  selectedBikes: string[];
  onChange: (bikes: string[]) => void;
}

export function BikeSelector({ selectedBikes = [], onChange }: Props) {
  const removeBike = (serialNumber: string) => {
    onChange(selectedBikes.filter(bike => bike !== serialNumber));
  };

  const renderBike = ({ item: serialNumber }: { item: string }) => (
    <View style={styles.bikeItem}>
      <Text style={styles.serialNumber}>{serialNumber}</Text>
      <Pressable
        style={styles.removeButton}
        onPress={() => removeBike(serialNumber)}
      >
        <Ionicons name="close-circle" size={24} color="#ef4444" />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Associated Bikes</Text>
        <Link href="/bikes/new" asChild>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={20} color="#2563eb" />
            <Text style={styles.addButtonText}>Add Bike</Text>
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={selectedBikes}
        renderItem={renderBike}
        keyExtractor={(item) => item}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No bikes associated with this client
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  bikeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  serialNumber: {
    fontSize: 16,
    color: '#1e293b',
  },
  removeButton: {
    padding: 4,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#64748b',
    fontSize: 14,
  },
});
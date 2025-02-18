/**
 * Bike List Component
 * 
 * Displays a list of bikes with filtering and sorting capabilities. Used in both
 * the main bikes screen and when selecting bikes for jobs or sales.
 * 
 * Props:
 * - bikes: Bike[] - Array of bikes to display
 * - onSelect?: (bike: Bike) => void - Optional callback when a bike is selected
 * - filter?: (bike: Bike) => boolean - Optional filter function
 * 
 * Features:
 * - Search/filter bikes
 * - Sort by different fields
 * - Quick actions menu
 */

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Bike } from '../../types';

interface Props {
  bikes: Bike[];
  onSelect?: (bike: Bike) => void;
  filter?: (bike: Bike) => boolean;
}

export function BikeList({ bikes, onSelect, filter }: Props) {
  const filteredBikes = filter ? bikes.filter(filter) : bikes;

  const renderBike = ({ item: bike }: { item: Bike }) => (
    <Pressable
      style={styles.bikeCard}
      onPress={() => onSelect?.(bike)}
    >
      <View style={styles.bikeInfo}>
        <Text style={styles.serialNumber}>{bike.serialNumber}</Text>
        <Text style={styles.bikeTitle}>
          {bike.year} {bike.brand} {bike.model}
        </Text>
        <Text style={styles.bikeDetails}>
          {bike.type} • {bike.size} • {bike.color}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
    </Pressable>
  );

  return (
    <FlatList
      data={filteredBikes}
      renderItem={renderBike}
      keyExtractor={(bike) => bike.serialNumber}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Ionicons name="bicycle-outline" size={48} color="#94a3b8" />
          <Text style={styles.emptyStateText}>No bikes found</Text>
          <Text style={styles.emptyStateSubtext}>
            Try adjusting your search or add a new bike
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  bikeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bikeInfo: {
    flex: 1,
  },
  serialNumber: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  bikeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  bikeDetails: {
    fontSize: 14,
    color: '#64748b',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
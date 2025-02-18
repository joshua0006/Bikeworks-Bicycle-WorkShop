/**
 * Bike Details Form Component
 * 
 * A form component for collecting bike information. Can be used in both sales and
 * service contexts. Validates serial numbers and provides suggestions for existing bikes.
 * 
 * Props:
 * - initialData: Partial<Bike> - Pre-fill form with existing data
 * - onSubmit: (data: Bike) => void - Called when form is submitted
 * 
 * Features:
 * - Serial number validation
 * - Existing bike lookup
 * - Brand/model suggestions
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Bike } from '../../types';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  initialData?: Partial<Bike>;
  onSubmit: (data: Bike) => void;
}

export function BikeDetailsForm({ initialData = {}, onSubmit }: Props) {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        console.log('Fetching bikes from Firestore...');
        const q = query(collection(db, 'bikes'));
        const querySnapshot = await getDocs(q);
        console.log('Bikes snapshot:', querySnapshot.docs.length);
        
        const bikesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Bike document:', doc.id, data);
          return {
            id: doc.id,
            serialNumber: data.serialNumber,
            brand: data.brand,
            model: data.model,
            year: data.year,
            color: data.color,
            photos: data.photos || [],
            status: data.status || 'available',
            // Add other necessary fields
          } as Bike;
        });
        
        setBikes(bikesData);
      } catch (err) {
        console.error('Bike fetch error:', err);
        setError('Failed to load bikes');
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  const renderBikeItem = ({ item }: { item: Bike }) => (
    <Pressable
      style={[
        styles.bikeCard,
        selectedBike?.id === item.id && styles.selectedCard
      ]}
      onPress={() => {
        console.log('Selected bike:', item);
        setSelectedBike(item);
        onSubmit(item);
      }}
    >
      <View style={styles.imageContainer}>
        {item.photos?.[0] ? (
          <Image
            source={{ uri: item.photos[0] }}
            style={styles.bikeImage}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="bicycle" size={40} color="#94a3b8" />
        )}
      </View>
      
      <View style={styles.bikeInfo}>
        <Text style={styles.serialNumber}>{item.serialNumber}</Text>
        <Text style={styles.bikeTitle}>
          {item.year} {item.brand} {item.model}
        </Text>
        <Text style={styles.bikeDetails}>
          {item.type} • {item.size} • {item.color}
        </Text>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading available bikes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Bike</Text>
      
      <FlatList
        data={bikes}
        renderItem={renderBikeItem}
        keyExtractor={(item) => item.id!}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="bicycle-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyStateText}>No bikes available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#dc2626',
    marginTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  bikeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedCard: {
    borderColor: '#2563eb',
    backgroundColor: '#f0f9ff',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    overflow: 'hidden',
  },
  bikeImage: {
    width: '100%',
    height: '100%',
  },
  bikeInfo: {
    flex: 1,
  },
  serialNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  bikeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  bikeDetails: {
    fontSize: 14,
    color: '#64748b',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#64748b',
    marginTop: 16,
  },
});
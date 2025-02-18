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
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Bike } from '../../types';
import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Props {
  bikes: Bike[];
  onSelect?: (bike: Bike) => void;
  filter?: (bike: Bike) => boolean;
}

export function BikeList() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const q = query(collection(db, 'bikes'));
        const querySnapshot = await getDocs(q);
        const bikesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Bike[];
        setBikes(bikesData);
      } catch (err) {
        setError('Failed to fetch bikes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
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

  const renderBike = ({ item: bike }: { item: Bike }) => (
    <Pressable
      style={styles.bikeCard}
      onPress={() => setSelectedBike(bike)}
    >
      <View style={styles.imageContainer}>
        {bike.photos?.[0] ? (
          <Image
            source={{ uri: bike.photos[0] }}
            style={styles.bikeImage}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="bicycle" size={40} color="#94a3b8" />
        )}
      </View>
      
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
    <>
      <FlatList
        data={bikes}
        renderItem={renderBike}
        keyExtractor={(bike) => bike.id}
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
      
      <Modal
        visible={!!selectedBike}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBike(null)}
      >
        <TouchableWithoutFeedback onPress={() => setSelectedBike(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {selectedBike && (
                  <>
                    <Text style={styles.modalTitle}>Bike Details</Text>
                    <Text>Serial: {selectedBike.serialNumber}</Text>
                    <Text>Brand: {selectedBike.brand}</Text>
                    <Text>Model: {selectedBike.model}</Text>
                    <Text>Year: {selectedBike.year}</Text>
                    <Text>Color: {selectedBike.color}</Text>
                    <Text>Size: {selectedBike.size}</Text>
                    <Text>Status: {selectedBike.status}</Text>
                    
                    <Pressable
                      style={styles.closeButton}
                      onPress={() => setSelectedBike(null)}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

function BikeCard({ bike }: { bike: Bike }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.brandModel}>{bike.brand} {bike.model}</Text>
        <Text style={styles.serial}>#{bike.serialNumber}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={16} color="#64748b" />
          <Text style={styles.detailText}>{bike.year || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="color-palette" size={16} color="#64748b" />
          <Text style={styles.detailText}>{bike.color || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="resize" size={16} color="#64748b" />
          <Text style={styles.detailText}>{bike.size || 'N/A'}</Text>
        </View>
      </View>

      {bike.photos?.[0] && (
        <Image 
          source={{ uri: bike.photos[0] }} 
          style={styles.bikeImage} 
          resizeMode="cover"
        />
      )}
    </View>
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
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: 'red',
    fontSize: 16
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  brandModel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  serial: {
    fontSize: 14,
    color: '#64748b',
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
  },
  bikeImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
});
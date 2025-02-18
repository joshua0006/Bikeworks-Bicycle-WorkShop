import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BikeList } from '../../components/bikes/BikeList';

export default function BikesScreen() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0'
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: '#1e293b'
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#2563eb',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      gap: 8
    },
    addButtonText: {
      color: '#ffffff',
      fontWeight: '600'
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Serviced Bikes</Text>
        <Link href="/bikes/new" asChild>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={24} color="#ffffff" />
            <Text style={styles.addButtonText}>Add Bike</Text>
          </Pressable>
        </Link>
      </View>
      <BikeList bikes={[]} />
    </View>
  );
}
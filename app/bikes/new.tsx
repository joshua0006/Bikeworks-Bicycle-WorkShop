/**
 * New Bike Screen
 * 
 * This screen handles adding new bikes to the system, whether they were sold by the shop
 * or are being serviced. It provides a streamlined form for entering bike details and
 * manages the creation of new bike records.
 * 
 * Related components:
 * - BikeForm: Main form for entering bike details
 * - SerialLookup: Checks if the bike already exists
 * 
 * Flow:
 * 1. Enter/scan serial number
 * 2. System checks if bike exists
 * 3. Enter bike details
 * 4. Save bike to database
 */

import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { BikeForm } from '../../components/bikes/BikeForm';
import type { Bike } from '../../types';

export default function NewBikeScreen() {
  const handleSubmit = async (bikeData: Bike) => {
    try {
      // TODO: Implement Firebase storage
      // await saveBike(bikeData);
      router.replace('/bikes');
    } catch (error) {
      console.error('Failed to save bike:', error);
    }
  };

  return (
    <View style={styles.container}>
      <BikeForm onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
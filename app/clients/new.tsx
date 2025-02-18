/**
 * New Client Screen
 * 
 * This screen handles the creation of new client records. It provides a streamlined
 * form for entering client details and manages the creation of new client records.
 * 
 * Related components:
 * - ClientForm: Main form for entering client details
 * - PhoneInput: Specialized input for phone numbers
 * - BikeSelector: Optional component to associate bikes with client
 * 
 * Flow:
 * 1. Enter client details
 * 2. Add associated bikes (optional)
 * 3. Save client to database
 */

import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ClientForm } from '../../components/clients/ClientForm';
import type { Client } from '../../types';

export default function NewClientScreen() {
  const handleSubmit = async (clientData: Client) => {
    try {
      // TODO: Implement Firebase storage
      // await saveClient(clientData);
      router.replace('/clients');
    } catch (error) {
      console.error('Failed to save client:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ClientForm onSubmit={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
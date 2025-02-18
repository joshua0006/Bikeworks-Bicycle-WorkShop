/**
 * Sale Details Form Component
 * 
 * Collects sale-specific information like sale date, seller, and whether it's a new bike.
 * 
 * Props:
 * - initialData: Partial<Sale> - Pre-fill form with existing data
 * - onSubmit: (data: Partial<Sale>) => void - Called when form is submitted
 * 
 * Features:
 * - Date selection
 * - Staff member selection
 * - New/Used bike toggle
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import type { Sale } from '../../types';

interface Props {
  initialData?: Partial<Sale>;
  onSubmit: (data: Partial<Sale>) => void;
}

export function SaleDetailsForm({ initialData = {}, onSubmit }: Props) {
  const [formData, setFormData] = useState<Partial<Sale>>({
    soldBy: '',
    isNewBike: true,
    dateSold: new Date().toISOString().split('T')[0],
    ...initialData,
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Sale Date</Text>
        <TextInput
          style={styles.input}
          value={formData.dateSold}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, dateSold: text }))
          }
          placeholder="YYYY-MM-DD"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Sold By</Text>
        <TextInput
          style={styles.input}
          value={formData.soldBy}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, soldBy: text }))
          }
          placeholder="Enter staff member name"
        />
      </View>

      <View style={[styles.field, styles.switchField]}>
        <Text style={styles.label}>New Bike</Text>
        <Switch
          value={formData.isNewBike}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, isNewBike: value }))
          }
        />
      </View>

      <Pressable
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Review Sale</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  field: {
    marginBottom: 16,
  },
  switchField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
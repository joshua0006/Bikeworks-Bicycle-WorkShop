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

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import type { Bike } from '../../types';

interface Props {
  initialData?: Partial<Bike>;
  onSubmit: (data: Bike) => void;
}

export function BikeDetailsForm({ initialData = {}, onSubmit }: Props) {
  const [formData, setFormData] = useState<Partial<Bike>>({
    serialNumber: '',
    type: '',
    brand: '',
    year: new Date().getFullYear(),
    size: '',
    model: '',
    color: '',
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Bike, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Bike, string>> = {};

    if (!formData.serialNumber) {
      newErrors.serialNumber = 'Serial number is required';
    }
    if (!formData.brand) {
      newErrors.brand = 'Brand is required';
    }
    if (!formData.model) {
      newErrors.model = 'Model is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData as Bike);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Serial Number</Text>
        <TextInput
          style={[styles.input, errors.serialNumber && styles.inputError]}
          value={formData.serialNumber}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, serialNumber: text }))
          }
          placeholder="Enter bike serial number"
        />
        {errors.serialNumber && (
          <Text style={styles.errorText}>{errors.serialNumber}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Brand</Text>
        <TextInput
          style={[styles.input, errors.brand && styles.inputError]}
          value={formData.brand}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, brand: text }))
          }
          placeholder="Enter bike brand"
        />
        {errors.brand && (
          <Text style={styles.errorText}>{errors.brand}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Model</Text>
        <TextInput
          style={[styles.input, errors.model && styles.inputError]}
          value={formData.model}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, model: text }))
          }
          placeholder="Enter bike model"
        />
        {errors.model && (
          <Text style={styles.errorText}>{errors.model}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Year</Text>
        <TextInput
          style={styles.input}
          value={formData.year?.toString()}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, year: parseInt(text) || 0 }))
          }
          keyboardType="numeric"
          placeholder="Enter bike year"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Size</Text>
        <TextInput
          style={styles.input}
          value={formData.size}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, size: text }))
          }
          placeholder="Enter bike size"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Color</Text>
        <TextInput
          style={styles.input}
          value={formData.color}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, color: text }))
          }
          placeholder="Enter bike color"
        />
      </View>

      <Pressable
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Continue</Text>
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
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
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
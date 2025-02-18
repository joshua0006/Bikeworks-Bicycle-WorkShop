/**
 * Client Form Component
 * 
 * A comprehensive form for entering client details. Used in both new client creation
 * and editing existing clients. Includes validation and bike association.
 * 
 * Props:
 * - initialData?: Client - Pre-fill form with existing data
 * - onSubmit: (data: Client) => void - Called when form is valid and submitted
 * 
 * Features:
 * - Contact information validation
 * - Bike association
 * - Email validation
 * - Phone number formatting
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
import { PhoneInput } from './PhoneInput';
import { BikeSelector } from './BikeSelector';
import type { Client } from '../../types';

interface Props {
  initialData?: Partial<Client>;
  onSubmit: (data: Client) => void;
}

export function ClientForm({ initialData = {}, onSubmit }: Props) {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    mobile: '',
    email: '',
    bikeSerialNumbers: [],
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Client, string>>>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Client, string>> = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    }
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData as Client);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={formData.name}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, name: text }))
          }
          placeholder="Enter client name"
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name}</Text>
        )}
      </View>

      <PhoneInput
        value={formData.mobile}
        onChange={(mobile) => setFormData((prev) => ({ ...prev, mobile }))}
        error={errors.mobile}
      />

      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={formData.email}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, email: text }))
          }
          placeholder="Enter email address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}
      </View>

      <BikeSelector
        selectedBikes={formData.bikeSerialNumbers}
        onChange={(bikes) =>
          setFormData((prev) => ({ ...prev, bikeSerialNumbers: bikes }))
        }
      />

      <Pressable
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Save Client</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
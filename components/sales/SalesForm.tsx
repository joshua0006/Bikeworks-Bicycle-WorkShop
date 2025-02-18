import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { addDoc, collection, updateDoc, doc, getDocs, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { BikeSelector } from './BikeSelector';
import { ClientSelector } from './ClientSelector';
import { BikeDetailsForm } from './BikeDetailsForm';
import { SaleDetailsForm } from './SaleDetailsForm';
import { SaleReview } from './SaleReview';
import { PhotoUpload } from './PhotoUpload';
import type { Bike, Client, Sale } from '../../types';

type FormStep = 'select' | 'details' | 'review';

export function SalesForm() {
  const [step, setStep] = useState<FormStep>('select');
  const [loading, setLoading] = useState(true);
  const [availableBikes, setAvailableBikes] = useState<Bike[]>([]);
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState<Partial<Sale>>({
    isNewBike: false,
    photos: [],
    saleDate: new Date().toISOString(),
    status: 'completed'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bikesSnapshot, clientsSnapshot] = await Promise.all([
          getDocs(query(collection(db, 'bikes'))),
          getDocs(query(collection(db, 'clients')))
        ]);

        const bikes = bikesSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Bike))
          .filter(bike => !bike.sold);
        
        const clients = clientsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Client));

        setAvailableBikes(bikes);
        setAvailableClients(clients);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load data');
      }
    };

    fetchData();
  }, []);

  const handleBikeSelect = (bike: Bike) => {
    setFormData(prev => ({
      ...prev,
      bikeId: bike.id,
      brand: bike.brand,
      model: bike.model,
      serialNumber: bike.serialNumber,
      year: bike.year,
      color: bike.color,
      type: bike.type,
      size: bike.size,
      photos: bike.photos || [],
      price: bike.suggestedPrice || bike.purchasePrice || 0
    }));
    setStep('details');
  };

  const handleManualEntry = () => {
    setFormData(prev => ({
      ...prev,
      isNewBike: true
    }));
    setStep('details');
  };

  const handleClientSelect = (client: Client) => {
    setFormData(prev => ({
      ...prev,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      clientEmail: client.email
    }));
  };

  const handleDetailsSubmit = (details: Partial<Sale>) => {
    setFormData(prev => ({
      ...prev,
      ...details
    }));
    setStep('review');
  };

  const handleSubmit = async () => {
    try {
      if (!formData.serialNumber || !formData.brand || !formData.price) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      const saleData = {
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'completed'
      };

      const saleRef = await addDoc(collection(db, 'sales'), saleData);

      if (formData.bikeId) {
        await updateDoc(doc(db, 'bikes', formData.bikeId), {
          sold: true,
          saleId: saleRef.id,
          saleDate: saleData.saleDate,
          salePrice: saleData.price,
          clientId: formData.clientId,
          lastUpdated: new Date().toISOString()
        });
      }

      Alert.alert('Success', 'Sale recorded successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Sale submission error:', error);
      Alert.alert('Error', 'Failed to record sale');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {step === 'select' && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Bike</Text>
            <BikeSelector
              bikes={availableBikes}
              onSelect={handleBikeSelect}
            />
            <Pressable
              style={styles.manualButton}
              onPress={handleManualEntry}
            >
              <Text style={styles.manualButtonText}>Enter Manually</Text>
            </Pressable>
          </View>
        </>
      )}

      {step === 'details' && (
        <>
          {formData.isNewBike ? (
            <BikeDetailsForm
              initialData={formData}
              onSubmit={handleDetailsSubmit}
            />
          ) : (
            <SaleDetailsForm
              initialData={formData}
              onSubmit={handleDetailsSubmit}
            />
          )}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Client</Text>
            <ClientSelector
              clients={availableClients}
              onSelect={handleClientSelect}
              selectedClientId={formData.clientId}
            />
          </View>
        </>
      )}

      {step === 'review' && (
        <SaleReview
          data={formData as Sale}
          onSubmit={handleSubmit}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  manualButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
    alignItems: 'center',
    marginTop: 12,
  },
  manualButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  }
}); 
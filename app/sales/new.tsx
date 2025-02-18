/**
 * New Sale Screen
 * 
 * This screen handles the creation of new bike sales records. It uses a multi-step form
 * process to collect bike details, photos, and sale information.
 * 
 * Related components:
 * - BikeDetailsForm: Collects basic bike information
 * - PhotoUpload: Handles bike photo capture and management
 * - SaleDetailsForm: Captures sale-specific information
 * 
 * Flow:
 * 1. Enter bike details (or select existing bike)
 * 2. Add photos of the bike
 * 3. Enter sale details
 * 4. Review and submit
 */

import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { BikeDetailsForm } from '../../components/sales/BikeDetailsForm';
import { PhotoUpload } from '../../components/sales/PhotoUpload';
import { SaleDetailsForm } from '../../components/sales/SaleDetailsForm';
import { SaleReview } from '../../components/sales/SaleReview';
import { StepIndicator } from '../../components/common/StepIndicator';
import type { Bike, Sale } from '../../types';

type Step = 'bike' | 'photos' | 'sale' | 'review';

export default function NewSaleScreen() {
  const [currentStep, setCurrentStep] = useState<Step>('bike');
  const [saleData, setSaleData] = useState<Partial<Sale>>({
    photos: [],
  });

  const steps: Step[] = ['bike', 'photos', 'sale', 'review'];

  const handleBikeSubmit = (bikeData: Bike) => {
    setSaleData(prev => ({ ...prev, ...bikeData }));
    setCurrentStep('photos');
  };

  const handlePhotosSubmit = (photos: string[]) => {
    setSaleData(prev => ({ ...prev, photos }));
    setCurrentStep('sale');
  };

  const handleSaleSubmit = (saleDetails: Partial<Sale>) => {
    setSaleData(prev => ({ ...prev, ...saleDetails }));
    setCurrentStep('review');
  };

  const handleSaleComplete = async () => {
    try {
      // TODO: Implement Firebase storage
      // await saveSale(saleData);
      router.replace('/');
    } catch (error) {
      console.error('Failed to save sale:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        labels={{
          bike: 'Bike Details',
          photos: 'Photos',
          sale: 'Sale Info',
          review: 'Review',
        }}
      />
      
      <ScrollView style={styles.content}>
        {currentStep === 'bike' && (
          <BikeDetailsForm
            initialData={saleData}
            onSubmit={handleBikeSubmit}
          />
        )}
        
        {currentStep === 'photos' && (
          <PhotoUpload
            photos={saleData.photos}
            onSubmit={handlePhotosSubmit}
          />
        )}
        
        {currentStep === 'sale' && (
          <SaleDetailsForm
            initialData={saleData}
            onSubmit={handleSaleSubmit}
          />
        )}
        
        {currentStep === 'review' && (
          <SaleReview
            data={saleData as Sale}
            onSubmit={handleSaleComplete}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
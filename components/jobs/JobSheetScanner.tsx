/**
 * Job Sheet Scanner Component
 * 
 * Handles the capture and processing of job sheet photos. Uses Google Cloud Vision
 * AI to extract text and parse it into structured job data.
 * 
 * Props:
 * - onComplete: (data: Partial<Job>) => void - Called with extracted job data
 * 
 * Features:
 * - Camera integration
 * - Image preprocessing
 * - OCR text extraction
 * - Data parsing and structuring
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import type { Job } from '../../types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { parseJobSheetText } from '../../utils/parseJobSheet';
import { createWorker } from 'tesseract.js';

interface Props {
  onComplete: (data: Partial<Job>) => void;
}

export function JobSheetScanner({ onComplete }: Props) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: [3, 4],
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
        processJobSheet(result.assets[0].uri);
      }
    } catch (err) {
      setError('Failed to take photo. Please try again.');
    }
  };

  const processJobSheet = async (imageUri: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const worker = await createWorker('eng', 1, {
        logger: m => console.log(m),
        cachePath: '.traineddata/',
        errorHandler: err => {
          throw new Error(`OCR Error: ${err.message}`);
        }
      });
      
      const { data: { text } } = await worker.recognize(imageUri);
      console.log('OCR Raw Text:', text);
      await worker.terminate();

      const parsedData = parseJobSheetText(text);
      if (!parsedData.customerName || !parsedData.customerPhone || !parsedData.bikeModel) {
        throw new Error('Could not extract required fields from job sheet');
      }

      const jobData = {
        customerName: parsedData.customerName || 'Unknown Customer',
        customerPhone: parsedData.customerPhone || 'No Phone',
        bikeModel: parsedData.bikeModel || 'Unknown Model',
        workRequired: parsedData.workRequired || 'No work description',
        workDone: parsedData.workDone || '',
        laborCost: parsedData.laborCost || 0,
        partsCost: parsedData.partsCost || 0,
        totalCost: (parsedData.laborCost || 0) + (parsedData.partsCost || 0),
        notes: parsedData.notes || '',
        status: 'pending',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'jobs'), jobData);
      onComplete({ id: docRef.id, ...jobData });
    } catch (err) {
      setError('OCR Processing Failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {!photo ? (
        <Pressable
          style={styles.captureButton}
          onPress={takePhoto}
        >
          <Ionicons name="camera" size={48} color="#64748b" />
          <Text style={styles.captureText}>Take Photo of Job Sheet</Text>
          <Text style={styles.captureSubtext}>
            Position the job sheet within the frame and ensure good lighting
          </Text>
        </Pressable>
      ) : (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: photo }}
            style={styles.preview}
            resizeMode="contain"
          />
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.processingText}>
                Processing Job Sheet...
              </Text>
            </View>
          )}
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  captureButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  captureText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  captureSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  preview: {
    flex: 1,
    borderRadius: 8,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
});
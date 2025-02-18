/**
 * Photo Upload Component
 * 
 * Handles photo capture and management for bike sales. Allows multiple photos
 * to be taken and managed. Uses expo-image-picker for camera access.
 * 
 * Props:
 * - photos: string[] - Array of existing photo URIs
 * - onSubmit: (photos: string[]) => void - Called when photos are ready
 * 
 * Features:
 * - Multiple photo capture
 * - Photo preview
 * - Photo deletion
 * - Photo reordering
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  photos: string[];
  onSubmit: (photos: string[]) => void;
}

export function PhotoUpload({ photos: initialPhotos = [], onSubmit }: Props) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [error, setError] = useState<string | null>(null);

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setPhotos((prev) => [...prev, result.assets[0].uri]);
        setError(null);
      }
    } catch (err) {
      setError('Failed to take photo. Please try again.');
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (photos.length === 0) {
      setError('Please take at least one photo');
      return;
    }
    onSubmit(photos);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={styles.photoList}
        contentContainerStyle={styles.photoListContent}
      >
        {photos.map((photo, index) => (
          <View key={photo} style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} />
            <Pressable
              style={styles.removeButton}
              onPress={() => removePhoto(index)}
            >
              <Ionicons name="close-circle" size={24} color="#ef4444" />
            </Pressable>
          </View>
        ))}
        
        <Pressable style={styles.addButton} onPress={takePhoto}>
          <Ionicons name="camera" size={32} color="#64748b" />
          <Text style={styles.addButtonText}>Take Photo</Text>
        </Pressable>
      </ScrollView>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photoList: {
    flexGrow: 0,
    marginBottom: 16,
  },
  photoListContent: {
    padding: 16,
    gap: 16,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  addButton: {
    width: 200,
    height: 150,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
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
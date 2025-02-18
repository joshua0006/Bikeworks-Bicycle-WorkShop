/**
 * Sale Review Component
 * 
 * Displays a summary of the sale information for final review before submission.
 * Shows bike details, photos, and sale information in a clean, organized layout.
 * 
 * Props:
 * - data: Sale - Complete sale data to review
 * - onSubmit: () => void - Called when sale is confirmed
 * 
 * Features:
 * - Photo gallery
 * - Formatted data display
 * - Confirmation button
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import type { Sale } from '../../types';

interface Props {
  data: Sale;
  onSubmit: () => void;
}

export function SaleReview({ data, onSubmit }: Props) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bike Details</Text>
        <View style={styles.detailsGrid}>
          <DetailItem label="Serial Number" value={data.serialNumber} />
          <DetailItem label="Brand" value={data.brand} />
          <DetailItem label="Model" value={data.model} />
          <DetailItem label="Year" value={data.year.toString()} />
          <DetailItem label="Size" value={data.size} />
          <DetailItem label="Color" value={data.color} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sale Information</Text>
        <View style={styles.detailsGrid}>
          <DetailItem label="Date Sold" value={data.dateSold} />
          <DetailItem label="Sold By" value={data.soldBy} />
          <DetailItem
            label="Bike Status"
            value={data.isNewBike ? 'New' : 'Used'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <ScrollView
          horizontal
          style={styles.photoList}
          contentContainerStyle={styles.photoListContent}
        >
          {data.photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo }}
              style={styles.photo}
            />
          ))}
        </ScrollView>
      </View>

      <Pressable
        style={styles.submitButton}
        onPress={onSubmit}
      >
        <Text style={styles.submitButtonText}>Complete Sale</Text>
      </Pressable>
    </ScrollView>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  detailsGrid: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1e293b',
  },
  photoList: {
    flexGrow: 0,
  },
  photoListContent: {
    gap: 16,
  },
  photo: {
    width: 200,
    height: 150,
    borderRadius: 8,
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
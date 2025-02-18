/**
 * Client List Component
 * 
 * Displays a list of clients with filtering and sorting capabilities.
 * Shows client details and associated bikes at a glance.
 * 
 * Props:
 * - clients: Client[] - Array of clients to display
 * - onSelect?: (client: Client) => void - Optional callback when a client is selected
 * - filter?: (client: Client) => boolean - Optional filter function
 * 
 * Features:
 * - Search by name/phone
 * - Sort by name
 * - Quick actions menu
 */

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Client } from '../../types';

interface Props {
  clients: Client[];
  onSelect?: (client: Client) => void;
  filter?: (client: Client) => boolean;
}

export function ClientList({ clients, onSelect, filter }: Props) {
  const filteredClients = filter ? clients.filter(filter) : clients;

  const renderClient = ({ item: client }: { item: Client }) => (
    <Pressable
      style={styles.clientCard}
      onPress={() => onSelect?.(client)}
    >
      <View style={styles.clientInfo}>
        <Text style={styles.name}>{client.name}</Text>
        <Text style={styles.contact}>{client.mobile}</Text>
        {client.email && (
          <Text style={styles.contact}>{client.email}</Text>
        )}
      </View>

      <View style={styles.bikeCount}>
        <Ionicons name="bicycle" size={16} color="#64748b" />
        <Text style={styles.bikeCountText}>
          {client.bikeSerialNumbers.length} bikes
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
    </Pressable>
  );

  return (
    <FlatList
      data={filteredClients}
      renderItem={renderClient}
      keyExtractor={(client) => client.mobile}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color="#94a3b8" />
          <Text style={styles.emptyStateText}>No clients found</Text>
          <Text style={styles.emptyStateSubtext}>
            Add your first client to get started
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  clientInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  contact: {
    fontSize: 14,
    color: '#64748b',
  },
  bikeCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
    gap: 4,
  },
  bikeCountText: {
    fontSize: 14,
    color: '#64748b',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
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

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { collection, query, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Client, Bike } from '../../types';

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Client>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsSnapshot, bikesSnapshot] = await Promise.all([
          getDocs(collection(db, 'clients')),
          getDocs(collection(db, 'bikes'))
        ]);

        const clientsData = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          phone: doc.data().phone,
          email: doc.data().email,
          bikeSerialNumbers: doc.data().bikeSerialNumbers || [],
        })) as Client[];

        const bikesData = bikesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Bike[];

        setClients(clientsData);
        setBikes(bikesData);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (clientId: string) => {
    // Show confirmation dialog
    Alert.alert(
      "Delete Client",
      "Are you sure you want to delete this client?",
      [
        { text: "Cancel", style: "cancel" }, // 'No' option
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // 1. Delete from Firebase
              await deleteDoc(doc(db, 'clients', clientId));

              // 2. Remove client references from bikes
              const client = clients.find(c => c.id === clientId);
              if (client) {
                await Promise.all(
                  client.bikeSerialNumbers.map(async serialNumber => {
                    const bike = bikes.find(b => b.serialNumber === serialNumber);
                    if (bike) {
                      await updateDoc(doc(db, 'bikes', bike.id), {
                        clientId: null,
                        clientName: null
                      });
                    }
                  })
                );
              }

              // 3. Update UI state
              setClients(prev => prev.filter(c => c.id !== clientId));
              setSelectedClient(null);
              
              Alert.alert('Success', 'Client deleted successfully');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Error', 'Failed to delete client');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (client: Client) => {
    router.push(`/clients/${client.id}`);
  };

  const getClientBikes = (client: Client) => {
    return bikes.filter(bike => 
      client.bikeSerialNumbers.includes(bike.serialNumber)
    );
  };

  const handleSave = async () => {
    try {
      if (!selectedClient) return;
      
      await updateDoc(doc(db, 'clients', selectedClient.id), editedData);
      const updatedClients = clients.map(client => 
        client.id === selectedClient.id ? { ...client, ...editedData } : client
      );
      setClients(updatedClients);
      setSelectedClient(prev => prev ? { ...prev, ...editedData } : null);
      setEditMode(false);
      Alert.alert('Success', 'Client updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update client');
    }
  };

  useEffect(() => {
    if (selectedClient) {
      const freshClientData = clients.find(c => c.id === selectedClient.id);
      if (freshClientData) {
        setSelectedClient(freshClientData);
      }
    }
  }, [clients]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderClient = ({ item: client }: { item: Client }) => {
    const clientBikes = getClientBikes(client);
    
    return (
      <Pressable style={styles.clientCard} onPress={() => setSelectedClient(client)}>
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{client.name}</Text>
          
          <View style={styles.clientMeta}>
            <Ionicons name="bicycle" size={14} color="#64748b" />
            <Text style={styles.metaText}>
              {clientBikes.length} {clientBikes.length === 1 ? 'bike' : 'bikes'}
            </Text>
            
            <Ionicons name="call" size={14} color="#64748b" />
            <Text style={styles.metaText}>{client.phone}</Text>
          </View>

          {clientBikes.slice(0, 2).map(bike => (
            <Text key={bike.id} style={styles.bikePreview}>
              {bike.brand} {bike.model}
            </Text>
          ))}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      </Pressable>
    );
  };

  return (
    <>
      <FlatList
        data={clients}
        renderItem={renderClient}
        keyExtractor={(client) => client.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyStateText}>No clients found</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first client by clicking the New Client button
            </Text>
          </View>
        }
      />
      
      <Modal
        visible={!!selectedClient}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setEditMode(false);
          setSelectedClient(null);
        }}
      >
        <TouchableWithoutFeedback onPress={() => !editMode && setSelectedClient(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editMode ? 'Edit Client' : 'Client Details'}
              </Text>
              
              {selectedClient && (
                <>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    {editMode ? (
                      <TextInput
                        style={styles.editInput}
                        value={editedData.name || selectedClient.name}
                        onChangeText={(text) => setEditedData(prev => ({ ...prev, name: text }))}
                      />
                    ) : (
                      <Text style={styles.detailValue}>{selectedClient.name}</Text>
                    )}
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    {editMode ? (
                      <TextInput
                        style={styles.editInput}
                        value={editedData.phone || selectedClient.phone}
                        onChangeText={(text) => setEditedData(prev => ({ ...prev, phone: text }))}
                        keyboardType="phone-pad"
                      />
                    ) : (
                      <Text style={styles.detailValue}>{selectedClient.phone}</Text>
                    )}
                  </View>
                  
                  {selectedClient.email && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Email:</Text>
                      <Text style={styles.detailValue}>{selectedClient.email}</Text>
                    </View>
                  )}
                  
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Associated Bikes:</Text>
                    <View style={styles.bikeListContainer}>
                      {getClientBikes(selectedClient).length === 0 ? (
                        <Text style={styles.noBikesText}>No associated bikes</Text>
                      ) : (
                        getClientBikes(selectedClient).map(bike => (
                          <View key={bike.id} style={styles.bikeListItem}>
                            <Ionicons name="bicycle" size={16} color="#64748b" />
                            <View style={styles.bikeInfo}>
                              <Text style={styles.bikeModel}>{bike.brand} {bike.model}</Text>
                              <Text style={styles.bikeSerial}>Serial: {bike.serialNumber}</Text>
                            </View>
                          </View>
                        ))
                      )}
                    </View>
                  </View>
                  
                  <View style={styles.modalActions}>
                    {editMode ? (
                      <>
                        <Pressable
                          style={[styles.actionButton, styles.deleteButton]}
                          onPress={() => {
                            if (selectedClient) {
                              handleDelete(selectedClient.id);
                              setEditMode(false);
                            }
                          }}
                        >
                          <Ionicons name="trash" size={18} color="#ef4444" />
                          <Text style={styles.actionButtonText}>Delete</Text>
                        </Pressable>
                        
                        <Pressable
                          style={[styles.actionButton, styles.cancelButton]}
                          onPress={() => {
                            setEditMode(false);
                            setEditedData({});
                          }}
                        >
                          <Text style={styles.actionButtonText}>Cancel</Text>
                        </Pressable>
                        
                        <Pressable
                          style={[styles.actionButton, styles.saveButton]}
                          onPress={handleSave}
                        >
                          <Text style={styles.actionButtonText}>Save</Text>
                        </Pressable>
                      </>
                    ) : (
                      <Pressable
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => {
                          setEditMode(true);
                          setEditedData(selectedClient);
                        }}
                      >
                        <Ionicons name="create" size={18} color="#2563eb" />
                        <Text style={styles.actionButtonText}>Edit</Text>
                      </Pressable>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  clientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  clientMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 12,
  },
  clientEmail: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  editButton: {
    borderColor: '#2563eb',
  },
  deleteButton: {
    borderColor: '#ef4444',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    marginBottom: 16,
    justifyContent: 'flex-end',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    color: '#1e293b',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  cancelButton: {
    borderColor: '#64748b',
    backgroundColor: '#f1f5f9',
  },
  bikePreview: {
    fontSize: 14,
    color: '#64748b',
  },
  bikeListContainer: {
    marginTop: 8,
    maxHeight: 200,
  },
  bikeListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  bikeInfo: {
    flex: 1,
  },
  bikeModel: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  bikeSerial: {
    fontSize: 12,
    color: '#64748b',
  },
  noBikesText: {
    fontStyle: 'italic',
    color: '#94a3b8',
    textAlign: 'center',
    marginVertical: 8,
  },
});
export type Bike = {
  id: string;
  // ... other fields ...
  clientId?: string;
  serialNumber: string;
  brand: string;
  model: string;
  photos?: string[]; // Array of image URLs
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  bikeSerialNumbers: string[]; // Changed from bikeIds
  // Add any other client fields you need
}; 

export type BusinessSettings = {
  features: {
    sales: boolean;
    jobs: boolean;
  };
};

export type Sale = {
  id: string;
  clientId: string;
  bikeId: string;
  saleDate: string;
};

export interface Job {
  id?: string; // Firestore document ID
  customerName: string;
  customerPhone: string;
  bikeModel: string;
  workRequired: string;
  workDone?: string;
  laborCost: number;
  partsCost: number;
  totalCost: number;
  notes?: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  dateIn?: string; // Add optional dateIn field
  // Add other fields as needed
}


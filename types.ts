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
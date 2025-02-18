export interface BusinessSettings {
  name: string;
  email: string;
  phone: string;
  mobile: string;
  address: string;
  logo?: string;
  features: {
    sales: boolean;
    jobs: boolean;
  };
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  theme: {
    primary: string;
  };
  photos: string[];
  notes?: string;
}
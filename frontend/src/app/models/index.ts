export interface Service {
  _id?: string;
  name: string;
  description: string;
  doctor: string;
  price: number;
  duration: number;
  image?: string;
  category: 'Physiotherapy' | 'Acupuncture' | 'Acupressure';
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Booking {
  _id?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAddress: string;
  service: Service | string;
  doctor?: string;
  appointmentDate: Date | string;
  appointmentTime: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Contact {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read?: boolean;
  createdAt?: Date;
}

export interface DoctorProfile {
  [x: string]: any;
  _id?: string;
  name: string;
  title?: string;
  specializations?: string[];
  bio?: string;
  experience?: number;
  profileImage?: string;
  email: string;
  phone: string;
  address: string;
  googleMapLink?: string;
  workSamples?: WorkSample[];
  consultationFee?: number;
  operatingHours?: OperatingHours;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkSample {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  date?: Date;
}

export interface OperatingHours {
  [key: string]: {
    start: string;
    end: string;
  };
}

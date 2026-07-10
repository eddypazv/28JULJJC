export interface User {
  dni: string;
  nombres: string;
  email: string;
}

export interface Station {
  id: number;
  name: string;
  completed: boolean;
  completedAt: string | null;
}

export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

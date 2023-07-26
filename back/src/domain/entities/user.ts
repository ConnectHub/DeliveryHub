import { Role } from '@prisma/client';

export interface User {
  id?: string;
  name: string;
  login: string;
  password: string;
  roles: Role[];
  rateId?: string;
  condominiumId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

import { Injectable } from '@nestjs/common';
import { Resident } from 'src/domain/entities/resident';
import { ResidentRepositoryInterface } from 'src/domain/repositories/resident';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class ResidentRepository implements ResidentRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(resident: Resident): Promise<Resident> {
    const newResident = await this.prisma.resident.create({
      data: resident,
    });
    return newResident;
  }

  async list(): Promise<Resident[]> {
    const allResidents = await this.prisma.resident.findMany();
    return allResidents;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.resident.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id,
      },
    });
  }

  update(resident: Resident): Promise<Resident> {
    throw new Error('Method not implemented.');
  }
  findByPhoneNumber(phoneNumber: string): Promise<Resident> {
    throw new Error('Method not implemented.');
  }
  findByName(name: string): Promise<Resident> {
    throw new Error('Method not implemented.');
  }
  findByBuildingApartment(name: string): Promise<Resident> {
    throw new Error('Method not implemented.');
  }
}

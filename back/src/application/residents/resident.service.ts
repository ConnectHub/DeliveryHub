import { Injectable } from '@nestjs/common';
import { ResidentRepository } from './repository/resident.repository';
import { Resident } from 'src/domain/entities/resident';
import { NumberFormat } from './helpers/number-format';

@Injectable()
export class ResidentService {
  constructor(private residentRepository: ResidentRepository) {}

  async createResident(resident: Resident): Promise<Resident> {
    resident.phoneNumber = NumberFormat.format(resident.phoneNumber);

    return await this.residentRepository.create(resident);
  }
}

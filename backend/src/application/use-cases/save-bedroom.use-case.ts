import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Bedroom } from '../../domain/bedroom/bedroom.entity';
import { IBedroomRepository, BEDROOM_REPOSITORY } from '../../domain/bedroom/bedroom.repository';

export interface SaveBedroomDto {
  id?: string;
  propertyId: string;
  name: string;
}

@Injectable()
export class SaveBedroomUseCase {
  constructor(@Inject(BEDROOM_REPOSITORY) private readonly repo: IBedroomRepository) {}

  async execute(dto: SaveBedroomDto): Promise<Bedroom> {
    if (dto.id) {
      const existing = await this.repo.findById(dto.id);
      if (!existing) throw new NotFoundException(`Bedroom ${dto.id} not found`);
      return this.repo.save(dto as any);
    }
    return this.repo.save({ ...dto, active: true } as any);
  }
}

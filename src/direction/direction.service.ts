import { Injectable } from '@nestjs/common';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Direction } from './entities/direction.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class DirectionService {
  constructor(
    @InjectRepository(Direction)
    private readonly directionRepository: Repository<Direction>,
  ) {}

  create(createDirectionDto: CreateDirectionDto) {
    return this.directionRepository.save(createDirectionDto);
  }

  findAllAdmin() {
    return this.directionRepository
      .createQueryBuilder('directions')
      .select([
        'directions.id as id',
        'directions.name as name',
        'directions.price as price',
        'directions.free_seats as free_seats',
        'directions.img as img',
      ])
      .getRawMany();
  }

  findAll(name?: string, indexVisible?: string) {
    const filter: any = {};

    if (name) {
      filter.name = Like(`%${name}%`);
    }
    if (indexVisible) {
      filter.index_visible = indexVisible;
    }
    // const filter = name ? { name: Like(`%${name}%`) } : {};
    return this.directionRepository.find({ where: filter });
  }

  findOne(id: number) {
    return this.directionRepository.findOneBy({ id });
  }

  update(id: number, updateDirectionDto: UpdateDirectionDto) {
    return this.directionRepository.save({ id, ...updateDirectionDto });
  }

  remove(id: number) {
    return `This action removes a #${id} direction`;
  }
}

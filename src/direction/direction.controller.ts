import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DirectionService } from './direction.service';
import { CreateDirectionDto } from './dto/create-direction.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('direction')
export class DirectionController {
  constructor(private readonly directionService: DirectionService) {}

  @Post()
  create(@Body() createDirectionDto: CreateDirectionDto) {
    return this.directionService.create(createDirectionDto);
  }

  @Get()
  findAll(
    @Query('name') name?: string,
    @Query('index_visible') indexVisible?: string,
  ) {
    return this.directionService.findAll(name, indexVisible);
  }

  @Get('admin')
  @Roles('moderator', 'admin')
  findAllAdmin() {
    return this.directionService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.directionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDirectionDto: UpdateDirectionDto,
  ) {
    return this.directionService.update(+id, updateDirectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.directionService.remove(+id);
  }
}

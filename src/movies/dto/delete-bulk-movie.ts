import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class DeleteBulkMovieDto {
  @ApiProperty({ 
    description: 'Film Mongo Idleri',
    type: [String], 
    example: ['507f1f77bcf86cd799439011', '507f191e810c19729de860ea']
  })
  @IsNotEmpty({ message: 'Film Idleri boş olamaz' })
  @IsArray()
  @IsString({ each: true })
  movieIds: string[];

}

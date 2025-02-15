import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WatchMovieBodyDto {
  @ApiProperty({
    description: 'Bilet ID',
    example: '507f1f77bcf86cd799439011'
  })
  @IsNotEmpty()
  @IsMongoId()
  ticketId: string;
}

export class WatchMovieIdParamDto {
  @ApiProperty({
    description: 'Movie ID',
    example: '507f1f77bcf86cd799439011'
  })
  @IsNotEmpty()
  @IsMongoId()
  movieId: string;
}

export class WatchMovieSessionIdParamDto {
  @ApiProperty({
    description: 'Movie Session ID',
    example: '507f1f77bcf86cd799439011'
  })
  @IsNotEmpty()
  @IsMongoId()
  movieSessionId: string;
}

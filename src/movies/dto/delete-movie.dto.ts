import { ApiProperty } from "@nestjs/swagger";

export class DeleteMovieResponseDto {
  @ApiProperty({
    description: 'İşlem sonucu mesajı',
    example: 'Film başarıyla silindi'
  })
  message: string;
}

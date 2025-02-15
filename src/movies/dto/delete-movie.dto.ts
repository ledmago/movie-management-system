import { ApiProperty } from "@nestjs/swagger";

export class DeleteMovieResponseDto {
  @ApiProperty({
    description: 'İşlem sonucu mesajı',
    example: 'Movie başarıyla silindi'
  })
  message: string;
}

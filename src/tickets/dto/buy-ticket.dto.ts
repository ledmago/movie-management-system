import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsMongoId } from "class-validator";

export class BuyTicketDto {
  @ApiProperty({
    description: "Koltuk numarası",
    example: 15,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  seatNumber: number;

  @ApiProperty({
    description: "Movie ID",
    example: "507f1f77bcf86cd799439011",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  movieId: string;

  @ApiProperty({
    description: "Movie seansı ID",
    example: "507f1f77bcf86cd799439011",
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  movieSessionId: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: "Bilet fiyatı",
    example: 50,
    type: Number,
  })
  price: number;
}

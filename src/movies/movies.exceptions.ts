
import { BadRequestException } from "@nestjs/common";

export const MovieNotFound = () => new BadRequestException("Film bulunamadı")
export const MovieSessionNotFound = () => new BadRequestException("Film seansı bulunamadı")
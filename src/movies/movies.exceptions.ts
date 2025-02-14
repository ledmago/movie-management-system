import { BadRequestException } from "@nestjs/common";

export const MovieNotFound = () => new BadRequestException("Film bulunamadı")
export const MovieOrSessionNotFound = () => new BadRequestException("Film veya Film seansı bulunamadı")
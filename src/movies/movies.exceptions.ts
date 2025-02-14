import { BadRequestException } from "@nestjs/common";

export const MovieNotFound = () => new BadRequestException("Film bulunamadı")
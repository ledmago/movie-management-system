
import { BadRequestException } from "@nestjs/common";

export const MovieNotFound = () => new BadRequestException("Film bulunamadı")
export const MovieSessionNotFound = () => new BadRequestException("Film seansı bulunamadı")
export const MovieSessionStartsInMoreThanOneHour = () => new BadRequestException("Film seansı bir saatten fazla var, lütfen bekleyin")
export const MovieSessionExpired = () => new BadRequestException("Film seansı bitti")
export const RoomAlreadyTaken = () => new BadRequestException("Bu salon zaten dolu")
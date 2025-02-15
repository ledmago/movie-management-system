import { BadRequestException } from "@nestjs/common";

export const TicketNotFound = () => new BadRequestException("Bilet bulunamadı")
export const TicketAlreadyUsed = () => new BadRequestException("Bilet zaten kullanıldı")
export const TicketIsNotValidForUser = () => new BadRequestException("Bu bilet kullanıcıya ait değildir")
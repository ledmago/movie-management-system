import { BadRequestException } from "@nestjs/common";

export const TicketNotFound = () => new BadRequestException("Bilet bulunamadı")
export const TicketAlreadyUsed = () => new BadRequestException("Bilet zaten kullanıldı")
export const TicketIsNotValidForUser = () => new BadRequestException("Bu bilet kullanıcıya ait değildir")
export const TicketIsNotValidForMovie = () => new BadRequestException("Bu bilet film için geçerli değildir")
export const TicketIsNotValidForMovieSession = () => new BadRequestException("Bu bilet film seansı için geçerli değildir")
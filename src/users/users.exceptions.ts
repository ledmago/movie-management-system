import { BadRequestException } from "@nestjs/common";

export const UsernameAndPasswordWrong = () => new BadRequestException("Kullanıcı adı veya Şifre Yanlış")
export const UserIsDeactive = () => new BadRequestException("Kullanıcı aktif değil")
export const UsernameAlreadyExists = () => new BadRequestException("Kullanıcı adı zaten mevcut")
export const PasswordIsWeak = () => new BadRequestException("Şifre çok zayıf")
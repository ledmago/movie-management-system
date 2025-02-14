import { BadRequestException } from "@nestjs/common";

export const UsernameAndPasswordWrong = () => new BadRequestException("Kullanıcı adı veya Şifre Yanlış")
export const UserIsDeactive = () => new BadRequestException("Kullanıcı aktif değil")
export const InvalidGaCode = () => new BadRequestException("Ga Kodu Geçersiz !")
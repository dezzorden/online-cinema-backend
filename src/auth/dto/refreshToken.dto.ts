import { IsString } from 'class-validator'

export class RefreshTokenDto {
  @IsString({ message: 'Нет токена или он не является строкой' })
  refreshToken: string
}

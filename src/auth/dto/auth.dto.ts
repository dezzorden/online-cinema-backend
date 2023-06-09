import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6, { message: 'меньше 6 символов' })
  password: string
}

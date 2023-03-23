import { RefreshTokenDto } from './dto/refreshToken.dto'
import { AuthDto } from './dto/auth.dto'
import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { hash, genSalt, compare } from 'bcryptjs'

import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from 'src/user/user.model'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService
	) {}
	async login(dto: AuthDto) {
		return this.validateUser(dto)
	}
	async validateUser(dto: AuthDto): Promise<UserModel> {
		const user = await this.UserModel.findOne({ email: dto.email })
		if (!user) throw new UnauthorizedException('Пользователь не найден')

		const isValidPassword = await compare(dto.password, user.password)
		if (!isValidPassword) throw new UnauthorizedException('Неверный пароль')

		return user
	}

	async register(dto: AuthDto) {
		const oldUser = await this.UserModel.findOne({ email: dto.email })
		if (oldUser)
			throw new BadRequestException('Пользователь с таким email уже существует')
		const salt = await genSalt(10)

		const newUser = new this.UserModel({
			email: dto.email,
			password: await hash(dto.password, salt),
		})
		return newUser.save()
	}

	async issueTokenPair(userId: string) {
		const data = { _id: userId }

		const refreshToken
	}
}

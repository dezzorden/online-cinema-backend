import { ModelType } from '@typegoose/typegoose/lib/types'
import { UserModel } from 'src/user/user.model'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { InjectModel } from 'nestjs-typegoose'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { config } from 'process'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly ConfigService: ConfigService,
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: ConfigService.get('JWT_SECRET'),
		})
	}

	async validate({ _id }: Pick<UserModel, '_id'>) {
		return this.UserModel.findById(_id).exec()
	}
}

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';
import { User as UserModel, Prisma } from '@prisma/client';
import * as Joi from 'joi';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
	constructor(private readonly service: PrismaService) {}

	// Helper methods

	async hashPassword(enteredPassword: string) {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(enteredPassword, salt);
	}

	matchPassword = async (enteredPassword: string, password: string) => {
		return await bcrypt.compare(enteredPassword, password);
	};

	// Data Layer methods

	createUser = async (
		id: string,
		first_name: string,
		last_name: string,
		email: string,
		password: string,
		age: number
	): Promise<UserModel> => {
		const result = await this.service.user.create({
			data: {
				id,
				first_name,
				last_name,
				email,
				password,
				age,
				purchased_products: '',
			},
		});

		return result;
	};

	findOneUser = async (id: string) => {
		return await this.service.user.findFirst({
			where: { id },
		});
	};

	findUserById = async (id: string) => {
		return await this.service.user.findFirst({
			where: { id },
		});
	};

	updateUserPurchasedProducts = async (
		userId: string,
		newPurchasedProducts: string
	) => {
		return await this.service.user.update({
			where: {
				id: userId,
			},
			data: {
				purchased_products: newPurchasedProducts,
			},
		});
	};

	// Validations

	validateRegisterUser(user: CreateUserDto) {
		const schema = Joi.object({
			first_name: Joi.string().required(),
			last_name: Joi.string().required(),
			email: Joi.string().email().required(),
			password: Joi.string().min(0).required(),
			age: Joi.string().required(),
		});

		return schema.validate(user);
	}

	validateGetUser(userInfo: GetUserDto) {
		const schema = Joi.object({
			id: Joi.string().required(),
			password: Joi.string().min(0).required(),
		});

		return schema.validate(userInfo);
	}
}

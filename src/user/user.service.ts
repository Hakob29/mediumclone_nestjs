import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from "bcrypt"
import { UserResponseInterface } from './response/user-response.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    //CREATE USER
    async createUser(dto: CreateUserDto): Promise<UserResponseInterface> {
        try {
            const user = this.userRepo.create({
                ...dto,
                password: await bcrypt.hash(dto.password, 10)
            });
            await this.userRepo.save(user);
            return {
                user: {
                    username: user.username,
                    email: user.email,
                    image: user.image,
                    bio: user.bio
                }
            }
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
        }
    }

    //GET ALL USERS
    async getUsers(): Promise<UserResponseInterface[]> {
        try {
            const users = await this.userRepo.find();
            return users.map((user) => {
                return {
                    user: {
                        username: user.username,
                        email: user.email,
                        image: user.image,
                        bio: user.bio

                    }
                }
            })
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
    }
}

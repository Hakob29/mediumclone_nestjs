import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from "bcrypt"
import { UserResponseInterface } from './response/user-response.interface';
import { UpdateUserDto } from './dto/update-user.dto';

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
                    bio: user.bio,
                    article: user.article,
                    favorites: user.favorites
                }
            }
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
        }
    }

    //GET ALL USERS
    async getUsers(): Promise<UserResponseInterface[]> {
        try {
            const users = await this.userRepo.find({ relations: ["article", "favorites"] });
            return users.map((user) => {
                return {
                    user: {
                        username: user.username,
                        email: user.email,
                        image: user.image,
                        bio: user.bio,
                        article: user.article,
                        favorites: user.favorites
                    }
                }
            })
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
    }

    //UPDATE USER
    async updateUser(id: number, dto: UpdateUserDto): Promise<UserResponseInterface> {
        try {
            await this.userRepo.update(id, {
                ...dto,
                password: await bcrypt.hash(dto.password, 10)
            });
            const user = await this.userRepo.findOne({ where: { id: id } })
            return {
                user: {
                    username: user.username,
                    email: user.email,
                    image: user.image,
                    bio: user.bio,
                    article: user.article,
                    favorites: user.favorites
                }
            }
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
        }
    }
    //DELETE USER
    async deleteUser(id: number): Promise<string> {
        try {
            const user = await this.userRepo.findOne({ where: { id: id } });
            if (!user) throw new HttpException("Not Found!", HttpStatus.NOT_FOUND);
            await this.userRepo.delete(user.id);
            return `User with id: ${id}, has been successfully deleted!`
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.NOT_FOUND);
        }
    }
}

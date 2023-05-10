import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { ILike, Repository } from 'typeorm';
import { ProfileResponseInterface } from './response/profile-response.interface';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }


    //GET BY USERNAME
    async getByUsername(username: string): Promise<ProfileResponseInterface[]> {
        try {
            const user = await this.userRepo.find({
                where: {
                    username: ILike(`%${username}%`)
                }
            })
            if (!user) throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND);
            const result = user.map((e) => {
                return {
                    profile: {
                        id: e.id,
                        username: e.username,
                        image: e.image,
                        bio: e.bio,
                        following: false

                    }
                }
            })
            return result;
        } catch (err) {
            throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND);
        }
    }
}

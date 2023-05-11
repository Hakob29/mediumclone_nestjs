import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { ILike, Repository } from 'typeorm';
import { ProfileResponseInterface } from './response/profile-response.interface';
import { Follow } from './follow.entity';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Follow)
        private readonly followRepo: Repository<Follow>
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

    //FOLLOW PROFILE
    async followProfile(username: string, currentUser: User): Promise<ProfileResponseInterface> {
        try {
            const user = await this.userRepo.findOne({
                where: {
                    username: ILike(`%${username}%`)
                }
            })
            if (!user) throw new HttpException("NOT FOUND", HttpStatus.NOT_FOUND);
            if (currentUser["sub"] === user.id) throw new HttpException("CAN'T FOLLOW YOURSELF", HttpStatus.BAD_REQUEST);

            const follow = await this.followRepo.findOne({
                where: { followerId: currentUser["sub"], following: user.id }
            })

            if (!follow) {
                const followToCreate = await this.followRepo.create({
                    followerId: currentUser["sub"],
                    following: user.id
                });

                await this.followRepo.save(followToCreate);
            }

            return {
                profile: {
                    id: user.id,
                    username: user.username,
                    image: user.image,
                    bio: user.bio,
                    following: true
                }
            }
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }

    }
}

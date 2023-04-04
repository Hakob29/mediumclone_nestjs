import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsEntity } from './tags.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(TagsEntity)
        private readonly tagsRepo: Repository<TagsEntity>
    ) { }

    //FIND ALL TAGS 
    async findAll(): Promise<{ tags: string[] }> {
        try {
            const tags = await this.tagsRepo.find();
            return {
                tags: tags.map((tag) => tag.name)
            }
        } catch (err) {
            throw new HttpException(err.message, HttpStatus.FORBIDDEN);
        }
    }
}

import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsEntity } from './tags.entity';

@Controller('tags')
export class TagsController {
    constructor(
        private readonly tagsService: TagsService
    ) { }

    //FIND ALL TAGS 
    @Get()
    async findAll(): Promise<{ tags: string[] }> {
        return await this.tagsService.findAll();
    }
}

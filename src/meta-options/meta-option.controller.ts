import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';
import { MetaOptionsService } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}

  @Post()
  public createMetaOptions(
    @Body() createPostMetaOptionsDto: CreatePostMetaOptionsDto,
  ) {
    // console.log(createPostMetaOptionsDto);
    return this.metaOptionsService.create(createPostMetaOptionsDto);
  }
}
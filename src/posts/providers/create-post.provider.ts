import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class CreatePostProvider {
  constructor(
    /**
     * injecting the users service
     */
    @Inject(UsersService)
    private readonly usersService: UsersService,

    /**
     * Injecting the post repository
     */
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    /**
     * Injecting the tag service
     */
    private readonly tagsService: TagsService,
  ) {}

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author, tags;
    try {
      // find the author
      author = await this.usersService.findOneById(user.sub);

      // find the tags and assign them to the post
      tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    } catch (error) {
      throw new ConflictException(error);
    }

    console.log(tags, createPostDto.tags);

    if (createPostDto.tags.length !== tags.length) {
      throw new BadRequestException('Please check your tag Ids');
    }
    // create the metaOptions that come as part of the request
    // let metaOptions = createPostDto.metaOptions
    //   ? this.metaOptionRepository.create(createPostDto.metaOptions)
    //   : null;

    // if (metaOptions) {
    //   await this.metaOptionRepository.save(metaOptions);
    // }

    // create post
    const post = this.postRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    // if metaoptions exist in the request, add them to the post
    // if (metaOptions) {
    //   post.metaOptions = metaOptions;

    try {
      return await this.postRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure post slug is unique',
      });
    }
    // }

    // return the post to the user
  }
}

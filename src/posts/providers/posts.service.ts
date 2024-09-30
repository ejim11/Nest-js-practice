import {
  BadRequestException,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/past-post.dto';
import { GetPostsDto } from '../dtos/get-post.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class PostsService {
  // injecting users service
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
     * Injecting the metaValue repository
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,

    /**
     * Injecting the tag service
     */
    private readonly tagsService: TagsService,

    /**
     * Injecting the pagination provider
     */
    private readonly paginationProvider: PaginationProvider,

    /**
     * Inject create post provider
     */
    private readonly createPostProvider: CreatePostProvider,
  ) {}

  /**
   * Creating new posts
   */
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    return await this.createPostProvider.create(createPostDto, user);
  }

  public async findAll(
    userId: string,
    postQuery: GetPostsDto,
  ): Promise<Paginated<Post>> {
    // const user = this.usersService.findOneById('1234');
    // console.log(userId);

    //users service,
    // find a user
    // const user = this.usersService.findOneById(userId);

    // const posts = await this.postRepository.find({
    //   relations: {
    //     metaOptions: true,
    //     // author: true,
    //     // tags: true,
    //   },
    //   // no of posts to skip in one query
    //   skip: (postQuery.page - 1) * postQuery.limit,
    //   // the no of posts to take in one query
    //   take: postQuery.limit,
    // });

    const posts = await this.paginationProvider.paginationQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postRepository,
    );

    return posts;
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags, post;

    // find the tags
    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    /**
     * No of tags need to be equal
     */
    if (!tags || tags.length !== patchPostDto.tags.length) {
      throw new BadRequestException(
        'Please check your tag Ids and ensure they are correct',
      );
    }

    // find the post
    try {
      post = await this.postRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!post) {
      throw new BadRequestException('Post id does not exist');
    }

    // update the properties of the post

    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishedOn = patchPostDto.publishOn ?? post.publishedOn;

    // assign the tags to the post
    post.tags = tags;

    // save the post and return it
    try {
      await this.postRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment, please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }
    return post;
  }

  public async delete(id: number) {
    await this.postRepository.delete(id);
    // find the post
    // let post = await this.postRepository.findOneBy({ id });

    // let inversePost = await this.metaOptionRepository.find({
    //   where: { id: post.metaOptions.id },
    //   relations: { post: true },
    // });

    // console.log(inversePost);

    // // delete the post
    // await this.postRepository.delete(id);

    // // delete the metaoptions
    // await this.metaOptionRepository.delete(post.metaOptions.id);

    return { deleted: true, id };
  }
}

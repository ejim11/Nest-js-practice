import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-options.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
    public readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  /**
   * Creating new posts
   */
  public async create(createPostDto: CreatePostDto) {
    // create the metaOptions that come as part of the request
    // let metaOptions = createPostDto.metaOptions
    //   ? this.metaOptionRepository.create(createPostDto.metaOptions)
    //   : null;

    // if (metaOptions) {
    //   await this.metaOptionRepository.save(metaOptions);
    // }

    // create post
    const post = this.postRepository.create(createPostDto);

    // if metaoptions exist in the request, add them to the post
    // if (metaOptions) {
    //   post.metaOptions = metaOptions;
    // }

    return await this.postRepository.save(post);

    // return the post to the user
  }

  public async findAll(userId: string) {
    const user = this.usersService.findOneById('1234');
    console.log(userId);

    //users service,
    // find a user
    // const user = this.usersService.findOneById(userId);

    const posts = await this.postRepository.find({
      // relations: {
      //   metaOptions: true,
      // },
    });

    return posts;
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

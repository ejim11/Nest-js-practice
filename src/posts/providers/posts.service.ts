import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostsService {
  // injecting users service
  constructor(private readonly usersService: UsersService) {}

  public findAll(userId: string) {
    console.log(userId);

    //users service,
    // find a user
    const user = this.usersService.findOneById(userId);

    return [
      {
        user: user,
        title: 'Test Title 1',
        content: 'Test content',
      },
      {
        user: user,
        title: 'Test Title 2',
        content: 'Test content 2',
      },
    ];
  }

  public createPost(createPostDto: CreatePostDto) {
    console.log(createPostDto);
  }
}

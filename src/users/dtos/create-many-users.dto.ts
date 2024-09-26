import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreataeManyUsersDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: {
      // the type of entity we expect for each of the items
      type: 'User',
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  //   this tells the type of values we are expecting in each nested obj
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}

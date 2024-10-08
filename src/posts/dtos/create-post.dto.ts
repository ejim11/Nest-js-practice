import {
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postType } from '../enums/postType.enum';
import { postStatus } from '../enums/postStatus.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  @MaxLength(512)
  @ApiProperty({
    description: 'This is the title for the blog post',
    example: 'This is a title',
  })
  title: string;

  @ApiProperty({
    enum: postType,
    description: "Possible values, 'post', 'page', 'story', 'series'",
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description: "For example - 'my-url'",
    example: 'my-blog-post',
  })
  @IsString()
  @MaxLength(256)
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only hyphen"-" and without spaces. For example "my-url"',
  })
  slug: string;

  @ApiProperty({
    enum: postStatus,
    description: "Possible values, 'draft', 'scheduled', 'review', 'published'",
  })
  @IsEnum(postStatus)
  status: postStatus;

  @ApiPropertyOptional({
    description: 'This is the content of the post',
    example: 'post content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description:
      'Serialize your JSON object else a validation error will be thrown',
    example:
      '{\r\n    "@context": "https://schema.org",\r\n    "@type": "Person"\r\n  }',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'This is the featured post image',
    example: 'http://localhost.com/images/image.jpg',
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'This is the date of publication of blog post',
    example: '2024-03-16T07:46:32+0000',
  })
  @IsOptional()
  @IsDate()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'An array of tag id',
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];

  // @CreatePostMetaOptionsDto()
  @ApiPropertyOptional({
    type: 'object',
    required: false,
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: 'json',
          description: 'The metavalue is a json string',
          example: `{"sidebarEnabled": true}`,
        },
      },
    },
  })
  @IsOptional()
  // This decorator ensures all the validators are conducted but does not know what it should match
  @ValidateNested({ each: true })
  // it matches incoming requests to the dto and creates and creates an instance when an incoming request comes in and all the properties are checked too to ensure they match
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto | null;

  // @IsNotEmpty()
  // @ApiProperty({
  //   type: 'integer',
  //   required: true,
  //   example: 1,
  // })
  // @IsInt()
  // authorId: number;
}

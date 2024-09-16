import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { postType } from './enums/postType.enum';
import { postStatus } from './enums/postStatus.enum';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: postType,
    nullable: false,
    default: postType.POST,
  })
  postType: postType;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: postStatus,
    nullable: false,
    default: postStatus.DRAFT,
  })
  status: postStatus;

  @Column({
    nullable: true,
    type: 'text',
  })
  content?: string;

  @Column({ nullable: true, type: 'text' })
  schemas?: string;

  @Column({ type: 'varchar', nullable: true, length: 1024 })
  featuredImages?: string;

  @Column({
    type: 'timestamp', //datetime in mysql
    nullable: true,
  })
  publishedOn?: Date;

  // work on these in lectures on relationships
  tags: string[];
  metaOptions?: CreatePostMetaOptionsDto[];
}

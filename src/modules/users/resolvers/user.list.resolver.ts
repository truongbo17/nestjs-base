import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserListGraphql } from '../dtos/graphql/user.list.graphql';
import { UserService } from '../services/user.service';
import { UserEntity } from '../repository/entities/user.entity';

@Resolver()
export class UserListResolver {
  constructor(private readonly userService: UserService) {}

  // @ValidateInput()
  @Query(() => [UserEntity], {
    name: 'getUserByEmail',
    description: 'Get a user by ID',
  })
  async findUsersByEmail(
    @Args('input', { nullable: true }) input: UserListGraphql
  ): Promise<UserEntity[]> {
    return await this.userService.findByEmail(input.email);
  }
}

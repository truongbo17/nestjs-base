import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserListGraphql {
  @Field()
  email: string;
}

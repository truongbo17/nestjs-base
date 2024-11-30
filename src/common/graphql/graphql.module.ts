import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import process from 'node:process';
import { Environment } from '../../config/app.config';
import { AppResolver } from '../resolvers/query.resolver';
import { UserListResolver } from '../../modules/users/resolvers/user.list.resolver';
import { UsersModule } from '../../modules/users/users.module';
import { GraphQLError, GraphQLFormattedError } from 'graphql/error';

@Module({
  imports: [
    UsersModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      fieldResolverEnhancers: ['interceptors'],
      driver: ApolloDriver,
      playground: process.env.APP_ENV !== Environment.PRODUCTION,
      definitions: {
        path: join(__dirname, '..', '..', 'graphql.ts'),
      },
      autoSchemaFile: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.message,
        };
        return graphQLFormattedError;
      },
    }),
  ],
  providers: [AppResolver, UserListResolver],
})
export class GraphqlModule {}

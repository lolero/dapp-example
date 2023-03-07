import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authUtilGetAuthUsersServiceProvider } from '../../../../api-nest-utils/src';
import { UsersController } from './users.controller';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [UsersService, authUtilGetAuthUsersServiceProvider(UsersService)],
  exports: [UsersService],
})
export class UsersModule {}

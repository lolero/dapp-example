import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authUtilGetAuthUsersServiceProvider } from '@js-modules/apps-nest-module-auth';
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

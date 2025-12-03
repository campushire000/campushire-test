import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CollegeModule } from './college/college.module';

@Module({
  imports: [UsersModule, CollegeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

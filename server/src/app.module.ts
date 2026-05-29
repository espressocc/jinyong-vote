import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { VoteModule } from '@/vote/vote.module';

@Module({
  imports: [VoteModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

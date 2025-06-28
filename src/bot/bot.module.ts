import { BotService } from '../bot/bot.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [BotService],
})
export class BotModule {}

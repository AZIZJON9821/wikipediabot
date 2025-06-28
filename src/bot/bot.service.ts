import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import axios from 'axios';

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Telegraf;
  private logger = new Logger(BotService.name);

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE');
  }

  async onModuleInit() {
    this.bot.start(async (ctx) => {
      await ctx.reply('👋 Assalomu alaykum! Wikipedia botga xush kelibsiz.\n\n🔍 Endi menga qidirish uchun so‘z yuboring.');
    });

    this.bot.on('text', async (ctx) => {
      const query = ctx.message.text.trim();

      if (query.startsWith('/')) {
        return;
      }

      try {
        const summary = await this.fetchWikipediaSummary(query);
        await ctx.reply(summary);
      } catch (error) {
        await ctx.reply('❌ Kechirasiz, maʼlumot topilmadi yoki xatolik yuz berdi.');
      }
    });

    await this.bot.launch();
    this.logger.log('Wikipedia bot ishga tushdi');
  }

  private async fetchWikipediaSummary(query: string): Promise<string> {
    const url = `https://uz.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const response = await axios.get(url);

    if (response.data.extract) {
      return `📚 *${response.data.title}*:\n\n${response.data.extract}\n\n🔗 [Wikipedia sahifasi](https://uz.wikipedia.org/wiki/${encodeURIComponent(query)})`;
    } else {
      throw new Error('Maqola topilmadi');
    }
  }
}

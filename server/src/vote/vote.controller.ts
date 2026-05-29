import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { VoteService } from './vote.service';

@Controller('characters')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCharacters() {
    const characters = await this.voteService.getCharacters();
    return {
      status: 'success',
      data: characters,
    };
  }

  @Post('vote')
  @HttpCode(HttpStatus.OK)
  async vote(@Body() body: { characterId: number }) {
    const { characterId } = body;
    const result = await this.voteService.vote(characterId);
    return {
      status: 'success',
      data: result,
    };
  }
}

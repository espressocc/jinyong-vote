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

  // 获取某个人物的评论
  @Get('comments')
  @HttpCode(HttpStatus.OK)
  async getComments(@Body() body: { characterId: number }) {
    const { characterId } = body;
    const comments = await this.voteService.getComments(characterId);
    return {
      status: 'success',
      data: comments,
    };
  }

  // 发表评论
  @Post('comments')
  @HttpCode(HttpStatus.OK)
  async addComment(@Body() body: { characterId: number; content: string; nickname: string }) {
    const { characterId, content, nickname } = body;
    const result = await this.voteService.addComment(characterId, content, nickname);
    return {
      status: 'success',
      data: result,
    };
  }
}

import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateInterviewAnswerDto, CreateInterviewSessionDto } from './dto/interview.dto';
import { InterviewsService } from './interviews.service';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createSession(@Req() req: any, @Body() dto: CreateInterviewSessionDto) {
    return this.interviewsService.createSession(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getUserSessions(@Req() req: any) {
    return this.interviewsService.getUserSessions(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getSession(@Req() req: any, @Param('id') id: string) {
    return this.interviewsService.getSessionById(req.user.id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/answers')
  addAnswer(@Req() req: any, @Param('id') id: string, @Body() dto: CreateInterviewAnswerDto) {
    return this.interviewsService.addAnswer(req.user.id, id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/complete')
  completeSession(@Req() req: any, @Param('id') id: string) {
    return this.interviewsService.completeSession(req.user.id, id);
  }
}

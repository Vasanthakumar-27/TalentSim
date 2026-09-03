import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterviewAnswerDto, CreateInterviewSessionDto } from './dto/interview.dto';

@Injectable()
export class InterviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(userId: string, dto: CreateInterviewSessionDto) {
    return this.prisma.interviewSession.create({
      data: {
        userId,
        role: dto.role,
        company: dto.company ?? null,
        interviewType: dto.interviewType,
        difficulty: dto.difficulty,
        status: 'DRAFT',
      },
    });
  }

  async getUserSessions(userId: string) {
    return this.prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        answers: true,
      },
    });
  }

  async getSessionById(userId: string, sessionId: string) {
    const session = await this.prisma.interviewSession.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      include: {
        answers: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Interview session not found');
    }

    return session;
  }

  async addAnswer(userId: string, sessionId: string, dto: CreateInterviewAnswerDto) {
    const session = await this.prisma.interviewSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Interview session not found');
    }

    const answer = await this.prisma.interviewAnswer.create({
      data: {
        sessionId,
        questionText: dto.questionText,
        transcript: dto.transcript,
        aiScore: dto.aiScore ?? null,
        aiFeedback: dto.aiFeedback ?? null,
        wpm: dto.wpm ?? null,
        fillerCount: dto.fillerCount ?? null,
        pauseCount: dto.pauseCount ?? null,
        durationSeconds: dto.durationSeconds ?? null,
      },
    });

    return answer;
  }

  async completeSession(userId: string, sessionId: string) {
    const session = await this.prisma.interviewSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Interview session not found');
    }

    return this.prisma.interviewSession.update({
      where: { id: sessionId },
      data: { status: 'COMPLETED' },
    });
  }
}

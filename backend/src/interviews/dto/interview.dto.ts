import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateInterviewSessionDto {
  @IsString()
  @MinLength(2)
  role: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @MinLength(2)
  interviewType: string;

  @IsString()
  @MinLength(2)
  difficulty: string;
}

export class CreateInterviewAnswerDto {
  @IsString()
  @MinLength(2)
  questionText: string;

  @IsString()
  @MinLength(2)
  transcript: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  aiScore?: number;

  @IsOptional()
  @IsString()
  aiFeedback?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  wpm?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  fillerCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  pauseCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;
}

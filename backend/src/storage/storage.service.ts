import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StorageService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async uploadResume(userId: string, file: { originalname: string; mimetype: string; buffer: Buffer }) {
    if (!file || !file.buffer) {
      throw new BadRequestException('Resume file is required');
    }

    const fileName = file.originalname.replace(/\s+/g, '-');
    const storagePath = `resumes/${userId}/${Date.now()}-${fileName}`;

    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co') {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.storage.from('resumes').upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

      if (error) {
        throw new BadRequestException(`Storage upload failed: ${error.message}`);
      }
    }

    const record = await this.prisma.resumeUpload.create({
      data: {
        userId,
        fileName,
        storagePath,
      },
    });

    return {
      id: record.id,
      fileName: record.fileName,
      storagePath: record.storagePath,
      message: supabaseUrl && supabaseKey ? 'Resume uploaded successfully' : 'Resume saved to local dev storage path',
    };
  }
}

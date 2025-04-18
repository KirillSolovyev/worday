import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { GoogleGenAI, type GenerateContentParameters } from '@google/genai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService implements OnModuleInit {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenAI;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      this.logger.error('GEMINI_API_KEY is not set');
      throw new Error('GEMINI_API_KEY is not set');
    }

    this.genAI = new GoogleGenAI({ apiKey });

    this.logger.log('Gemini service initialized');
  }

  async generateContent(genParams: GenerateContentParameters): Promise<string | undefined> {
    if (!this.genAI) {
      this.logger.error('Gen AI is not initialized');
      throw new Error('Gen AI is not initialized');
    }

    try {
      this.logger.log(`Generating response`);

      const result = await this.genAI.models.generateContent(genParams);
      const text = result.text;

      this.logger.log(`Generated response: ${text?.slice(0, 50)}...`);
      return text;
    } catch (error) {
      this.logger.error('Error generating response:', error);
      throw error;
    }
  }
}

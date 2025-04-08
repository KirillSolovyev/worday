import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '@/entities/gemini';

@Injectable()
export class WordService {
  private readonly logger = new Logger(WordService.name);
  private words: string[] = [];

  constructor(private geminiService: GeminiService) {}

  async getWord() {
    const prompt = `You are a language teacher. Generate a single new word in English and return it. Return a unique word every time. Already generated words: ${this.words.join(', ')}`;

    try {
      this.logger.log('Generating word...');

      const response = await this.geminiService.generateResponse(prompt);
      this.words.push(response);

      this.logger.log(`Word generated successfully`);
      return response;
    } catch (error) {
      this.logger.error('Error generating word:', error);
      throw error;
    }
  }
}

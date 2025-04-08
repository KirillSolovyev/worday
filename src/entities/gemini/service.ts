import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService implements OnModuleInit {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      this.logger.error('GEMINI_API_KEY is not set');
      throw new Error('GEMINI_API_KEY is not set');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        maxOutputTokens: 100,
        temperature: 1,
        topP: 0.1,
        topK: 16,
      },
    });

    this.logger.log('Gemini service initialized with model: gemini-2.0-flash');
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.model) {
      this.logger.error('Model is not initialized');
      throw new Error('Model is not initialized');
    }

    try {
      this.logger.log(`Generating response for prompt: ${prompt.slice(0, 50)}...`);
      this.logger.log(this.model.generationConfig);

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();

      this.logger.log(`Generated response: ${text.slice(0, 50)}...`);
      return text;
    } catch (error) {
      this.logger.error('Error generating response:', error);
      throw error;
    }
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Type } from '@google/genai';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { GeminiService } from '@/services/gemini';
import { Language } from '@/shared/config/languages';
import { GetLanguageDTO, ParsedLanguage } from './types';

@Injectable()
export class LanguageService {
  constructor(private geminiService: GeminiService) {}

  async getLanguageFromPrompt({ userPrompt }: GetLanguageDTO) {
    const prompt = `
A user texted about the language of his choice: "${userPrompt}".
You should understand what language the user asked for.
If is not clearly stated about the language, then return "null"

Ex: english - en, русский - ru, I am learning english - en, I like dogs - null, fdgfdgdfg - null
`;

    const response = await this.geminiService.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            language: {
              type: Type.STRING,
              enum: [...Object.values(Language), 'null'],
              description: 'The language selected by the user',
            },
          },
          required: ['language'],
        },
      },
    });

    if (!response) {
      throw new NotFoundException('Language not found or empty');
    }

    const parsedLanguage = plainToClass(ParsedLanguage, JSON.parse(response));
    const errors = await validate(parsedLanguage);

    if (errors.length > 0) {
      throw new BadRequestException(errors[0], 'Failed to parse language');
    }

    return parsedLanguage.language;
  }
}

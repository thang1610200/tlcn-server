import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { CreateListQuizzDto, OutputFormat } from './dto/create-list-quizz.dto';
import { ConfigService } from '@nestjs/config';
import { ChatgptServiceInterface } from './interfaces/chatgpt.service.interface';
import { PrismaService } from 'src/prisma.service';
import { QuizzService } from 'src/quizz/quizz.service';
import { OutputFormatMC, OutputFormatTF } from './dto/output-format.dto';
import { ChatSession, GoogleGenerativeAI } from "@google/generative-ai";
import { parseSync, stringifySync } from 'subtitle';
import fetch from 'node-fetch';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class ChatgptService implements ChatgptServiceInterface {
    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
        private readonly quizzService: QuizzService,
        private readonly uploadService: UploadService
    ) {}
    private readonly openai = new OpenAI({
        //organization: this.configService.get('ORGANIZATION_ID'),
        apiKey: this.configService.get('OPENAI_API_KEY'),
    });

    async translateSubtitle(subtitleUrl: any): Promise<string> {
        try {
            const file = await fetch(subtitleUrl.payload);
            const buffer = await file.buffer();

            const output_format = {
                "Input": "Translation of subtitles"
            }

            let subtitle = parseSync(buffer.toString());

            subtitle = subtitle.filter(line => line.type === 'cue');

            let previousSubtitles = [];

            for (let i = 0; i < subtitle.length; i++) {
                let text: string = subtitle[i].data['text'];

                let input: {
                    Input: string,
                    Next?: string
                } = { Input: text };

                if (subtitle[i + 1]) {
                    input.Next = subtitle[i + 1].data['text'];
                }
                let completion: ChatSession;

                for(;;) {
                    try {
                        let output_format_prompt: string = `\nYou are to output the following in json format: ${JSON.stringify(
                            output_format,
                        )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

                        const model = this.genai.getGenerativeModel({
                            model: 'gemini-1.0-pro-001',
                        },{
                            timeout: 60 * 1000
                        });

                        completion = model.startChat({
                            history: [
                                {
                                    role: 'user',
                                    parts: JSON.stringify(input)
                                },
                                ...previousSubtitles.slice(-4),
                                {
                                    role: 'model',
                                    parts: `You are a program responsible for translating subtitles. Your task is to output the specified target language based on the input text. Please do not create the following subtitles on your own. Please do not output any text other than the translation. You will receive the subtitles as array that needs to be translated, as well as the previous translation results and next subtitle. You need to review the previous and next subtitles to translate the current subtitle to suit the context.If you need to merge the subtitles with the following line, simply repeat the translation. Please transliterate the person's name into the local language. Target language: Vietnamese`
                                    + output_format_prompt
                                }
                            ]
                        });
                        break;
                    }
                    catch {
                        throw new InternalServerErrorException();
                    }
                }

                try {
                    const result = await completion.sendMessage(JSON.stringify(input));

                    const response = await result.response;
        
                    let res: string = response.text() ?? '';

                    res = JSON.parse(res).Input;

                    previousSubtitles.push({ role: 'model', parts: JSON.stringify({ ...input, Input: res }) });
                    previousSubtitles.push({ role: 'user', parts: JSON.stringify(input) });

                    subtitle[i].data['text'] = res;
                }
                catch {
                    throw new InternalServerErrorException();
                }
            }

            const output_file = stringifySync(subtitle, {format: 'WebVTT'});

            const fileAWS = {
                originalname: 'translate-learning.vtt',
                buffer: Buffer.from(output_file)
            }

            return await this.uploadService.uploadAttachmentToS3(fileAWS);
        }
        catch {
            throw new InternalServerErrorException();
        }

    }

    private readonly genai = new GoogleGenerativeAI(this.configService.get('GEMINI_API_KEY'));

    // async strict_output(
    //     system_prompt: string,
    //     user_prompt: string | string[],
    //     output_format: OutputFormat,
    //     default_category: string = '',
    //     output_value_only: boolean = false,
    //     model: string = 'gpt-3.5-turbo',
    //     temperature: number = 1,
    //     num_tries: number = 3,
    // ): Promise<
    //     {
    //         question: string;
    //         answer: string;
    //     }[]
    // > {
    //     // if the user input is in a list, we also process the output as a list of json
    //     const list_input: boolean = Array.isArray(user_prompt);
    //     // if the output format contains dynamic elements of < or >, then add to the prompt to handle dynamic elements
    //     const dynamic_elements: boolean = /<.*?>/.test(
    //         JSON.stringify(output_format),
    //     );
    //     // if the output format contains list elements of [ or ], then we add to the prompt to handle lists
    //     const list_output: boolean = /\[.*?\]/.test(
    //         JSON.stringify(output_format),
    //     );

    //     // start off with no error message
    //     let error_msg: string = '';

    //     for (let i = 0; i < num_tries; i++) {
    //         let output_format_prompt: string = `\nYou are to output the following in json format: ${JSON.stringify(
    //             output_format,
    //         )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

    //         if (list_output) {
    //             output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
    //         }

    //         // if output_format contains dynamic elements, process it accordingly
    //         if (dynamic_elements) {
    //             output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
    //         }

    //         // if input is in a list format, ask it to generate json in a list
    //         if (list_input) {
    //             output_format_prompt += `\nGenerate a list of json, one json for each input element.`;
    //         }

    //         // Use OpenAI to get a response
    //         const response = await this.openai.chat.completions.create({
    //             temperature: temperature,
    //             model: model,
    //             messages: [
    //                 {
    //                     role: 'system',
    //                     content:
    //                         system_prompt + output_format_prompt + error_msg,
    //                 },
    //                 { role: 'user', content: user_prompt.toString() },
    //             ],
    //         });

    //         let res: string = response.choices[0].message?.content ?? '';

    //         // ensure that we don't replace away apostrophes in text
    //         res = res.replace(/(\w)"(\w)/g, "$1'$2");
    //         // try-catch block to ensure output format is adhered to
    //         try {
    //             let output: any = JSON.parse(res);

    //             output = !Array.isArray(output) ? new Array(output) : output;
    //             // check for each element in the output_list, the format is correctly adhered to
    //             for (let index = 0; index < output.length; index++) {
    //                 for (const key in output_format) {
    //                     // unable to ensure accuracy of dynamic output header, so skip it
    //                     if (/<.*?>/.test(key)) {
    //                         continue;
    //                     }

    //                     //if output field missing, raise an error
    //                     if (!(key in output[index])) {
    //                         throw new Error(`${key} not in json output`);
    //                     }

    //                     // check that one of the choices given for the list of words is an unknown
    //                     if (Array.isArray(output_format[key])) {
    //                         const choices = output_format[key] as string[];
    //                         // ensure output is not a list
    //                         if (Array.isArray(output[index][key])) {
    //                             output[index][key] = output[index][key][0];
    //                         }
    //                         // output the default category (if any) if GPT is unable to identify the category
    //                         if (
    //                             !choices.includes(output[index][key]) &&
    //                             default_category
    //                         ) {
    //                             output[index][key] = default_category;
    //                         }
    //                         // if the output is a description format, get only the label
    //                         if (output[index][key].includes(':')) {
    //                             output[index][key] =
    //                                 output[index][key].split(':')[0];
    //                         }
    //                     }
    //                 }

    //                 // if we just want the values for the outputs
    //                 if (output_value_only) {
    //                     output[index] = Object.values(output[index]);
    //                     // just output without the list if there is only one element
    //                     if (output[index].length === 1) {
    //                         output[index] = output[index][0];
    //                     }
    //                 }
    //             }

    //             return output;
    //         } catch (e) {
    //             error_msg = `\n\nResult: ${res}\n\nError message: ${e}`;
    //             console.log(e);
    //             throw new InternalServerErrorException();
    //         }
    //     }

    //     return [];
    // }

    async strict_output(
        system_prompt: string,
        user_prompt: string | string[],
        output_format: OutputFormat,
        default_category: string = '',
        output_value_only: boolean = false,
        model: string = 'gemini-1.0-pro-latest',
        temperature: number = 0.9,
        num_tries: number = 3,
    ): Promise<
        {
            question: string;
            answer: string;
        }[]
    > {
        // if the user input is in a list, we also process the output as a list of json
        const list_input: boolean = Array.isArray(user_prompt);
        // if the output format contains dynamic elements of < or >, then add to the prompt to handle dynamic elements
        const dynamic_elements: boolean = /<.*?>/.test(
            JSON.stringify(output_format),
        );
        // if the output format contains list elements of [ or ], then we add to the prompt to handle lists
        const list_output: boolean = /\[.*?\]/.test(
            JSON.stringify(output_format),
        );

        // start off with no error message
        let error_msg: string = '';

        for (let i = 0; i < num_tries; i++) {
            let output_format_prompt: string = `\nYou are to output the following in json format: ${JSON.stringify(
                output_format,
            )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

            if (list_output) {
                output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
            }

            // if output_format contains dynamic elements, process it accordingly
            if (dynamic_elements) {
                output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
            }

            // if input is in a list format, ask it to generate json in a list
            if (list_input) {
                output_format_prompt += `\nGenerate a list of json, one json for each input element.`;
            }

            const models = this.genai.getGenerativeModel({model});

            const chat = models.startChat({
                history: [
                    {
                        role: 'user',
                        parts: user_prompt.toString()
                    },
                    {
                        role: 'model',
                        parts: system_prompt + output_format_prompt + error_msg
                    }
                ],
                generationConfig: {
                    temperature
                }
            });

            const result = await chat.sendMessage(user_prompt.toString());
            const response = await result.response;

            let res: string = response.text() ?? '';

            // ensure that we don't replace away apostrophes in text
            res = res.replace(/(\w)"(\w)/g, "$1'$2");
            // try-catch block to ensure output format is adhered to
            try {
                let output: any = JSON.parse(res);

                output = !Array.isArray(output) ? new Array(output) : output;
                // check for each element in the output_list, the format is correctly adhered to
                for (let index = 0; index < output.length; index++) {
                    for (const key in output_format) {
                        // unable to ensure accuracy of dynamic output header, so skip it
                        if (/<.*?>/.test(key)) {
                            continue;
                        }

                        //if output field missing, raise an error
                        if (!(key in output[index])) {
                            throw new Error(`${key} not in json output`);
                        }

                        // check that one of the choices given for the list of words is an unknown
                        if (Array.isArray(output_format[key])) {
                            const choices = output_format[key] as string[];
                            // ensure output is not a list
                            if (Array.isArray(output[index][key])) {
                                output[index][key] = output[index][key][0];
                            }
                            // output the default category (if any) if GPT is unable to identify the category
                            if (
                                !choices.includes(output[index][key]) &&
                                default_category
                            ) {
                                output[index][key] = default_category;
                            }
                            // if the output is a description format, get only the label
                            if (output[index][key].includes(':')) {
                                output[index][key] =
                                    output[index][key].split(':')[0];
                            }
                        }
                    }

                    // if we just want the values for the outputs
                    if (output_value_only) {
                        output[index] = Object.values(output[index]);
                        // just output without the list if there is only one element
                        if (output[index].length === 1) {
                            output[index] = output[index][0];
                        }
                    }
                }

                return output;
            } catch (e) {
                console.log(e);
                throw new InternalServerErrorException();
            }
        }

        return [];
    }

    async addListQuizzTFToDB(
        payload: CreateListQuizzDto,
        question: OutputFormatTF[],
    ): Promise<string> {
        const user = await this.quizzService.findUserByEmail(payload.email);
        const course = await this.quizzService.findCourseBySlug(payload.course_slug, user.id);
        const chapter = await this.quizzService.findChapterByToken(payload.chapter_token, course.id);
    
        const exercise = await this.quizzService.findExcersie(chapter.id, payload.exercise_token);

        try {
            return await this.prismaService.$transaction(async (tx) => {
                await Promise.all(
                    question.map(async (item) => {
                        const lastQuizz = await this.prismaService.quizz.findFirst({
                            where: {
                                exerciseId: exercise.id,
                            },
                            orderBy: {
                                position: 'desc',
                            },
                        });
        
                        const newPosition = lastQuizz ? lastQuizz.position + 1 : 1;
        
                        await tx.quizz.create({
                            data: {
                                token: new Date().getTime().toString(),
                                question: item.question,
                                answer:
                                    item.answer,
                                position: newPosition,
                                exerciseId: exercise.id,
                                option: ['True', 'False'],
                                explain: item?.explain || '',
                            },
                        });
                    })
                );
    
                return 'SUCCESS';
            });
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    async addListQuizzMCToDB(
        payload: CreateListQuizzDto,
        question: OutputFormatMC[],
    ): Promise<string> {
        const user = await this.quizzService.findUserByEmail(payload.email);
        const course = await this.quizzService.findCourseBySlug(payload.course_slug, user.id);
        const chapter = await this.quizzService.findChapterByToken(payload.chapter_token, course.id);
    
        const exercise = await this.quizzService.findExcersie(chapter.id, payload.exercise_token);

        try {
            return this.prismaService.$transaction(async (tx) => {
                await Promise.all(
                    question.map(async (item) => {
                        const lastQuizz = await this.prismaService.quizz.findFirst({
                            where: {
                                exerciseId: exercise.id,
                            },
                            orderBy: {
                                position: 'desc',
                            },
                        });
        
                        const newPosition = lastQuizz ? lastQuizz.position + 1 : 1;
        
                        await tx.quizz.create({
                            data: {
                                token: new Date().getTime().toString(),
                                question: item.question,
                                answer:
                                    item.answer,
                                position: newPosition,
                                exerciseId: exercise.id,
                                option: [
                                    item?.option1 || '',
                                    item?.option2 || '',
                                    item?.option3 || '',
                                    item.answer,
                                ],
                                explain: item?.explain || '',
                            },
                        });
                    })
                );
    
                return 'SUCCESS';
            });
        } catch (err: any) {
            throw new InternalServerErrorException();
        }
    }

    async createQuizzList(payload: CreateListQuizzDto): Promise<any> {
        const format =
            payload.type === 'True Or False'
                ? {
                      question: 'question',
                      answer: 'answer',
                      explain: 'explain why you chose the answer',
                  }
                : {
                      question: 'question',
                      answer: 'answer with max length of 15 words',
                      option1: 'option1 with max length of 15 words',
                      option2: 'option2 with max length of 15 words',
                      option3: 'option3 with max length of 15 words',
                      explain: 'explain why you chose the answer',
                  };

        const questions = await this.strict_output(
            `You are a helpful AI that is able to generate ${payload.type} include questions and answers, the length of each answer should not be more than 15 words, store all answers, questions, options, explain in a JSON array by language Vietnamese.`,
            `You are to generate ${payload.amount} question random level ${payload.level} ${payload.type} about ${payload.topic}`,
            format,
        );
        if (questions.length < payload.amount) {
            throw new InternalServerErrorException();
        } else {
            return payload.type === 'True Or False'
                ? this.addListQuizzTFToDB(
                      payload,
                      questions.slice(0, payload.amount),
                  )
                : this.addListQuizzMCToDB(
                      payload,
                      questions.slice(0, payload.amount),
                  );
        }
    }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { CreateListQuizzDto, OutputFormat } from './dto/create-list-quizz.dto';
import { ConfigService } from '@nestjs/config';
import { ChatgptServiceInterface } from './interfaces/chatgpt.service.interface';
import { PrismaService } from 'src/prisma.service';
import { QuizzService } from 'src/quizz/quizz.service';
import { OutputFormatMC, OutputFormatTF } from './dto/output-format.dto';
import { GoogleGenerativeAI } from "@google/generative-ai";

@Injectable()
export class ChatgptService implements ChatgptServiceInterface {
    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
        private readonly quizzService: QuizzService,
    ) {}

    private readonly openai = new OpenAI({
        //organization: this.configService.get('ORGANIZATION_ID'),
        apiKey: this.configService.get('OPENAI_API_KEY'),
    });

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
        model: string = 'gemini-1.0-pro-001',
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

            // Use OpenAI to get a response
            // const response = await this.openai.chat.completions.create({
            //     temperature,
            //     model,
            //     messages: [
            //         {
            //             role: 'system',
            //             content:
            //                 system_prompt + output_format_prompt + error_msg,
            //         },
            //         { role: 'user', content: user_prompt.toString() },
            //     ],
            // });

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

                await this.prismaService.quizz.create({
                    data: {
                        token: new Date().getTime().toString(),
                        question: item.question,
                        answer:
                            item.answer.charAt(0).toUpperCase() +
                            item.answer.slice(1),
                        position: newPosition,
                        exerciseId: exercise.id,
                        option: ['True', 'False'],
                        explain: item?.explain || '',
                    },
                });
            });

            return 'SUCCESS';
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

                await this.prismaService.quizz.create({
                    data: {
                        token: new Date().getTime().toString(),
                        question: item.question,
                        answer:
                            item.answer.charAt(0).toUpperCase() +
                            item.answer.slice(1),
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
            });

            return 'SUCCESS';
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
        console.log(questions);
        return "dsd";
        // if (questions.length < payload.amount) {
        //     throw new InternalServerErrorException();
        // } else {
        //     return payload.type === 'True Or False'
        //         ? this.addListQuizzTFToDB(
        //               payload,
        //               questions.slice(0, payload.amount),
        //           )
        //         : this.addListQuizzMCToDB(
        //               payload,
        //               questions.slice(0, payload.amount),
        //           );
        // }
    }
}

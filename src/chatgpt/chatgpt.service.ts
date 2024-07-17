import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { CreateListQuizzDto, OutputFormat } from './dto/create-list-quizz.dto';
import { ConfigService } from '@nestjs/config';
import { ChatgptServiceInterface } from './interfaces/chatgpt.service.interface';
import { PrismaService } from 'src/prisma.service';
import { QuizzService } from 'src/quizz/quizz.service';
import { OutputFormatMC, OutputFormatTF } from './dto/output-format.dto';
import { ChatSession, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, InputContent } from "@google/generative-ai";
import { parseSync, stringifySync } from 'subtitle';
import fetch from 'node-fetch';
import { UploadService } from 'src/upload/upload.service';
import { ChatbotUserDto, SummaryCourseDto, SupportCodeDto } from './dto/chatbot-user.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { uuid as v4 } from 'uuidv4';

@Injectable()
export class ChatgptService implements ChatgptServiceInterface {
    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
        private readonly quizzService: QuizzService,
        private readonly uploadService: UploadService,
        private readonly httpService: HttpService,
    ) {}
    private readonly openai = new OpenAI({
        //organization: this.configService.get('ORGANIZATION_ID'),
        apiKey: this.configService.get('OPENAI_API_KEY'),
    });

    private readonly genai = new GoogleGenerativeAI(this.configService.get('GEMINI_API_KEY'));

    // async supportCode(payload: SupportCodeDto): Promise<any> {
    //     try{
    //         const model = this.genai.getGenerativeModel({
    //             model: "gemini-1.5-flash",
    //         });
              
    //         const generationConfig = {
    //             temperature: 0.7,
    //             topP: 0.95,
    //             topK: 64,
    //             maxOutputTokens: 400,
    //         };

    //         const chatSession = model.startChat({
    //             generationConfig,
    //         });

    //         const prompt = `Gemini, mình đang làm bài tập lập trình với đề bài sau: ${payload.codeTitle} sử dụng ngôn ngữ lập trình ${payload.codeLang}
    //                         Mình muốn bạn giúp mình giải quyết bài toán này 1 cách tối ưu nhất và hãy xuất ra nội dung JSON trực tiếp,
    //                         và tách mỗi ngôn ngữ tôi yêu cầu ra 1 JSON riêng biệt,
    //                         không bao gồm bất kỳ phần định dạng nào khác theo định dạng sau: 
    //                         [{
    //                             'id': [1 mã IDv4 ngẫu nhiên],
    //                             'name': [tên của file code],
    //                             'lang': [tên của ngôn ngữ lập trình],
    //                             'code': [viết code mà không cần gán các giá trị và in ra dữ liệu để test thử],
    //                             'explain': [lời giải thích]
    //                         }]`

    //         const result = await chatSession.sendMessage(prompt);

    //         const response = await result.response;

    //         let res = response.text() ?? '';

    //         const regex = /\[\s*\{\s*"id":\s*"([^']*)",\s*"name":\s*"([^']*)",\s*"lang":\s*"([^']*)",\s*"code":\s*"([^']*)",\s*"explain":\s*"([^']*)"\s*}\s*\]/;

    //         //const regex = /\[\s*\{\s*"lang":\s*".*", \s*"code":\s*".*",\s*"explain":\s*".*"\s*}\s*\]/;

    //         //console.log(res.match(regex)[0]);

    //         return res.match(regex)[0];
    //     }
    //     catch(err) {
    //         console.log(err);
    //         throw new InternalServerErrorException()
    //     }
    // }

    async supportCode(payload: SupportCodeDto): Promise<any> {
        const maxRetries = 3;
        let attempts = 0;
    
        while (attempts < maxRetries) {
            try {
                const model = this.genai.getGenerativeModel({
                    model: "gemini-1.5-flash",
                });
    
                const generationConfig = {
                    temperature: 0.7
                };
    
                const chatSession = model.startChat({
                    generationConfig,
                });
    
                // const prompt = `Gemini, mình đang làm bài tập lập trình với đề bài sau: ${payload.codeTitle} sử dụng ngôn ngữ lập trình ${payload.codeLang}
                //                 Mình muốn bạn giúp mình giải quyết bài toán này 1 cách tối ưu nhất và hãy xuất ra nội dung JSON trực tiếp,
                //                 và tách mỗi ngôn ngữ tôi yêu cầu ra 1 JSON riêng biệt,
                //                 không bao gồm bất kỳ phần định dạng nào khác theo định dạng sau: 
                //                 [{
                //                     "id": [1 mã IDv4 ngẫu nhiên],
                //                     "name": [tên của file code],
                //                     "lang": [tên của ngôn ngữ lập trình],
                //                     "code": [viết code mà không cần gán các giá trị và in ra dữ liệu để test thử],
                //                     "explain": [lời giải thích]
                //                 }]`;
                const prompt = `Gemini, I'm working on a programming assignment with the following task: ${payload.codeTitle} using the programming language ${payload.codeLang}.
                                I would like you to help me solve this problem in the most optimal way and output the content directly in JSON format.
                                Separate each language I request into a separate JSON,
                                excluding any other formatting, according to the following format:
                                [{
                                    "id": [a random UUIDv4],
                                    "name": [name of the code file],
                                    "lang": [name of the programming language],
                                    "code": [write the code without assigning values and printing data for testing],
                                    "explain": [explanation]
                                }]`;
    
                const result = await chatSession.sendMessage(prompt);
                const response = await result.response;
                let res = response.text() ?? '';
                res = res.replace(/(\w)"(\w)/g, "$1'$2");
    
                const regex = /\[\s*\{\s*"id":\s*"([^']*)",\s*"name":\s*"([^']*)",\s*"lang":\s*"([^']*)",\s*"code":\s*"([^']*)",\s*"explain":\s*"([^']*)"\s*}\s*\]/;
                const match = res.match(regex);
                console.log(match);
    
                if (match && match[0]) {
                    return match[0];
                } else {
                    attempts++;
                    if (attempts >= maxRetries) {
                        throw new Error("Response did not contain the expected JSON format after multiple attempts.");
                    }
                }
            } catch (err) {
                console.log(err);
                attempts++;
                if (attempts >= maxRetries) {
                    throw new InternalServerErrorException();
                }
            }
        }
    }
    
    async getSummaryCourse(payload: SummaryCourseDto): Promise<string> {
        const course = await this.prismaService.course.findFirst({
            where: {
                slug: payload.course_slug
            },
            select: {
                title: true,
                description: true,
                requirement: true,
                learning_outcome: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        title: true,
                        description: true,  
                        contents: {
                            select: {
                                lesson: {
                                    where: {
                                        isPublished: true
                                    },
                                    select: {
                                        title: true,
                                        description: true
                                    }
                                },
                                exercise: {
                                    where: {
                                        isOpen: true
                                    },
                                    select: {
                                        title: true,
                                        type: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const generationConfig = {
            temperature: 0.5,
            topP: 0.95,
            topK: 64,
            responseMimeType: "text/plain",
        };

        const models = this.genai.getGenerativeModel({model: 'gemini-1.5-pro', generationConfig}, {timeout: 20 * 1000});

        const input = `Tóm tắt khóa học này: ${JSON.stringify(course)}`;

        //console.log(input.length);

        const chat = models.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{
                        text: 'Bạn là một trợ lý tóm tắt nội dung khóa học. Hãy tóm tắt một cách khách quan, chính xác, tập trung vào những điểm chính, ý tưởng quan trọng và không thêm thông tin không có trong nội dung gốc.'
                    }]
                },
                {
                    role: 'model',
                    parts: [{
                        text: input
                    }]
                }
            ]
        });

        const result = await chat.sendMessage(input);
        const response = await result.response;

        let res: string = response.text() ?? '';

        return res;
    }

    async chatbotUser(payload: ChatbotUserDto): Promise<string> {
        try {
            const model = this.genai.getGenerativeModel({
                model: "gemini-1.5-pro",
            });
              
            const generationConfig = {
                temperature: 0.4,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 8192,
            };

            const safetySettings = [
                {
                  category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                  threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                  category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                  threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                  category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                  threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
                {
                  category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                  threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                },
            ];

            const history: InputContent[] = payload.history.map((item) => {
                return {
                    role: item.label,
                    parts: [
                        {
                            text: item.value
                        }
                    ]
                };
            });

            const chatSession = model.startChat({
                generationConfig,
                safetySettings,
                history
            });
            
            const result = await chatSession.sendMessage(payload.request);
              
            return result.response.text();
        }
        catch(err) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async translateSubtitle(subtitleUrl: string, languageTarget: string): Promise<string> {
        try {
            const file = await fetch(subtitleUrl);
            const buffer = await file.buffer();

            let subtitle = parseSync(buffer.toString());

            subtitle = subtitle.filter(line => line.type === 'cue');

            for (let i = 0; i < subtitle.length; i++) {
                let text: string = subtitle[i].data['text'];

                const { data } = await firstValueFrom(
                    this.httpService.request({
                        baseURL: this.configService.get('ENDPOINT_TRANSLATE'),
                        url: '/translate',
                        method: 'post',
                        headers: {
                            'Ocp-Apim-Subscription-Key': this.configService.get('KEY_TRANSLATE'),
                            'Ocp-Apim-Subscription-Region': this.configService.get('LOCATION_TRANSLATE'),
                            'Content-type': 'application/json',
                            'X-ClientTraceId': v4()
                        },
                        params: {
                            'api-version': '3.0',
                            'to': languageTarget
                        },
                        data: [{
                            'text': text
                        }],
                        responseType: 'json'
                    })
                );
                subtitle[i].data['text'] = data[0].translations[0].text;
            }
            const output_file = stringifySync(subtitle, {format: 'WebVTT'});

           /// console.log(output_file);

            const fileAWS = {
                originalname: 'translate-learning.vtt',
                buffer: Buffer.from(output_file)
            }

            return await this.uploadService.uploadAttachmentToS3(fileAWS);
        }
        catch(err) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    // async translateSubtitle(subtitleUrl: string, languageTarget: string): Promise<string> {
    //     try {
    //         const file = await fetch(subtitleUrl);
    //         const buffer = await file.buffer();

    //         const output_format = {
    //             "Input": "Translation of subtitles"
    //         }

    //         let subtitle = parseSync(buffer.toString());

    //         subtitle = subtitle.filter(line => line.type === 'cue');

    //         let previousSubtitles = [];

    //         for (let i = 0; i < subtitle.length; i++) {
    //             let text: string = subtitle[i].data['text'];

    //             let input: {
    //                 Input: string,
    //                 Next?: string
    //             } = { Input: text };

    //             if (subtitle[i + 1]) {
    //                 input.Next = subtitle[i + 1].data['text'];
    //             }
    //             let completion: ChatSession;

    //             for(;;) {
    //                 try {
    //                     let output_format_prompt: string = `\nYou are to output the following in json format: ${JSON.stringify(
    //                         output_format,
    //                     )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

    //                     const model = this.genai.getGenerativeModel({
    //                         model: 'gemini-1.5-pro',
    //                     },{
    //                         timeout: 60 * 1000
    //                     });

    //                     completion = model.startChat({
    //                         history: [
    //                             {
    //                                 role: 'user',
    //                                 parts: JSON.stringify(input)
    //                             },
    //                             ...previousSubtitles.slice(-4),
    //                             {
    //                                 role: 'model',
    //                                 parts: `You are a program responsible for translating subtitles. Your task is to output the specified target language based on the input text. Please do not create the following subtitles on your own. Please do not output any text other than the translation. You will receive the subtitles as array that needs to be translated, as well as the previous translation results and next subtitle. You need to review the previous and next subtitles to translate the current subtitle to suit the context.If you need to merge the subtitles with the following line, simply repeat the translation. Please transliterate the person's name into the local language. Target language: ${languageTarget}`
    //                                 + output_format_prompt
    //                             }
    //                         ]
    //                     });
    //                     break;
    //                 }
    //                 catch (err) {
    //                     console.log(err);
    //                     throw new InternalServerErrorException();
    //                 }
    //             }

    //             try {
    //                 const result = await completion.sendMessage(JSON.stringify(input));

    //                 const response = await result.response;
        
    //                 let res: string = response.text() ?? '';

    //                 res = JSON.parse(res).Input;

    //                 console.log(res);

    //                 previousSubtitles.push({ role: 'model', parts: JSON.stringify({ ...input, Input: res }) });
    //                 previousSubtitles.push({ role: 'user', parts: JSON.stringify(input) });

    //                 subtitle[i].data['text'] = res;
    //             }
    //             catch(err) {
    //                 console.log(err);
    //                 throw new InternalServerErrorException();
    //             }
    //         }

    //         const output_file = stringifySync(subtitle, {format: 'WebVTT'});

    //         console.log(output_file);

    //         const fileAWS = {
    //             originalname: 'translate-learning.vtt',
    //             buffer: Buffer.from(output_file)
    //         }

    //         return await this.uploadService.uploadAttachmentToS3(fileAWS);
    //     }
    //     catch(err) {
    //         console.log(err);
    //         throw new InternalServerErrorException();
    //     }

    // }

    // async translateSubtitle(subtitleUrl: string, languageTarget: string): Promise<string> {
    //     try {
    //         const file = await fetch(subtitleUrl);
    //         const buffer = await file.buffer();

    //         const output_format = {
    //             "Input": "Translation of subtitles"
    //         }

    //         let subtitle = parseSync(buffer.toString());

    //         subtitle = subtitle.filter(line => line.type === 'cue');

    //         let previousSubtitles = [];

    //         for (let i = 0; i < subtitle.length; i++) {
    //             let text: string = subtitle[i].data['text'];

    //             let input: {
    //                 Input: string,
    //                 Next?: string
    //             } = { Input: text };

    //             if (subtitle[i + 1]) {
    //                 input.Next = subtitle[i + 1].data['text'];
    //             }

    //             for(;;) {
    //                 try {
    //                     let output_format_prompt: string = `\nYou are to output the following in json format: ${JSON.stringify(
    //                         output_format,
    //                     )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

    //                     var completion = await this.openai.chat.completions.create({
    //                         model: "gpt-3.5-turbo",
    //                         messages: [
    //                           {
    //                             role: "system",
    //                             content: `You are a program responsible for translating subtitles. Your task is to output the specified target language based on the input text. Please do not create the following subtitles on your own. Please do not output any text other than the translation. You will receive the subtitles as array that needs to be translated, as well as the previous translation results and next subtitle. You need to review the previous and next subtitles to translate the current subtitle to suit the context.If you need to merge the subtitles with the following line, simply repeat the translation. Please transliterate the person's name into the local language. Target language: ${languageTarget}`
    //                             + output_format_prompt
    //                           },
    //                           ...previousSubtitles.slice(-4),
    //                           {
    //                             role: "user",
    //                             content: JSON.stringify(input)
    //                           }
    //                         ],
    //                     }, {timeout: 60 * 1000 });
    //                     break;
    //                 }
    //                 catch (err) {
    //                     console.log(err);
    //                     throw new InternalServerErrorException();
    //                 }
    //             }

    //             try {
    //                 let result = completion.choices[0].message.content;

    //                 result = JSON.parse(result).Input;

    //                 console.log(result);

    //                 previousSubtitles.push({ role: 'model', parts: JSON.stringify({ ...input, Input: result }) });
    //                 previousSubtitles.push({ role: 'user', parts: JSON.stringify(input) });

    //                 subtitle[i].data['text'] = result;
    //             }
    //             catch(err) {
    //                 console.log(err);
    //                 throw new InternalServerErrorException();
    //             }
    //         }

    //         const output_file = stringifySync(subtitle, {format: 'WebVTT'});

    //         console.log(output_file);

    //         const fileAWS = {
    //             originalname: 'translate-learning.vtt',
    //             buffer: Buffer.from(output_file)
    //         }

    //         return await this.uploadService.uploadAttachmentToS3(fileAWS);
    //     }
    //     catch(err) {
    //         console.log(err);
    //         throw new InternalServerErrorException();
    //     }

    // }

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

    isJsonString(str: string): boolean {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    async strict_output(
        system_prompt: string,
        user_prompt: string | string[],
        output_format: OutputFormat,
        default_category: string = '',
        output_value_only: boolean = false,
        model: string = 'gemini-1.5-pro',
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
                console.log(res);
                if(!this.isJsonString(res)) {
                    res = res.match(/json\s*(\[[\s\S]*?\])/)[1];
                    console.log(res);
                }
                //console.log(JSON.stringify(res));
                let output: any = JSON.parse(res.trim());

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
                                answer: this.capitalizeFirstLetter(item.answer),
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
                      option1: 'option1 with max length of 15 words and must not be the same as the answer',
                      option2: 'option2 with max length of 15 words and must not be the same as the answer',
                      option3: 'option3 with max length of 15 words and must not be the same as the answer',
                      explain: 'explain why you chose the answer and must not be the same as the answer',
                  };

        // const questions = await this.strict_output(
        //     `You are a helpful AI that is able to generate ${payload.type} include questions and answers, the length of each answer should not be more than 15 words, store all answers, questions, options, explain in a JSON array by language Vietnamese.`,
        //     `You are to generate ${payload.amount} question random level ${payload.level} ${payload.type} about ${payload.topic}`,
        //     format,
        // );

        const questions = await this.strict_output(
            `You are an AI that automatically creates quizzes, please help me create a quiz with the form ${payload.type}, includes questions and answers, the length of each answer must not exceed 15 words, store all answers, questions, options, explanations as a JSON array by language Vietnamese`,
            `You muste generate according to the following requirements: topic about ${payload.topic}, ${payload.level} difficulty, number of questions is ${payload.amount}`,
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

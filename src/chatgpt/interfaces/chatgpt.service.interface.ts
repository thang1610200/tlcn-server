import { CreateListQuizzDto, OutputFormat } from '../dto/create-list-quizz.dto';
import { OutputFormatMC, OutputFormatTF } from '../dto/output-format.dto';

export interface ChatgptServiceInterface {
    strict_output(
        system_prompt: string,
        user_prompt: string | string[],
        output_format: OutputFormat,
        default_category: string,
        output_value_only: boolean,
        model: string,
        temperature: number,
        num_tries: number,
    ): Promise<
        {
            question: string;
            answer: string;
        }[]
    >;
    createQuizzList(payload: CreateListQuizzDto): Promise<any>;
    addListQuizzTFToDB(payload: CreateListQuizzDto, question: OutputFormatTF[]): Promise<string>;
    addListQuizzMCToDB(payload: CreateListQuizzDto, question: OutputFormatMC[]): Promise<string>
}

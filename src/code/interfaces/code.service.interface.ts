import { Code, FileCode, LanguageCode } from "@prisma/client";
import { AddQuestionCodeDto, GetDetailCodeDto, UpdateValueCodeDto, GetAllLanguageCodeDto } from "../dto/code.dto";
import { AddFileNameDto } from "../dto/file.dto";

export interface CodeServiceInterface {
    getAllLanguageCode(payload: GetAllLanguageCodeDto): Promise<LanguageCode[]>;
    addQuestionCode(payload: AddQuestionCodeDto): Promise<Code>;
    getDetailCode(payload: GetDetailCodeDto): Promise<Code>;
    updateValueCode(payload: UpdateValueCodeDto): Promise<Code>;
    addFileName(payload: AddFileNameDto): Promise<FileCode>;
}
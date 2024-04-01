import { Code, FileCode, LabCode } from "@prisma/client";
import { AddQuestionCodeDto, GetDetailCodeDto, UpdateValueCodeDto, GetAllLanguageCodeDto } from "../dto/code.dto";
import { AddFileNameDto, UpdateContentFileDto } from "../dto/file.dto";

export interface CodeServiceInterface {
    updateContentFile(payload: UpdateContentFileDto): Promise<FileCode>;
    getAllLanguageCode(payload: GetAllLanguageCodeDto): Promise<LabCode[]>;
    addQuestionCode(payload: AddQuestionCodeDto): Promise<Code>;
    getDetailCode(payload: GetDetailCodeDto): Promise<Code>;
    updateValueCode(payload: UpdateValueCodeDto): Promise<Code>;
    addFileName(payload: AddFileNameDto): Promise<FileCode>;
}
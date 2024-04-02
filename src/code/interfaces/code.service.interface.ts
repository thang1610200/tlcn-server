import { Code, FileCode, LabCode, TestCase } from "@prisma/client";
import { AddQuestionCodeDto, GetDetailCodeDto, UpdateValueCodeDto, GetAllLanguageCodeDto } from "../dto/code.dto";
import { AddFileNameDto, UpdateContentFileDto } from "../dto/file.dto";
import { AddTestCaseDto } from "../dto/test-case.dto";

export interface CodeServiceInterface {
    addTestCase(payload: AddTestCaseDto): Promise<TestCase>;
    updateContentFile(payload: UpdateContentFileDto): Promise<FileCode>;
    getAllLanguageCode(payload: GetAllLanguageCodeDto): Promise<LabCode[]>;
    addQuestionCode(payload: AddQuestionCodeDto): Promise<Code>;
    getDetailCode(payload: GetDetailCodeDto): Promise<Code>;
    updateValueCode(payload: UpdateValueCodeDto): Promise<Code>;
    addFileName(payload: AddFileNameDto): Promise<FileCode>;
}
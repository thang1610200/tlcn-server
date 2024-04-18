import { Code, FileCode, LabCode, TestCase, UserProgress } from "@prisma/client";
import { AddQuestionCodeDto, GetDetailCodeDto, UpdateValueCodeDto, GetAllLanguageCodeDto, SubmitCodeDto, HandleCodeProp, CheckStatusDto } from "../dto/code.dto";
import { AddFileNameDto, UpdateContentFileDto } from "../dto/file.dto";
import { AddTestCaseDto, DeleteTestCaseDto } from "../dto/test-case.dto";

export interface CodeServiceInterface {
    updateLabCode(payload: UpdateValueCodeDto): Promise<Code>;
    addTestCase(payload: AddTestCaseDto): Promise<TestCase>;
    updateContentFile(payload: UpdateContentFileDto): Promise<FileCode>;
    getAllLanguageCode(payload: GetAllLanguageCodeDto): Promise<LabCode[]>;
    addQuestionCode(payload: AddQuestionCodeDto): Promise<Code>;
    getDetailCode(payload: GetDetailCodeDto): Promise<Code>;
    updateValueCode(payload: UpdateValueCodeDto): Promise<Code>;
    addFileName(payload: AddFileNameDto): Promise<FileCode>;
    deleteTestCase(payload: DeleteTestCaseDto): Promise<TestCase>;
    submitCode(payload: SubmitCodeDto): Promise<string>;
    updateFunctioName(payload: UpdateContentFileDto): Promise<FileCode>;
    handleCode(payload: HandleCodeProp): Promise<{
        language_id: string,
        source_code: string
    }[]>;
    checkStatusCode(payload: CheckStatusDto): Promise<string>;
}
import { Code, Course, FileCode, FileTest, LabCode } from "@prisma/client";
import { AddQuestionCodeDto, GetDetailCodeDto, UpdateValueCodeDto, GetAllLanguageCodeDto, SubmitCodeDto, DetailCodeInterface } from "../dto/code.dto";
import { AddFileNameDto, AddFileTestDto, DeleteFileDto, UpdateContentFileDto } from "../dto/file.dto";

export interface CodeServiceInterface {
    updateLabCode(payload: UpdateValueCodeDto): Promise<Code>;
    updateContentFile(payload: UpdateContentFileDto): Promise<FileCode>;
    updateContentTestFile(payload: UpdateContentFileDto): Promise<FileTest>;
    getAllLanguageCode(payload: GetAllLanguageCodeDto): Promise<LabCode[]>;
    addQuestionCode(payload: AddQuestionCodeDto): Promise<Code>;
    getDetailCode(payload: GetDetailCodeDto): Promise<Code>;
    updateValueCode(payload: UpdateValueCodeDto): Promise<Code>;
    addFileName(payload: AddFileNameDto): Promise<FileCode>;
    addFileTest(payload: AddFileTestDto): Promise<FileTest>;
    submitCode(payload: SubmitCodeDto): Promise<boolean>;
    findCourse(slug: string): Promise<Course>;
    detailCode(payload: DetailCodeInterface): Promise<Code>;
    deleteFile(payload: DeleteFileDto): Promise<FileCode>;
}
import { RegisterInstructor, User } from "@prisma/client";
import { RegisterInstructorInterface } from "../dto/register-instructor.dto";
import { DetailRegisterInstructorDto } from "../dto/detail-register-instructor.dto";
import { UpdateStatusRegisterInstructorDto } from "../dto/update-status.dto";
import { UpdateRoleUserSuccess } from "../events/update-role-success.event";

export interface RegisterInstructorServiceInterface {
    findUserByEmail(email: string): Promise<User>;
    addRegisterInstructor(payload: RegisterInstructorInterface): Promise<string>;
    findAll(): Promise<RegisterInstructor[]>;
    detail(payload: DetailRegisterInstructorDto): Promise<RegisterInstructor>;
    updateStatus(payload: UpdateStatusRegisterInstructorDto): Promise<string>;
    sendEmailUpdateStatusSuccess(data: UpdateRoleUserSuccess): Promise<void>;
    sendEmailUpdateStatusReject(data: UpdateRoleUserSuccess): Promise<void>;
    updateRoleUser(email: string): Promise<string>;
}
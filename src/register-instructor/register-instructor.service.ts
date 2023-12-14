import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterInstructorServiceInterface } from './interfaces/register-instructor.service.interface';
import { RegisterInstructorInterface } from './dto/register-instructor.dto';
import { PrismaService } from 'src/prisma.service';
import { RegisterInstructor, User } from '@prisma/client';
import { UploadService } from 'src/upload/upload.service';
import { DetailRegisterInstructorDto } from './dto/detail-register-instructor.dto';
import { UpdateStatusRegisterInstructorDto } from './dto/update-status.dto';
import { MailingService } from 'src/mailing/mailing.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { UpdateRoleUserSuccess } from './events/update-role-success.event';
import { AddRegisterInstructorDto } from './dto/add-register-instructor.dto';

@Injectable()
export class RegisterInstructorService implements RegisterInstructorServiceInterface {
    constructor (private readonly prismaService: PrismaService,
                private readonly uploadService: UploadService,
                private readonly mailingService: MailingService,
                private readonly eventEmitter: EventEmitter2){}

    async findUserByEmail(email: string): Promise<User>{
        const user = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        if(!email){
            throw new UnauthorizedException();
        }

        return user;
    }

    async addRegisterInstructor(payload: RegisterInstructorInterface): Promise<string> {
        const user = await this.findUserByEmail(payload.email);

        const fileName = await this.uploadService.uploadAvatarToS3(payload.file);

        await this.prismaService.registerInstructor.create({
            data: {
                token: new Date().getTime().toString(),
                userId: user.id,
                file: fileName
            }
        });

        return "SUCCESS";
    }

    async findAll(): Promise<RegisterInstructor[]>{
        try {
            const registerInstructor = await this.prismaService.registerInstructor.findMany({
                include: {
                    user: true
                }
            });

            return registerInstructor;
        }
        catch {
            throw new InternalServerErrorException();
        }
    }

    async detail(payload: DetailRegisterInstructorDto): Promise<RegisterInstructor> {
        try {
            const data = await this.prismaService.registerInstructor.findUnique({
                where: {
                    token: payload.token
                },
                include: {
                    user: true
                }
            });

            if(!data){
                throw new NotFoundException();
            }

            return data;
        }
        catch(err: any){
            throw new InternalServerErrorException();
        }
    }

    async updateRoleUser(email: string): Promise<string> {
        await this.prismaService.user.update({
            where: {
                email
            },
            data: {
                role: "INSTRUCTOR"
            }
        });

        return "SUCCESS";
    }

    async updateStatus(payload: UpdateStatusRegisterInstructorDto): Promise<string> {
        try {
            const data = await this.prismaService.registerInstructor.update({
                where: {
                    token: payload.token
                },
                data: {
                    status: payload.status,
                    reply: payload.reply
                },
                include: {
                    user: true
                }
            });

            if(payload.status === 'SUCCESS'){
                await this.updateRoleUser(data.user.email);

                this.eventEmitter.emit(
                    'email.update-status-success',
                    new UpdateRoleUserSuccess(data.user.email, data.token, data.user.name, data.reply)
                );
            }
            else {
                this.eventEmitter.emit(
                    'email.update-status-reject',
                    new UpdateRoleUserSuccess(data.user.email, data.token, data.user.name, data.reply)
                );
            }

            return "SUCCESS";
        }
        catch(err: any){
            throw new InternalServerErrorException();
        }
    }

    @OnEvent('email.update-status-success')
    async sendEmailUpdateStatusSuccess(data: UpdateRoleUserSuccess): Promise<void> {
        this.mailingService.sendUpdateRoleSuccess(data);
    }

    @OnEvent('email.update-status-reject')
    async sendEmailUpdateStatusReject(data: UpdateRoleUserSuccess): Promise<void> {
        this.mailingService.sendUpdateRoleReject(data);
    }

    async findRegisterInstructor(payload: AddRegisterInstructorDto): Promise<RegisterInstructor>{
        try {
            const user = await this.findUserByEmail(payload.email);

            const data = await this.prismaService.registerInstructor.findFirst({
                where: {
                    userId: user.id
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return data;
        }
        catch{
            throw new InternalServerErrorException();
        }
    }
}

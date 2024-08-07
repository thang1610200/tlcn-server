import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { MailingModule } from './mailing/mailing.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as Joi from 'joi';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { ChapterModule } from './chapter/chapter.module';
import { ExerciseModule } from './exercise/exercise.module';
import { QuizzModule } from './quizz/quizz.module';
import { ChatgptModule } from './chatgpt/chatgpt.module';
import { UserProgressModule } from './user-progress/user-progress.module';
import { ReviewModule } from './review/review.module';
import { ThreadModule } from './thread/thread.module';
import { AttachmentModule } from './attachment/attachment.module';
import { RegisterInstructorModule } from './register-instructor/register-instructor.module';
import * as path from 'path';
import { RedisModule } from '@nestjs-modules/ioredis';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { MessageModule } from './message/message.module';
import { CodeModule } from './code/code.module';
import { EvaluateModule } from './evaluate/evaluate.module';
@Module({
    imports: [
        DevtoolsModule.register({
            http: process.env.NODE_ENV !== 'production',
        }),
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                DATABASE_URL: Joi.string().required(),
                jwtSecretKey: Joi.string().required(),
                jwtRefreshToken: Joi.string().required(),
                CLIENT_URL: Joi.string().required(),
                HOST_EMAIL: Joi.string().required(),
                USER_NAME: Joi.string().required(),
                PASSWORD: Joi.string().required(),
                REDIS_HOST: Joi.string().required(),
                REDIS_PORT: Joi.string().required(),
                BACKEND_URL: Joi.string().required(),
                OPENAI_API_KEY: Joi.string().required(),
                CLIENT_ADMIN_URL: Joi.string().required(),
                LIVEKIT_API_KEY: Joi.string().required(),
                LIVEKIT_API_SECRET: Joi.string().required()
            }),
        }),
        MailingModule,
        MailerModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get('HOST_EMAIL'),
                    port: 587,
                    secure: false,
                    auth: {
                        user: configService.get('USER_NAME'),
                        pass: configService.get('PASSWORD'),
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                },
                template: {
                    dir: path.join(__dirname,'mailing','templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
        EventEmitterModule.forRoot(),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                redis: {
                    host: configService.get('REDIS_HOST'),
                    port: configService.get('REDIS_PORT'),
                }
            }),
            inject: [ConfigService],
        }),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'single',
                url: `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`
            }),
            inject: [ConfigService]
        }),
        UserModule,
        UploadModule,
        CourseModule,
        LessonModule,
        ChapterModule,
        ExerciseModule,
        QuizzModule,
        ChatgptModule,
        UserProgressModule,
        ReviewModule,
        ThreadModule,
        AttachmentModule,
        RegisterInstructorModule,
        MessageModule,
        CodeModule,
        EvaluateModule,
    ],
    controllers: [AppController],
    providers: [AppService, PrismaService],
})
export class AppModule {}

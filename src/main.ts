import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './socket-io-adapter';
import * as compression from 'compression';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bull';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import * as expressBasicAuth from 'express-basic-auth';
 
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const config = new DocumentBuilder()
        .setTitle('TLCN Server')
        .setDescription('TLCN API description')
        .setVersion('1.0')
        .addTag('tlcn')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/bull-board');

    createBullBoard({
        queues: [
            new BullAdapter(app.get<Queue>(
                `BullQueue_emailSending`
            )),
            new BullAdapter(app.get<Queue>(
                `BullQueue_upload`
            )),
        ],
        serverAdapter
    });

    app.use(
        '/bull-board',
        expressBasicAuth({
            users: {
                'thang': '123',
            },
            challenge: true,
        }),
        serverAdapter.getRouter()
    );

    app.enableCors({
        origin: [
            configService.get('CLIENT_URL'),
            configService.get('CLIENT_ADMIN_URL'),
            configService.get('BACKEND_URL')
        ],
    });

    app.use(helmet());
    app.use(compression());
    app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    await app.listen(4000);
}
bootstrap();

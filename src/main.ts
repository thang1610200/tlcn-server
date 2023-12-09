import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './socket-io-adapter';
import * as compression from 'compression';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.enableCors({
        origin: [configService.get('CLIENT_URL'), configService.get('CLIENT_ADMIN_URL')],
    });

    app.use(helmet());
    app.use(compression());
    app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

    const config = new DocumentBuilder()
        .setTitle('TLCN Server')
        .setDescription('TLCN API description')
        .setVersion('1.0')
        .addTag('tlcn')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

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

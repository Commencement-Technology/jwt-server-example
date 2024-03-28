import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

const allowedOrigin = ['http://localhost:5173', 'http://localhost:3000'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Hukka Dashboard')
    .setDescription('The Hukka Dashboard API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  /**
   * @description CORS Configuration
   */
  app.enableCors({
    origin: (origin, callback) => {
      allowedOrigin.indexOf(origin) !== -1 || !origin
        ? callback(null, true)
        : callback(new Error('Not allowed by the cors'));
    },
    credentials: true, // access control allowed credentials header
    optionsSuccessStatus: 200, // success status
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  await app.listen(3000);
}
bootstrap();

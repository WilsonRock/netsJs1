import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { VideoController } from './video.controller';
import * as express from 'express';
import { INestApplication } from '@nestjs/common';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MulterModule.register({
      dest: './uploads', // Directorio donde se guardarán los videos
    }),
  ],
  controllers: [VideoController, AppController],
  providers: [AppService],
})
export class AppModule {}

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create<INestApplication>(AppModule, new ExpressAdapter(server));

  const options = new DocumentBuilder()
    .setTitle('Nombre de tu API')
    .setDescription('Descripción de tu API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  // Establece la ruta para servir la documentación Swagger en '/api'
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();

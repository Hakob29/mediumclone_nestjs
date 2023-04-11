import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());
  const config = app.get(ConfigService);
  const host = config.get("HOST");
  const port = config.get("PORT");
  await app.listen(port, () => {
    console.log("Server has been connected to " + host + port)
  });
}
bootstrap();

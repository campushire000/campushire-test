import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // This allows Angular (4200) to call Nest (3000)
  await app.listen(3000);
}
bootstrap();

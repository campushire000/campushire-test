// /src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors(
    // {
    //   origin: [
    //     'http://localhost:4200',           // Angular dev server
    //     'https://your-production-domain.com', // add your real frontend URL later
    //   ],
    //   credentials: true, // important if you use cookies/auth
    // }
  ); // This allows Angular (4200) to call Nest (3000)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
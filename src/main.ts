import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

(async () => {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
})();

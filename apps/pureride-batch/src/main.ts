import { NestFactory } from '@nestjs/core';
import { PurerideBatchModule } from './pureride-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(PurerideBatchModule);
  await app.listen(3000);
}
bootstrap();

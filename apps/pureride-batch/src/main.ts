import { NestFactory } from '@nestjs/core';
import { PurerideBatchModule } from './pureride-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(PurerideBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 5000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // general validation
  app.useGlobalPipes(
    new ValidationPipe({
      // validates the body
      whitelist: true,
      forbidNonWhitelisted: true,
      // transforms the request obj to an instance of the Dto class
      transform: true,
      transformOptions: {
        // validation pipe takes care of implicit conversions
        enableImplicitConversion: true,
      },
    }),
  );

  // swagger config
  const swaggerConfig = new DocumentBuilder()
    // setting the title of the documentation
    .setTitle('Nest js Masterclass - Blog API')
    // setting the description of the documentation
    .setDescription('Use the base API Url as http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .setLicense('MIT License', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();

  // instantiate the doc
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // setup
  SwaggerModule.setup('api', app, document);

  // setup aws sdk
  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get('appConfig.awsAccessKeyId'),
      secretAccessKey: configService.get('appConfig.awsSecretAccessKey'),
    },
    region: configService.get('appConfig.awsRegion'),
  });

  // enable cors
  app.enableCors();

  // global interceptors
  // app.useGlobalInterceptors(new DataResponseInterceptor());

  await app.listen(3000);
}
bootstrap();

import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { config as dotenvConfig } from "dotenv";
import * as session from "express-session";
import * as passport from "passport";
// Modules
import { AppModule } from "./app.module";

// Documentation
import { DocumentationConfig } from "./docs/";

dotenvConfig({
  path: ".env.development",
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true});
  const logger = new Logger('SERVER_STATUS');
  DocumentationConfig(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(
    session({
      secret: process.env.SESSION_PASSPORT || 'secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT);
  logger.log(`Server is running on http://localhost:${PORT}`);
  console.log("Press CTRL+C to stop the server.");
}

bootstrap();

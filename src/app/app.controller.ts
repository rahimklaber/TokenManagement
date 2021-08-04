import { controller, IAppController } from '@foal/core';
import { createConnection } from 'typeorm';

import { ApiController } from './controllers';
import {AuthController} from "./controllers";

export class AppController implements IAppController {
  subControllers = [
    controller('/token', ApiController),
      controller("/auth",AuthController),
  ];

  async init() {
    await createConnection();
  }
}

// @deno-types="npm:@types/express@4.17.15"
import { Router } from 'express';
import { CitizenController } from '../controllers/citizen.ts';

export const citizenRouter = Router();

citizenRouter.get('/', CitizenController.get);
citizenRouter.get('/:id', CitizenController.getById);
citizenRouter.post('/', CitizenController.create);
citizenRouter.patch('/:id', CitizenController.edit);
citizenRouter.delete('/:id', CitizenController.delete);

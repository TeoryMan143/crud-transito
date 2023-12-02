// @deno-types="npm:@types/express@4.17.15"
import { Router } from 'express';
import { CitizenController } from '../controllers/citizen.ts';
import { CitizenModel } from '../models/citizen.ts';

export const createCitizenRouter = ({ model }: { model: CitizenModel }) => {
  const controller = new CitizenController({ model });

  const citizenRouter = Router();

  citizenRouter.get('/', controller.get);
  citizenRouter.get('/:id', controller.getById);
  citizenRouter.post('/', controller.create);
  citizenRouter.patch('/:id', controller.edit);
  citizenRouter.delete('/:id', controller.delete);

  return citizenRouter;
};

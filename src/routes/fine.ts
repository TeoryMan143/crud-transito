// @deno-types="npm:@types/express@4.17.15"
import { Router } from 'express';
import { FineController } from '../controllers/fine.ts';
import { FineModel } from '../models/fine.ts';

export const createFineRouter = ({ model }: { model: FineModel }) => {
  const controller = new FineController({ model });

  const fineRouter = Router();

  fineRouter.get('/', controller.get);
  fineRouter.get('/:id', controller.getById);
  fineRouter.post('/', controller.create);
  fineRouter.patch('/:id', controller.edit);
  fineRouter.delete('/:id', controller.delete);

  return fineRouter;
};

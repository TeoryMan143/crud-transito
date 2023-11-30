// @deno-types="npm:@types/express@4.17.15"
import { Router } from 'express';
import { FineController } from '../controllers/fine.ts';

export const fineRouter = Router();

fineRouter.get('/', FineController.get);
fineRouter.get('/:id', FineController.getById);
fineRouter.post('/', FineController.create);
fineRouter.patch('/:id', FineController.edit);
fineRouter.delete('/:id', FineController.delete);

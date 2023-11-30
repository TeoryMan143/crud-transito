// @deno-types="npm:@types/express@4.17.15"
import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.ts';

export const vehicleRouter = Router();

vehicleRouter.get('/', VehicleController.get);
vehicleRouter.get('/:id', VehicleController.getById);
vehicleRouter.post('/', VehicleController.create);
vehicleRouter.patch('/:id', VehicleController.edit);
vehicleRouter.delete('/:id', VehicleController.delete);

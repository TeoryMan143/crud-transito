// @deno-types="npm:@types/express@4.17.15"
import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.ts';
import { VehicleModel } from '../models/vehicle.ts';

export const createVehicleRouter = ({ model }: { model: VehicleModel }) => {
  const controller = new VehicleController({ model });

  const vehicleRouter = Router();

  vehicleRouter.get('/', controller.get);
  vehicleRouter.get('/:id', controller.getById);
  vehicleRouter.post('/', controller.create);
  vehicleRouter.patch('/:id', controller.edit);
  vehicleRouter.delete('/:id', controller.delete);

  return vehicleRouter;
};

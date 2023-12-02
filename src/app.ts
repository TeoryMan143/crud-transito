// @deno-types="npm:@types/express@4.17.15"
import express from 'express';
import cors from 'npm:/cors@2.8.5';
import { env } from './core/utils.ts';
import { CitizenModel } from './models/citizen.ts';
import { VehicleModel } from './models/vehicle.ts';
import { FineModel } from './models/fine.ts';
import { createVehicleRouter } from './routes/vehicle.ts';
import { createCitizenRouter } from './routes/citizen.ts';
import { createFineRouter } from './routes/fine.ts';

interface Models {
  citizenModel: CitizenModel;
  vehicleModel: VehicleModel;
  fineModel: FineModel;
}

export const createApp = (
  { citizenModel, vehicleModel, fineModel }: Models,
) => {
  const app = express();

  const PORT = env.PORT || 8080;

  app.use(express.json());
  app.use(cors());
  app.disable('x-powered-by');

  app.use('/vehicle', createVehicleRouter({ model: vehicleModel }));
  app.use('/citizen', createCitizenRouter({ model: citizenModel }));
  app.use('/fine', createFineRouter({ model: fineModel }));

  app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
  });
};

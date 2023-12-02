import { createApp } from './app.ts';
import { CitizenModel } from './models/citizen.ts';
import { VehicleModel } from './models/vehicle.ts';
import { FineModel } from './models/fine.ts';

const citizenModel = new CitizenModel();
const vehicleModel = new VehicleModel();
const fineModel = new FineModel();

createApp({ citizenModel, vehicleModel, fineModel });

console.log(Deno.env.get('PORT'));

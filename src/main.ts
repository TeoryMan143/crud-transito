// @deno-types="npm:@types/express@4.17.15"
import express from 'express';
import cors from 'npm:/cors@2.8.5';
import { env } from './core/utils.ts';

import { vehicleRouter } from './routes/vehicle.ts';
import { citizenRouter } from './routes/citizen.ts';
import { fineRouter } from './routes/fine.ts';

const app = express();

const PORT = env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.disable('x-powered-by');

app.use('/vehicle', vehicleRouter);
app.use('/citizen', citizenRouter);
app.use('/fine', fineRouter);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});

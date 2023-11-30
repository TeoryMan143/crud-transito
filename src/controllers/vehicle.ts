// @deno-types="npm:@types/express@4.17.15"
import { type Request, type Response } from 'express';
import { isUUID } from '../core/utils.ts';
import {
  validatePartialVehicle,
  validateVehicle,
  type Vehicle,
} from '../core/schemas.ts';
import { VehicleModel } from '../models/vehicle.ts';

export class VehicleController {
  static async get(req: Request, res: Response) {
    if (!req.query.cedula && !req.query.owner) {
      const vehicles = await VehicleModel.getAll();
      return res.json(vehicles);
    }

    if (req.query.cedula) {
      const vehicle = await VehicleModel.getByCedula(
        req.query.cedula as string,
      );
      if (vehicle) return res.json(vehicle);
    }

    if (req.query.owner) {
      const vehicle = await VehicleModel.getByOwnerId(
        req.query.owner as string,
      );

      if (vehicle) {
        return res.json(vehicle);
      }
    }

    res.status(404).json({
      error: 'Vehicle not found',
    });
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!isUUID(id)) {
      return res.status(404).json({
        error: 'Invalid id',
      });
    }

    const vehicle = await VehicleModel.getById(id);

    if (!vehicle) {
      return res.status(404).json({
        error: 'Vehicle not found',
      });
    }

    res.json(vehicle);
  }

  static async create(req: Request, res: Response) {
    const result = validateVehicle(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const vehicle: Vehicle = result.data;

    const newVehicle = await VehicleModel.create(vehicle);

    res.status(201).json(newVehicle);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!isUUID(id)) {
      res.status(404).json({
        error: 'Invalid id',
      });
      return;
    }

    const query = await VehicleModel.delete(id);

    if (!query) {
      return res.status(404).json({
        error: 'Vehicle not found',
      });
    }

    res.status(202).json(query);
  }

  static async edit(req: Request, res: Response) {
    const { id } = req.params;
    const result = validatePartialVehicle(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const vehicle = result.data;

    const query = await VehicleModel.edit(id, vehicle);

    if (!query) {
      return res.status(404).json({
        error: 'Vehicle not found',
      });
    }

    res.status(200).send(query);
  }
}

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
  private readonly model: VehicleModel;

  constructor({ model }: { model: VehicleModel }) {
    this.model = model;
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
    this.create = this.create.bind(this);
  }

  async get(req: Request, res: Response) {
    if (!req.query.cedula && !req.query.owner) {
      const vehicles = await this.model.getAll();
      return res.json({
        error: null,
        message: 'Vehicles found',
        result: vehicles,
      });
    }

    if (req.query.cedula) {
      const vehicle = await this.model.getByCedula(
        req.query.cedula as string,
      );
      if (vehicle) {
        return res.json({
          error: null,
          message: 'Vehicle found',
          result: vehicle,
        });
      }
    }

    if (req.query.owner) {
      const vehicle = await this.model.getByOwnerId(
        req.query.owner as string,
      );

      if (vehicle) {
        return res.json({
          error: null,
          message: 'Vehicle found',
          result: vehicle,
        });
      }
    }

    res.status(404).json({
      error: 'Vehicle not found',
      message: 'Vehicle not found',
      result: null,
    });
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!isUUID(id)) {
      return res.status(404).json({
        error: 'Invalid id',
        message: 'Invalid id',
        result: null,
      });
    }

    const vehicle = await this.model.getById(id);

    if (!vehicle) {
      return res.status(404).json({
        error: 'Vehicle not found',
        message: 'Vehicle not found',
        result: null,
      });
    }

    res.json({
      error: null,
      message: 'Vehicle found',
      result: vehicle,
    });
  }

  async create(req: Request, res: Response) {
    const result = validateVehicle(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: JSON.parse(result.error.message),
        message: 'Invalid format',
        result: null,
      });
    }

    const vehicle: Vehicle = result.data;

    const newVehicle = await this.model.create(vehicle);

    res.status(201).json({
      error: null,
      message: 'Vehicle created',
      result: newVehicle,
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!isUUID(id)) {
      return res.status(404).json({
        error: 'Invalid id',
        message: 'Invalid id',
        result: null,
      });
    }

    const query = await this.model.delete(id);

    if (!query) {
      return res.status(404).json({
        error: 'Vehicle not found',
        message: 'Vehicle not found',
        result: null,
      });
    }

    res.status(202).json({
      error: null,
      message: 'Successfully deleted',
      result: query,
    });
  }

  async edit(req: Request, res: Response) {
    const { id } = req.params;
    const result = validatePartialVehicle(req.body);

    if (!isUUID(id)) {
      return res.status(404).json({
        error: 'Invalid id',
        message: 'Invalid id',
        result: null,
      });
    }

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const vehicle = result.data;

    const query = await this.model.edit(id, vehicle);

    if (!query) {
      return res.status(404).json({
        error: 'Vehicle not found',
        message: 'Vehicle not found',
        result: null,
      });
    }

    res.status(200).send({
      error: null,
      message: 'Successfully modified',
      result: query,
    });
  }
}

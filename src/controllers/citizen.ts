// @deno-types="npm:@types/express@4.17.15"
import { type Request, type Response } from 'express';
import { isUUID } from '../core/utils.ts';
import {
  type Citizen,
  validateCitizen,
  validatePartialCitizen,
} from '../core/schemas.ts';
import { CitizenModel } from '../models/citizen.ts';

export class CitizenController {
  static async get(req: Request, res: Response) {
    if (!req.query.cedula && !req.query.vehicle) {
      const citizens = await CitizenModel.getAll();
      return res.json(citizens);
    }

    if (req.query.vehicle) {
      const citizen = await CitizenModel.getByVehicleId(
        req.query.vehicle as string,
      );
      if (citizen) return res.json(citizen);
    }

    const citizen = await CitizenModel.getByCedula(req.query.cedula as string);

    if (citizen) {
      return res.json(citizen);
    }

    res.status(404).json({
      error: 'Citizen not found',
    });
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!isUUID(id)) {
      return res.status(404).json({
        error: 'Invalid id',
      });
    }

    const citizen = await CitizenModel.getById(id);

    if (!citizen) {
      return res.status(404).json({
        error: 'Citizen not found',
      });
    }

    res.json(citizen);
  }

  static async create(req: Request, res: Response) {
    const result = validateCitizen(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const citizen: Citizen = result.data;

    const newCitizen = await CitizenModel.create(citizen);

    res.status(201).json(newCitizen);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!isUUID(id)) {
      res.status(404).json({
        error: 'Invalid id',
      });
      return;
    }

    const query = await CitizenModel.delete(id);

    if (!query) {
      return res.status(404).json({
        error: 'Citizen not found',
      });
    }

    res.status(202).json(query);
  }

  static async edit(req: Request, res: Response) {
    const { id } = req.params;
    const result = validatePartialCitizen(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const citizen = result.data;

    const query = await CitizenModel.edit(id, citizen);

    if (!query) {
      return res.status(404).json({
        error: 'Citizen not found',
      });
    }

    res.status(200).send(query);
  }
}

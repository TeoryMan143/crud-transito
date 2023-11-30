// @deno-types="npm:@types/express@4.17.15"
import { type Request, type Response } from 'express';
import { isUUID } from '../core/utils.ts';
import {
  type Fine,
  validateFine,
  validatePartialFine,
} from '../core/schemas.ts';
import { FineModel } from '../models/fine.ts';

export class FineController {
  static async get(req: Request, res: Response) {
    if (!req.query.citizen && !req.query.vehicle) {
      const fines = await FineModel.getAll();
      return res.json(fines);
    }

    if (req.query.vehicle) {
      const fine = await FineModel.getByVehicleId(
        req.query.vehicle as string,
      );

      if (fine) return res.json(fine);
    }
    if (req.query.citizen) {
      const fine = await FineModel.getByCitizenId(req.query.citizen as string);

      if (fine) return res.json(fine);
    }

    res.status(404).json({
      error: 'Fine not found',
    });
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!isUUID(id)) {
      return res.status(404).json({
        error: 'Invalid id',
      });
    }

    const fine = await FineModel.getById(id);

    if (!fine) {
      return res.status(404).json({
        error: 'Fine not found',
      });
    }

    res.json(fine);
  }

  static async create(req: Request, res: Response) {
    const result = validateFine(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const fine: Fine = result.data;

    const newFine = await FineModel.create(fine);

    res.status(201).json(newFine);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!isUUID(id)) {
      res.status(404).json({
        error: 'Invalid id',
      });
      return;
    }

    const query = await FineModel.delete(id);

    if (!query) {
      return res.status(404).json({
        error: 'Fine not found',
      });
    }

    res.status(202).json(query);
  }

  static async edit(req: Request, res: Response) {
    const { id } = req.params;
    const result = validatePartialFine(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const citizen = result.data;

    const query = await FineModel.edit(id, citizen);

    if (!query) {
      return res.status(404).json({
        error: 'Fine not found',
      });
    }

    res.status(200).send(query);
  }
}

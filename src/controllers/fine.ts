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
  private readonly model: FineModel;

  constructor({ model }: { model: FineModel }) {
    this.model = model;
  }

  async get(req: Request, res: Response) {
    if (!req.query.citizen && !req.query.vehicle) {
      const fines = await this.model.getAll();
      return res.json(fines);
    }

    if (req.query.vehicle) {
      const fine = await this.model.getByVehicleId(
        req.query.vehicle as string,
      );

      if (fine) return res.json(fine);
    }
    if (req.query.citizen) {
      const fine = await this.model.getByCitizenId(req.query.citizen as string);

      if (fine) return res.json(fine);
    }

    res.status(404).json({
      error: 'Fine not found',
    });
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!isUUID(id)) {
      return res.status(404).json({
        error: 'Invalid id',
      });
    }

    const fine = await this.model.getById(id);

    if (!fine) {
      return res.status(404).json({
        error: 'Fine not found',
      });
    }

    res.json(fine);
  }

  async create(req: Request, res: Response) {
    const result = validateFine(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const fine: Fine = result.data;

    const newFine = await this.model.create(fine);

    res.status(201).json(newFine);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!isUUID(id)) {
      res.status(404).json({
        error: 'Invalid id',
      });
      return;
    }

    const query = await this.model.delete(id);

    if (!query) {
      return res.status(404).json({
        error: 'Fine not found',
      });
    }

    res.status(202).json(query);
  }

  async edit(req: Request, res: Response) {
    const { id } = req.params;
    const result = validatePartialFine(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const citizen = result.data;

    const query = await this.model.edit(id, citizen);

    if (!query) {
      return res.status(404).json({
        error: 'Fine not found',
      });
    }

    res.status(200).send(query);
  }
}

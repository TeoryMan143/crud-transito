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
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
    this.create = this.create.bind(this);
  }

  async get(req: Request, res: Response) {
    if (!req.query.citizen && !req.query.vehicle) {
      const fines = await this.model.getAll();
      return res.json({
        error: null,
        message: 'Fines found',
        result: fines,
      });
    }

    if (req.query.vehicle) {
      const fine = await this.model.getByVehicleId(
        req.query.vehicle as string,
      );

      return res.json({
        error: null,
        message: 'Fine found',
        result: fine,
      });
    }
    if (req.query.citizen) {
      const fine = await this.model.getByCitizenId(req.query.citizen as string);

      if (fine) {
        return res.json({
          error: null,
          message: 'Fine found',
          result: fine,
        });
      }
    }

    res.status(404).json({
      error: 'Fine not found',
      message: 'Fine not found',
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

    const fine = await this.model.getById(id);

    if (!fine) {
      return res.status(404).json({
        error: 'Fine not found',
        message: 'Fine not found',
        result: null,
      });
    }

    res.json({
      error: null,
      message: 'Fine found',
      result: fine,
    });
  }

  async create(req: Request, res: Response) {
    const result = validateFine(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: JSON.parse(result.error.message),
        message: 'Invalid format',
        result: null,
      });
    }

    const fine: Fine = result.data;

    const newFine = await this.model.create(fine);

    res.status(201).json({
      error: null,
      message: 'Fine created',
      result: newFine,
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
        error: 'Fine not found',
        message: 'Fine not found',
        result: null,
      });
    }

    res.status(202).json({
      error: null,
      message: 'Successfully deleted',
      result: null,
    });
  }

  async edit(req: Request, res: Response) {
    const { id } = req.params;
    const result = validatePartialFine(req.body);

    if (!isUUID(id)) {
      return res.status(404).json({
        error: 'Invalid id',
        message: 'Invalid id',
        result: null,
      });
    }

    if (!result.success) {
      return res.status(400).json({
        error: JSON.parse(result.error.message),
        message: 'Invalid format',
        result: null,
      });
    }

    const citizen = result.data;

    const query = await this.model.edit(id, citizen);

    if (!query) {
      return res.status(404).json({
        error: 'Fine not found',
        message: 'Fine not found',
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

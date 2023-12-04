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
  private readonly model: CitizenModel;

  constructor({ model }: { model: CitizenModel }) {
    this.model = model;
    this.get = this.get.bind(this);
    this.getById = this.getById.bind(this);
    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
    this.create = this.create.bind(this);
  }

  async get(req: Request, res: Response) {
    if (!req.query.cedula && !req.query.vehicle && !req.query.plate) {
      const citizens = await this.model.getAll();
      return res.json({
        error: null,
        message: 'Citizens found',
        result: citizens,
      });
    }

    if (req.query.vehicle) {
      const citizen = await this.model.getByVehicleId(
        req.query.vehicle as string,
      );
      if (citizen) {
        return res.json({
          error: null,
          message: 'Citizen found',
          result: citizen,
        });
      }
    }

    if (req.query.plate) {
      const citizen = await this.model.getByVehiclePlate(
        req.query.plate as string,
      );
      if (citizen) {
        return res.json({
          error: null,
          message: 'Citizen found',
          result: citizen,
        });
      }
    }

    const citizen = await this.model.getByCedula(req.query.cedula as string);

    if (citizen) {
      return res.json({
        error: null,
        message: 'Citizen found',
        result: citizen,
      });
    }

    res.status(404).json({
      error: 'Citizen not found',
      message: 'Citizen not found',
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

    const citizen = await this.model.getById(id);

    if (!citizen) {
      return res.status(404).json({
        error: 'Citizen not found',
        message: 'Citizen not found',
        result: null,
      });
    }

    res.json({
      error: null,
      message: 'Citizen found',
      result: citizen,
    });
  }

  async create(req: Request, res: Response) {
    const result = validateCitizen(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: JSON.parse(result.error.message),
        message: 'Invalid format',
        result: null,
      });
    }

    const citizen: Citizen = result.data;

    const newCitizen = await this.model.create(citizen);

    res.status(201).json({
      error: null,
      message: 'Citizen created',
      result: newCitizen,
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
        error: 'Citizen not found',
        message: 'Citizen not found',
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
    const result = validatePartialCitizen(req.body);

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

    const citizen = result.data;

    const query = await this.model.edit(id, citizen);

    if (!query) {
      return res.status(404).json({
        error: 'Citizen not found',
        message: 'Citizen not found',
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

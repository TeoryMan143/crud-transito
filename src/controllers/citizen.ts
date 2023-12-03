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
    if (!req.query.cedula && !req.query.vehicle) {
      const citizens = await this.model.getAll();
      return res.json(citizens);
    }

    if (req.query.vehicle) {
      const citizen = await this.model.getByVehicleId(
        req.query.vehicle as string,
      );
      if (citizen) return res.json(citizen);
    }

    const citizen = await this.model.getByCedula(req.query.cedula as string);

    if (citizen) {
      return res.json(citizen);
    }

    res.status(404).json({
      error: 'Citizen not found',
    });
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!isUUID(id)) {
      return res.status(404).json({
        error: 'Invalid id',
      });
    }

    const citizen = await this.model.getById(id);

    if (!citizen) {
      return res.status(404).json({
        error: 'Citizen not found',
      });
    }

    res.json(citizen);
  }

  async create(req: Request, res: Response) {
    const result = validateCitizen(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const citizen: Citizen = result.data;

    const newCitizen = await this.model.create(citizen);

    res.status(201).json(newCitizen);
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
        error: 'Citizen not found',
      });
    }

    res.status(202).json(query);
  }

  async edit(req: Request, res: Response) {
    const { id } = req.params;
    const result = validatePartialCitizen(req.body);

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const citizen = result.data;

    const query = await this.model.edit(id, citizen);

    if (!query) {
      return res.status(404).json({
        error: 'Citizen not found',
      });
    }

    res.status(200).send(query);
  }
}

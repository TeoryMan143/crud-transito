import sql from '../db/config.ts';
import type { PartialVehicle, Vehicle } from '../core/schemas.ts';

export class VehicleModel {
  async getAll() {
    return await sql`SELECT * FROM vehicles;`;
  }

  async getById(id: string) {
    const result = await sql`SELECT * FROM vehicles WHERE id = ${id}`;
    if (result.length === 0) return null;
    return result[0];
  }

  async getByCedula(cedula: string) {
    const result =
      await sql`SELECT vehicles.* FROM vehicles JOIN citizens ON vehicles.owner = citizens.id WHERE citizens.cedula = ${cedula}`;
    if (result.length === 0) return null;
    return result;
  }

  async getByOwnerId(id: string) {
    const result =
      await sql`SELECT vehicles.* FROM vehicles JOIN citizens ON vehicles.owner = citizens.id WHERE citizens.id = ${id}`;
    if (result.length === 0) return null;
    return result;
  }

  async create(vehicle: Vehicle) {
    const {
      vtype,
      brand,
      model,
      model_year,
      plate,
      color,
      soat_end,
      tech_end,
      image_url,
      owner,
    } = vehicle;
    const result =
      await sql`INSERT INTO vehicles (vtype, brand, model, model_year, plate, color, soat_end, tech_end, image_url, owner) VALUES (${vtype}, ${brand}, ${model}, ${model_year}, ${plate.toUpperCase()}, ${color}, ${soat_end}, ${tech_end}, ${image_url}, ${owner}) RETURNING *`;
    return result[0];
  }

  async delete(id: string) {
    const search = await sql`SELECT * FROM vehicles WHERE id = ${id}`;
    if (search.length === 0) return null;
    await sql`DELETE FROM vehicles WHERE id = ${id}`;
    return {
      ok: 'Successfully removed',
    };
  }

  async edit(id: string, vehicle: PartialVehicle) {
    const result = await sql`UPDATE vehicles SET ${
      sql(
        vehicle,
      )
    } WHERE id = ${id} RETURNING *`;
    if (result.length === 0) return null;
    return result[0];
  }
}

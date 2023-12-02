import sql from '../db/config.ts';
import type { Citizen, PartialCitizen } from '../core/schemas.ts';

export class CitizenModel {
  async getAll() {
    return await sql`SELECT * FROM citizens;`;
  }

  async getById(id: string) {
    const result = await sql`SELECT * FROM citizens WHERE id = ${id}`;
    if (result.length === 0) return null;
    return result[0];
  }

  async getByCedula(cedula: string) {
    const result = await sql`SELECT * FROM citizens WHERE cedula = ${cedula}`;
    if (result.length === 0) return null;
    return result[0];
  }

  async getByVehicleId(vehicleId: string) {
    const result =
      await sql`SELECT citizens.* FROM citizens JOIN vehicles ON citizens.id = vehicles.owner WHERE vehicles.id = ${vehicleId}`;
    if (result.length === 0) return null;
    return result[0];
  }

  async create(citizen: Citizen) {
    const { name, last_name, birth_day, cedula, licence_end, address } =
      citizen;
    const result =
      await sql`INSERT INTO citizens (name, last_name, birth_day, cedula, licence_end, address) VALUES (${name}, ${last_name}, ${birth_day}, ${cedula}, ${licence_end}, ${address}) RETURNING *`;
    return result[0];
  }

  async delete(id: string) {
    const search = await sql`SELECT * FROM citizens WHERE id = ${id}`;
    if (search.length === 0) return null;
    await sql`DELETE FROM citizens WHERE id = ${id}`;
    return {
      ok: 'Successfully removed',
    };
  }

  async edit(id: string, citizen: PartialCitizen) {
    const result = await sql`UPDATE citizens SET ${
      sql(
        citizen,
      )
    } WHERE id = ${id} RETURNING *`;
    if (result.length == 0) return null;
    return result;
  }
}

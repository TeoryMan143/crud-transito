import sql from '../db/config.ts';
import type { Fine, PartialFine } from '../core/schemas.ts';

export class FineModel {
  async getAll() {
    return await sql`SELECT * FROM fines;`;
  }

  async getById(id: string) {
    const result = await sql`SELECT * FROM fines WHERE id = ${id}`;
    if (result.length === 0) return null;
    return result[0];
  }

  async getByCitizenId(citizenId: string) {
    const result =
      await sql`SELECT fines.* FROM fines JOIN citizens ON fines.fined_cit = citizens.id WHERE citizens.id = ${citizenId}`;
    if (result.length === 0) return null;
    return result;
  }

  async getByCedula(cedula: string) {
    const result =
      await sql`SELECT fines.* FROM fines JOIN citizens ON fines.fined_cit = citizens.id WHERE citizens.cedula = ${cedula}`;
    if (result.length === 0) return null;
    return result;
  }

  async getByVehicleId(vehicleId: string) {
    const result =
      await sql`SELECT fines.* FROM fines JOIN vehicles ON fines.fined_vehicle = vehicles.id WHERE vehicles.id = ${vehicleId}`;
    if (result.length === 0) return null;
    return result;
  }

  async getByPlate(plate: string) {
    const result =
      await sql`SELECT fines.* FROM fines JOIN vehicles ON fines.fined_vehicle = vehicles.id WHERE vehicles.plate = ${plate}`;
    if (result.length === 0) return null;
    return result;
  }

  async create(fine: Fine) {
    const { reason, fined_cit, fined_vehicle } = fine;
    const result =
      await sql`INSERT INTO fines (reason, fined_cit, fined_vehicle) VALUES (${reason}, ${fined_cit}, ${fined_vehicle}) RETURNING *`;
    return result[0];
  }

  async delete(id: string) {
    const search = await sql`SELECT * FROM fines WHERE id = ${id}`;
    if (search.length === 0) return null;
    await sql`DELETE FROM fines WHERE id = ${id}`;
    return true;
  }

  async edit(id: string, citizen: PartialFine) {
    const result = await sql`UPDATE fines SET ${
      sql(
        citizen,
      )
    } WHERE id = ${id} RETURNING *`;
    if (result.length === 0) return null;
    return result;
  }
}

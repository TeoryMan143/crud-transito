import { z } from 'zod';

const vehicleSchema = z.object({
  vtype: z.enum(['Carro', 'Moto']),
  brand: z.string().trim(),
  model: z.string().trim(),
  model_year: z.number().min(2000).max(2024).int(),
  plate: z.string().trim().length(6),
  color: z.string().trim(),
  soat_end: z.string().datetime(),
  tech_end: z.string().datetime(),
  image_url: z.string(),
  owner: z.string().uuid(),
});

export type Vehicle = z.infer<typeof vehicleSchema>;
export type PartialVehicle = Partial<Vehicle>;

export const validateVehicle = (vehicle: object) =>
  vehicleSchema.safeParse(vehicle);

export const validatePartialVehicle = (vehicle: object) =>
  vehicleSchema.partial().safeParse(vehicle);

const citizenSchema = z.object({
  name: z.string().trim(),
  last_name: z.string().trim(),
  birth_day: z.string().datetime(),
  cedula: z.number().int().positive(),
  licence_end: z.string().datetime(),
  address: z.string(),
});

export type Citizen = z.infer<typeof citizenSchema>;
export type PartialCitizen = Partial<Citizen>;

export const validateCitizen = (citizen: object) =>
  citizenSchema.safeParse(citizen);

export const validatePartialCitizen = (citizen: object) =>
  citizenSchema.partial().safeParse(citizen);

const fineSchema = z.object({
  reason: z.string().trim(),
  fined_cit: z.string().uuid(),
  fined_vehicle: z.string().uuid(),
});

export type Fine = z.infer<typeof fineSchema>;
export type PartialFine = Partial<Fine>;

export const validateFine = (fine: object) => fineSchema.safeParse(fine);

export const validatePartialFine = (fine: object) =>
  fineSchema.partial().safeParse(fine);

import { load } from 'deno/dotenv/mod.ts';

await load({ export: true });

export const env = Deno.env.toObject();

export const isUUID = (text: string) => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(text);
};

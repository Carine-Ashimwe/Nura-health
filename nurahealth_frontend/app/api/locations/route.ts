import { NextResponse } from "next/server";
import data from "@/data/rw-locations.json";

// province -> district -> sector -> cell -> [villages]
type Tree = Record<string, Record<string, Record<string, Record<string, string[]>>>>;
const LOCATIONS = data as unknown as Tree;

// Returns the options for one level of the Rwandan administrative hierarchy,
// based on the parent values passed as query params. Powers the cascading
// location picker on the register & profile screens.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const province = searchParams.get("province") || undefined;
  const district = searchParams.get("district") || undefined;
  const sector = searchParams.get("sector") || undefined;
  const cell = searchParams.get("cell") || undefined;

  let options: string[] = [];
  if (!province) options = Object.keys(LOCATIONS);
  else if (!district) options = Object.keys(LOCATIONS[province] ?? {});
  else if (!sector) options = Object.keys(LOCATIONS[province]?.[district] ?? {});
  else if (!cell) options = Object.keys(LOCATIONS[province]?.[district]?.[sector] ?? {});
  else options = LOCATIONS[province]?.[district]?.[sector]?.[cell] ?? [];

  return NextResponse.json({ options });
}

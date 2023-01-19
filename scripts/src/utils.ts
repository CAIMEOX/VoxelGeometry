import { BlockLocation, Vector3 } from "@minecraft/server";

function Tellraw(Player: string, ...Message: string[]) {
  return `tellraw ${Player} {"rawtext":[{"text":"${now()} ${Message.join("\n")}"}]}`;
}

function LocationAdd(Location: BlockLocation, Location2: BlockLocation) {
  return new BlockLocation(Location.x + Location2.x, Location.y + Location2.y, Location.z + Location2.z);
}

function LocationTrans(pos: Vector3): BlockLocation {
  return new BlockLocation(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z));
}

function BAdd(p1: BlockLocation, p2: BlockLocation): BlockLocation {
  return new BlockLocation(p1.x + p2.x, p1.y + p2.y, p2.z + p2.z);
}

function BMul(p: BlockLocation, k: number): BlockLocation {
  return new BlockLocation(p.x * k, p.y * k, p.z * k);
}

function now(): string {
  const date = new Date();
  return ["[", date.toTimeString().slice(0, 8), "]"].join("");
}

function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getDistacne(p1: BlockLocation, p2: BlockLocation): number {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y) + (p1.z - p2.z) * (p1.z - p2.z));
}

function rand(): number {
  const p = Math.random();
  if (p > 0.5) return Math.random();
  else return -Math.random();
}

export { LocationAdd, Tellraw, LocationTrans, rand, BAdd, BMul, random, getDistacne };

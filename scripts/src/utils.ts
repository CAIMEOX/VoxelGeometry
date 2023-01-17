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

function now(): string {
  let date = new Date();
  return ["[", date.toTimeString().slice(0, 8), "]"].join("");
}

export { LocationAdd, Tellraw, LocationTrans };

import { Block, BlockLocation, Location } from "mojang-minecraft";

export function Tellraw(Player: string, ...Message: string[]) {
  return `tellraw ${Player} {"rawtext":[{"text":"${Message.join("\n")}"}]}`;
}

export function LocationAdd(Location: BlockLocation, Location2: BlockLocation) {
  return new BlockLocation(Location.x + Location2.x, Location.y + Location2.y, Location.z + Location2.z);
}

export function LocationTrans(pos: Location): BlockLocation {
  return new BlockLocation(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z));
}

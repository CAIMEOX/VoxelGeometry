import {
  ItemStack,
  world,
  system,
  ChatSendBeforeEvent,
  BlockPlaceAfterEvent,
  ItemUseOnAfterEvent,
} from "@minecraft/server";
import * as VG from "@pureeval/voxel-geometry";
export const Vec3 = (x: number, y: number, z: number) => new VG.Vec3(x, y, z);
export const eq_item = (a: ItemStack, b: string) => a.typeId === b;
export const OVER_WORLD = world.getDimension("overworld");
export const events = {
  blockPlace: world.afterEvents.blockPlace,
  afterChat: world.afterEvents.chatSend,
  beforeChat: world.beforeEvents.chatSend,
  itemUse: world.afterEvents.itemUse,
  worldInitialize: world.afterEvents.worldInitialize,
  beforeWatchdogTerminate: system.beforeEvents.watchdogTerminate,
  ChatSendBeforeEvent: ChatSendBeforeEvent,
  BlockPlaceAfterEvent: BlockPlaceAfterEvent,
  ItemUseOnAfterEvent: ItemUseOnAfterEvent,
};

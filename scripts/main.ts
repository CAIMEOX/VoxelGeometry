/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import * as VG from "@pureeval/voxel-geometry";
import {
  MinecraftBlockTypes,
  BlockType,
  Player,
  Dimension,
  BlockRaycastOptions,
  Vector3,
  ChatSendAfterEvent,
  BlockPlaceAfterEvent,
  ItemUseAfterEvent,
  MolangVariableMap,
  system,
} from "@minecraft/server";

import { OVER_WORLD, events, Vec3, eq_item } from "./wrapper";
type Space = VG.Vec3[];

class Sandbox {
  sandbox: object;
  // boxProxy: Object;
  constructor(sandbox: object) {
    this.sandbox = sandbox;
    // this.boxProxy = new Proxy(this.sandbox, {});
  }

  eval(code: string): unknown {
    const body = `with(inside) { ${code} }`;
    const fn = new Function("inside", body);
    return fn(this.sandbox);
  }

  updateEnv(...env: object[]) {
    Object.assign(this.sandbox, ...env);
  }
}

interface Setting {
  block: BlockType;
  origin: VG.Vec3;
  brush_item: string;
}

export default class System {
  operator: Player | null = null;
  evaluator: Sandbox;
  dimension: Dimension = OVER_WORLD;
  setting: Setting;
  // eslint-disable-next-line @typescript-eslint/ban-types
  funcs: { [key: string]: any } = {
    ...VG.Generator,
    ...VG.Exp,
    ...VG.Transform,
    ...VG.LSystem,
    ...VG.IFS,
    dla2d: VG.DLA2D,
    dla3d: VG.DLA3D,
    // Effect
    plot: this.plot,
    repeat: this.repeat,
    render: this.spawnParticles,
    summon: this.summonEntities,
    place: this.placeMode,
    brush: this.brush,
    tellraw: this.tellraw,
    getpos: () => {
      this.setPosition(this.getPlayerPosition());
    },
  };
  callbacks: { [key: string]: (arg: any) => void } = {};
  savedCode = "";
  // callbacks: { [key: string]: Function } = {};
  constructor() {
    this.setting = {
      block: MinecraftBlockTypes.ironBlock,
      origin: new VG.Vec3(0, 0, 0),
      brush_item: "minecraft:stick",
    };
    for (const p of this.dimension.getPlayers({ closest: 5 })) {
      this.operator = p;
    }
    this.evaluator = new Sandbox(this.funcs);
    this.evaluator.updateEnv(this.setting);
  }

  run() {
    this.subscribe();
    events.worldInitialize.subscribe(() => this.boardcast("Voxel Geometry :: System initialized"));
    this.watch_dog();
  }

  repeat(fn: () => void, interval: number, count: number) {
    for (let i = 0; i < count; i++) {
      system.runTimeout(fn, i * interval);
    }
  }

  // Subscribe

  subscribe() {
    events.afterChat.subscribe((eventData: ChatSendAfterEvent) => {
      const player = eventData.sender;
      if (this.operator === null) this.operator = player;
      const Chat = eventData.message;
      if (Chat.startsWith("-")) {
        const script = Chat.substring(1).trim();
        this.tellraw(`<< §3${script}`);
        this.evaluator.updateEnv({
          callbacks: this.callbacks,
          setBlock: this.setBlock,
          setting: this.setting,
          operator: player,
          dimension: this.dimension,
        });
        try {
          const result = this.evaluator.eval(script);
          if (result) {
            this.tellraw(`>> §e${result}`);
          } else {
            this.tellraw(`>> §eSuccess`);
          }
        } catch (e) {
          this.tellraw(`>> §4${e}`);
        }
      }
    });

    events.blockPlace.subscribe(() => {});
  }

  // World Action
  fill(blockType: BlockType, begin: Vector3, end: Vector3) {
    const [xFrom, yFrom, zFrom, xTo, yTo, zTo] = [begin.x, begin.y, begin.z, end.x, end.y, end.z];
    for (let x = xFrom; x <= xTo; ++x) {
      for (let y = yFrom; y <= yTo; ++y) {
        for (let z = zFrom; z <= zTo; ++z) {
          this.dimension.getBlock(Vec3(x, y, z))!.setType(blockType);
        }
      }
    }
  }

  plot(blocks: Space, pos = this.setting.origin, tile = this.setting.block): void {
    blocks.forEach((block) => {
      this.setBlock(tile, Vec3(block.x + pos.x, block.y + pos.y, block.z + pos.z));
    });
  }

  spawnParticles(space: Space, effect: string, origin = this.setting.origin) {
    const mvm = new MolangVariableMap();
    space.forEach((pos) => {
      this.dimension.spawnParticle(effect, Vec3(pos.x + origin.x, pos.y + origin.y, pos.z + origin.z), mvm);
    });
  }

  summonEntities(space: Space, entity: string, origin = this.setting.origin) {
    space.forEach((pos) => {
      this.dimension.spawnEntity(entity, Vec3(pos.x + origin.x, pos.y + origin.y, pos.z + origin.z));
    });
  }

  spawnParticle(pos: Vector3, effect: string, origin = this.setting.origin) {
    this.dimension.spawnParticle(
      effect,
      Vec3(pos.x + origin.x, pos.y + origin.y, pos.z + origin.z),
      new MolangVariableMap()
    );
  }

  setBlocks(blockType: BlockType, blocks: Vector3[]) {
    blocks.forEach((block) => {
      this.dimension.getBlock(block)!.setType(blockType);
    });
  }

  setBlock(block: BlockType, pos: Vector3) {
    this.dimension.getBlock(pos)!.setType(block);
  }

  placeMode(blocks: Space = []): void {
    if (this.callbacks["place"]) {
      const callback: (a: BlockPlaceAfterEvent) => void = this.callbacks["place"];
      events.blockPlace.unsubscribe(callback);
      delete this.callbacks["place"];
    }
    if (blocks.length !== 0) {
      this.callbacks["place"] = events.blockPlace.subscribe((eventData) => {
        const pos = eventData.block.location;
        const block = eventData.block.type;
        this.plot(blocks, pos, block);
      });
    }
  }

  brush(blocks: Space = []): void {
    if (this.callbacks["brush"]) {
      const callback: (a: ItemUseAfterEvent) => void = this.callbacks["brush"];
      events.itemUse.unsubscribe(callback);
      delete this.callbacks["brush"];
    }
    if (blocks.length !== 0) {
      this.callbacks["brush"] = events.itemUse.subscribe((eventData) => {
        const opt: BlockRaycastOptions = {
          maxDistance: 256,
          includeLiquidBlocks: false,
          includePassableBlocks: true,
        };
        const block = eventData.source.getBlockFromViewDirection(opt);
        if (block != undefined && eq_item(eventData.itemStack, this.setting.brush_item)) {
          const pos = block.block.location;
          this.plot(blocks, pos);
        }
      });
    }
  }

  cloneArea(target: Vector3, begin: Vector3, end: Vector3) {
    const [xFrom, yFrom, zFrom, xTo, yTo, zTo] = [begin.x, begin.y, begin.z, end.x, end.y, end.z];
    for (let x = xFrom; x <= xTo; ++x) {
      for (let y = yFrom; y <= yTo; ++y) {
        for (let z = zFrom; z <= zTo; ++z) {
          this.setBlock(
            this.getBlock(Vec3(x, y, z)),
            Vec3(target.x + x - xFrom, target.y + y - yFrom, target.z + z - zFrom)
          );
        }
      }
    }
  }

  // Info :

  tellraw(...message: string[]) {
    this.dimension.runCommandAsync(Tellraw(this.operator!.name, ...message.map((m) => `§6${m}`)));
  }

  boardcast(...message: string[]) {
    this.dimension.runCommandAsync(Tellraw("@a", ...message.map((m) => `§e${m}`)));
  }

  getPlayerPosition(): Vector3 {
    return this.operator!.location;
  }

  getBlock(pos: Vector3): BlockType {
    return this.dimension.getBlock(pos)!.type;
  }

  // Modify config

  setPosition(pos: Vector3) {
    this.setting.origin = pos;
  }

  // Watch Dog
  watch_dog() {
    events.beforeWatchdogTerminate.subscribe((e) => {
      if (e.terminateReason.toString() == "hang") {
        e.cancel = true;
      }
    });
  }
}

function Tellraw(Player: string, ...Message: string[]) {
  return `tellraw ${Player} {"rawtext":[{"text":"${now()} ${Message.join("\n")}"}]}`;
}

function now(): string {
  const date = new Date();
  return ["[", date.toTimeString().slice(0, 8), "]"].join("");
}

const sys = new System();

sys.run();

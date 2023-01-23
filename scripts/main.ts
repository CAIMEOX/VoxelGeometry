import * as VG from "@pureeval/voxel-geometry";

/* eslint-disable @typescript-eslint/no-empty-function */
import {
  BeforeChatEvent,
  world,
  BlockLocation,
  MinecraftBlockTypes,
  BlockType,
  Player,
  Dimension,
  BlockPlaceEvent,
  ItemUseEvent,
  BlockRaycastOptions,
  system,
  ItemStack,
  Vector3,
  EntityInventoryComponent,
} from "@minecraft/server";
// @ts-ignore
import * as PE from "pureeval";
import { ModalFormData, ModalFormResponse } from "@minecraft/server-ui";

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
  console: string;
}

export default class System {
  operator: Player | null = null;
  evaluator: Sandbox;
  dimension: Dimension;
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
    place: this.placeMode,
    brush: this.brush,
    say: this.tellraw,
    code: this.codeEditor,
    getpos: () => {
      this.setPosition(this.getPlayerPosition());
    },
  };
  callbacks: { [key: string]: (arg: any) => void } = {};
  savedCode = "";
  // callbacks: { [key: string]: Function } = {};
  constructor() {
    this.setting = {
      block: MinecraftBlockTypes.stainedGlass,
      origin: new VG.Vec3(0, 0, 0),
      brush_item: "minecraft:stick",
      console: "minecraft:blaze_rod",
    };
    this.dimension = world.getDimension("overworld");
    for (const p of this.dimension.getPlayers({ closest: 5 })) {
      this.operator = p;
    }
    this.evaluator = new Sandbox(this.funcs);
    this.evaluator.updateEnv(this.setting);
  }

  run() {
    this.subscribe();
    world.events.worldInitialize.subscribe(() => this.boardcast("Voxel Geometry :: System initialized"));
    this.watch_dog();
  }

  // Subscribe

  subscribe() {
    world.events.itemUse.subscribe((eventData) => {
      if (eventData.item.typeId === this.setting.console) {
        this.codeEditor(this.operator!);
      }
    });
    world.events.beforeChat.subscribe((eventData: BeforeChatEvent) => {
      const player = eventData.sender;
      if (this.operator === null) this.operator = player;
      const Chat = eventData.message;
      if (Chat.startsWith("-")) {
        eventData.cancel = true;
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

    world.events.blockPlace.subscribe(() => {});
  }

  // Code editor : For long script editing
  codeEditor(player: Player) {
    const m = new ModalFormData();
    m.title("Voxel Geometry");
    m.textField("Console", "code here", this.savedCode);
    m.show(player).then((v: ModalFormResponse) => {
      if (!v.canceled) {
        v.formValues?.forEach((v: string) => {
          this.savedCode = v;
          this.evaluator.updateEnv({
            callbacks: this.callbacks,
            setBlock: this.setBlock,
            setting: this.setting,
            operator: player,
            dimension: this.dimension,
          });
          try {
            const result = this.evaluator.eval(v);
            if (result) {
              this.tellraw(`>> §e${result}`);
            } else {
              this.tellraw(`>> §eSuccess`);
            }
          } catch (e) {
            this.tellraw(`>> §4${e}`);
          }
        });
      }
    });
  }

  // World Action
  fill(blockType: BlockType, begin: BlockLocation, end: BlockLocation) {
    const [xFrom, yFrom, zFrom, xTo, yTo, zTo] = [begin.x, begin.y, begin.z, end.x, end.y, end.z];
    for (let x = xFrom; x <= xTo; ++x) {
      for (let y = yFrom; y <= yTo; ++y) {
        for (let z = zFrom; z <= zTo; ++z) {
          this.dimension.getBlock(new BlockLocation(x, y, z)).setType(blockType);
        }
      }
    }
  }

  plot(blocks: Space, pos = this.setting.origin, tile = this.setting.block): void {
    blocks.forEach((block) => {
      this.setBlock(tile, new BlockLocation(block.x + pos.x, block.y + pos.y, block.z + pos.z));
    });
  }

  setBlocks(blockType: BlockType, blocks: VG.Vec3[]) {
    blocks.forEach((block) => {
      this.dimension.getBlock(toPos(block)).setType(blockType);
    });
  }

  setBlock(block: BlockType, pos: BlockLocation) {
    this.dimension.getBlock(pos).setType(block);
  }

  placeMode(blocks: Space = []): void {
    if (this.callbacks["place"]) {
      const callback: (a: BlockPlaceEvent) => void = this.callbacks["place"];
      world.events.blockPlace.unsubscribe(callback);
      delete this.callbacks["place"];
    }
    if (blocks.length !== 0) {
      this.callbacks["place"] = world.events.blockPlace.subscribe((eventData) => {
        const pos = eventData.block.location;
        const block = eventData.block.type;
        this.plot(blocks, pos, block);
      });
    }
  }

  brush(blocks: Space = []): void {
    if (this.callbacks["brush"]) {
      const callback: (a: ItemUseEvent) => void = this.callbacks["brush"];
      world.events.itemUse.unsubscribe(callback);
      delete this.callbacks["brush"];
    }
    if (blocks.length !== 0) {
      this.callbacks["brush"] = world.events.itemUse.subscribe((eventData) => {
        const opt: BlockRaycastOptions = {
          maxDistance: 256,
          includeLiquidBlocks: false,
          includePassableBlocks: true,
        };
        const block = eventData.source.getBlockFromViewVector(opt);
        if (block != undefined && eventData.item.typeId === this.setting.brush_item) {
          const pos = block.location;
          this.plot(blocks, pos);
        }
      });
    }
  }

  cloneArea(target: BlockLocation, begin: BlockLocation, end: BlockLocation) {
    const [xFrom, yFrom, zFrom, xTo, yTo, zTo] = [begin.x, begin.y, begin.z, end.x, end.y, end.z];
    for (let x = xFrom; x <= xTo; ++x) {
      for (let y = yFrom; y <= yTo; ++y) {
        for (let z = zFrom; z <= zTo; ++z) {
          this.setBlock(
            this.getBlock(new BlockLocation(x, y, z)),
            new BlockLocation(target.x + x - xFrom, target.y + y - yFrom, target.z + z - zFrom)
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

  getPlayerPosition(): BlockLocation {
    return LocationTrans(this.operator!.location);
  }

  getBlock(pos: BlockLocation): BlockType {
    return this.dimension.getBlock(pos).type;
  }

  // Modify config

  setPosition(pos: BlockLocation) {
    this.setting.origin = pos;
  }

  getItemInHand(): ItemStack {
    const playerComp: EntityInventoryComponent = this.operator?.getComponent("inventory") as EntityInventoryComponent;
    return playerComp.container.getItem(this.operator!.selectedSlot);
  }

  // Watch Dog
  watch_dog() {
    system.events.beforeWatchdogTerminate.subscribe((e) => {
      if (e.terminateReason == "hang") {
        e.cancel = true;
      }
    });
  }
}

function Tellraw(Player: string, ...Message: string[]) {
  return `tellraw ${Player} {"rawtext":[{"text":"${now()} ${Message.join("\n")}"}]}`;
}

function toPos(v: VG.Vec3): BlockLocation {
  return new BlockLocation(v.x, v.y, v.z);
}

function toVec(v: BlockLocation): VG.Vec3 {
  return new VG.Vec3(v.x, v.y, v.z);
}

function LocationTrans(pos: Vector3): BlockLocation {
  return new BlockLocation(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z));
}

function now(): string {
  const date = new Date();
  return ["[", date.toTimeString().slice(0, 8), "]"].join("");
}

const sys = new System();

sys.run();

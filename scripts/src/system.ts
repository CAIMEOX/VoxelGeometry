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
} from "@minecraft/server";
import * as PureEval from './pureeval/PureEval.js'
import { Sandbox } from "./command";
import { expression } from "./expression";
import { circle, sphere, line, torus, turtle } from "./generator";
import { scale, rotate, swap, embed } from "./transform";
import * as LSystem from "./lsystem";
import { LocationTrans, Tellraw } from "./utils";
export type Config = {
  block: BlockType;
  origin: BlockLocation;
  player: Player | null;
  dimension: Dimension;
  env: Object;
};

export default class System {
  config: Config;
  evaluator: Sandbox;
  funcs: { [key: string]: Function } = {
    // Pure
    circle,
    sphere,
    line,
    torus,
    turtle,
    expression,
    // Transform
    scale,
    rotate,
    swap,
    embed,

    ...LSystem,
    // Effect
    plot: this.plot,
    place: this.placeMode,
    brush: this.bursh,
    say: this.tellraw,
    getpos: () => {
      this.setPosition(this.getPlayerPosition());
    },
  };
  callbacks: { [key: string]: (a: any) => void } = {};
  // callbacks: { [key: string]: Function } = {};
  constructor() {
    this.config = {
      block: MinecraftBlockTypes.ironBlock,
      origin: new BlockLocation(0, 0, 0),
      player: null,
      dimension: world.getDimension("overworld"),
      env: {},
    };
    this.evaluator = new Sandbox(this.funcs);
    this.evaluator.updateEnv(this.config);
    this.evaluator.updateEnv(...PureEval);
    this.subscribe();
    this.boardcast("System initialized");
  }

  // Subscribe

  subscribe() {
    world.events.beforeChat.subscribe((eventData: BeforeChatEvent) => {
      let Player = eventData.sender;
      if (this.config.player === null) this.config.player = Player;
      let Chat = eventData.message;

      if (Chat.startsWith("-")) {
        eventData.cancel = true;
        let script = Chat.substring(1).trim();
        this.tellraw(`<< §3${script}`);
        this.evaluator.updateEnv({
          callbacks: this.callbacks,
          setBlock: this.setBlock,
          config: this.config,
          player: Player,
        });
        try {
          let result = this.evaluator.eval(script);
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

    world.events.blockPlace.subscribe((eventData) => {});
  }

  // Code editor : For long script editing
  codeEditor() {}

  // World Action
  fill(blockType: BlockType, begin: BlockLocation, end: BlockLocation) {
    let [xFrom, yFrom, zFrom, xTo, yTo, zTo] = [begin.x, begin.y, begin.z, end.x, end.y, end.z];
    for (let x = xFrom; x <= xTo; x++) {
      for (let y = yFrom; y <= yTo; y++) {
        for (let z = zFrom; z <= zTo; z++) {
          this.config.dimension.getBlock(new BlockLocation(x, y, z)).setType(blockType);
        }
      }
    }
  }

  plot(blocks: BlockLocation[], pos = this.config.origin, tile = this.config.block): void {
    blocks.forEach((block) => {
      this.setBlock(tile, new BlockLocation(block.x + pos.x, block.y + pos.y, block.z + pos.z));
    });
  }

  setBlocks(blockType: BlockType, blocks: BlockLocation[]) {
    blocks.forEach((block) => {
      this.config.dimension.getBlock(block).setType(blockType);
    });
  }

  setBlock(block: BlockType, pos: BlockLocation) {
    this.config.dimension.getBlock(pos).setType(block);
  }

  placeMode(blocks: BlockLocation[] = []): void {
    if (this.callbacks["place"]) {
      let callback: (a: BlockPlaceEvent) => void = this.callbacks["place"];
      world.events.blockPlace.unsubscribe(callback);
      delete this.callbacks["place"];
    }
    if (blocks.length !== 0) {
      this.callbacks["place"] = world.events.blockPlace.subscribe((eventData) => {
        let pos = eventData.block.location;
        let block = eventData.block.type;
        this.plot(blocks, pos, block);
      });
    }
  }

  bursh(blocks: BlockLocation[] = []): void {
    if (this.callbacks["brush"]) {
      let callback: (a: ItemUseEvent) => void = this.callbacks["brush"];
      world.events.itemUse.unsubscribe(callback);
      delete this.callbacks["brush"];
    }
    if (blocks.length !== 0) {
      this.callbacks["brush"] = world.events.itemUse.subscribe((eventData) => {
        // let opt = new BlockRaycastOptions
        // opt.includeLiquidBlocks = true;
        // opt.maxDistance = 256;
        // opt.includePassableBlocks = true;
        // let block = eventData.source.getBlockFrom
        // // TO DO : Detect stick or sth
        // if (block != undefined) {
        //   let pos = block.location;
        //   this.plot(blocks, pos);
        // }
      });
    }
  }

  cloneArea(target: BlockLocation, begin: BlockLocation, end: BlockLocation) {
    let [xFrom, yFrom, zFrom, xTo, yTo, zTo] = [begin.x, begin.y, begin.z, end.x, end.y, end.z];
    for (let x = xFrom; x <= xTo; x++) {
      for (let y = yFrom; y <= yTo; y++) {
        for (let z = zFrom; z <= zTo; z++) {
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
    this.config.dimension.runCommandAsync(Tellraw(this.config.player!.name, ...message.map((m) => `§6${m}`)));
  }

  boardcast(...message: string[]) {
    this.config.dimension.runCommandAsync(Tellraw("@a", ...message.map((m) => `§e${m}`)));
  }

  getPlayerPosition(): BlockLocation {
    return LocationTrans(this.config.player!.location);
  }

  getBlock(pos: BlockLocation): BlockType {
    return this.config.dimension.getBlock(pos).type;
  }

  // Modify config

  setPosition(pos: BlockLocation) {
    this.config.origin = pos;
  }

  // getItemInHand(): ItemStack {
  //   let playerComp: Player = this.config.player.getComponent("inventory");
  //   return playerComp.getItem(this.config.player.selectedSlot);
  // }
}

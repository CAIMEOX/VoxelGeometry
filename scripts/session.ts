import * as V from "@pureeval/voxel-geometry";
import { MinecraftBlockTypes, BlockType, Player, Dimension, Vector3, system } from "@minecraft/server";
import { events, Space, location, setBlocks, spawnParticles, summonEntities, eq_item, eq_player } from "./effect";
import { Sandbox } from "./sandbox";
import { tell_raw } from "./utils";
// @ts-ignore
import * as P from "pureeval-es";

class Setting {
  block: BlockType;
  origin: Vector3;
  particle: string;
  brush_item: string;

  constructor(p: Player) {
    this.block = MinecraftBlockTypes.ironBlock;
    this.origin = location(p);
    this.particle = "minecraft:basic_flame_particle";
    this.brush_item = "minecraft:stick";
  }

  static bind(p: Player) {
    return new Session(p);
  }

  setPosition(pos: Vector3) {
    this.origin = pos;
  }

  setBlockFromView(player: Player) {
    const block = player.getBlockFromViewDirection()?.block;
    if (block) {
      this.block = block.type;
    }
  }
}

export default class Session {
  user: Player;
  history: Array<string> = [];
  sandbox: Sandbox = new Sandbox({});
  setting: Setting;
  callbacks: { [key: string]: (arg: any) => void } = {};
  constructor(user: Player) {
    this.user = user;
    this.setting = new Setting(user);
    this.welcome();
    this.bind_user();
    this.load_pure_functions();
    this.load_effect_functions();
  }

  welcome() {
    this.broadcast(`${this.user.name}, Welcome to Voxel Geometry!`);
  }

  load_pure_functions() {
    this.sandbox.updateEnv({
      ...P,
      ...V.Generator,
      ...V.Exp,
      ...V.Transform,
      ...V.LSystem,
      ...V.IFS,
      dla2d: V.DLA2D,
      dla3d: V.DLA3D,
    });
  }

  load_effect_functions() {
    this.sandbox.updateEnv({
      dimension: this.dimension,
      plot: this.plot,
      render: (space: Space, effect = this.setting.particle) => spawnParticles(this.dimension())(effect)(space),
      summon: (space: Space, name: string) => summonEntities(this.dimension())(name)(space),
      pos: () => this.setting.setPosition(location(this.user)),
      get_view: () => this.setting.setBlockFromView(this.user),
      setBlocks,
      summonEntities,
      spawnParticles,
      location,
      place: this.place,
      brush: this.brush,
      repeat: this.repeat,
      tell_raw: this.tell_raw,
    });
  }

  plot(space: Space, o = this.setting.origin, block = this.setting.block) {
    return setBlocks(this.dimension())(block)(V.Transform.move(space, o.x, o.y, o.z));
  }

  place(blocks: Space = []): void {
    if (this.callbacks["place"]) {
      const callback = this.callbacks["place"];
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
      const callback = this.callbacks["brush"];
      events.itemUse.unsubscribe(callback);
      delete this.callbacks["brush"];
    }
    if (blocks.length !== 0) {
      this.callbacks["brush"] = events.itemUse.subscribe((eventData) => {
        const block = eventData.source.getBlockFromViewDirection();
        if (block && eq_item(eventData.itemStack, this.setting.brush_item)) {
          const pos = block.block.location;
          this.plot(blocks, pos);
        }
      });
    }
  }

  exports() {
    this.sandbox.updateEnv({
      user: this.user,
      setting: this.setting,
      callbacks: this.callbacks,
    });
  }

  repeat(fn: () => void, interval: number, count: number) {
    for (let i = 0; i < count; i++) {
      system.runTimeout(fn, i * interval);
    }
  }

  dimension(): Dimension {
    return this.user.dimension;
  }

  bind_user() {
    events.afterChat.subscribe((eventData) => {
      if (!eq_player(this.user, eventData.sender)) return;
      const message = eventData.message;
      if (message.startsWith("-")) {
        const script = message.substring(1).trim();
        this.exports();
        try {
          const result = this.sandbox.eval(script);
          if (result) {
            this.tell_raw(`>> §e${result}`);
          } else {
            this.tell_raw(`>> §eSuccess`);
          }
        } catch (e) {
          this.tell_raw(`>> §4${e}`);
        }
      }
    });
  }

  // Info
  tell_raw(...message: string[]) {
    this.dimension().runCommandAsync(tell_raw(this.user.name, ...message.map((m) => `§6${m}`)));
  }

  broadcast(...message: string[]) {
    this.dimension().runCommandAsync(tell_raw("@a", ...message.map((m) => `§e${m}`)));
  }
}

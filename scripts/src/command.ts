import { BlockLocation, BlockType, Dimension, Player } from "mojang-minecraft";
import { circle, fractal, sphere, turtleTest } from "./generator";
import { LocationAdd, LocationTrans, Tellraw } from "./utils";
export type Config = {
  block: BlockType;
  origin: BlockLocation;
  player: Player | null;
  dimension: Dimension;
  env: Object;
};

export type Result = Config | string;

export default class Command {
  static functional: Array<string> = ["circle", "sphere", "turtle", "lsystem", "torus"];
  static utils: Array<string> = ["get", "set"];
  message: string;
  constructor(message: string) {
    this.message = message;
  }
  // Combine parse and run
  go(config: Config) {
    this.parse(config);
  }
  gen(config: Config): Config {
    let sp = this.message.split(" ");
    let vecs: BlockLocation[] = [];
    switch (sp[0]) {
    }
    switch (sp[0]) {
      case "circle":
        let radius = parseInt(sp[1]);
        let inner_radius = parseInt(sp[2]);
        vecs = circle(radius, inner_radius);
        break;
      case "sphere":
        let radius2 = parseInt(sp[1]);
        let inner_radius2 = parseInt(sp[2]);
        vecs = sphere(radius2, inner_radius2);
        break;
      case "turtle":
        vecs = turtleTest();
        break;
      case "fractal":
        vecs = fractal(parseInt(sp[1]));
        break;
      default:
    }

    vecs.forEach((block) => {
      let b = LocationAdd(config.origin, block);
      config.dimension.getBlock(b).setType(config.block);
    });
    return config;
  }

  modify(config: Config): Config {
    let sp = this.message.split(" ");
    if (sp[0] == "get") {
      config.origin = config.player === null ? config.origin : LocationTrans(config.player.location);
      config.dimension.runCommand(Tellraw("@a", `New Position: ${config.origin}`));
    }
    return config;
  }
  parse(config: Config): Result {
    let cmd = this.message.split(" ")[0];
    //test include
    if (Command.functional.indexOf(cmd) != -1) {
      return this.gen(config);
    } else if (Command.utils.indexOf(cmd) != -1) {
      return this.modify(config);
    } else {
      return "Unknown command";
    }
  }
}

type ReadToken = string | string[]

// class Scheme {
//   token: string[]
//   constructor(code: string) {
//     this.tokenize(code)
//     this.read(this.token)
//   }

//   tokenize(s: string){
//     this.token = s.replace(/\(/g, " ( ").replace(/\)/g, " ) ").trim().split(/\s+/);
//   }

//   read(tokens: string[]) : ReadToken {
    
//   }
// }

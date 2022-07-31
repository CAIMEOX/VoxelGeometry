import { BeforeChatEvent, world, BlockLocation, MinecraftBlockTypes } from "mojang-minecraft";
import Command, { Config, Result } from "./command";
import { LocationTrans, Tellraw } from "./utils";
export default class System {
  config: Config;
  constructor() {
    this.config = {
      block: MinecraftBlockTypes.ironBlock,
      origin: new BlockLocation(0, 0, 0),
      player: null,
      dimension: world.getDimension("overworld"),
      env: {},
    };
    this.config.dimension.runCommand("say Voxel Generator initializing...");
    world.events.beforeChat.subscribe((eventData: BeforeChatEvent) => {
      let Player = eventData.sender;
      if (this.config.player === null) this.config.player = Player;
      this.config.origin = LocationTrans(this.config.player.location);
      let Chat = eventData.message;

      if (Chat.startsWith("-")) {
        eventData.cancel = true;
        let cmd = new Command(Chat.substring(1).trim());
        let result: Result = cmd.parse(this.config);
        if (typeof result === "string") {
          Player.dimension.runCommand(Tellraw(Player.name, result));
        } else {
          // Update Config
          this.config = result;
        }
      }
    });
  }
}

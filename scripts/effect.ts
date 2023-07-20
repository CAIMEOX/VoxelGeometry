import {
	ItemStack,
	world,
	system,
	Dimension,
	BlockType,
	Vector3,
	Player,
	MolangVariableMap
} from '@minecraft/server';
import * as VG from '@pureeval/voxel-geometry';

type Space = VG.Vec3[];

const Vec3 = (x: number, y: number, z: number) => new VG.Vec3(x, y, z);

const setBlock = (dimension: Dimension) => (block: BlockType) => (pos: Vector3) => {
	dimension.getBlock(pos)?.setType(block);
};

const spawnParticle = (dimension: Dimension) => (particle: string) => (pos: Vector3) => {
	dimension.spawnParticle(particle, pos, new MolangVariableMap());
};

const summonEntity = (dimension: Dimension) => (entity: string) => (pos: Vector3) => {
	dimension.spawnEntity(entity, pos);
};

const overSpace = (space: Space) => (fn: (pos: Vector3) => void) => {
	space.forEach(fn);
};

const setBlocks = (dimension: Dimension) => (block: BlockType) => (space: Space) =>
	overSpace(space)(setBlock(dimension)(block));

const spawnParticles = (dimension: Dimension) => (particle: string) => (space: Space) =>
	overSpace(space)(spawnParticle(dimension)(particle));

const summonEntities = (dimension: Dimension) => (entity: string) => (space: Space) =>
	overSpace(space)(summonEntity(dimension)(entity));
const location = (player: Player) => player.location;

const getBlock = (dimension: Dimension) => (pos: Vector3) => dimension.getBlock(pos)?.type;

const eq_item = (a: ItemStack, b: string) => a.typeId === b;

const all_operators = () => world.getAllPlayers().filter((x) => x.isOp());

const eq_player = (a: Player, b: Player) => a.name === b.name;

const events = {
	playerSpawned: world.afterEvents.playerSpawn,
	blockPlace: world.afterEvents.blockPlace,
	afterChat: world.afterEvents.chatSend,
	beforeChat: world.beforeEvents.chatSend,
	itemUse: world.afterEvents.itemUse,
	worldInitialize: world.afterEvents.worldInitialize,
	beforeWatchdogTerminate: system.beforeEvents.watchdogTerminate
};

export {
	Vec3,
	eq_item,
	events,
	setBlock,
	spawnParticle,
	summonEntity,
	overSpace,
	setBlocks,
	spawnParticles,
	summonEntities,
	location,
	Space,
	all_operators,
	eq_player,
	getBlock
};

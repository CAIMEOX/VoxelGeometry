import { Vec3 } from "./vector.js";
function BAdd(p1, p2) {
    return new Vec3(p1.x + p2.x, p1.y + p2.y, p2.z + p2.z);
}
function BMul(p, k) {
    return new Vec3(p.x * k, p.y * k, p.z * k);
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}
function getDistance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) +
        (p1.y - p2.y) * (p1.y - p2.y) +
        (p1.z - p2.z) * (p1.z - p2.z));
}
function rand() {
    const p = Math.random();
    if (p > 0.5)
        return Math.random();
    else
        return -Math.random();
}
export { rand, BAdd, BMul, random };

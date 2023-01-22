const adm_zip = require('adm-zip');
const fs=require('fs');
const zip = new adm_zip();

zip.addLocalFolder('./build/behavior_packs/gen/');
zip.writeZip('VoxelGeometry.mcpack');

fs.writeFileSync('version',JSON.parse(fs.readFileSync('./build/behavior_packs/gen/manifest.json'))["header"]["version"].join('.'));
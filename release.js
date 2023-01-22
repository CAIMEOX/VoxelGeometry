const adm_zip = require('adm-zip');
const zip = new adm_zip();
zip.addLocalFolder('./build/behavior_packs/gen/');
zip.writeZip('VoxelGeometry.mcpack');
const fse = require('fs-extra');
const { validate } = require('arvis-extension-validator');

const convert = async (source, outputPath) => {
  if (fs.existsSync(source)) {
    const sourceJson = fse.readJSON(source, { encoding: 'utf8' });

    if (!validate(sourceJson, "workflow", { strict: false })) {
      console.error(
        chalk.redBright(
          'Not valid source file'
        )
      );
    }


  } else {
    throw new Error(`plist file not found! given plist path: ${source}`);
  }
};

export default convert;

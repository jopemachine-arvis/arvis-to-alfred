import plist from 'plist';
import fse from 'fs-extra';
import chalk from 'chalk';
import _ from 'lodash';
import { validate } from 'arvis-extension-validator';

const replaceAttribute = (json: any, from: string, to: string) => {
  json[`${to}`] = json[`${from}`];
  delete json[`${from}`];
  return json;
};

const transformAttributes = (sourceJson: any) => {
  delete sourceJson['$schema'];
  delete sourceJson['defaultIcon'];
  sourceJson['bundleid'] = `${sourceJson.creator}.${sourceJson.name}`;
  replaceAttribute(sourceJson, 'creator', 'createdby');
  replaceAttribute(sourceJson, 'webAddress', 'webaddress');

  sourceJson['disabled'] = !sourceJson['enabled'];
  delete sourceJson['enabled'];

  return sourceJson;
};

const convert = async (source?: string, outputPath?: string) => {
  if (!source) source = 'arvis-workflow.json';

  if (fse.existsSync(source)) {
    const sourceJson = await fse.readJSON(source, { encoding: 'utf8' });

    if (!validate(sourceJson, "workflow", { strict: false })) {
      console.error(
        chalk.redBright(
          'Not valid source file'
        )
      );
    }

    const out = outputPath ? outputPath : `info.plist`;

    const json = transformAttributes(sourceJson);

    const resultPlist = plist.build(json);

    await fse.writeFile(out, resultPlist, { encoding: 'utf-8' });

    console.log(chalk.white(`${chalk.greenBright('✔')} info.plist converting is done.`));
  } else {
    throw new Error(`arvis-workflow.json file not found! given plist path: ${source}`);
  }
};

export default convert;

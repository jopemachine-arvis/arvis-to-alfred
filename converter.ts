import plist from 'plist';
import fse from 'fs-extra';
import chalk from 'chalk';
import _ from 'lodash';
import { validate } from 'arvis-extension-validator';
import { transformCommandsToDAG } from './commandConverter';
import { deleteAttributeIfExist, ensureAttributeExist, insertAttribute, replaceAttribute } from './util';

const migrateVariable = (json: any) => {
  if (json['variable']) {
    Object.keys(json['variable']).forEach((variableName) => {
      json['variable'][variableName] = JSON.stringify(json['variable'][variableName]);
    });
  }
};

const transformAttributes = (sourceJson: any) => {
  deleteAttributeIfExist(sourceJson, '$schema');
  deleteAttributeIfExist(sourceJson, 'defaultIcon');
  deleteAttributeIfExist(sourceJson, 'latest');

  insertAttribute(sourceJson, 'bundleid', `${sourceJson.creator}.${sourceJson.name}`);
  insertAttribute(sourceJson, 'readme', `${sourceJson.readme ?? '(no readme)'}\n\nThis workflow is converted by arvis-to-alfred.`);
  replaceAttribute(sourceJson, 'creator', 'createdby');
  replaceAttribute(sourceJson, 'webAddress', 'webaddress');

  insertAttribute(sourceJson, 'disabled', sourceJson['enabled'] ? !sourceJson['enabled'] : true);
  deleteAttributeIfExist(sourceJson, 'enabled');

  ensureAttributeExist(sourceJson, 'version');
  ensureAttributeExist(sourceJson, 'webaddress');

  migrateVariable(sourceJson);

  const { connections, objects, uidata } = transformCommandsToDAG(sourceJson.commands);

  insertAttribute(sourceJson, 'connections', connections);
  insertAttribute(sourceJson, 'objects', objects);
  insertAttribute(sourceJson, 'uidata', uidata);

  deleteAttributeIfExist(sourceJson, 'commands');
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

    const resultPlist = plist.build(transformAttributes(sourceJson), { indent: '\t', allowEmpty: true });
    await fse.writeFile(out, resultPlist, { encoding: 'utf-8' });

    console.log(chalk.white(`${chalk.greenBright('✔')} info.plist converting is done.`));
  } else {
    throw new Error(`arvis-workflow.json file not found! given plist path: ${source}`);
  }
};

export default convert;

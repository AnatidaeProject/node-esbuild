import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  formatFiles,
  GeneratorCallback,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { Schema } from './schema';
import { setDefaultCollection } from '@nrwl/workspace/src/utilities/set-default-collection';
import { jestInitGenerator } from '@nrwl/jest';

export const pluginVersion = '*';

function updateDependencies(tree: Tree) {
  updateJson(tree, 'package.json', (json) => {
    delete json.dependencies['@anatidaeproject/node-esbuild'];
    return json;
  });

  return addDependenciesToPackageJson(
    tree,
    {},
    { '@anatidaeproject/node-esbuild': pluginVersion }
  );
}

function normalizeOptions(schema: Schema) {
  return {
    ...schema,
    unitTestRunner: schema.unitTestRunner ?? 'jest',
  };
}

export async function initGenerator(tree: Tree, schema: Schema) {
  const options = normalizeOptions(schema);

  setDefaultCollection(tree, '@anatidaeproject/node-esbuild');

  let jestInstall: GeneratorCallback;
  if (options.unitTestRunner === 'jest') {
    jestInstall = await jestInitGenerator(tree, {});
  }
  const installTask = await updateDependencies(tree);
  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return async () => {
    if (jestInstall) {
      await jestInstall();
    }
    await installTask();
  };
}

export default initGenerator;
export const initSchematic = convertNxGenerator(initGenerator);

import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
import { peek } from '@anatidaeproject/utils';
describe('node-esbuild e2e', () => {
  it('should create node-esbuild', async (done) => {
    const plugin = uniq('node-esbuild');
    ensureNxProject(
      '@anatidaeproject/node-esbuild',
      'dist/packages/node-esbuild'
    );
    await runNxCommandAsync(
      `generate @anatidaeproject/node-esbuild:application ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);
    peek(result);
    expect(result.stdout).toContain('Executor ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('node-esbuild');
      ensureNxProject(
        '@anatidaeproject/node-esbuild',
        'dist/packages/node-esbuild'
      );
      await runNxCommandAsync(
        `generate @anatidaeproject/node-esbuild:application ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${plugin}/src/index.ts`)
      ).not.toThrow();
      done();
    });
  });

  describe('--tags', () => {
    it('should add tags to nx.json', async (done) => {
      const plugin = uniq('node-esbuild');
      ensureNxProject(
        '@anatidaeproject/node-esbuild',
        'dist/packages/node-esbuild'
      );
      await runNxCommandAsync(
        `generate @anatidaeproject/node-esbuild:application ${plugin} --tags e2etag,e2ePackage`
      );
      const nxJson = readJson('nx.json');
      expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
      done();
    });
  });
});

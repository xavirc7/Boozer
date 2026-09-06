import { build } from 'esbuild'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const directory = await mkdtemp(join(tmpdir(), 'boozer-api-tests-'))
try {
  await build({ entryPoints: ['tests/api.test.ts', 'tests/paymentCountdown.test.ts'], outdir: directory, outExtension: { '.js': '.mjs' }, bundle: true, platform: 'node', format: 'esm' })
  const result = spawnSync(process.execPath, ['--test', join(directory, 'api.test.mjs'), join(directory, 'paymentCountdown.test.mjs')], { stdio: 'inherit' })
  process.exitCode = result.status ?? 1
} finally {
  await rm(directory, { recursive: true, force: true })
}

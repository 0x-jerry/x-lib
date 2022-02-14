import { join } from 'path'
import { run, runInProject } from './shared'

const dependencies = process.argv.slice(2)

main()

async function main() {
  for (const depProject of dependencies) {
    await runInProject('build', join(__dirname, '../packages', depProject))
  }

  await run('tsup src/exports.ts --format cjs,esm --dts', process.cwd())
}

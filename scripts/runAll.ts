import assert from 'assert'
import execa from 'execa'
import fs from 'fs/promises'
import path from 'path'

const packagesDir = path.join(process.cwd(), 'packages')

main(process.argv.slice(2))

async function main(params: string[]) {
  const [command, project = ''] = params

  assert(command, 'Invalid command, please select one of [test, build, release]')

  const projectNames = await fs.readdir(packagesDir)

  if (projectNames.includes(project)) {
    const packageCwd = path.join(packagesDir, project)
    await runInProject(command, packageCwd)

    return
  }

  for (const projectName of projectNames) {
    const packageCwd = path.join(packagesDir, projectName)
    await runInProject(command, packageCwd)
  }
}

async function runInProject(script: string, cwd: string) {
  return run(`pnpm run ${script}`, cwd)
}

async function run(cmd: string, cwd?: string) {
  console.log('$', cwd + ':', cmd)
  await execa('sh', ['-c', cmd], { stdio: 'inherit', cwd })
}

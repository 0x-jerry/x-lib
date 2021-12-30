import assert from 'assert'
import execa from 'execa'
import fs from 'fs/promises'
import path from 'path'

const packagesDir = path.join(process.cwd(), 'packages')

main(process.argv.slice(2))

async function main(params: string[]) {
  const [command, project = '', ...args] = params

  assert(command, 'Invalid command, please select one of [test, build, release]')

  const projectNames = await fs.readdir(packagesDir)

  const runConf = {
    projects: [] as string[],
    params: [] as string[],
  }

  if (projectNames.includes(project)) {
    runConf.projects = [project]
    runConf.params = args
  } else {
    runConf.projects = projectNames
    runConf.params = [project, ...args]
  }

  for (const projectName of runConf.projects) {
    const packageCwd = path.join(packagesDir, projectName)

    const cmd = [command, ...runConf.params].join(' ')
    await runInProject(cmd, packageCwd)
  }
}

async function runInProject(script: string, cwd: string) {
  return run(`pnpm run ${script}`, cwd)
}

async function run(cmd: string, cwd?: string) {
  console.log('$', cwd + ':', cmd)
  await execa('sh', ['-c', cmd], { stdio: 'inherit', cwd })
}

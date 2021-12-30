import assert from 'assert'
import fs from 'fs/promises'
import path from 'path'
import { runInProject } from './shared'

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

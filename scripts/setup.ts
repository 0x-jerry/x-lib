import path from 'path'
import { runInProject } from './shared'

const packagesDir = path.join(process.cwd(), 'packages')

main()

async function main() {
  const projectNames = [
    //
    'events',
    'key-events',
    'logger',

    'utils',

    'dom-navigator',
    'conf',
    'algorithm',

    'socket',
    'protocol',
  ]

  for (const projectName of projectNames) {
    const packageCwd = path.join(packagesDir, projectName)

    await runInProject('build', packageCwd)
  }
}

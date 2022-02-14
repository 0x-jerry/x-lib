import { parse } from 'path'
import { getDepsTree, getBuildSequence, build, getProjectDir } from './shared'

main()

async function main() {
  const projectName = parse(process.cwd()).name
  const tree = await getDepsTree(projectName)

  const buildSequence: string[] = getBuildSequence(tree)

  for (const project of buildSequence) {
    await build(getProjectDir(project))
  }
}

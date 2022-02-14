import { join } from 'path'
import { build, getBuildSequence, getDepsTree, getProjectDir, TreeNode } from './shared'
import fs from 'fs/promises'

main()

async function main() {
  const packageNames = await fs.readdir(join(__dirname, '../packages'))

  const root: TreeNode = {
    id: '',
    children: [],
  }

  for (const pkgName of packageNames) {
    if (pkgName.startsWith('.')) continue

    const node = await getDepsTree(pkgName, root)
    root.children.push(node)
  }

  const seq = getBuildSequence(root).filter(Boolean)

  for (const project of seq) {
    await build(getProjectDir(project))
  }
}

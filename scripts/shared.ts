import { join } from 'path'
import fs from 'fs/promises'
import execa from 'execa'

export async function runInProject(script: string, cwd: string) {
  return run(`pnpm run ${script}`, cwd)
}

export async function run(cmd: string, cwd?: string) {
  console.log('$', cwd + ':', cmd)
  await execa('sh', ['-c', cmd], { stdio: 'inherit', cwd })
}

export function getBuildSequence(tree: TreeNode<string>): string[] {
  const buildSequence: string[] = []

  const walkTree = (node: TreeNode) => {
    for (const n of node.children) {
      walkTree(n)
    }

    if (!buildSequence.includes(node.id)) {
      buildSequence.push(node.id)
    }
  }

  walkTree(tree)
  return buildSequence
}

export async function build(cwd: string) {
  await run('tsup src/exports.ts --format cjs,esm --dts', cwd)
}

export async function getDepsTree(projectName: string, parent?: TreeNode): Promise<TreeNode> {
  const deps = await getDependencies(projectName)

  const node: TreeNode = {
    parent,
    id: projectName,
    children: [],
  }

  for (const dep of deps) {
    const subTree = await getDepsTree(dep, node)
    node.children.push(subTree)
  }

  return node
}

export interface TreeNode<T = string> {
  id: T
  parent?: TreeNode<T>
  children: TreeNode<T>[]
}

export function getProjectDir(projectName: string) {
  return join(__dirname, '../packages', projectName)
}

async function getDependencies(projectName: string): Promise<string[]> {
  const pkgPath = join(getProjectDir(projectName), 'package.json')
  try {
    const txt = await fs.readFile(pkgPath, { encoding: 'utf-8' })
    const json = await JSON.parse(txt)

    const pkgPrefix = '@0x-jerry/'

    const pkgNames = Object.keys(json.devDependencies)
      .filter((n) => n.startsWith(pkgPrefix))
      .map((n) => n.slice(pkgPrefix.length))

    return pkgNames
  } catch (error) {
    console.warn(error)
  }

  return []
}

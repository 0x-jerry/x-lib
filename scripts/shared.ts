import execa from 'execa'

export async function runInProject(script: string, cwd: string) {
  return run(`pnpm run ${script}`, cwd)
}

async function run(cmd: string, cwd?: string) {
  console.log('$', cwd + ':', cmd)
  await execa('sh', ['-c', cmd], { stdio: 'inherit', cwd })
}

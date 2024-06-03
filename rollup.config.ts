import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: './src/extension.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  external: ['vscode', 'fsevents'],
  treeshake: true,
  plugins: [nodeResolve(), commonjs(), typescript()],
})

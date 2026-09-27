import { resolve as pathResolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import fs from 'node:fs';

const rootDir = process.cwd();

export async function resolve(specifier, context, nextResolve) {
  // Mock Next.js internal runtime modules for standalone test execution
  if (specifier === 'next/cache') {
    return {
      format: 'module',
      shortCircuit: true,
      url: 'data:text/javascript,export function revalidatePath(){}; export function revalidateTag(){};',
    };
  }

  if (specifier === 'next/headers') {
    return {
      format: 'module',
      shortCircuit: true,
      url: 'data:text/javascript,export async function headers(){ return new Headers(); }; export async function cookies(){ return { get: ()=>null }; };',
    };
  }

  if (specifier === 'next/navigation') {
    return {
      format: 'module',
      shortCircuit: true,
      url: 'data:text/javascript,export function notFound(){ throw new Error("NEXT_NOT_FOUND"); }; export function redirect(){}; export function useRouter(){ return {}; };',
    };
  }

  // Handle @/ path alias
  if (specifier.startsWith('@/')) {
    const relPath = specifier.slice(2);
    let fullPath = pathResolve(rootDir, relPath);
    if (!fs.existsSync(fullPath)) {
      if (fs.existsSync(fullPath + '.js')) {
        fullPath = fullPath + '.js';
      } else if (fs.existsSync(fullPath + '.mjs')) {
        fullPath = fullPath + '.mjs';
      } else if (fs.existsSync(fullPath + '.json')) {
        fullPath = fullPath + '.json';
      }
    }
    return nextResolve(pathToFileURL(fullPath).href, context);
  }

  // Handle relative imports without extension
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    if (context.parentURL) {
      const parentPath = fileURLToPath(context.parentURL);
      const parentDir = pathResolve(parentPath, '..');
      let targetPath = pathResolve(parentDir, specifier);
      if (!fs.existsSync(targetPath)) {
        if (fs.existsSync(targetPath + '.js')) {
          targetPath = targetPath + '.js';
        } else if (fs.existsSync(targetPath + '.mjs')) {
          targetPath = targetPath + '.mjs';
        } else if (fs.existsSync(targetPath + '.json')) {
          targetPath = targetPath + '.json';
        }
      }
      return nextResolve(pathToFileURL(targetPath).href, context);
    }
  }

  return nextResolve(specifier, context);
}

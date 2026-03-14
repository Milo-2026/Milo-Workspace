// Environment Loader - reads from ../.env (OpenClaw parent)
import fs from 'fs';
import path from 'path';

const envPaths = [
  path.join(process.cwd(), '..', '.env'),
  path.join(process.cwd(), '.env'),
];

export function loadEnv() {
  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...value] = trimmed.split('=');
          if (key && value) {
            process.env[key.trim()] = value.join('=').trim();
          }
        }
      }
      return true;
    }
  }
  return false;
}

// Auto-load on import
loadEnv();

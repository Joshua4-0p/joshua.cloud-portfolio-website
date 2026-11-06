// Builds out/ against a fake API host so the e2e suite is deterministic and can never reach the real API.
import { execSync } from 'node:child_process';
execSync('npx next build', { stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_DRUM_API: 'https://example.execute-api.us-east-1.amazonaws.com' } });

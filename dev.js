import { spawn } from 'child_process';

console.log('Starting Workforce HRMS fullstack in development mode...');
spawn('npm', ['run', 'dev'], { cwd: './backend', stdio: 'inherit', shell: true });
spawn('npm', ['run', 'dev'], { cwd: './frontend', stdio: 'inherit', shell: true });

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

class Logger {
    constructor() {
        this.logsDir = path.join(__dirname, '../../logs');

        // Create logs directory if it doesn't exist
        if (!fs.existsSync(this.logsDir)) {
            fs.mkdirSync(this.logsDir, { recursive: true });
        }

        this.logFile = path.join(this.logsDir, `bot-${new Date().toISOString().split('T')[0]}.log`);
    }

    write(level, message, data = {}) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        const logData = Object.keys(data).length > 0 ? JSON.stringify(data) : '';
        const fullLog = logData ? `${logMessage} ${logData}` : logMessage;

        // Console output
        console.log(fullLog);

        // File output
        try {
            fs.appendFileSync(this.logFile, fullLog + '\n');
        } catch (error) {
            console.error('Erro ao escrever log:', error);
        }
    }

    info(message, data) {
        this.write('info', message, data);
    }

    error(message, data) {
        this.write('error', message, data);
    }

    warn(message, data) {
        this.write('warn', message, data);
    }

    debug(message, data) {
        if (process.env.DEBUG === 'true') {
            this.write('debug', message, data);
        }
    }

    success(message, data) {
        this.write('success', message, data);
    }
}

export default new Logger();

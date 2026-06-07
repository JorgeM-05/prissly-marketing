const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

class Logger {
  constructor(scriptName) {
    this.scriptName = scriptName;
    this.logFile = null;
  }

  _ensureLogFile() {
    if (this.logFile === null) {
      const reportsDir = path.join(process.cwd(), '../pipeline/reports');
      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }
      this.logFile = path.join(reportsDir, `${this.scriptName}-${new Date().toISOString().split('T')[0]}.log`);
    }
  }

  info(message) {
    console.log(chalk.blue(`[${this.scriptName}] ${message}`));
    this._writeLog(`INFO: ${message}`);
  }

  success(message) {
    console.log(chalk.green(`✓ ${message}`));
    this._writeLog(`SUCCESS: ${message}`);
  }

  error(message) {
    console.log(chalk.red(`✗ ${message}`));
    this._writeLog(`ERROR: ${message}`);
  }

  warning(message) {
    console.log(chalk.yellow(`⚠ ${message}`));
    this._writeLog(`WARNING: ${message}`);
  }

  _writeLog(message) {
    this._ensureLogFile();
    try {
      fs.appendFileSync(this.logFile, `${new Date().toISOString()} - ${message}\n`);
    } catch (err) {
      // Silent fail if logging fails
    }
  }
}

module.exports = Logger;

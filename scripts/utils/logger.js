const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

class Logger {
  constructor(scriptName) {
    this.scriptName = scriptName;
    this.logFile = path.join(__dirname, `../pipeline/reports/${scriptName}-${new Date().toISOString().split('T')[0]}.log`);
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
    fs.appendFileSync(this.logFile, `${new Date().toISOString()} - ${message}\n`);
  }
}

module.exports = Logger;

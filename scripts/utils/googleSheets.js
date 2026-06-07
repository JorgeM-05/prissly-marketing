// TODO: Integrate google-spreadsheet API for full functionality
const Logger = require('./logger');
const logger = new Logger('googleSheets');

async function connect(sheetId, apiKey) {
  // TODO: Initialize Google Sheets client
  logger.info('Google Sheets client initialized (stub)');
  return {
    doc: null,
    sheet: null
  };
}

async function appendRow(connection, sheetName, rowData) {
  // TODO: Append row to specified sheet
  logger.info(`Would append row to ${sheetName}: ${JSON.stringify(rowData)}`);
  return true;
}

async function readSheet(connection, sheetName) {
  // TODO: Read entire sheet
  logger.info(`Would read sheet: ${sheetName}`);
  return [];
}

module.exports = {
  connect,
  appendRow,
  readSheet
};

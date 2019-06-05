'use strict';
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const stripAnsi = require('strip-ansi');
const { inspect } = require('util');

module.exports = class KenshoLogger {
  constructor(options = {
    appname: null,
    global: true,
    logdir: true,
    logurl: null,
  }) {
    this.options = options;
    let dir = _getCallerFile().split(path.sep).reverse();
    this.appname = options.appname ? `${options.appname} | ${`${dir[1]}/${dir[0]}`}` : `${__dirname.split(path.sep).reverse()[0]}/${_getCallerFile()}`;
    this.shardID = '';
    this.logfile = this.options.logdir ? path.resolve(__dirname, this.options.logdir, `${new Date().toLocaleString().replace(/\//g, '.')
      .replace(/:/g, '-')
      .replace(', ', '-')}.log`) : null;
    this.logfileEnabled = this.options.logdir ? fs.access(path.resolve(__dirname, this.options.logdir), fs.constants.F_OK | fs.constants.W_OK, err => {
      if (err) {
        this.types.error(`${this.mod.header('Kensho Logger')} Unable to find or write to "${path.resolve(__dirname, this.options.logdir)}", Disabling Log to File`, err);
        this.logfileEnabled = false;
        return false;
      }
      return true;
    }) : false;
    this.figures = {
      info: '\u2756',
      warn: '\u26A0',
      error: '\u2755',
      debug: '\u2754',
    };
    this.mod = {
      sector: args => `${chalk.white(`「${args}」`)}`,
      seperator: `${chalk.magenta.bold('>>')}`,
      header: args => `${this.mod.sector(args)} ${this.mod.seperator}`,
      getTime: () => `${chalk.white(`「${chalk.greenBright.bold(new Date().toLocaleString('en-US').replace(',', ''))}」`)}`,
      base: () => `${this.mod.getTime()} ${this.mod.sector(chalk.cyanBright.bold(this.appname))}${this.shardID} ${this.mod.seperator}`,
    };
    this.types = {
      log: (...args) => {
        for (const part of args) {
          let text = '';
          if (part === args[0]) {
            if (typeof part === 'object') text = `${this.mod.base()} ${inspect(part, { depth: 1, colors: true })}\n`;
            else text = `${this.mod.base()} ${part}\n`;
          } else if (typeof part === 'object') {
            text = `${inspect(part, {
              depth: 1,
              colors: true,
            })}\n`;
          } else {
            text = `${part}\n`;
          }
          if (this.logfileEnabled) {
            this.logToFile(text);
          }
          process.stdout.write(text);
        }
      },
      info: (...args) => {
        const info = `${this.mod.sector(chalk.cyanBright.bold(`${this.figures.info} Info`))}`;
        for (const part of args) {
          let text = '';
          if (part === args[0]) {
            if (typeof part === 'object') text = `${this.mod.base()} ${info} ${this.mod.seperator} ${inspect(part, { depth: 1, colors: true })}\n`;
            else text = `${this.mod.base()} ${info} ${this.mod.seperator} ${chalk.white(part)}\n`;
          } else if (typeof part === 'object') {
            text = `${inspect(part, {
              depth: 1,
              colors: true,
            })}\n`;
          } else {
            text = `${part}\n`;
          }
          if (this.logfileEnabled) {
            this.logToFile(text);
          }
          process.stdout.write(text);
        }
      },
      warn: (...args) => {
        const warn = `${this.mod.sector(chalk.yellow.bold(`${this.figures.warn} Warn`))}`;
        for (const part of args) {
          let text = '';
          if (part === args[0]) {
            if (typeof partrgs === 'object') text = `${this.mod.base()} ${warn} ${this.mod.seperator} ${inspect(part, { depth: 1, colors: true })}\n`;
            else text = `${this.mod.base()} ${warn} ${this.mod.seperator} ${chalk.yellow(part)}\n`;
          } else if (typeof part === 'object') {
            text = `${inspect(part, {
              depth: 1,
              colors: true,
            })}\n`;
          } else {
            text = `${part}\n`;
          }
          if (this.logfileEnabled) {
            this.logToFile(text);
          }
          process.stdout.write(text);
        }
      },
      error: (...args) => {
        const error = `${this.mod.sector(chalk.redBright.bold(`${this.figures.error} Error`))}`;
        for (const part of args) {
          let text = '';
          if (part === args[0]) {
            if (typeof part === 'object') text = `${this.mod.base()} ${error} ${this.mod.seperator} ${inspect(part, { depth: 1, colors: true })}\n`;
            else text = `${this.mod.base()} ${error} ${this.mod.seperator} ${chalk.redBright(part)}\n`;
          } else if (typeof part === 'object') {
            text = `${inspect(part, {
              depth: 1,
              colors: true,
            })}\n`;
          } else {
            text = `${part}\n`;
          }
          if (this.logfileEnabled) {
            this.logToFile(text);
          }
          process.stdout.write(text);
        }
      },
      debug: (...args) => {
        const debug = `${this.mod.sector(chalk.green.bold(`${this.figures.debug} Debug`))}`;
        for (const part of args) {
          let text = '';
          if (part === args[0]) {
            if (typeof part === 'object') text = `${this.mod.base()} ${debug} ${this.mod.seperator} ${inspect(part, { depth: 1, showHidden: true, colors: true })}\n`;
            else text = `${this.mod.base()} ${debug} ${this.mod.seperator} ${chalk.greenBright(part)}\n`;
          } else if (typeof part === 'object') {
            text = `${inspect(part, {
              depth: 1,
              colors: true,
            })}\n`;
          } else {
            text = `${part}\n`;
          }
          if (this.logfileEnabled) {
            this.logToFile(text);
          }
          process.stdout.write(text);
        }
      },
    };
    Object.keys(this.types).forEach(i => {
      this[i] = this.types[i];
      if (!options.global) {
        console[i] = this.types[i];
        console.header = this.mod.header;
        console.seperator = this.mod.seperator;
        console.sector = this.mod.sector;
      }
    });
    if (this.options.logurl) {
      this.types.warn(`${this.mod.header('Kensho Logger')} Option "logurl" is not yet supported`);
    }
  }
  setShard(id) {
    this.shardID = this.mod.sector(chalk.greenBright(id));
    return true;
  }
  logToFile(text) {
    fs.appendFile(this.logfile, stripAnsi(text), err => {
      if (err) {
        this.types.error(`${this.mod.header('Kensho Logger')} Error while writing to "${this.logfile}", Disabling Log to File`, err);
      }
    });
  }
};
function _getCallerFile() {
  const originalFunc = Error.prepareStackTrace;

  let callerfile;
  (() => {
    const err = new Error();
    let currentfile;

    Error.prepareStackTrace = (error, stack) => stack;
    currentfile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();

      if (currentfile !== callerfile) break;
    }
  })();

  Error.prepareStackTrace = originalFunc;

  return callerfile;
}

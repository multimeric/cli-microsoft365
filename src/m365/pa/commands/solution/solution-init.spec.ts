import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';
import { Cli } from '../../../../cli/Cli';
import { CommandInfo } from '../../../../cli/CommandInfo';
import { Logger } from '../../../../cli/Logger';
import Command from '../../../../Command';
import { telemetry } from '../../../../telemetry';
import { pid } from '../../../../utils/pid';
import { session } from '../../../../utils/session';
import { sinonUtil } from '../../../../utils/sinonUtil';
import commands from '../../commands';
import TemplateInstantiator from '../../template-instantiator';
const command: Command = require('./solution-init');

describe(commands.SOLUTION_INIT, () => {
  let log: string[];
  let logger: Logger;
  let commandInfo: CommandInfo;
  let trackEvent: any;
  let telemetryCommandName: any;

  before(() => {
    trackEvent = sinon.stub(telemetry, 'trackEvent').callsFake((commandName) => {
      telemetryCommandName = commandName;
    });
    sinon.stub(pid, 'getProcessName').callsFake(() => '');
    sinon.stub(session, 'getId').callsFake(() => '');
    commandInfo = Cli.getCommandInfo(command);
  });

  beforeEach(() => {
    log = [];
    logger = {
      log: (msg: string) => {
        log.push(msg);
      },
      logRaw: (msg: string) => {
        log.push(msg);
      },
      logToStderr: (msg: string) => {
        log.push(msg);
      }
    };
    telemetryCommandName = null;
  });

  afterEach(() => {
    sinonUtil.restore([
      path.basename,
      fs.readdirSync,
      fs.existsSync,
      TemplateInstantiator.instantiate
    ]);
  });

  after(() => {
    sinonUtil.restore([
      telemetry.trackEvent,
      pid.getProcessName,
      session.getId
    ]);
  });

  it('has correct name', () => {
    assert.strictEqual(command.name.startsWith(commands.SOLUTION_INIT), true);
  });

  it('has a description', () => {
    assert.notStrictEqual(command.description, null);
  });

  it('calls telemetry', async () => {
    await assert.rejects(command.action(logger, { options: {} }));
    assert(trackEvent.called);
  });

  it('logs correct telemetry event', async () => {
    await assert.rejects(command.action(logger, { options: {} }));
    assert.strictEqual(telemetryCommandName, commands.SOLUTION_INIT);
  });

  it('supports specifying publisher name', () => {
    const options = command.options;
    let containsOption = false;
    options.forEach(o => {
      if (o.option.indexOf('--publisherName') > -1) {
        containsOption = true;
      }
    });
    assert(containsOption);
  });

  it('supports specifying publisher prefix', () => {
    const options = command.options;
    let containsOption = false;
    options.forEach(o => {
      if (o.option.indexOf('--publisherPrefix') > -1) {
        containsOption = true;
      }
    });
    assert(containsOption);
  });

  it('passes validation when valid publisherName and publisherPrefix are specified', async () => {
    const actual = await command.validate({ options: { publisherName: '_ExamplePublisher', publisherPrefix: 'prefix' } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('fails validation when the project directory contains relative paths', async () => {
    sinon.stub(path, 'basename').callsFake(() => 'rootPath1\\.\\..\\rootPath2');

    const actual = await command.validate({ options: { publisherName: 'ExamplePublisher', publisherPrefix: 'prefix' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation when the project directory equals invalid text sequences (like COM1 or LPT6)', async () => {
    sinon.stub(path, 'basename').callsFake(() => 'COM1');

    const actual = await command.validate({ options: { publisherName: 'ExamplePublisher', publisherPrefix: 'prefix' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation when the project directory name is emtpy', async () => {
    sinon.stub(path, 'basename').callsFake(() => '');

    const actual = await command.validate({ options: { publisherName: 'ExamplePublisher', publisherPrefix: 'prefix' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation when the publisherName option isn\'t specified', async () => {
    const actual = await command.validate({ options: { publisherPrefix: 'prefix' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation when the publisherPrefix option isn\'t specified', async () => {
    const actual = await command.validate({ options: { publisherName: 'ExamplePublisher' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation when the length of publisherPrefix is less than 2', async () => {
    const actual = await command.validate({ options: { publisherName: 'ExamplePublisher', publisherPrefix: 'p' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation when the length of publisherPrefix is more than 8', async () => {
    const actual = await command.validate({ options: { publisherName: 'ExamplePublisher', publisherPrefix: 'verylongprefix' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation when the length of publisherPrefix starts with a number', async () => {
    const actual = await command.validate({ options: { publisherName: 'ExamplePublisher', publisherPrefix: '1prefix' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation when the length of publisherPrefix starts with an underscore', async () => {
    const actual = await command.validate({ options: { publisherName: 'ExamplePublisher', publisherPrefix: '_prefix' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation when the length of publisherPrefix starts with \'mscrm\'', async () => {
    const actual = await command.validate({ options: { publisherName: 'ExamplePublisher', publisherPrefix: 'mscrmpr' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation when the length of publisherPrefix contains a special character', async () => {
    const actual = await command.validate({ options: { publisherName: 'ExamplePublisher', publisherPrefix: 'préfix' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation when the length of publisherName starts with a number', async () => {
    const actual = await command.validate({ options: { publisherName: '1ExamplePublisher', publisherPrefix: 'prefix' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation when the length of publisherName contains a special character', async () => {
    const actual = await command.validate({ options: { publisherName: 'ExamplePùblisher', publisherPrefix: 'prefix' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation when the current directory doesn\'t contain any files with extension proj', async () => {
    sinon.stub(fs, 'readdirSync').callsFake(() => ['file1.exe', 'file2.xml', 'file3.json'] as any);
    const actual = await command.validate({ options: { publisherName: '_ExamplePublisher', publisherPrefix: 'prefix' } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('fails validation when the current directory contains files with extension proj', async () => {
    sinon.stub(fs, 'readdirSync').callsFake(() => ['file1.exe', 'file2.cdsproj', 'file3.json'] as any);
    const actual = await command.validate({ options: { publisherName: '_ExamplePublisher', publisherPrefix: 'prefix' } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('TemplateInstantiator.instantiate is called exactly twice in an empty directory', async () => {
    sinon.stub(fs, 'existsSync').callsFake(() => false);
    const templateInstantiate = sinon.stub(TemplateInstantiator, 'instantiate').callsFake(() => { });

    await command.action(logger, { options: { publisherName: '_ExamplePublisher', publisherPrefix: 'prefix' } });
    assert(templateInstantiate.calledTwice);
    assert(templateInstantiate.withArgs(logger, sinon.match.string, sinon.match.string, false, sinon.match.object, false).calledTwice);
  });

  it('TemplateInstantiator.instantiate is called exactly twice in an empty directory (verbose)', async () => {
    sinon.stub(fs, 'existsSync').callsFake(() => false);
    const templateInstantiate = sinon.stub(TemplateInstantiator, 'instantiate').callsFake(() => { });

    await command.action(logger, { options: { publisherName: '_ExamplePublisher', publisherPrefix: 'prefix', verbose: true } });
    assert(templateInstantiate.calledTwice);
    assert(templateInstantiate.withArgs(logger, sinon.match.string, sinon.match.string, false, sinon.match.object, true).calledTwice);
  });

  it('TemplateInstantiator.instantiate is called exactly twice in an empty directory, using the standard publisherPrefix \'new\'', async () => {
    sinon.stub(fs, 'existsSync').callsFake(() => false);
    const templateInstantiate = sinon.stub(TemplateInstantiator, 'instantiate').callsFake(() => { });

    await command.action(logger, { options: { publisherName: '_ExamplePublisher', publisherPrefix: 'new' } });
    assert(templateInstantiate.calledTwice);
    assert(templateInstantiate.withArgs(logger, sinon.match.string, sinon.match.string, false, sinon.match.object, false).calledTwice);
  });

  it('TemplateInstantiator.instantiate is called exactly twice when the CDS Assets Directory \'Other\' already exists in the current directory, but doesn\'t contain a Solution.xml file', async () => {
    const originalExistsSync = fs.existsSync;
    sinon.stub(fs, 'existsSync').callsFake((pathToCheck) => {
      if (path.basename(pathToCheck.toString()).toLowerCase() === 'other') {
        return true;
      }
      else if (path.basename(pathToCheck.toString()).toLowerCase() === 'solution.xml') {
        return false;
      }
      else {
        return originalExistsSync(pathToCheck);
      }
    });
    const templateInstantiate = sinon.stub(TemplateInstantiator, 'instantiate').callsFake(() => { });

    await command.action(logger, { options: { publisherName: '_ExamplePublisher', publisherPrefix: 'prefix' } });
    assert(templateInstantiate.calledTwice);
    assert(templateInstantiate.withArgs(logger, sinon.match.string, sinon.match.string, false, sinon.match.object, false).calledTwice);
  });

  it('TemplateInstantiator.instantiate is called exactly once when the CDS Assets Directory \'Other\' already exists in the current directory and contains a Solution.xml file', async () => {
    const originalExistsSync = fs.existsSync;
    sinon.stub(fs, 'existsSync').callsFake((pathToCheck) => {
      if (path.basename(pathToCheck.toString()).toLowerCase() === 'other') {
        return true;
      }
      else if (path.basename(pathToCheck.toString()).toLowerCase() === 'solution.xml') {
        return true;
      }
      else {
        return originalExistsSync(pathToCheck);
      }
    });
    const templateInstantiate = sinon.stub(TemplateInstantiator, 'instantiate').callsFake(() => { });

    await command.action(logger, { options: { publisherName: '_ExamplePublisher', publisherPrefix: 'prefix' } });
    assert(templateInstantiate.calledOnce);
    assert(templateInstantiate.withArgs(logger, sinon.match.string, sinon.match.string, false, sinon.match.object, false).calledOnce);
  });

  it('supports verbose mode', () => {
    const options = command.options;
    let containsOption = false;
    options.forEach((o) => {
      if (o.option === '--verbose') {
        containsOption = true;
      }
    });
    assert(containsOption);
  });
});

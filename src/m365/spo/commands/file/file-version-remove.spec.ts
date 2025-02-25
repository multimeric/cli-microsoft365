import * as assert from 'assert';
import * as sinon from 'sinon';
import { telemetry } from '../../../../telemetry';
import auth from '../../../../Auth';
import { Cli } from '../../../../cli/Cli';
import { CommandInfo } from '../../../../cli/CommandInfo';
import { Logger } from '../../../../cli/Logger';
import Command, { CommandError } from '../../../../Command';
import request from '../../../../request';
import { formatting } from '../../../../utils/formatting';
import { pid } from '../../../../utils/pid';
import { session } from '../../../../utils/session';
import { sinonUtil } from '../../../../utils/sinonUtil';
import commands from '../../commands';
const command: Command = require('./file-version-remove');

describe(commands.FILE_VERSION_REMOVE, () => {
  let log: any[];
  let logger: Logger;
  let loggerLogToStderrSpy: sinon.SinonSpy;
  let commandInfo: CommandInfo;
  let promptOptions: any;
  const validWebUrl = "https://contoso.sharepoint.com";
  const validFileUrl = "/Shared Documents/Document.docx";
  const validFileId = "7a9b8bb6-d5c4-4de9-ab76-5210a7879e89";
  const validLabel = "1.0";

  before(() => {
    sinon.stub(auth, 'restoreAuth').callsFake(() => Promise.resolve());
    sinon.stub(telemetry, 'trackEvent').callsFake(() => { });
    sinon.stub(pid, 'getProcessName').callsFake(() => '');
    sinon.stub(session, 'getId').callsFake(() => '');
    auth.service.connected = true;
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
    loggerLogToStderrSpy = sinon.spy(logger, 'logToStderr');
    sinon.stub(Cli, 'prompt').callsFake(async (options: any) => {
      promptOptions = options;
      return { continue: false };
    });
    promptOptions = undefined;
  });

  afterEach(() => {
    sinonUtil.restore([
      request.delete,
      Cli.prompt
    ]);
  });

  after(() => {
    sinonUtil.restore([
      auth.restoreAuth,
      telemetry.trackEvent,
      pid.getProcessName,
      session.getId
    ]);
    auth.service.connected = false;
  });

  it('has correct name', () => {
    assert.strictEqual(command.name.startsWith(commands.FILE_VERSION_REMOVE), true);
  });

  it('has a description', () => {
    assert.notStrictEqual(command.description, null);
  });

  it('fails validation if fileId is not a valid guid.', async () => {
    const actual = await command.validate({
      options: {
        webUrl: validWebUrl,
        label: validLabel,
        fileId: 'Invalid GUID'
      }
    }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('fails validation if the webUrl option is not a valid SharePoint site URL', async () => {
    const actual = await command.validate({ options: { webUrl: 'foo', label: validLabel, fileUrl: validFileUrl } }, commandInfo);
    assert.notStrictEqual(actual, true);
  });

  it('passes validation if required options specified (fileUrl)', async () => {
    const actual = await command.validate({ options: { webUrl: validWebUrl, label: validLabel, fileUrl: validFileUrl } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('passes validation if required options specified (fileId)', async () => {
    const actual = await command.validate({ options: { webUrl: validWebUrl, label: validLabel, fileId: validFileId } }, commandInfo);
    assert.strictEqual(actual, true);
  });

  it('prompts before removing the specified version when confirm option not passed', async () => {
    await command.action(logger, {
      options: {
        webUrl: validWebUrl,
        label: validLabel,
        fileId: validFileId
      }
    });
    let promptIssued = false;

    if (promptOptions && promptOptions.type === 'confirm') {
      promptIssued = true;
    }

    assert(promptIssued);
  });

  it('aborts removing the specified version when confirm option not passed and prompt not confirmed', async () => {
    const postSpy = sinon.spy(request, 'delete');
    sinonUtil.restore(Cli.prompt);
    sinon.stub(Cli, 'prompt').callsFake(async () => (
      { continue: false }
    ));
    await command.action(logger, {
      options: {
        webUrl: validWebUrl,
        label: validLabel,
        fileId: validFileId
      }
    });
    assert(postSpy.notCalled);
  });

  it('deletes a version from a file with the fileUrl options', async () => {
    sinon.stub(request, 'delete').callsFake(async (opts) => {
      if (opts.url === `${validWebUrl}/_api/web/GetFileByServerRelativeUrl('${formatting.encodeQueryParameter(validFileUrl)}')/versions/DeleteByLabel('${validLabel}')`) {
        return { statusCode: 200 };
      }
      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        debug: true,
        webUrl: validWebUrl,
        label: validLabel,
        fileUrl: validFileUrl,
        confirm: true
      }
    });
    assert(loggerLogToStderrSpy.called);
  });

  it('deletes a version from a file with the fileId options', async () => {
    sinon.stub(request, 'delete').callsFake(async (opts) => {
      if (opts.url === `${validWebUrl}/_api/web/GetFileById('${validFileId}')/versions/DeleteByLabel('${validLabel}')`) {
        return { statusCode: 200 };
      }
      throw 'Invalid request';
    });

    await command.action(logger, {
      options: {
        debug: true,
        webUrl: validWebUrl,
        label: validLabel,
        fileId: validFileId,
        confirm: true
      }
    });
    assert(loggerLogToStderrSpy.called);
  });

  it('deletes a version from a file with the fileUrl options asking to confirm', async () => {
    sinon.stub(request, 'delete').callsFake(async (opts) => {
      if (opts.url === `${validWebUrl}/_api/web/GetFileByServerRelativeUrl('${formatting.encodeQueryParameter(validFileUrl)}')/versions/DeleteByLabel('${validLabel}')`) {
        return { statusCode: 200 };
      }
      throw 'Invalid request';
    });

    sinonUtil.restore(Cli.prompt);
    sinon.stub(Cli, 'prompt').callsFake(async () => (
      { continue: true }
    ));

    await command.action(logger, {
      options: {
        debug: true,
        webUrl: validWebUrl,
        label: validLabel,
        fileUrl: validFileUrl
      }
    });
    assert(loggerLogToStderrSpy.called);
  });

  it('deletes a version from a file with the fileId options asking to confirm', async () => {
    sinon.stub(request, 'delete').callsFake(async (opts) => {
      if (opts.url === `${validWebUrl}/_api/web/GetFileById('${validFileId}')/versions/DeleteByLabel('${validLabel}')`) {
        return { statusCode: 200 };
      }
      throw 'Invalid request';
    });

    sinonUtil.restore(Cli.prompt);
    sinon.stub(Cli, 'prompt').callsFake(async () => (
      { continue: true }
    ));

    await command.action(logger, {
      options: {
        debug: true,
        webUrl: validWebUrl,
        label: validLabel,
        fileId: validFileId
      }
    });
    assert(loggerLogToStderrSpy.called);
  });

  it('command correctly handles version list reject request', async () => {
    const err = 'Invalid version request';
    sinon.stub(request, 'delete').callsFake((opts) => {
      if ((opts.url as string).indexOf('/_api/web/GetFileById') > -1) {
        throw err;
      }

      throw 'Invalid request';
    });

    await assert.rejects(command.action(logger, {
      options: {
        debug: true,
        webUrl: validWebUrl,
        label: validLabel,
        confirm: true
      }
    }), new CommandError(err));
  });
});

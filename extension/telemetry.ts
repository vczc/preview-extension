import Mixpanel from 'mixpanel';
import * as vscode from 'vscode';
import * as os from 'os';
import { uuid } from './uuid';

export class Telemetry {
  client: any;
  amplitude: any;
  userId: string;
  ip: string;
  isTelemetryEnabled: boolean;

  constructor() {
    this.userId = vscode.env.machineId;
    this.isTelemetryEnabled = false;
    this.ip = '';

    this.getSettingFromConfig();
    this.setup();
    vscode.workspace.onDidChangeConfiguration(this.configurationChanged, this);
  }

  async setup() {
    if (!this.isTelemetryEnabled) {
      return;
    }

    if (this.client) {
      return;
    }

    this.client = Mixpanel.init('d0149f7b700b44a18fa53e2cab03b564');

    const extension = vscode.extensions.getExtension('toolchain.tortie-preview');
    const extensionVersion = extension ? extension.packageJSON.version : '<none>';

    // Store
    this.ip = uuid();

    // Mixpanel
    this.client.people.set(this.userId, {
      sessionId: vscode.env.sessionId,
      language: vscode.env.language,
      vscodeVersion: vscode.version,
      platform: os.platform(),
      version: extensionVersion,
      ip: this.ip,
    });
  }

  sendEvent(eventName: string, params?: any) {
    if (!this.isTelemetryEnabled) {
      return;
    }

    const data = {
      ...params,
      distinct_id: this.userId,
      ip: this.ip,
    };

    // Mixpanel
    this.client.track(eventName, data);
  }

  configurationChanged() {
    this.getSettingFromConfig();
  }

  private getSettingFromConfig() {
    const config = vscode.workspace.getConfiguration('telemetry');
    if (config) {
      const enableTelemetry = config.get<boolean>('enableTelemetry');
      this.isTelemetryEnabled = !!enableTelemetry;
    }
    if (this.isTelemetryEnabled) {
      this.setup();
    }
  }
}

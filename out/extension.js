"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// node_modules/sudo-prompt/index.js
var require_sudo_prompt = __commonJS({
  "node_modules/sudo-prompt/index.js"(exports, module2) {
    var Node = {
      child: require("child_process"),
      crypto: require("crypto"),
      fs: require("fs"),
      os: require("os"),
      path: require("path"),
      process,
      util: require("util")
    };
    function Attempt(instance, end) {
      var platform = Node.process.platform;
      if (platform === "darwin")
        return Mac(instance, end);
      if (platform === "linux")
        return Linux(instance, end);
      if (platform === "win32")
        return Windows(instance, end);
      end(new Error("Platform not yet supported."));
    }
    function EscapeDoubleQuotes(string) {
      if (typeof string !== "string")
        throw new Error("Expected a string.");
      return string.replace(/"/g, '\\"');
    }
    function Exec() {
      if (arguments.length < 1 || arguments.length > 3) {
        throw new Error("Wrong number of arguments.");
      }
      var command = arguments[0];
      var options = {};
      var end = function() {
      };
      if (typeof command !== "string") {
        throw new Error("Command should be a string.");
      }
      if (arguments.length === 2) {
        if (Node.util.isObject(arguments[1])) {
          options = arguments[1];
        } else if (Node.util.isFunction(arguments[1])) {
          end = arguments[1];
        } else {
          throw new Error("Expected options or callback.");
        }
      } else if (arguments.length === 3) {
        if (Node.util.isObject(arguments[1])) {
          options = arguments[1];
        } else {
          throw new Error("Expected options to be an object.");
        }
        if (Node.util.isFunction(arguments[2])) {
          end = arguments[2];
        } else {
          throw new Error("Expected callback to be a function.");
        }
      }
      if (/^sudo/i.test(command)) {
        return end(new Error('Command should not be prefixed with "sudo".'));
      }
      if (typeof options.name === "undefined") {
        var title = Node.process.title;
        if (ValidName(title)) {
          options.name = title;
        } else {
          return end(new Error("process.title cannot be used as a valid name."));
        }
      } else if (!ValidName(options.name)) {
        var error = "";
        error += "options.name must be alphanumeric only ";
        error += "(spaces are allowed) and <= 70 characters.";
        return end(new Error(error));
      }
      if (typeof options.icns !== "undefined") {
        if (typeof options.icns !== "string") {
          return end(new Error("options.icns must be a string if provided."));
        } else if (options.icns.trim().length === 0) {
          return end(new Error("options.icns must not be empty if provided."));
        }
      }
      if (typeof options.env !== "undefined") {
        if (typeof options.env !== "object") {
          return end(new Error("options.env must be an object if provided."));
        } else if (Object.keys(options.env).length === 0) {
          return end(new Error("options.env must not be empty if provided."));
        } else {
          for (var key in options.env) {
            var value = options.env[key];
            if (typeof key !== "string" || typeof value !== "string") {
              return end(
                new Error("options.env environment variables must be strings.")
              );
            }
            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
              return end(
                new Error(
                  "options.env has an invalid environment variable name: " + JSON.stringify(key)
                )
              );
            }
            if (/[\r\n]/.test(value)) {
              return end(
                new Error(
                  "options.env has an invalid environment variable value: " + JSON.stringify(value)
                )
              );
            }
          }
        }
      }
      var platform = Node.process.platform;
      if (platform !== "darwin" && platform !== "linux" && platform !== "win32") {
        return end(new Error("Platform not yet supported."));
      }
      var instance = {
        command,
        options,
        uuid: void 0,
        path: void 0
      };
      Attempt(instance, end);
    }
    function Linux(instance, end) {
      LinuxBinary(
        instance,
        function(error, binary) {
          if (error)
            return end(error);
          var command = [];
          command.push('cd "' + EscapeDoubleQuotes(Node.process.cwd()) + '";');
          for (var key in instance.options.env) {
            var value = instance.options.env[key];
            command.push("export " + key + '="' + EscapeDoubleQuotes(value) + '";');
          }
          command.push('"' + EscapeDoubleQuotes(binary) + '"');
          if (/kdesudo/i.test(binary)) {
            command.push(
              "--comment",
              '"' + instance.options.name + ' wants to make changes. Enter your password to allow this."'
            );
            command.push("-d");
            command.push("--");
          } else if (/pkexec/i.test(binary)) {
            command.push("--disable-internal-agent");
          }
          var magic = "SUDOPROMPT\n";
          command.push(
            '/bin/bash -c "echo ' + EscapeDoubleQuotes(magic.trim()) + "; " + EscapeDoubleQuotes(instance.command) + '"'
          );
          command = command.join(" ");
          Node.child.exec(
            command,
            { encoding: "utf-8", maxBuffer: MAX_BUFFER },
            function(error2, stdout, stderr) {
              var elevated = stdout && stdout.slice(0, magic.length) === magic;
              if (elevated)
                stdout = stdout.slice(magic.length);
              if (error2 && !elevated) {
                if (/No authentication agent found/.test(stderr)) {
                  error2.message = NO_POLKIT_AGENT;
                } else {
                  error2.message = PERMISSION_DENIED;
                }
              }
              end(error2, stdout, stderr);
            }
          );
        }
      );
    }
    function LinuxBinary(instance, end) {
      var index = 0;
      var paths = ["/usr/bin/kdesudo", "/usr/bin/pkexec"];
      function test() {
        if (index === paths.length) {
          return end(new Error("Unable to find pkexec or kdesudo."));
        }
        var path9 = paths[index++];
        Node.fs.stat(
          path9,
          function(error) {
            if (error) {
              if (error.code === "ENOTDIR")
                return test();
              if (error.code === "ENOENT")
                return test();
              end(error);
            } else {
              end(void 0, path9);
            }
          }
        );
      }
      test();
    }
    function Mac(instance, callback) {
      var temp = Node.os.tmpdir();
      if (!temp)
        return callback(new Error("os.tmpdir() not defined."));
      var user = Node.process.env.USER;
      if (!user)
        return callback(new Error("env['USER'] not defined."));
      UUID(
        instance,
        function(error, uuid) {
          if (error)
            return callback(error);
          instance.uuid = uuid;
          instance.path = Node.path.join(
            temp,
            instance.uuid,
            instance.options.name + ".app"
          );
          function end(error2, stdout, stderr) {
            Remove(
              Node.path.dirname(instance.path),
              function(errorRemove) {
                if (error2)
                  return callback(error2);
                if (errorRemove)
                  return callback(errorRemove);
                callback(void 0, stdout, stderr);
              }
            );
          }
          MacApplet(
            instance,
            function(error2, stdout, stderr) {
              if (error2)
                return end(error2, stdout, stderr);
              MacIcon(
                instance,
                function(error3) {
                  if (error3)
                    return end(error3);
                  MacPropertyList(
                    instance,
                    function(error4, stdout2, stderr2) {
                      if (error4)
                        return end(error4, stdout2, stderr2);
                      MacCommand(
                        instance,
                        function(error5) {
                          if (error5)
                            return end(error5);
                          MacOpen(
                            instance,
                            function(error6, stdout3, stderr3) {
                              if (error6)
                                return end(error6, stdout3, stderr3);
                              MacResult(instance, end);
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
    function MacApplet(instance, end) {
      var parent = Node.path.dirname(instance.path);
      Node.fs.mkdir(
        parent,
        function(error) {
          if (error)
            return end(error);
          var zip = Node.path.join(parent, "sudo-prompt-applet.zip");
          Node.fs.writeFile(
            zip,
            APPLET,
            "base64",
            function(error2) {
              if (error2)
                return end(error2);
              var command = [];
              command.push("/usr/bin/unzip");
              command.push("-o");
              command.push('"' + EscapeDoubleQuotes(zip) + '"');
              command.push('-d "' + EscapeDoubleQuotes(instance.path) + '"');
              command = command.join(" ");
              Node.child.exec(command, { encoding: "utf-8" }, end);
            }
          );
        }
      );
    }
    function MacCommand(instance, end) {
      var path9 = Node.path.join(
        instance.path,
        "Contents",
        "MacOS",
        "sudo-prompt-command"
      );
      var script = [];
      script.push('cd "' + EscapeDoubleQuotes(Node.process.cwd()) + '"');
      for (var key in instance.options.env) {
        var value = instance.options.env[key];
        script.push("export " + key + '="' + EscapeDoubleQuotes(value) + '"');
      }
      script.push(instance.command);
      script = script.join("\n");
      Node.fs.writeFile(path9, script, "utf-8", end);
    }
    function MacIcon(instance, end) {
      if (!instance.options.icns)
        return end();
      Node.fs.readFile(
        instance.options.icns,
        function(error, buffer) {
          if (error)
            return end(error);
          var icns = Node.path.join(
            instance.path,
            "Contents",
            "Resources",
            "applet.icns"
          );
          Node.fs.writeFile(icns, buffer, end);
        }
      );
    }
    function MacOpen(instance, end) {
      var binary = Node.path.join(instance.path, "Contents", "MacOS", "applet");
      var options = {
        cwd: Node.path.dirname(binary),
        encoding: "utf-8"
      };
      Node.child.exec("./" + Node.path.basename(binary), options, end);
    }
    function MacPropertyList(instance, end) {
      var plist = Node.path.join(instance.path, "Contents", "Info.plist");
      var path9 = EscapeDoubleQuotes(plist);
      var key = EscapeDoubleQuotes("CFBundleName");
      var value = instance.options.name + " Password Prompt";
      if (/'/.test(value)) {
        return end(new Error("Value should not contain single quotes."));
      }
      var command = [];
      command.push("/usr/bin/defaults");
      command.push("write");
      command.push('"' + path9 + '"');
      command.push('"' + key + '"');
      command.push("'" + value + "'");
      command = command.join(" ");
      Node.child.exec(command, { encoding: "utf-8" }, end);
    }
    function MacResult(instance, end) {
      var cwd = Node.path.join(instance.path, "Contents", "MacOS");
      Node.fs.readFile(
        Node.path.join(cwd, "code"),
        "utf-8",
        function(error, code) {
          if (error) {
            if (error.code === "ENOENT")
              return end(new Error(PERMISSION_DENIED));
            end(error);
          } else {
            Node.fs.readFile(
              Node.path.join(cwd, "stdout"),
              "utf-8",
              function(error2, stdout) {
                if (error2)
                  return end(error2);
                Node.fs.readFile(
                  Node.path.join(cwd, "stderr"),
                  "utf-8",
                  function(error3, stderr) {
                    if (error3)
                      return end(error3);
                    code = parseInt(code.trim(), 10);
                    if (code === 0) {
                      end(void 0, stdout, stderr);
                    } else {
                      error3 = new Error(
                        "Command failed: " + instance.command + "\n" + stderr
                      );
                      error3.code = code;
                      end(error3, stdout, stderr);
                    }
                  }
                );
              }
            );
          }
        }
      );
    }
    function Remove(path9, end) {
      if (typeof path9 !== "string" || !path9.trim()) {
        return end(new Error("Argument path not defined."));
      }
      var command = [];
      if (Node.process.platform === "win32") {
        if (/"/.test(path9)) {
          return end(new Error("Argument path cannot contain double-quotes."));
        }
        command.push('rmdir /s /q "' + path9 + '"');
      } else {
        command.push("/bin/rm");
        command.push("-rf");
        command.push('"' + EscapeDoubleQuotes(Node.path.normalize(path9)) + '"');
      }
      command = command.join(" ");
      Node.child.exec(command, { encoding: "utf-8" }, end);
    }
    function UUID(instance, end) {
      Node.crypto.randomBytes(
        256,
        function(error, random) {
          if (error)
            random = Date.now() + "" + Math.random();
          var hash = Node.crypto.createHash("SHA256");
          hash.update("sudo-prompt-3");
          hash.update(instance.options.name);
          hash.update(instance.command);
          hash.update(random);
          var uuid = hash.digest("hex").slice(-32);
          if (!uuid || typeof uuid !== "string" || uuid.length !== 32) {
            return end(new Error("Expected a valid UUID."));
          }
          end(void 0, uuid);
        }
      );
    }
    function ValidName(string) {
      if (!/^[a-z0-9 ]+$/i.test(string))
        return false;
      if (string.trim().length === 0)
        return false;
      if (string.length > 70)
        return false;
      return true;
    }
    function Windows(instance, callback) {
      var temp = Node.os.tmpdir();
      if (!temp)
        return callback(new Error("os.tmpdir() not defined."));
      UUID(
        instance,
        function(error, uuid) {
          if (error)
            return callback(error);
          instance.uuid = uuid;
          instance.path = Node.path.join(temp, instance.uuid);
          if (/"/.test(instance.path)) {
            return callback(
              new Error("instance.path cannot contain double-quotes.")
            );
          }
          instance.pathElevate = Node.path.join(instance.path, "elevate.vbs");
          instance.pathExecute = Node.path.join(instance.path, "execute.bat");
          instance.pathCommand = Node.path.join(instance.path, "command.bat");
          instance.pathStdout = Node.path.join(instance.path, "stdout");
          instance.pathStderr = Node.path.join(instance.path, "stderr");
          instance.pathStatus = Node.path.join(instance.path, "status");
          Node.fs.mkdir(
            instance.path,
            function(error2) {
              if (error2)
                return callback(error2);
              function end(error3, stdout, stderr) {
                Remove(
                  instance.path,
                  function(errorRemove) {
                    if (error3)
                      return callback(error3);
                    if (errorRemove)
                      return callback(errorRemove);
                    callback(void 0, stdout, stderr);
                  }
                );
              }
              WindowsWriteExecuteScript(
                instance,
                function(error3) {
                  if (error3)
                    return end(error3);
                  WindowsWriteCommandScript(
                    instance,
                    function(error4) {
                      if (error4)
                        return end(error4);
                      WindowsElevate(
                        instance,
                        function(error5, stdout, stderr) {
                          if (error5)
                            return end(error5, stdout, stderr);
                          WindowsWaitForStatus(
                            instance,
                            function(error6) {
                              if (error6)
                                return end(error6);
                              WindowsResult(instance, end);
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
    function WindowsElevate(instance, end) {
      var command = [];
      command.push("powershell.exe");
      command.push("Start-Process");
      command.push("-FilePath");
      command.push(`"'` + instance.pathExecute.replace(/'/g, "`'") + `'"`);
      command.push("-WindowStyle hidden");
      command.push("-Verb runAs");
      command = command.join(" ");
      var child = Node.child.exec(
        command,
        { encoding: "utf-8" },
        function(error, stdout, stderr) {
          if (error)
            return end(new Error(PERMISSION_DENIED), stdout, stderr);
          end();
        }
      );
      child.stdin.end();
    }
    function WindowsResult(instance, end) {
      Node.fs.readFile(
        instance.pathStatus,
        "utf-8",
        function(error, code) {
          if (error)
            return end(error);
          Node.fs.readFile(
            instance.pathStdout,
            "utf-8",
            function(error2, stdout) {
              if (error2)
                return end(error2);
              Node.fs.readFile(
                instance.pathStderr,
                "utf-8",
                function(error3, stderr) {
                  if (error3)
                    return end(error3);
                  code = parseInt(code.trim(), 10);
                  if (code === 0) {
                    end(void 0, stdout, stderr);
                  } else {
                    error3 = new Error(
                      "Command failed: " + instance.command + "\r\n" + stderr
                    );
                    error3.code = code;
                    end(error3, stdout, stderr);
                  }
                }
              );
            }
          );
        }
      );
    }
    function WindowsWaitForStatus(instance, end) {
      Node.fs.stat(
        instance.pathStatus,
        function(error, stats) {
          if (error && error.code === "ENOENT" || stats.size < 2) {
            setTimeout(
              function() {
                Node.fs.stat(
                  instance.pathStdout,
                  function(error2) {
                    if (error2)
                      return end(new Error(PERMISSION_DENIED));
                    WindowsWaitForStatus(instance, end);
                  }
                );
              },
              1e3
            );
          } else if (error) {
            end(error);
          } else {
            end();
          }
        }
      );
    }
    function WindowsWriteCommandScript(instance, end) {
      var cwd = Node.process.cwd();
      if (/"/.test(cwd)) {
        return end(new Error("process.cwd() cannot contain double-quotes."));
      }
      var script = [];
      script.push("@echo off");
      script.push("chcp 65001>nul");
      script.push('cd /d "' + cwd + '"');
      for (var key in instance.options.env) {
        var value = instance.options.env[key];
        script.push("set " + key + "=" + value.replace(/([<>\\|&^])/g, "^$1"));
      }
      script.push(instance.command);
      script = script.join("\r\n");
      Node.fs.writeFile(instance.pathCommand, script, "utf-8", end);
    }
    function WindowsWriteExecuteScript(instance, end) {
      var script = [];
      script.push("@echo off");
      script.push(
        'call "' + instance.pathCommand + '" > "' + instance.pathStdout + '" 2> "' + instance.pathStderr + '"'
      );
      script.push('(echo %ERRORLEVEL%) > "' + instance.pathStatus + '"');
      script = script.join("\r\n");
      Node.fs.writeFile(instance.pathExecute, script, "utf-8", end);
    }
    module2.exports.exec = Exec;
    var APPLET = "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";
    var PERMISSION_DENIED = "User did not grant permission.";
    var NO_POLKIT_AGENT = "No polkit authentication agent found.";
    var MAX_BUFFER = 134217728;
  }
});

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.0.3",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          require: "./lib/main.js",
          types: "./lib/main.d.ts",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        "lint-readme": "standard-markdown",
        pretest: "npm run lint && npm run dts-check",
        test: "tap tests/*.js --100 -Rspec",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^17.0.9",
        decache: "^4.6.1",
        dtslint: "^3.7.0",
        sinon: "^12.0.1",
        standard: "^16.0.4",
        "standard-markdown": "^7.1.0",
        "standard-version": "^9.3.2",
        tap: "^15.1.6",
        tar: "^6.1.11",
        typescript: "^4.5.4"
      },
      engines: {
        node: ">=12"
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports, module2) {
    var fs4 = require("fs");
    var path9 = require("path");
    var os = require("os");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _log(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path9.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function config2(options) {
      let dotenvPath = path9.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (options) {
        if (options.path != null) {
          dotenvPath = _resolveHome(options.path);
        }
        if (options.encoding != null) {
          encoding = options.encoding;
        }
      }
      try {
        const parsed = DotenvModule.parse(fs4.readFileSync(dotenvPath, { encoding }));
        Object.keys(parsed).forEach(function(key) {
          if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
            process.env[key] = parsed[key];
          } else {
            if (override === true) {
              process.env[key] = parsed[key];
            }
            if (debug) {
              if (override === true) {
                _log(`"${key}" is already defined in \`process.env\` and WAS overwritten`);
              } else {
                _log(`"${key}" is already defined in \`process.env\` and was NOT overwritten`);
              }
            }
          }
        });
        return { parsed };
      } catch (e) {
        if (debug) {
          _log(`Failed to load ${dotenvPath} ${e.message}`);
        }
        return { error: e };
      }
    }
    var DotenvModule = {
      config: config2,
      parse
    };
    module2.exports.config = DotenvModule.config;
    module2.exports.parse = DotenvModule.parse;
    module2.exports = DotenvModule;
  }
});

// src-extension/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);

// src-extension/registryCommanders.ts
var vscode6 = __toESM(require("vscode"));

// src-extension/zopCompileDebugView.ts
var vscode5 = __toESM(require("vscode"));
var path4 = __toESM(require("path"));

// src-extension/utils/index.ts
var fs = __toESM(require("fs"));
var vscode = __toESM(require("vscode"));
var path = __toESM(require("path"));

// src-extension/constants/config.ts
var SDK_PATH_NAME = "Zoks: Global SDK Path";
var BUILD_PAGE_INITDATA = "buildPageInitData";
var PAGE_DATAS_KEY = "pageDatasKey";

// src-extension/utils/index.ts
var infoMsg = (msg) => {
  vscode.window.showInformationMessage(msg);
};
var warningMsg = (msg) => {
  vscode.window.showWarningMessage(msg);
};
var errorMsg = (msg) => {
  vscode.window.showErrorMessage(msg);
};
var checkSDKPath = () => {
  let config2 = vscode.workspace.getConfiguration().get(SDK_PATH_NAME) || "";
  return config2 && fs.existsSync(path.join(config2, "sdk_build.sh"));
};

// src-extension/webview.ts
var vscode3 = __toESM(require("vscode"));
var path2 = __toESM(require("path"));
var fs2 = __toESM(require("fs"));

// src-extension/handleMessageFromWebview.ts
var vscode2 = __toESM(require("vscode"));
var sudo = __toESM(require_sudo_prompt());

// src-extension/utils/common.ts
var saveState = (context, key, value) => {
  return context.globalState.update(key, JSON.stringify(value));
};
var getState = (context, key) => {
  const _d = context.globalState.get(key);
  return _d ? JSON.parse(_d) : {};
};

// src-extension/handleMessageFromWebview.ts
function receiveMessageFromWebview(pannel, context) {
  pannel.webview.onDidReceiveMessage(function(e) {
    const evName = e.id;
    if (evName === "vscode:message save-buildConfig") {
      let pageDataMap = getState(context, PAGE_DATAS_KEY) || {};
      pageDataMap[e.pageId] = e.data;
      saveState(context, PAGE_DATAS_KEY, pageDataMap);
      infoMsg("\u4FDD\u5B58\u914D\u7F6E\u6210\u529F");
    }
    if (evName === "vscode:sudo") {
      initEnvironment(e, pannel);
    }
    if (evName === "vscode:dialog") {
      vscode2.window.showOpenDialog({
        canSelectFiles: !!e.canSelectFiles,
        canSelectFolders: !e.canSelectFiles,
        canSelectMany: !!e.canSelectMany,
        defaultUri: vscode2.Uri.file(e?.path),
        openLabel: `\u9009\u62E9\u6587\u4EF6${!e.canSelectFiles ? "\u5939" : ""}`
      }).then((res) => {
        if (res) {
          let path9 = res[0].path.toString();
          pannel.webview.postMessage({
            id: "changePath",
            path: process.platform === "win32" ? path9.slice(1, path9.length) : path9
          });
        }
      });
    }
  });
}
async function initEnvironment(event, pannel) {
  try {
    if (!checkSDKPath()) {
      warningMsg("\u8BF7\u5148\u914D\u7F6EGlobal Sdk Path !");
      vscode2.commands.executeCommand("workbench.action.openSettings", SDK_PATH_NAME);
      return;
    }
    const _sdkPath = vscode2.workspace.getConfiguration().get(SDK_PATH_NAME);
    const options = {
      name: "VSCode"
      // icns: '/Applications/Visual Studio Code.app/Contents/Resources/Code.icns', // (optional)
    };
    const startSh = `${_sdkPath}/toolchains/svt/tools/svt-backend/files/scripts/env_init.sh  ${_sdkPath} ${event.version} ${event.ip_address} ${event.mask} ${event.platform_info} $USER`;
    sudo.exec(startSh, options, (error, stdout, stderr) => {
      if (error) {
        console.log("\u542F\u52A8\u521D\u59CB\u5316\u73AF\u5883\u5931\u8D252", error);
        errorMsg(`\u542F\u52A8\u521D\u59CB\u5316\u73AF\u5883\u9519\u8BEF ${error}`);
        pannel.webview.postMessage({
          id: "vscode:sudo:cb",
          data: { message: error.message, stderr, type: "error" },
          sdkPath: _sdkPath
        });
      } else {
        pannel.webview.postMessage({
          id: "vscode:sudo:cb",
          data: {
            message: "success",
            type: "success"
          },
          sdkPath: _sdkPath
        });
      }
    });
  } catch (error) {
    console.log("\u521D\u59CB\u5316\u73AF\u5883\u51FA\u9519!");
  }
}

// src-extension/webview.ts
var webviewMap = {};
var getHtmlContent = (context, panel, router, htmlName) => {
  const htmlPath = path2.resolve(__dirname, `./web-build/${htmlName}`);
  let html = fs2.readFileSync(htmlPath, "utf-8");
  const webviewUri = (localFilePath) => {
    const resourceUri = vscode3.Uri.file(localFilePath);
    return panel.webview.asWebviewUri(resourceUri);
  };
  const resourcePath = path2.join(context.extensionPath, `out/web-build/${htmlName}`);
  const dirPath = path2.dirname(resourcePath);
  html = html.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
    return $1 + webviewUri(path2.join(dirPath, $2)) + '"';
  });
  return html;
};
var openWebview = async (context, id, title = "\u7F51\u9875\u6807\u9898", url = "http://127.0.0.1:5173/build.html", htmlName = "build.html", disposeCb) => {
  const _currentWebview = webviewMap[id];
  if (!_currentWebview) {
    const panel = vscode3.window.createWebviewPanel(
      id,
      // Identifies the type of the webview. Used internally
      title,
      // Title of the panel displayed to the user
      vscode3.ViewColumn.One,
      // Editor column to show the new webview panel in.
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
      // Webview options. More on these later.
    );
    panel.webview.html = getHtmlContent(context, panel, url, htmlName);
    panel.onDidDispose(
      () => {
        webviewMap[id] = null;
        disposeCb && disposeCb();
      },
      void 0,
      context.subscriptions
    );
    receiveMessageFromWebview(panel, context);
    webviewMap[id] = panel;
  } else {
    const panel = webviewMap[id];
    panel?.reveal(vscode3.ViewColumn.One);
  }
  return webviewMap;
};

// src-extension/initProject.ts
var vscode4 = __toESM(require("vscode"));
var fs3 = __toESM(require("fs"));
var path3 = __toESM(require("path"));
var child_process = __toESM(require("child_process"));
var buildPageData = null;
var initSetting = (context) => {
  context = context;
};
var getPlatformsFromSh = async (context) => {
  buildPageData = getState(context, BUILD_PAGE_INITDATA);
  if (!context) {
    context = context;
  }
  let config2 = vscode4.workspace.getConfiguration().get(SDK_PATH_NAME) || "";
  if (config2 === "") {
    warningMsg("\u8BF7\u5148\u914D\u7F6EGlobal Sdk Path !");
    vscode4.commands.executeCommand("workbench.action.openSettings", SDK_PATH_NAME);
    return false;
  } else if (!fs3.existsSync(path3.join(config2, "sdk_build.sh"))) {
    warningMsg("sdk \u8DEF\u5F84\u4E0D\u6B63\u786E!");
    vscode4.commands.executeCommand("workbench.action.openSettings", SDK_PATH_NAME);
    return false;
  } else {
    if (!buildPageData) {
      const platform = process.platform;
      let cmd = "";
      if (platform === "linux") {
        cmd = path3.join(config2, "sdk_build.sh");
      } else if (platform === "win32") {
        cmd = path3.join(config2, "sdk_build.bat");
      }
      cmd += " list-platform --json";
      execShellByChildProcess(cmd, platform, context);
      while (!buildPageData) {
        let fun = () => console.log("time out");
        let sleep2 = (time) => new Promise((resolve3) => {
          setTimeout(resolve3, time);
        });
        await sleep2(500).then(fun);
      }
      return true;
    } else {
      return true;
    }
  }
};
var execShellByChildProcess = (cmd, platform, context) => {
  const replaceMap = {
    "Default version": "Default_version",
    "prebuilt platform": "prebuilt_platform",
    "runtime platform": "runtime_platform"
  };
  if (platform === "linux") {
    child_process.exec(
      cmd,
      (_error, stdout) => {
        let str = stdout.toString();
        let newstr = str.replaceAll("Default version", "Default_version").replaceAll("prebuilt platform", "prebuilt_platform").replaceAll("runtime platform", "runtime_platform");
        buildPageData = JSON.parse(newstr);
        saveState(context, BUILD_PAGE_INITDATA, buildPageData);
      }
    );
  } else if (platform === "win32") {
    child_process.exec(
      cmd,
      (_error, stdout, _stderr) => {
        let str = stdout.toString();
        let newstr = str.replaceAll("Default version", "Default_version").replaceAll("prebuilt platform", "prebuilt_platform").replaceAll("runtime platform", "runtime_platform");
        let i = 0;
        let len = newstr.length;
        for (; i < len; i++) {
          if (newstr[i] === "{") {
            break;
          }
        }
        newstr = newstr.substr(i, len - i);
        buildPageData = JSON.parse(newstr);
        saveState(context, BUILD_PAGE_INITDATA, buildPageData);
      }
    );
  } else if (platform === "darwin") {
    const str = {
      "Default version": "3.0.1.2.0",
      "Detail": {
        "prebuilt": [
          {
            "version": "3.0.1.2.0",
            "prebuilt platform": [
              "orin-aarch64-linux-debug",
              "sa8295_aarch64_qnx-debug",
              "platform-x64-linux-debug",
              "tcam-aarch64-linux-debug",
              "s32g-aarch64-linux-debug"
            ],
            "runtime platform": "platform-x64-linux-debug"
          }
        ]
      }
    };
    const jsonStr = JSON.stringify(str).replace(/Default version|prebuilt platform|runtime platform/g, function(match) {
      return replaceMap[match];
    });
    buildPageData = JSON.parse(jsonStr);
    saveState(context, BUILD_PAGE_INITDATA, buildPageData);
  }
};

// src-extension/zopCompileDebugView.ts
var zopCompileDebugProviderInstance = null;
var ZopCompileDebugTreeDataProvider = class {
  constructor(context) {
    this.context = context;
    __publicField(this, "_onDidChangeTreeData", new vscode5.EventEmitter());
    __publicField(this, "onDidChangeTreeData", this._onDidChangeTreeData.event);
    __publicField(this, "data");
    __publicField(this, "initialData");
    __publicField(this, "contextValue");
    const treeDataJson = this.context.globalState.get("zopCompileDebugDataCache");
    this.context = context;
    this.contextValue = "zopCompileDebug";
    this.initialData = [
      {
        id: `${(/* @__PURE__ */ new Date()).getTime() + 11}`,
        label: "Build Settings",
        contextValue: "Build_setting",
        iconPath: {
          light: path4.join(__dirname, "..", "images/light/light_build.svg"),
          dark: path4.join(__dirname, "..", "images/dark/dark_build.svg")
        },
        children: [],
        collapsibleState: vscode5.TreeItemCollapsibleState.Collapsed
      },
      {
        id: `${(/* @__PURE__ */ new Date()).getTime() + 22}`,
        label: "Docker_Debugging",
        contextValue: "Docker_Debuggingsss",
        iconPath: {
          light: path4.join(__dirname, "..", "images/light/light_docker.svg"),
          dark: path4.join(__dirname, "..", "images/dark/dark_docker.svg")
        },
        children: [],
        collapsibleState: vscode5.TreeItemCollapsibleState.Collapsed
      },
      {
        id: `${(/* @__PURE__ */ new Date()).getTime() + 33}`,
        label: "Gdb_docker_debugging",
        contextValue: "Gdb_docker_debugging",
        iconPath: {
          light: path4.join(__dirname, "..", "images/light/light_gdb.svg"),
          dark: path4.join(__dirname, "..", "images/dark/dark_gdb.svg")
        },
        children: [],
        collapsibleState: vscode5.TreeItemCollapsibleState.Collapsed
      }
      // {
      //     id: `${new Date().getTime()+44}`, label: 'test-清除缓存', contextValue: 'clearCacheTreeData', iconPath: {
      //         light: path.join(__dirname, '..', 'images/service.svg'), 
      //         dark: path.join(__dirname, '..', 'images/service.svg'),
      //     },
      //     children: [], collapsibleState: vscode.TreeItemCollapsibleState.None,
      //     command: {
      //         title: '测试',
      //         command: 'zopPlugin.delCache',
      //         arguments: []
      //     }
      //  },
    ];
    if (treeDataJson) {
      const _cacheData = JSON.parse(treeDataJson);
      this.data = _cacheData;
    } else {
      this.data = this.initialData;
    }
  }
  cacheTreeData() {
    this.context.globalState.update("zopCompileDebugDataCache", JSON.stringify(this.data));
  }
  clearCacheTreeData() {
    this.data = this.initialData;
    this.cacheTreeData();
    this.refresh();
  }
  getTreeItem(element) {
    return element;
  }
  getChildren(element) {
    if (element) {
      return element.children;
    } else {
      return this.data;
    }
  }
  removeSubNode(node) {
    const _parentNode = this.data.find((item) => item.id === node.parentId);
    const _rmIndex = _parentNode?.children?.findIndex((i) => i.id === node.id);
    _parentNode?.children?.splice(_rmIndex, 1);
    this.cacheTreeData();
    this.refresh();
    vscode5.window.showInformationMessage(`\u5220\u9664\u6210\u529F!`);
  }
  renameSubNode(node, value) {
    const _parentNode = this.data.find((item) => item.id === node.parentId);
    if (_parentNode?.children?.some((i) => i.label === value)) {
      warningMsg(`\u4FEE\u6539\u6210\u529F!`);
      return;
    } else {
      node.label = value;
      this.cacheTreeData();
      this.refresh();
      infoMsg(`\u4FEE\u6539\u6210\u529F!`);
    }
  }
  addSubNode(node, value) {
    const _hasSameNode = node.children?.some((i) => i.label === value);
    if (_hasSameNode) {
      warningMsg(`\u5B58\u5728\u540C\u540D\u8282\u70B9!`);
      return;
    }
    const _contextValue = `${node.contextValue}_child`;
    const _id = `${(/* @__PURE__ */ new Date()).getTime()}`;
    const newNode = {
      label: value,
      parentId: node.id,
      id: _id,
      contextValue: _contextValue,
      collapsibleState: vscode5.TreeItemCollapsibleState.None,
      tooltip: value,
      command: {
        title: value,
        command: `${node.contextValue}_click`,
        arguments: [{ parentId: node.id, id: _id, contextValue: _contextValue, label: value }]
      }
    };
    node.children?.push(newNode);
    this.cacheTreeData();
    this.refresh();
    infoMsg(`\u65B0\u589E\u8282\u70B9: ${value} \u6210\u529F!`);
  }
  refresh() {
    this._onDidChangeTreeData.fire();
  }
};
function initCompileDebugView(context) {
  zopCompileDebugProviderInstance = new ZopCompileDebugTreeDataProvider(context);
  context.subscriptions.push(vscode5.window.registerTreeDataProvider("zopCompileDebugView", zopCompileDebugProviderInstance));
  context.subscriptions.push(vscode5.commands.registerCommand("zopPlugin.addNewNode", (node) => {
    vscode5.window.showInputBox({ prompt: "\u8BF7\u8F93\u5165\u540D\u79F0" }).then((value) => {
      if (value) {
        zopCompileDebugProviderInstance.addSubNode(node, value);
      }
    });
  }));
  context.subscriptions.push(vscode5.commands.registerCommand("zopPlugin.renameNode", (node) => {
    vscode5.window.showInputBox({ prompt: "\u8BF7\u8F93\u5165\u65B0\u540D\u79F0" }).then((value) => {
      if (value) {
        zopCompileDebugProviderInstance.renameSubNode(node, value);
      }
    });
  }));
  context.subscriptions.push(vscode5.commands.registerCommand("zopPlugin.removeNode", (node) => {
    zopCompileDebugProviderInstance.removeSubNode(node);
  }));
  context.subscriptions.push(vscode5.commands.registerCommand("zopPlugin.delCache", () => {
    zopCompileDebugProviderInstance.clearCacheTreeData();
    vscode5.window.showInformationMessage(`\u6E05\u7406\u6210\u529F!`);
    context.globalState.update(BUILD_PAGE_INITDATA, "");
    context.globalState.update(PAGE_DATAS_KEY, "");
  }));
  context.subscriptions.push(vscode5.commands.registerCommand("Build_setting_click", async (node) => {
    if (await getPlatformsFromSh(context)) {
      const _buildPageInitData = getState(context, BUILD_PAGE_INITDATA);
      const _pageData = getState(context, PAGE_DATAS_KEY);
      const webviewPanel = openWebview(
        context,
        node.id,
        `${node.label}\u7684\u914D\u7F6E`,
        "http://localhost:5173/build.html/#/build-config",
        "build.html"
      );
      webviewPanel[node.id].webview.postMessage({
        id: "initdata",
        data: _buildPageInitData,
        pageId: node.id
      });
      const nodePageData = _pageData[node.id];
      if (nodePageData) {
        webviewPanel[node.id].webview.postMessage({
          id: "pageData",
          data: nodePageData,
          pageId: node.id
        });
      }
    }
  }));
}

// src-extension/registryCommanders.ts
function registryCommanders_default(context) {
  context.subscriptions.push(vscode6.commands.registerCommand("view.refresh", (node) => {
    switch (node.contextValue) {
      case "Build_setting":
        zopCompileDebugProviderInstance?.refresh();
        break;
      default:
        zopCompileDebugProviderInstance?.refresh();
        break;
    }
    infoMsg(`\u5237\u65B0\u6210\u529F!`);
  }));
}

// src-extension/zopCodeGenerateView.ts
var vscode7 = __toESM(require("vscode"));
var path5 = __toESM(require("path"));
var zopCodeProviderInstance = null;
var ZopCodeGenerateTreeDataProvider = class {
  constructor(context) {
    this.context = context;
    __publicField(this, "_onDidChangeTreeData", new vscode7.EventEmitter());
    __publicField(this, "onDidChangeTreeData", this._onDidChangeTreeData.event);
    __publicField(this, "data");
    this.context = context;
    this.data = [
      {
        id: `${(/* @__PURE__ */ new Date()).getTime() + 1}`,
        label: "\u5DE5\u5177\u94FE",
        contextValue: "Tool_Chain",
        iconPath: {
          light: path5.join(__dirname, "..", "images/light/light_toolchain.svg"),
          dark: path5.join(__dirname, "..", "images/dark/dark_toolchain.svg")
        },
        children: [],
        collapsibleState: vscode7.TreeItemCollapsibleState.None,
        command: {
          title: "\u5DE5\u5177\u94FE",
          command: `toolChain.click`
        }
      }
    ];
  }
  getTreeItem(element) {
    return element;
  }
  getChildren(element) {
    if (element) {
      return element.children;
    } else {
      return this.data;
    }
  }
};
function initZopCodeView(context) {
  zopCodeProviderInstance = new ZopCodeGenerateTreeDataProvider(context);
  context.subscriptions.push(vscode7.window.registerTreeDataProvider("zopCodeGenerate", zopCodeProviderInstance));
  context.subscriptions.push(vscode7.commands.registerCommand("toolChain.click", () => {
    const mathExt = vscode7.extensions.getExtension("toolchain.Tortie-preview");
    const importedApi = mathExt.exports;
    const url = "https://www.baidu.com";
    importedApi.createWebview(url);
  }));
}

// src-extension/zopSettingsView.ts
var vscode8 = __toESM(require("vscode"));
var path6 = __toESM(require("path"));
var zopSettingViewInstance = null;
var ZopSettingViewTreeDataProvider = class {
  constructor(context) {
    this.context = context;
    __publicField(this, "data");
    const treeDataJson = this.context.globalState.get("zopSettingDataCache");
    this.context = context;
    if (treeDataJson) {
      const _cacheData = JSON.parse(treeDataJson);
      this.data = _cacheData;
    } else {
      this.data = [
        {
          id: `${(/* @__PURE__ */ new Date()).getTime() + 1}`,
          label: "\u8BBE\u7F6E",
          contextValue: "Settings",
          iconPath: {
            light: path6.join(__dirname, "..", "images/light/light_setting.svg"),
            dark: path6.join(__dirname, "..", "images/dark/dark_setting.svg")
          },
          children: [],
          collapsibleState: vscode8.TreeItemCollapsibleState.None,
          command: {
            title: "\u8BBE\u7F6E",
            command: "zopPlugin.openSetting",
            arguments: []
          }
        }
      ];
    }
  }
  getTreeItem(element) {
    return element;
  }
  getChildren(element) {
    if (element) {
      return element.children;
    } else {
      return this.data;
    }
  }
};
function initZopSettingView(context) {
  zopSettingViewInstance = new ZopSettingViewTreeDataProvider(context);
  context.subscriptions.push(vscode8.window.registerTreeDataProvider("zopSetting", zopSettingViewInstance));
  context.subscriptions.push(vscode8.commands.registerCommand("zopPlugin.openSetting", (node) => {
    vscode8.commands.executeCommand("workbench.action.openSettings", "Zoks: Global SDK Path");
  }));
}

// src-extension/zopServiceDebugView.ts
var vscode10 = __toESM(require("vscode"));
var path7 = __toESM(require("path"));

// src-extension/serviceBackendServer.ts
var vscode9 = __toESM(require("vscode"));
var child_process2 = __toESM(require("child_process"));
async function startServer() {
  try {
    if (!checkSDKPath()) {
      warningMsg("\u8BF7\u5148\u914D\u7F6EGlobal Sdk Path !");
      vscode9.commands.executeCommand("workbench.action.openSettings", SDK_PATH_NAME);
      return;
    }
    const _sdkPath = vscode9.workspace.getConfiguration().get(SDK_PATH_NAME);
    const cmd = `bash ${_sdkPath}/toolchains/svt/tools/svt-backend/files/scripts/start_svt.sh start ${_sdkPath}`;
    const childProcess = child_process2.spawn(cmd, [], { detached: true, shell: true });
    childProcess.stdout.on("data", (data) => {
      console.log(`\u547D\u4EE4\u8F93\u51FA: ${data}`);
    });
    childProcess.stderr.on("data", (data) => {
      console.error(`\u547D\u4EE4\u9519\u8BEF\u8F93\u51FA: ${data}`);
    });
    childProcess.on("error", (error) => {
      console.error(`\u6267\u884C\u547D\u4EE4\u51FA\u9519: ${error}`);
    });
    childProcess.on("close", (code) => {
      console.log(`\u547D\u4EE4\u9000\u51FA\uFF0C\u9000\u51FA\u7801: ${code}`);
    });
    console.log("\u62C9\u8D77\u670D\u52A1");
  } catch (error) {
    console.log("\u62C9\u8D77\u670D\u52A1\u9A8C\u8BC1\u540E\u7AEF\u670D\u52A1\u5931\u8D25!");
  }
}
async function stopServer() {
  try {
    if (!checkSDKPath()) {
      warningMsg("\u8BF7\u5148\u914D\u7F6EGlobal Sdk Path !");
      vscode9.commands.executeCommand("workbench.action.openSettings", SDK_PATH_NAME);
      return;
    }
    const _sdkPath = vscode9.workspace.getConfiguration().get(SDK_PATH_NAME);
    child_process2.execSync(`${_sdkPath}/toolchains/svt/tools/svt-backend/files/scripts/start_svt.sh stop `).toString();
    console.log("\u505C\u6B62\u670D\u52A1");
  } catch (error) {
    console.log("\u505C\u6B62\u670D\u52A1\u9A8C\u8BC1\u540E\u7AEF\u670D\u52A1\u5931\u8D25!");
  }
}

// src-extension/zopServiceDebugView.ts
var zopServiceDebugInstance = null;
var ZopServiceDebugTreeDataProvider = class {
  constructor(context) {
    this.context = context;
    __publicField(this, "_onDidChangeTreeData", new vscode10.EventEmitter());
    __publicField(this, "onDidChangeTreeData", this._onDidChangeTreeData.event);
    __publicField(this, "data");
    this.context = context;
    const _serviceCheckId = `${(/* @__PURE__ */ new Date()).getTime() + 31}`;
    const _serviceContextValue = `${(/* @__PURE__ */ new Date()).getTime() + 31}`;
    const _serviceLabel = "\u670D\u52A1\u9A8C\u8BC1";
    this.data = [
      {
        id: _serviceCheckId,
        label: _serviceLabel,
        contextValue: _serviceContextValue,
        iconPath: {
          light: path7.join(__dirname, "..", "images/light/light_service.svg"),
          dark: path7.join(__dirname, "..", "images/dark/dark_service.svg")
        },
        children: [],
        collapsibleState: vscode10.TreeItemCollapsibleState.None,
        command: {
          title: "\u670D\u52A1\u9A8C\u8BC1",
          command: `serviceCheck.click`,
          arguments: [{
            id: _serviceCheckId,
            contextValue: _serviceContextValue,
            label: _serviceLabel
          }]
        }
      }
    ];
  }
  getTreeItem(element) {
    return element;
  }
  getChildren(element) {
    if (element) {
      return element.children;
    } else {
      return this.data;
    }
  }
};
function initServiceDebugView(context) {
  zopServiceDebugInstance = new ZopServiceDebugTreeDataProvider(context);
  context.subscriptions.push(vscode10.window.registerTreeDataProvider("zopCheckDebugToolView", zopServiceDebugInstance));
  context.subscriptions.push(vscode10.commands.registerCommand("serviceCheck.click", async (node) => {
    await startServer();
    if (!checkSDKPath()) {
      warningMsg("\u8BF7\u5148\u914D\u7F6EGlobal Sdk Path !");
      vscode10.commands.executeCommand("workbench.action.openSettings", SDK_PATH_NAME);
      return;
    }
    setTimeout(() => {
      console.log("1s\u6253\u5F00webview\u56DE\u8C03");
      openWebview(context, node.id, `\u670D\u52A1\u9A8C\u8BC1`, process.env.SERVICE_WEBVIEW, "service.html", stopServer);
    }, 1e3);
  }));
}

// src-extension/extension.ts
var path8 = __toESM(require("path"));
var dotenv = __toESM(require_main());
function activate(context) {
  console.log("zop-plugin is now active!");
  dotenv.config({ path: path8.resolve(__dirname, "../.env") });
  registryCommanders_default(context);
  initZopCodeView(context);
  initCompileDebugView(context);
  initServiceDebugView(context);
  initZopSettingView(context);
  initSetting(context);
}
function deactivate() {
  console.log("zop-plugin is deactive!");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map

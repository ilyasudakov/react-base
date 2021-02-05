#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const compareVersions = require('compare-versions');
const shell = require('shelljs');

const npmConfig = require('./helpers/get_npm_config.js');

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdout.write('\n');
let interval = -1;

function hasGitRepository() {
  return new Promise((resolve, reject) => {
    exec('git status', (err, stdout) => {
      if (err) {
        reject(new Error(err));
      }

      const regex = new RegExp(/fatal:\s+Not\s+a\s+git\s+repository/, 'i');

      /* eslint-disable-next-line no-unused-expressions */
      regex.test(stdout) ? resolve(false) : resolve(true);
    });
  });
}

async function cleanCurrentRepository() {
  const hasGitRepo = await hasGitRepository().catch((reason) =>
    reportError(reason),
  );

  // We are not under Git version control. So, do nothing
  if (hasGitRepo === false) {
    return false;
  }

  const answer = await askUser(
    '\nDo you want to start with a new repository? [Y/n] ',
  );

  if (answer === true) {
    process.stdout.write('Removing current repository');
    await removeFilesFromDirectory('.git/').catch((reason) =>
      reportError(reason),
    );
    // addCheckMark();
  }

  return answer;
}

function installPackages() {
  return new Promise((resolve, reject) => {
    process.stdout.write(
      '\nInstalling dependencies... (This might take a while)',
    );

    setTimeout(() => {
      readline.cursorTo(process.stdout, 0);
      // interval = animateProgress("Installing dependencies");
    }, 500);

    exec('npm install', (err) => {
      if (err) {
        reject(new Error(err));
      }

      clearInterval(interval);
      //   addCheckMark();
      resolve('Packages installed');
    });
  });
}

function actionInGitRepository(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(stdout);
      }
    });
  });
}

function openVSCode() {
  return new Promise((resolve, reject) => {
    process.stdout.write('\nOpening VSCode');
    exec('code .', (err, stdout) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(stdout);
      }
    });
  });
}

function askUser(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.resume();
    process.stdin.on('data', (pData) => {
      const answer = pData.toString().trim().toLowerCase() || 'y';

      /* eslint-disable-next-line no-unused-expressions */
      answer === 'y' ? resolve(true) : resolve(false);
    });
  });
}

function copyTypeScriptFiles() {
  return new Promise((resolve, reject) => {
    try {
      shell.cp('bin/typescript/package.json', 'package.json');
      shell.cp('bin/typescript/tsconfig.json', 'tsconfig.json');
      shell.cp('bin/typescript/webpack.dev.ts', 'webpack.dev.ts');
      shell.cp('bin/typescript/webpack.prod.ts', 'webpack.prod.ts');
      shell.cp('bin/typescript/.eslintrc.js', '.eslintrc.js');
      shell.cp('bin/typescript/App.tsx', 'src/components/App.tsx');
      shell.cp('bin/typescript/index.tsx', 'src/index.tsx');
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function removeOldWebpackConfigs() {
  return new Promise((resolve, reject) => {
    try {
      shell.rm('-rf', 'webpack.config.js');
      shell.rm('-rf', 'src/components/App.jsx');
      shell.rm('-rf', 'src/index.js');
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

async function makeProjectWithTypeScript() {
  const answer = await askUser(
    '\nAre you gonna be using TypeScript for this project? [Y/n] ',
  );

  if (answer === true) {
    process.stdout.write('Loading TypeScript configs...');
    await copyTypeScriptFiles().catch((reason) => reportError(reason));
    await removeOldWebpackConfigs().catch((reason) => reportError(reason));
  }

  return answer;
}

function removeFilesFromDirectory(directory) {
  return new Promise((resolve, reject) => {
    try {
      shell.rm('-rf', directory);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

const apps = {
  npm: { command: 'npm --version', fullName: 'NPM' },
  node: { command: 'node --version', fullName: 'Node.js' },
};

function checkAppVersion(minimalVersion, app) {
  const curApp = apps[app] ?? apps['node'];
  return new Promise((resolve, reject) => {
    exec(curApp.command, (err, stdout) => {
      const version = stdout.trim();
      if (err) {
        reject(new Error(err));
      } else if (compareVersions(version, minimalVersion) === -1) {
        reject(
          new Error(
            `You need ${curApp.fullName} v${minimalVersion} or above but you have v${version}`,
          ),
        );
      }

      resolve(`${curApp.fullName} version OK`);
    });
  });
}

function endProcess() {
  clearInterval(interval);
  process.stdout.write('\n\nDone!\n');
  process.exit(0);
}

function reportError(error) {
  clearInterval(interval);

  if (error) {
    process.stdout.write('\n\n');
    process.stderr.write(` ${error}\n`);
    // addXMark(() => process.stderr.write(chalk.red(` ${error}\n`)));
    process.exit(1);
  }
}

(async () => {
  const repoRemoved = await cleanCurrentRepository();
  const isTypescriptInstalled = await makeProjectWithTypeScript();

  if (isTypescriptInstalled) {
    process.stdout.write('\n');
    process.stdout.write('TypeScript is installed');
  }

  // Take the required Node and NPM version from package.json
  const {
    engines: { node, npm },
  } = npmConfig;

  const requiredNodeVersion = node.match(/([0-9.]+)/g)[0];
  await checkAppVersion(requiredNodeVersion, 'node').catch((reason) =>
    reportError(reason),
  );

  const requiredNpmVersion = npm.match(/([0-9.]+)/g)[0];
  await checkAppVersion(requiredNpmVersion, 'npm').catch((reason) =>
    reportError(reason),
  );

  await installPackages().catch((reason) => reportError(reason));
  await removeFilesFromDirectory('bin/').catch((reason) => reportError(reason));
  await removeFilesFromDirectory('public/assets/logo.png').catch((reason) => reportError(reason));

  if (repoRemoved) {
    process.stdout.write('\n');
    // interval = animateProgress("Initialising new repository");
    process.stdout.write('Initialising new repository');

    try {
      await actionInGitRepository('git init');
      await actionInGitRepository('git add .');
      await actionInGitRepository('git commit -m "Initial commit"');
    } catch (err) {
      reportError(err);
    }

    // addCheckMark();
    clearInterval(interval);
  }

  openVSCode();
  endProcess();
})();

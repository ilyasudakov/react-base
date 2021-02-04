#!/usr/bin/env node

const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const readline = require("readline");
const compareVersions = require("compare-versions");
const shell = require("shelljs");
// const chalk = require("chalk");

const npmConfig = require("./helpers/get_npm_config.js");

process.stdin.resume();
process.stdin.setEncoding("utf8");

process.stdout.write("\n");
let interval = -1;

function deleteFileInCurrentDir(file) {
  return new Promise((resolve, reject) => {
    fs.unlink(path.join(__dirname, file), (err) => reject(new Error(err)));
    resolve();
  });
}

function hasGitRepository() {
  return new Promise((resolve, reject) => {
    exec("git status", (err, stdout) => {
      if (err) {
        reject(new Error(err));
      }

      const regex = new RegExp(/fatal:\s+Not\s+a\s+git\s+repository/, "i");

      /* eslint-disable-next-line no-unused-expressions */
      regex.test(stdout) ? resolve(false) : resolve(true);
    });
  });
}

function removeGitRepository() {
  return new Promise((resolve, reject) => {
    try {
      shell.rm("-rf", ".git/");
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function askUserIfWeShouldRemoveRepo() {
  return new Promise((resolve) => {
    process.stdout.write(
      "\nDo you want to start with a new repository? [Y/n] "
    );
    process.stdin.resume();
    process.stdin.on("data", (pData) => {
      const answer = pData.toString().trim().toLowerCase() || "y";

      /* eslint-disable-next-line no-unused-expressions */
      answer === "y" ? resolve(true) : resolve(false);
    });
  });
}

async function cleanCurrentRepository() {
  const hasGitRepo = await hasGitRepository().catch((reason) =>
    reportError(reason)
  );

  // We are not under Git version control. So, do nothing
  if (hasGitRepo === false) {
    return false;
  }

  const answer = await askUserIfWeShouldRemoveRepo();

  if (answer === true) {
    process.stdout.write("Removing current repository");
    await removeGitRepository().catch((reason) => reportError(reason));
    // addCheckMark();
  }

  return answer;
}

function installPackages() {
  return new Promise((resolve, reject) => {
    process.stdout.write(
      "\nInstalling dependencies... (This might take a while)"
    );

    setTimeout(() => {
      readline.cursorTo(process.stdout, 0);
      // interval = animateProgress("Installing dependencies");
    }, 500);

    exec("npm install", (err) => {
      if (err) {
        reject(new Error(err));
      }

      clearInterval(interval);
      //   addCheckMark();
      resolve("Packages installed");
    });
  });
}

function initGitRepository() {
  return new Promise((resolve, reject) => {
    exec("git init", (err, stdout) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(stdout);
      }
    });
  });
}

function addToGitRepository() {
  return new Promise((resolve, reject) => {
    exec("git add .", (err, stdout) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(stdout);
      }
    });
  });
}

function commitToGitRepository() {
  return new Promise((resolve, reject) => {
    exec('git commit -m "Initial commit"', (err, stdout) => {
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
    process.stdout.write(
      "\nOpening VSCode"
    );
    exec('code .', (err, stdout) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(stdout);
      }
    });
  });
}


function askUserIfProjectIsUsingTypeScript() {
  return new Promise((resolve) => {
    process.stdout.write(
      "\nAre you gonna be using TypeScript for this project? [Y/n] "
    );
    process.stdin.resume();
    process.stdin.on("data", (pData) => {
      const answer = pData.toString().trim().toLowerCase() || "y";

      /* eslint-disable-next-line no-unused-expressions */
      answer === "y" ? resolve(true) : resolve(false);
    });
  });
}

function addTypeScriptToProject() {
  return new Promise((resolve, reject) => {
    process.stdout.write("Loading TypeScript packages...");
    exec("npm install -D awesome-typescript-loader \
    @types/react @types/react-dom @types/html-webpack-plugin \
    typescript @types/webpack ts-node", (err) => {
      if (err) {
        reject(new Error(err));
      }

      clearInterval(interval);
      resolve("TypeScript packages installed");
    });
  });
}

async function makeProjectWithTypeScript() {
  const answer = await askUserIfProjectIsUsingTypeScript();

  if (answer === true) {
    await addTypeScriptToProject().catch((reason) => reportError(reason));
  }

  return answer;
}

function checkNodeVersion(minimalNodeVersion) {
  return new Promise((resolve, reject) => {
    exec("node --version", (err, stdout) => {
      const nodeVersion = stdout.trim();
      if (err) {
        reject(new Error(err));
      } else if (compareVersions(nodeVersion, minimalNodeVersion) === -1) {
        reject(
          new Error(
            `You need Node.js v${minimalNodeVersion} or above but you have v${nodeVersion}`
          )
        );
      }

      resolve("Node version OK");
    });
  });
}

function checkNpmVersion(minimalNpmVersion) {
  return new Promise((resolve, reject) => {
    exec("npm --version", (err, stdout) => {
      const npmVersion = stdout.trim();
      if (err) {
        reject(new Error(err));
      } else if (compareVersions(npmVersion, minimalNpmVersion) === -1) {
        reject(
          new Error(
            `You need NPM v${minimalNpmVersion} or above but you have v${npmVersion}`
          )
        );
      }

      resolve("NPM version OK");
    });
  });
}

function endProcess() {
  clearInterval(interval);
  process.stdout.write("\n\nDone!\n");
  process.exit(0);
}

function reportError(error) {
  clearInterval(interval);

  if (error) {
    process.stdout.write("\n\n");
    process.stderr.write(` ${error}\n`);
    // addXMark(() => process.stderr.write(chalk.red(` ${error}\n`)));
    process.exit(1);
  }
}

(async () => {
  const repoRemoved = await cleanCurrentRepository();
  // const isTypescriptInstalled = await makeProjectWithTypeScript();

  // Take the required Node and NPM version from package.json
  const {
    engines: { node, npm },
  } = npmConfig;

  const requiredNodeVersion = node.match(/([0-9.]+)/g)[0];
  await checkNodeVersion(requiredNodeVersion).catch((reason) =>
    reportError(reason)
  );

  const requiredNpmVersion = npm.match(/([0-9.]+)/g)[0];
  await checkNpmVersion(requiredNpmVersion).catch((reason) =>
    reportError(reason)
  );

  await installPackages().catch((reason) => reportError(reason));
  await deleteFileInCurrentDir("setup.js").catch((reason) =>
    reportError(reason)
  );
  await deleteFileInCurrentDir("../.github/workflows/setup.yml").catch((reason) =>
    reportError(reason)
  );

  if (repoRemoved) {
    process.stdout.write("\n");
    // interval = animateProgress("Initialising new repository");
    process.stdout.write("Initialising new repository");

    try {
      await initGitRepository();
      await addToGitRepository();
      await commitToGitRepository();
    } catch (err) {
      reportError(err);
    }

    openVSCode();
    // addCheckMark();
    clearInterval(interval);
  }

  endProcess();
})();

import { Low, JSONFile } from "lowdb";
import chalk from "chalk";

const args = process.argv;

const help = function () {
  console.log(`
  todo helps you manage your todo tasks.

  usage:
    todo <command>

    commands can be:

    new:      used to create a new todo
    get:      used to retrieve your todos
    remove: used to mark a todo as complete --all (to remove all) or --<name> to remove an specific one
    help:     used to print the usage guide
  `);
};

function errorLog(error) {
  return console.error(error);
}

if (args.length > 4) {
  errorLog(`only one or two arguments can be accepted`);
  help();
}

switch (args[2]) {
  case "help":
    help();
    break;
  case "new":
    write(args[3]);
    break;
  case "get":
    get();
    break;
  case "remove":
    remove(args[3]);
    break;
  case "complete":
    break;
  default:
    errorLog("invalid command passed");
    help();
}

async function write(arg) {
  const db = new Low(new JSONFile("./todo.json"));
  await db.read();
  db.data = db.data || {
    todo: new Array(),
  };
  db.data.todo.push(arg);
  await db.write();
  console.log(chalk.bgCyan.white("Todo added"));
}

async function remove(arg) {
  const db = new Low(new JSONFile("./todo.json"));
  await db.read();
  db.data = db.data || {
    todo: [],
  };
  if (arg == "all") {
    db.data.todo = new Array();
  } else {
    db.data.todo = db.data.todo.filter((e) => e != arg);
  }
  await db.write();
  console.log(chalk.bgRedBright.black(`${arg} removed`));
}

async function get() {
  const db = new Low(new JSONFile("./todo.json"));
  await db.read();
  console.log(chalk.bgYellow.red(...db.data.todo));
}

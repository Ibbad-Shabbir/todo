#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

interface Task {
  description: string;
  priority: "High" | "Medium" | "Low";
  name: string;
}

class TaskManager {
  private tasks: Task[] = [];

  async addTask() {
    const { name, description, priority } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Name your task",
      },
      {
        type: "input",
        name: "description",
        message: "Enter a new task description:",
      },
      {
        type: "list",
        name: "priority",
        message: "Select task priority:",
        choices: ["High", "Medium", "Low"],
      },
    ]);

    const spinner = ora("Adding task...").start();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    spinner.succeed(chalk.green("Task added successfully!\n"));

    this.tasks.push({ name, description, priority });
  }

  async viewTasks() {
    const spinner = ora("Fetching tasks...").start();
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (this.tasks.length === 0) {
      spinner.warn(chalk.yellow("No tasks found.\n"));
    } else {
      spinner.succeed(chalk.blue("Tasks:\n"));
      this.tasks.forEach((task, index) => {
        const coloredDescription = getColorForPriority(task.priority)(
          task.name
        );
        console.log(`\n${index + 1}. ${coloredDescription} ${chalk.italic(task.description)} (${task.priority})\n`);
      });
    }
  }

  async deleteTask() {
    const { taskIndex } = await inquirer.prompt({
      type: "list",
      name: "taskIndex",
      message: "Select a task to delete:",
      choices: this.tasks.map((task) => task.name),
    });

    const spinner = ora("Deleting task...").start();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    spinner.succeed(chalk.red("Task deleted successfully!\n"));

    this.tasks.splice(taskIndex, 1);
  }
}

function getColorForPriority(priority: "High" | "Medium" | "Low") {
  switch (priority) {
    case "High":
      return chalk.red;
    case "Medium":
      return chalk.yellow;
    case "Low":
      return chalk.green;
    default:
      return chalk.white;
  }
}

async function main() {
  const taskManager = new TaskManager();

  while (true) {
    const { action } = await inquirer.prompt({
      type: "list",
      name: "action",
      message: "Choose an action:",
      choices: ["Add Task", "View Tasks", "Delete Task", "Exit"],
    });

    switch (action) {
      case "Add Task":
        await taskManager.addTask();
        break;
      case "View Tasks":
        await taskManager.viewTasks();
        break;
      case "Delete Task":
        await taskManager.deleteTask();
        break;
      case "Exit":
        console.log(chalk.yellow("Goodbye!"));
        process.exit(0);
    }
  }
}

main();

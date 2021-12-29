import { Command } from 'commander';
import pkg from 'inquirer';
import axios from 'axios';
import ora from 'ora';

import { main } from './chat-ui.js';

const { prompt } = pkg;
const spinner = ora();
const program = new Command();
const baseUrl = "http://localhost:3000";

const menuSchema = [
    { 
        type: "list",
        name: "menu",
        message: "Select An Option",
        choices:["Login", "Sign Up"]
    }
]

const loginSchema = [
    {
        type: "input",
        name: "username",
        message: "Username:"
    },
    {
        type: "password",
        name: "password",
        message: "Password:"
    }
];

const signupSchema = [
    {
        type: "input",
        name: "username",
        message: "Username:"
    },
    {
        type: "password",
        name: "password",
        message: "Password:"
    },
    {
        type: "password",
        name: "confirmPassword",
        message: "Confirm Password:"
    }
];

program
    .command("init")
    .alias("i")
    .description("Initialize The Chat Engine")
    .action(() => {
        prompt(menuSchema)
            .then((answers) => {
                if (answers.menu === "Login") {
                    prompt(loginSchema)
                        .then(async (answers) => {
                            try {
                                spinner.start('Authentication credentials...');
                                const { data } = await axios.post(`${baseUrl}/auth/login`, answers);
                                spinner.succeed(`Login successfully!`);
                            
                                if (data.success === true) {
                                    const user = data.response;

                                    // Client Side UI
                                    spinner.start("Connecting to Chat Engine");
                                    setTimeout(() => {
                                        spinner.succeed("Connecction Established")
                                        main(user);
                                    }, 1500);
                                }

                            } catch (error) {
                                console.log(error.message);
                            }
                        })
                }
                else if (answers.menu === "Sign Up") {
                    prompt(signupSchema)
                        .then(async (answers) => {
                            try {
                                spinner.start('Authentication credentials...');
                                const { data } = await axios.post(`${baseUrl}/auth/signup`, answers);
                                spinner.succeed(`Sign Up successfully!`);
                            
                                if (data.success === true) {
                                    const user = data.response;
                
                                    // Client Side UI
                                    spinner.start("Connecting to Chat Engine");
                                    setTimeout(() => {
                                        spinner.succeed("Connecction Established")
                                        main(user);
                                    }, 1500);
                                }

                            } catch (error) {
                                console.log(error.message);
                            }
                        })
                }
            })
    })

program.parse()
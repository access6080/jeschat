import { Command } from 'commander';
import pkg from 'inquirer';
import axios from 'axios';
import ora from 'ora';

import { writeData, retrieveData } from './utils/persistUser.js';
import { main } from './chat-ui.js';

// const socket = io("http://localhost:3000")
// socket.emit('hello', "I connected");
const baseUrl = "http://localhost:3000";
const { prompt } = pkg;
const program = new Command();
const spinner = ora();
const user = retrieveData();

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
    .action(() => main(1))


program
    .command("login")
    .description("Login into chat service")
    .action(() => {
        // prompt.start()
        prompt(loginSchema)
            .then(async (answers) => {
                try {
                    spinner.start('Authentication credentials...');
                    const { data } = await axios.post(`${baseUrl}/auth/login`, answers);
                    spinner.succeed(`Login successfully!`);
                
                    if (data.success === true) {
                        const user = data.response; 
                        writeData(user._id);
                    }

                    // Client Side UI
                    main(user);

                } catch (error) {
                    console.log(error.message);
                }
            })
    })
    
program
    .command("signup")
    .description("Sign Up for chat service")
    .action(() => {
        // prompt.start()
        prompt(signupSchema)
            .then(async (answers) => {
                try {
                    spinner.start('Authentication credentials...');
                    const { data } = await axios.post(`${baseUrl}/auth/signup`, answers);
                    spinner.succeed(`Sign Up successfully!`);
                
                    if (data.success === true) {
                        const user = data.response; 
                        writeData(user._id);
                    }

                    // Client Side UI
                    main(user);

                } catch (error) {
                    console.log(error.message);
                }
            })
    })
program.parse()
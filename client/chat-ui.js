import { io } from 'socket.io-client';
import blessed from 'neo-blessed';
import ora from 'ora';
import axios from 'axios';
import { retrieveData } from './utils/persistUser.js';

const baseUrl = "http://localhost:3000";
const spinner = ora();
const socket = io(baseUrl);

export const main = async (user) => {
    try {
        if (!user) {
            const id = retrieveData();
            if (id.length <= 0) return console.log(
                `\n
                Not Authenticated!!\n
                Please Run Jeschat login to login\n
                Or Run Jeschat signup to Sign Up.
                `
            );

            const { data } = await axios.post(`${baseUrl}/auth`, id);
            user = data.response;
        }

        const screen = blessed.screen({
            smartCSR: true,
            title: 'Jeschat: A Terminal Chat App',
        });

        const messageList = blessed.list({
            align: 'left',
            mouse: true,
            keys: true,
            width: '100%',
            height: '90%',
            top: 0,
            left: 0,
            scrollbar: {
                ch: ' ',
                inverse: true,
            },
            items: [],
        });

        // Append our box to the screen.
        const input = blessed.textarea({
            bottom: 0,
            height: '10%',
            inputOnFocus: true,
            padding: {
                top: 1,
                left: 2,
            },
            style: {
                fg: '#787878',
                bg: '#454545',

                focus: {
                    fg: '#f6f6f6',
                    bg: '#353535',
                },
            },
        });

        input.key('enter', async function () {
            const message = this.getValue();
            try {
                socket.emit("newMessage", message);
                //TODO: Make A  post request to /send-message endpoint
            } catch (error) {
                console.log(error.message);
                process.exit(1);
            } finally {
                this.clearValue();
                screen.render();
            }
        });

        screen.key(['escape', 'q', 'C-c'], function () {
            return process.exit(0);
        });

        screen.append(messageList);
        screen.append(input);
        input.focus();

        screen.render();

        socket.on('newChat', (data) => {
        messageList.addItem(`${data}`);
        messageList.addItem("");
        messageList.scrollTo(100);
        screen.render();
        });
    } catch (error) {
        spinner.fail();
        console.log(error.message);
        process.exit(1);
    }
}
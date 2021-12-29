import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFile, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataUrl = join(__dirname, '.jes')
const data = readFileSync(dataUrl);

export const writeData = (data) => {
    writeFile(join(__dirname, '.jes'), data, (err) => {
        if (err) throw err;
    });
}

export const retrieveData = () => {
    return data.toString();
}
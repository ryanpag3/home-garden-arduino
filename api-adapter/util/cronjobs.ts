import { CronJob } from 'cron';
import { port } from '..';
import Tasks from '../tasks.json';

const tasks = [];

for (const task of Tasks) {
    tasks.push(new CronJob(task.cron, () => {
        port.write(`${task.taskMessage}\n`, (err) => {
            if (err) {
                console.log(err);
            }
            console.log(`sent ${task.taskMessage} message`);
        });
    }, null, true, 'America/Los_Angeles'));
}
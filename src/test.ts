/**
 * npm run build && node dist/test.js
 */

import {Client} from "./Client";
import {TaskExecutionSummary} from './Model/TaskExecutionSummary';

// client.authenticate('admin@attlaz.com', 'admin2').subscribe((success) => {
//     console.log('Authenticate', success);
//
//     // client.getProjects().subscribe((projects: Project[]) => {
//     //     for (let project of projects) {
//     //         console.log('Project', project);
//     //     }
//     // });

// function test(): Observable<Project[]> {
//     return Observable.create((subscribe: Subscriber<Project[]>) => {
//         subscribe.next([]);
//         subscribe.complete();
//
//     });
//
// }
// function test(): Observable<Project[]> {
//
//     return Observable.create((subscribe: Subscriber<Project[]>) => {
//         subscribe.next([]);
//         subscribe.complete();
//
//     });
//
// }
//
// function test2(i: number) {
//     test().pipe(take(1)).subscribe((result => {
//
//         if (i > 0) {
//             test2(i - 1);
//         }
//     }));
// }

const readableBytes = (bytes: number, si: boolean = true): string => {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
};

let before: number = process.memoryUsage().heapUsed;
// test2(100);

let endpoint: string = 'http://localhost:8080/';
endpoint = 'https://api2.attlaz.com/';

let client: Client = new Client(endpoint, '6as&01LW!iVe!wO7Guv%5#MlfZ2SJgSG', '#zqtn*4IKcx7iNM4bNvc$XU@H27prch8');
client.getHttpClient().enableDebug();
client.authenticate().then((success) => {

    // console.log('Auth: ' + readableBytes(process.memoryUsage().heapUsed) + ']');
    // //test();
    //
    // const logEntry: Log = new Log();
    // logEntry.date = new Date();
    // logEntry.level = LogLevel.Alert;
    // logEntry.message = 'test';
    // logEntry.type = LogType.TaskExecution;
    //
    // const context: any = {};
    // context.taskexecution = 'B6D7DE655';
    // context.worker = 'Yes';
    //
    // logEntry.context = context;
    //
    // // client.getTaskExecutionRequestEndpoint().postTaskExecutionRequest('kUkx32dk9', {}).then(() => {
    // //     console.log('qmsdfkj');
    // // })
    // client.getSystemEndpoint().save(logEntry).then((savedLogEntry: Log) => {
    //     console.log(savedLogEntry);
    // });

    // client.getTriggerEndpoint().getByTask('XG88AUITB').then((triggers: Trigger[]) => {
    //
    //     for (let trigger of triggers) {
    //         console.log(trigger.data);
    //     }
    // })

    client.getTaskExecutionEndpoint().getTaskExecutionSummaries('zwgUjKacG', new Date("2019-01-12T18:29:52.545Z")).then((taskExecutionSummaries: TaskExecutionSummary[]) => {
        console.log(taskExecutionSummaries.length);
    })
    // client.getSubscriberEndpoint().getSubscribersByTask('BEXG88ATH').then((subscribers: Subscriber[]) => {
    //     console.log(subscribers);
    // })

}).catch((error) => {
    console.error('Unable to authenticate: ' + error.message);
});

// function test() {
//     console.log('get data');
//     client.getTeamsEndpoint().getAll().then((data) => {
//         // console.log(data);
//
//         console.log('Data loaded: ' + readableBytes(process.memoryUsage().heapUsed) + ']');
//         test();
//     });
// }
//
// let after: number = process.memoryUsage().heapUsed;
//
// let used = after - before;
//
// console.log('The script uses approximately ' + readableBytes(used) + ' [' + readableBytes(before) + ' ' + readableBytes(after) + ']');

// client.getProjectEndpoint().test().subscribe((projects: Project[]) => {
//
//     console.log('Projects: ' + projects.length);
//     // for (let log of logs) {
//     //     console.log(log.message);
//     // }
// });
// client.setProject('espa');
// client.scheduleTask('syncCatalog', {
//     'externalIds': [
//         15068,
//         601178,
//     ],
// });

//     client.getTaskExecutionEndpoint().getLogs('472EF5058').subscribe((taskExecutionLogs: PagedResult) => {
//         console.log('Logs: ', +taskExecutionLogs);
//     });
// }, (error) => {
//     console.error(error.message);
// });
//

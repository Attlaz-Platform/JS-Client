/**
 * npm run build && node dist/test.js
 */

import {Client} from "./Client";
import {ClientError} from './Model/Error/ClientError';
import {User} from './Model/User';

import {HttpClientRequest} from './Http/HttpClientRequest';
import {HttpClient} from './Http/HttpClient';
import {State} from './Model/State';
import {FlowSummary} from './Model/Flow/FlowSummary';

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
// test();

function test() {
    let endpoint: string = 'http://localhost:5728/';
    // endpoint = 'https://galantis.echron.com/';

    let client: Client = new Client(endpoint, '6as&01LW!iVe!wO7Guv%5#MlfZ2SJgSG', '#zqtn*4IKcx7iNM4bNvc$XU@H27prch8');
    client.getHttpClient().enableDebug();
// client.getUserEndpoint().getUser().then((result: User) => {
//     console.log(result);
// }, (error: ClientError) => {
//     console.error(error);
// });

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
        client.getUserEndpoint().getUser().then((user: User | null) => {
            console.log('User', user);
        });

        const newUser: User = new User();
        newUser.name = 'Test user';
        newUser.email = 'email@domain.com';
        // newUser.password = 'BoyWMpu3N7h47IGt5kKT4FYK';
        newUser.state = State.Active;
        client.getUserEndpoint().create(newUser, 'BoyWMpu3N7h47IGt5kKT4FYK').then((result: User) => {
            console.log('Create user result', result);
        })

        /**
         * We expect an exception!
         */
        client.getFlowEndpoint().getFlowSummary('3B4A1772A', '41').then((flowSummary: FlowSummary | null) => {
            console.log('Flow', flowSummary);
        }).catch((error: Error) => {
            console.error(error);
        })
        // client.getSystemEndpoint().save(logEntry).then((savedLogEntry: Log) => {
        //     console.log(savedLogEntry);
        // });

        // client.getTriggerEndpoint().getByTask('XG88AUITB').then((triggers: Trigger[]) => {
        //
        //     for (let trigger of triggers) {
        //         console.log(trigger.data);
        //     }
        // })

        // client.getTaskExecutionEndpoint().getTaskExecutionSummaries('zwgUjKacG', new Date("2019-01-12T18:29:52.545Z")).then((taskExecutionSummaries: TaskExecutionSummary[]) => {
        //     console.log(taskExecutionSummaries.length);
        // }, (error: ClientError) => {
        //     console.error(error);
        // })
        // client.getSubscriberEndpoint().getSubscribersByTask('BEXG88ATH').then((subscribers: Subscriber[]) => {
        //     console.log(subscribers);
        // })

    }).catch((error: ClientError) => {
        console.error('Unable to authenticate: ');
        console.error(error);
    });
}

async function testHTTPAuth() {
    const requestData: HttpClientRequest = new HttpClientRequest('http://hq.attlaz.com:32769/api/queues');
    requestData.setJsonHeader();
    requestData.setBasicAuth('attlaz', '4$0x51eIaF9w');

    try {
        const res: any = await HttpClient.request2(requestData);
        console.log(res);
    } catch (e) {
        console.error('Error', e);
    }
}

testExpiredToken().then(() => {

})

async function testExpiredToken() {
    try {
        let attlazClient: Client = new Client('https://api2.attlaz.com', 'echron_client_id', 'f5jM!OBzcWzS*EpE');
        await attlazClient.authenticate();
        console.log(await attlazClient.getHttpClient().getToken());

        // client.setToken('c2bb0b9c8e870486a2adae9f350193fc9414318d');
        //
        // console.log(await client.x())
        //
        // const user: User = await client.getUserEndpoint().getUser();
        // console.log(user);
    } catch (e) {
        console.error(e);
    }
}

// testHTTPAuth();
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

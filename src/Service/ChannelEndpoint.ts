import {Endpoint, SubscriberChannel} from "..";

export class ChannelEndpoint extends Endpoint {

    public getByTeam(teamId: string): Promise<SubscriberChannel[]> {
        return new Promise<SubscriberChannel[]>((resolve, reject) => {
            this.httpClient.request('/teams/' + teamId + '/channels').then((rawChannels: any) => {

                let subscriberChannels: SubscriberChannel[] = [];
                for (let rawChannel of rawChannels) {

                    let subscriberChannel: SubscriberChannel = new SubscriberChannel(rawChannel.id, rawChannel.owner, rawChannel.label, rawChannel.type, rawChannel.data);

                    subscriberChannels.push(subscriberChannel);

                }
                resolve(subscriberChannels);

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load channels for team "' + teamId + '": ', reason);
                }

                reject(reason);
            });

        });
    }

    public getByOwner(): Promise<SubscriberChannel[]> {
        return new Promise<SubscriberChannel[]>((resolve, reject) => {
            this.httpClient.request('/channels').then((rawChannels: any) => {

                let subscriberChannels: SubscriberChannel[] = [];
                for (let rawChannel of rawChannels) {

                    let subscriberChannel: SubscriberChannel = new SubscriberChannel(rawChannel.id, rawChannel.owner, rawChannel.label, rawChannel.type, rawChannel.data);

                    subscriberChannels.push(subscriberChannel);

                }
                resolve(subscriberChannels);

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to load channels for current user: ', reason);
                }

                reject(reason);
            });

        });
    }

    public save(subscriberChannel: SubscriberChannel): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let url: string = '/channels/';

            this.httpClient.request(url, subscriberChannel, 'POST').then((result: any) => {

                resolve(result);

            }).catch((reason) => {
                if (this.httpClient.isDebugEnabled()) {
                    console.error('Failed to save channel: ', reason);
                }
                reject(reason);
            });

        });
    }
}
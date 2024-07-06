import {Workspace} from '../Workspace/Workspace.js';
import {Project} from '../Project/Project.js';
import {ProjectEnvironment} from '../Project/ProjectEnvironment.js';
import {Flow} from '../Flow/Flow.js';
import {FlowRun} from '../Flow/FlowRun.js';
import {Channel} from '../Messaging/Channel/Channel.js';
import {Adapter} from '../Adapter/Adapter.js';
import {AdapterConnection} from '../Adapter/AdapterConnection.js';
import {EntityType} from '../EntityType.js';
import {WorkspaceMember} from '../Workspace/WorkspaceMember.js';
import {Trigger} from '../Trigger/Trigger.js';
import {Subscriber} from '../Messaging/Subscriber.js';

export class SearchResult {
    public type: EntityType;
    public label: string;
    public description: string;
    public object: Workspace | WorkspaceMember | Project | ProjectEnvironment | Flow | FlowRun | Trigger | Channel | Subscriber | Adapter | AdapterConnection;

    public static parse(rawResult: any): SearchResult {
        const searchResult: SearchResult = new SearchResult();
        searchResult.type = EntityType.fromString(rawResult.type);
        searchResult.object = rawResult.object;
        searchResult.label = rawResult.label;
        searchResult.description = rawResult.description;

        switch (rawResult.type) {
            case EntityType.Workspace:
                searchResult.object = Workspace.parse(rawResult.object);
                break;
            case EntityType.Project:
                searchResult.object = Project.parse(rawResult.object);
                break;
            case EntityType.ProjectEnvironment:
                searchResult.object = ProjectEnvironment.parse(rawResult.object);
                break;
            case EntityType.Flow:
                searchResult.object = Flow.parse(rawResult.object);
                break;
            case EntityType.FlowRun:
                searchResult.object = FlowRun.parse(rawResult.object);
                break;
            case EntityType.WorkspaceMember:
                searchResult.object = WorkspaceMember.parse(rawResult.object);
                break;
            case EntityType.Adapter:
                searchResult.object = Adapter.parse(rawResult.object);
                break;
            case EntityType.AdapterConnection:
                searchResult.object = AdapterConnection.parse(rawResult.object);
                break;
            case EntityType.Channel:
                searchResult.object = Channel.parse(rawResult.object);
                break;
            case EntityType.ChannelSubscriber:
                searchResult.object = Subscriber.parseRaw(rawResult.object);
                break;
            case EntityType.Trigger:
                searchResult.object = Trigger.parse(rawResult.object);
                break;
            default:
                throw new Error('Unknown search result type "' + rawResult.type + '"');
        }

        return searchResult;
    }
}

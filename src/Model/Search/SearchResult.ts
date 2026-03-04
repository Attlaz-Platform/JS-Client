import {Adapter} from '../Adapter/Adapter.js';
import {AdapterConnection} from '../Adapter/AdapterConnection.js';
import {ApiRecord} from '../ApiRecord.js';
import {CodeSource} from '../Deployment/CodeSource.js';
import {CodeSourceAccount} from '../Deployment/CodeSourceAccount.js';
import {EntityType} from '../EntityType.js';
import {Flow} from '../Flow/Flow.js';
import {FlowRun} from '../Flow/FlowRun.js';
import {Channel} from '../Messaging/Channel/Channel.js';
import {Subscriber} from '../Messaging/Subscriber.js';
import {CodeDeploy} from '../Project/CodeDeploy.js';
import {Project} from '../Project/Project.js';
import {ProjectEnvironment} from '../Project/ProjectEnvironment.js';
import {Trigger} from '../Trigger/Trigger.js';
import {Workspace} from '../Workspace/Workspace.js';
import {WorkspaceMember} from '../Workspace/WorkspaceMember.js';

export class SearchResult {
    public type: EntityType;
    public label: string;
    public description: string;
    public entity: Workspace | WorkspaceMember | Project | ProjectEnvironment | Flow | FlowRun | Trigger | Channel | Subscriber | Adapter | AdapterConnection | CodeSourceAccount | CodeSource | CodeDeploy;
    public score: number;

    public static parse(rawResult: Record<string, unknown>): SearchResult {
        const searchResult: SearchResult = new SearchResult();
        searchResult.type = EntityType.fromString(rawResult.entity_type as string);
        // searchResult.entity = rawResult.entity;
        searchResult.label = rawResult.label as string;
        searchResult.description = rawResult.description as string;
        searchResult.score = rawResult.score as number;

        const rawEntity: ApiRecord = rawResult.entity as ApiRecord;
        switch (searchResult.type) {
            case EntityType.Organisation:
                // TODO: implement
                searchResult.entity = rawEntity as any;
                break;
            case EntityType.Workspace:
                searchResult.entity = Workspace.parse(rawEntity);
                break;
            case EntityType.Project:
                searchResult.entity = Project.parse(rawEntity);
                break;
            case EntityType.ProjectEnvironment:
                searchResult.entity = ProjectEnvironment.parse(rawEntity);
                break;
            case EntityType.Flow:
                searchResult.entity = Flow.parse(rawEntity);
                break;
            case EntityType.FlowRun:
                searchResult.entity = FlowRun.parse(rawEntity);
                break;
            case EntityType.WorkspaceMember:
                searchResult.entity = WorkspaceMember.parse(rawEntity);
                break;

            case EntityType.Adapter:
                searchResult.entity = Adapter.parse(rawEntity);
                break;
            case EntityType.AdapterConnection:
                searchResult.entity = AdapterConnection.parse(rawEntity);
                break;

            case EntityType.Channel:
                searchResult.entity = Channel.parse(rawEntity);
                break;
            case EntityType.ChannelSubscriber:
                searchResult.entity = Subscriber.parseRaw(rawEntity);
                break;
            case EntityType.Trigger:
                searchResult.entity = Trigger.parse(rawEntity);
                break;

            case EntityType.CodeSourceAccount:
                searchResult.entity = CodeSourceAccount.parse(rawEntity);
                break;
            case EntityType.CodeSource:
                searchResult.entity = CodeSource.parse(rawEntity);
                break;
            case EntityType.CodeSourceDeploy:
                searchResult.entity = CodeDeploy.parse(rawEntity);
                break;
            case EntityType.StorageBucket:
                // TODO: implement
                searchResult.entity = rawEntity as any;
                break;
            case EntityType.LogStream:
                // TODO: implement
                searchResult.entity = rawEntity as any;
                break;
            case EntityType.RunnerPool:
                // TODO: implement
                searchResult.entity = rawEntity as any;
                break;
            default:
                throw new Error('Unknown search result type "' + searchResult.type + '"');
        }

        return searchResult;
    }
}

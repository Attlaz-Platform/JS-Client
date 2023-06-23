import {Workspace} from '../Workspace/Workspace.js';
import {Project} from '../Project/Project.js';
import {ProjectEnvironment} from '../Project/ProjectEnvironment.js';
import {Flow} from '../Flow/Flow.js';
import {FlowRun} from '../Flow/FlowRun.js';
import {Channel} from '../Messaging/Channel/Channel.js';
import {Adapter} from '../Adapter/Adapter.js';

export class SearchResult {
    public type: string;
    public label: string;

    public description: string;
    public object: Workspace | Project | ProjectEnvironment | Flow | FlowRun | Channel | Adapter;

    public static parse(rawResult: any): SearchResult {
        const searchResult: SearchResult = new SearchResult();
        searchResult.type = rawResult.type;
        searchResult.object = rawResult.object;
        searchResult.label = 'result';
        searchResult.description = rawResult.description;
        switch (rawResult.type) {
            case 'workspace':
                searchResult.object = Workspace.parse(rawResult.object);

                break;
            case 'project':
                searchResult.object = Project.parse(rawResult.object);
                searchResult.label = searchResult.object.name;
                break;
            case 'projectenvironment':
                searchResult.object = ProjectEnvironment.parse(rawResult.object);
                searchResult.label = searchResult.object.name;
                break;
            case 'flow':
                searchResult.object = Flow.parse(rawResult.object);
                searchResult.label = searchResult.object.name;
                break;
            case 'flowrun':
                searchResult.object = FlowRun.parse(rawResult.object);
                searchResult.label = searchResult.object.id;
                break;
            case 'adapter':
                searchResult.object = Adapter.parse(rawResult.object);
                searchResult.label = searchResult.object.id;
                break;
            default:
                throw new Error('Unknown search result type "' + rawResult.type + '"');

        }

        return searchResult;

    }
}

import {TemplateMessage} from "./TemplateMessage.ts";

export interface Project {
    name: string;
    templates: TemplateMessage[];
}
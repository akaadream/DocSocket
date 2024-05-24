import '@material-design-icons/font';
import 'bulma/css/bulma.css';
import './style.css';
import { EditorView, basicSetup } from 'codemirror';
import { indentWithTab } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import { jsonLanguage } from '@codemirror/lang-json';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { createApp } from "vue";
import { createPinia } from "pinia";
import Application from "./app/Application.vue";

export const editorState = EditorState.create({
    extensions: [
        basicSetup,
        jsonLanguage,
        oneDark,
        keymap.of([indentWithTab])
    ]
});

const pinia = createPinia();
const app = createApp(Application);
app.use(pinia);
app.mount('#app');
export let editContentEditor: EditorView|null = null;

document.addEventListener('DOMContentLoaded', () => {
    recreateEditEditor("");
});

export function recreateEditEditor(content?: string) {
    const editMessageEditorContent = document.getElementById('edit-message-editor-content');
    if (editMessageEditorContent) {
        editContentEditor = new EditorView({
            state: EditorState.create({
                doc: content ?? "",
                extensions: [
                    basicSetup,
                    jsonLanguage,
                    oneDark,
                    keymap.of([indentWithTab])
                ]
            }),
            parent: editMessageEditorContent
        });
    }
}
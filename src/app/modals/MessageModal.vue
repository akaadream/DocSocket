<template>
    <div id="message-modal" class="modal">
        <div class="modal-background"></div>
        <div class="modal-card">
            <button class="delete" aria-label="close"></button>
            <section class="modal-card-body">
                <form action="" id="add-message">
                    <div class="subtitle is-4">Create a new message</div>

                    <div class="field">
                        <label class="label">Name</label>

                        <div class="control">
                            <input id="message-name" type="text" class="input">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Type</label>

                        <div class="select">
                            <select id="message-type">
                                <option value="request">Request</option>
                                <option value="response">Response</option>
                            </select>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Content</label>

                        <div class="control">
                            <div id="message-editor-content" class="cm-editor">
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <button class="button is-link">Add the message</button>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    </div>
</template>
<template>
    <div id="project-modal" class="modal">
        <div class="modal-background"></div>
        <div class="modal-card">
            <button class="delete" aria-label="close"></button>
            <section class="modal-card-body">
                <form id="create-project">
                    <div class="subtitle is-4">Create a new project</div>
                
                    <div class="field">
                        <label class="label">Name</label>

                        <div class="control">
                            <input type="text" class="input" id="project-name">
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <button class="button is-link">Create</button>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    </div>
</template>
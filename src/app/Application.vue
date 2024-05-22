<script setup lang="ts">
    console.log("loaded");
</script>

<template>
    <Menu></Menu>

    <div id="notifications">

    </div>

    <div class="modals">
        <CreateProjectModal></CreateProjectModal>
        <ConnectionModal></ConnectionModal>
        <MessageModal></MessageModal>
        <EditMessageModal></EditMessageModal>
        <ExportModal></ExportModal>
    </div>

    <div class="app-content">
        <div class="columns">
            <div class="column">
                <div class="title">
                    Doc<span class="title-thin">ket</span>
                </div>

                <div id="connection" class="connection-status">
                    <span id="connection-text" class="connection-text">Disconnected</span>
                    <span class="connection-indicator"></span>
                </div>
            </div>
            
            <div class="column is-right">
                <button id="open-message-modal" class="button expand-button modal-opening-button" data-target="project-modal">
                    <span class="icon">
                        <i class="fas fa-plus"></i>
                    </span>

                    <span class="text">
                        New project
                    </span>
                </button>
            </div>
        </div>

        <div class="spaced">
            <button id="open-connection-modal" class="button modal-opening-button" data-target="connection-modal">
                <span class="icon">
                    <i class="fa-solid fa-right-to-bracket"></i>
                </span>
                
                <span class="text">
                    Connect to the server
                </span>
            </button>
            <button id="open-message-modal" class="button modal-opening-button" data-target="message-modal">
                <span class="icon">
                    <i class="fa-solid fa-plus"></i>
                </span>
                
                <span class="text">
                    Add a new message
                </span>
            </button>
        </div>

        <div class="columns">
            <div class="column">
                <div id="template-messages" class="output disconnected">
                </div>

                <button id="export" class="button modal-opening-button" data-target="export-modal">
                    <span class="icon">
                        <i class="fa-solid fa-file-export"></i>
                    </span>
                    
                    <span class="text">
                        Export documentation
                    </span>
                </button>

                <button id="reset" class="button is-danger">
                    <span class="icon">
                        <i class="fa-solid fa-trash"></i>
                    </span>
                    
                    <span class="text">
                        Delete local storage
                    </span>
                </button>
            </div>

            <div class="column">
                <div id="messages" class="output">
                </div>
            </div>
        </div>
    </div>
</template>
<template>
    <div id="connection-modal" class="modal">
        <div class="modal-background"></div>
        <div class="modal-card">
            <button class="delete" aria-label="close"></button>
            <section class="modal-card-body">
                <form id="login">
                    <div class="subtitle is-4">Service connection</div>

                    <div class="field">
                        <label class="label">Server address</label>

                        <div class="control">
                            <input type="text" class="input" id="address" placeholder="ws(s)://">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Service</label>

                        <div class="select">
                            <select id="client">
                                <option value="colyseus">Colyseus</option>
                                <option value="socketio">Socket.io</option>
                                <option value="websocket">Web socket</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="field">
                        <label class="label">Room name</label>

                        <div class="control">
                            <input type="text" id="room-name" class="input">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Username</label>

                        <div class="control">
                            <input type="text" id="username" class="input">
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <button class="button is-link">Connect</button>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    </div>
</template>
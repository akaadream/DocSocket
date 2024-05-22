<script lang="ts">
import {defineComponent} from "vue";
import NavItem from "./NavItem.vue";

export default defineComponent({
    components: {NavItem}
})
</script>

<template>
    <div class="nav">
        <div class="nav-title subtitle is-5">Projects</div>

        <div id="nav" class="nav-links">
            <NavItem project-name="Test project" project-slug="test-project" />
        </div>
    </div>
</template>
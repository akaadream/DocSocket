<script setup lang="ts">
import {Codemirror} from "vue-codemirror";
import {ref} from "vue";
import { json } from '@codemirror/lang-json';
import {oneDark} from "@codemirror/theme-one-dark";
import {basicSetup} from "codemirror";

const props = defineProps(['code']);
const code = ref(props.code);
const extensions = [basicSetup, json(), oneDark];
</script>

<template>
  <codemirror
  v-model="code"
  :indent-with-tab="true"
  :tab-size="2"
  :extensions="extensions"
  />
</template>
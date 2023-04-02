<script lang="ts" context="module">
  import { filesInCurrentFolder, fileUrl, imageStyle } from "./lib/stores.js";
  import { openFile } from "./lib/FileManaging.svelte";
  import { handleKeydown, nextFile } from "./lib/Shortcuts.svelte";
  import { invoke } from "@tauri-apps/api/tauri";

  const args = invoke("get_args");
  console.log(args);
</script>

<main>
  {#if $filesInCurrentFolder.length === 0}
    <button on:click={openFile}>Open File</button>
  {/if}
  {#if $filesInCurrentFolder.length > 0}
    <img src={$fileUrl} alt={$fileUrl} style={$imageStyle} />
  {/if}
</main>

<svelte:window on:keydown={(event) => handleKeydown(event)} on:click={nextFile} />

<style>
  main {
    margin: 0;
    padding: 0;
    height: 98vh;
    width: 98vw;
    display: block;
    background-color: #eeeeee;
    overflow: scroll;
    user-select: none;
    -webkit-user-select: none;
    position: relative;
    overscroll-behavior-y: none;
    overscroll-behavior-x: none;
    cursor: grab;
  }
</style>

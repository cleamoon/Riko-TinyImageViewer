<script lang="ts" context="module">
  import { filesInCurrentFolder, fileUrl, file, imageStyle } from "./lib/stores.js";
  import { openFile, openFileByPath } from "./lib/FileManaging.svelte";
  import { handleKeydown, nextFile } from "./lib/Shortcuts.svelte";
  import { invoke } from "@tauri-apps/api/tauri";

  invoke("get_args").then((args: string[]) => {
    if (args?.length > 1) {
      openFileByPath(args[1]);
    }
  });
</script>

<main>
  {#if $filesInCurrentFolder.length === 0}
    <button on:click={openFile}>Open File</button>
  {/if}
  {#if $filesInCurrentFolder.length > 0}
    <img src={$fileUrl} alt={$fileUrl} style={$imageStyle} />
  {/if}
  {#if $filesInCurrentFolder.length > 0}
    <div class="info">{$file?.path}</div>
  {/if}
</main>

<svelte:window on:keydown={(event) => handleKeydown(event)} on:click={nextFile} />

<style>
  main {
    margin: 0;
    padding: 0;
    height: 99vh;
    width: 99vw;
    align-items: center;
    justify-content: center;
    display: block;
    background-color: #eeeeee;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
    position: relative;
    overscroll-behavior-y: none;
    overscroll-behavior-x: none;
    cursor: grab;
  }

  div.info {
    position: absolute;
    top: auto;
    bottom: 0;
    left: auto;
    right: 0;
    font-size: 2;
    color: rgba(50, 255, 50, 1);
    background-color: rgba(10, 10, 10, 0.2);
  }
</style>

<script lang="ts" context="module">
  import {
    filesInCurrentFolder,
    fileUrl,
    file,
    imageStyle,
    zoomStyle,
    showFilePath,
  } from "./lib/stores.js";
  import { openFile, openFileByPath } from "./lib/FileManaging.svelte";
  import { handleKeydown, nextFile } from "./lib/Shortcuts.svelte";
  import { invoke } from "@tauri-apps/api/tauri";
  import Help from "./Help.svelte";

  invoke("get_full_path").then((path) => {
    console.log(path);
  });
</script>

<main>
  {#if $filesInCurrentFolder.length === 0}
    <div class="start">
      <button on:click={openFile}>Open File</button>
      <Help />
    </div>
  {/if}
  {#if $filesInCurrentFolder.length > 0}
    <div class="image" style={$zoomStyle}>
      <img src={$fileUrl} alt={$fileUrl} style={$imageStyle} />
      {#if $showFilePath}
        <div class="info">{$file?.path}</div>
      {/if}
    </div>
  {/if}
</main>

<svelte:window on:keydown={(event) => handleKeydown(event)} on:click={nextFile} />

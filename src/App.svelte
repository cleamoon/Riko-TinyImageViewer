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
  import Help from "./Help.svelte";
  import { onMount } from "svelte";
  import { promisified } from "@tauri-apps/api/tauri";

  onMount(async () => {
    const args = await promisified({ cmd: "cliArgs" });
    if (args.length > 1) {
      openFileByPath(args[0]);
    }
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

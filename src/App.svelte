<script lang="ts" context="module">
  import { filesInCurrentFolder, fileUrl, file, imageStyle, showFilePath } from "./lib/stores.js";
  import { openFile, openFileByPath } from "./lib/FileManaging.svelte";
  import { handleKeydown, nextFile } from "./lib/Shortcuts.svelte";
  import { invoke } from "@tauri-apps/api/tauri";
  import Help from "./Help.svelte";

  invoke("get_args").then((args: string[]) => {
    if (args?.length > 1) {
      openFileByPath(args[1]);
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
    <img src={$fileUrl} alt={$fileUrl} style={$imageStyle} />
  {/if}
  {#if $showFilePath && $filesInCurrentFolder.length > 0}
    <div class="info">{$file?.path}</div>
  {/if}
</main>

<svelte:window on:keydown={(event) => handleKeydown(event)} on:click={nextFile} />

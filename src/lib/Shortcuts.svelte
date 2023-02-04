<script lang="ts" context="module">
  import { openFile } from "./FileManaging.svelte";
  import { exit } from "@tauri-apps/api/process";
  import { register, registerAll, unregisterAll } from "@tauri-apps/api/globalShortcut";
  import { fileIndex, folderSize, imageStyle, scale, defaultImageStyle } from "./stores.js";
  import { get } from "svelte/store";
  import { changeFolder } from "./FileManaging.svelte";

  const nextFile = () => {
    if (get(fileIndex) + 1 >= get(folderSize)) {
      changeFolder(1);
    } else {
      fileIndex.update((n) => n + 1);
    }
  };

  const previousFile = () => {
    if (get(fileIndex) === 0) {
      changeFolder(-1);
    } else {
      fileIndex.update((n) => n - 1);
    }
  };

  const firstFile = () => {
    fileIndex.set(0);
  };

  const lastFile = () => {
    fileIndex.set(get(folderSize) - 1);
  };

  const zoomIn = () => {
    scale.update((n) => n * 1.1);
    imageStyle.update((style) => style + `transform: scale(${scale});`);
  };

  const zoomOut = () => {
    scale.update((n) => n / 1.1);
    imageStyle.set(defaultImageStyle + `transform: scale(${scale});`);
  };

  export const registerShortcuts = () => {
    register("CommandOrControl+o", openFile);

    register("CommandOrControl+q", () => exit(0));

    register("CommandOrControl+b", () => {
      imageStyle.set(defaultImageStyle);
      scale.set(1.0);
    });

    register("CommandOrControl+w", () => {
      imageStyle.set("width: 100%; height: auto;");
    });

    register("CommandOrControl+h", () => {
      imageStyle.set("width: auto; height: 100%;");
    });

    register("CommandOrControl+=", zoomIn);

    register("CommandOrControl+-", zoomOut);

    registerAll(["Left", "Up", "PageUp"], previousFile);

    registerAll(["Right", "Down", "PageDown", "Space"], nextFile);

    register("Home", firstFile);

    register("End", lastFile);
  };

  export const unregisterShortcuts = () => unregisterAll();
</script>

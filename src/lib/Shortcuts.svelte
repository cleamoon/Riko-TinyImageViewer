<script lang="ts" context="module">
  import { openFile } from "./FileManaging.svelte";
  import { exit } from "@tauri-apps/api/process";
  import { appWindow } from "@tauri-apps/api/window";
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

  const toggleFullScreen = () => {
    appWindow.setFullscreen(!appWindow.isFullscreen());
  };

  export const handleKeydown = (event) => {
    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
        previousFile();
        break;
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
      case " ":
        nextFile();
        break;
      case "Home":
        firstFile();
        break;
      case "End":
        lastFile();
        break;
      case "f":
        toggleFullScreen();
        break;
      case "b":
        if (event.ctrlKey) {
          imageStyle.set(defaultImageStyle);
          scale.set(1.0);
        }
        break;
      case "w":
        if (event.ctrlKey) {
          imageStyle.set("width: 100%; height: auto;");
        }
        break;
      case "h":
        if (event.ctrlKey) {
          imageStyle.set("width: auto; height: 100%;");
        }
        break;
      case "o":
        if (event.ctrlKey) {
          openFile();
        }
        break;
      case "q":
        if (event.ctrlKey) {
          exit(0);
        }
        break;
      case "+":
        if (event.ctrlKey) {
          zoomIn();
        }
        break;
      case "-":
        if (event.ctrlKey) {
          zoomOut();
        }
        break;
      default:
        break;
    }
  };
</script>

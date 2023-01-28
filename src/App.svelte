<script lang="ts">
  import { open, confirm } from "@tauri-apps/api/dialog";
  import { exit } from "@tauri-apps/api/process";
  import { convertFileSrc } from "@tauri-apps/api/tauri";
  import { register, registerAll } from "@tauri-apps/api/globalShortcut";
  import { derived, writable } from "svelte/store";
  import type { Writable } from "svelte/store";
  import { readDir, BaseDirectory } from "@tauri-apps/api/fs";

  const scale = writable(1.0);

  const defaultImageStyle = "width: 100%; height: 100%; object-fit: contain;";

  const imageStyle = writable(defaultImageStyle);

  register("CmdOrControl+o", () => {
    openFile();
  });

  register("CmdOrControl+q", () => {
    exit();
  });

  register("CmdOrControl+b", () => {
    imageStyle.set(defaultImageStyle);
    scale.set(1.0);
  });

  register("CmdOrControl+w", () => {
    imageStyle.set("width: 100%; height: auto;");
  });

  register("CmdOrControl+h", () => {
    imageStyle.set("width: auto; height: 100%;");
  });

  register("CmdOrControl+=", () => {
    scale.update((n) => n * 1.1);
    imageStyle.update((style) => style + `transform: scale(${scale});`);
  });

  register("CmdOrControl+-", () => {
    scale.update((n) => n / 1.1);
    imageStyle.set(defaultImageStyle + `transform: scale(${scale});`);
  });

  registerAll(["left", "up", "PageUp"], () => {
    fileIndex.update((n) => n - 1);
  });

  registerAll(["right", "down", "PageDown"], () => {
    fileIndex.update((n) => n + 1);
  });

  const fileIndex = writable(0);
  const filesInCurrentFolder: Writable<{ name: string; path: string; children: any[] }[]> =
    writable([]);
  const folderSize = derived(
    filesInCurrentFolder,
    ($filesInCurrentFolder) => $filesInCurrentFolder.length
  );
  const filePath = derived(fileIndex, ($fileIndex) => {
    if ($filesInCurrentFolder.length === 0) {
      return "";
    }
    return convertFileSrc($filesInCurrentFolder[$fileIndex].path);
  });

  const openFile = () => {
    open({
      multiple: false,
      filters: [
        {
          name: "Image",
          extensions: ["jpg", "png", "gif"],
        },
      ],
    })
      .then((file) => (Array.isArray(file) ? file[0] : file))
      .then((file) => {
        const folderPath = file.split("/").slice(0, -1).join("/");
        return { file, folderPath };
      })
      .then(({ file, folderPath }) => {
        readDir(folderPath, { dir: BaseDirectory.AppData, recursive: false }).then((entries) => {
          filesInCurrentFolder.set(
            entries
              .map((entry) => {
                return { name: entry.name, path: entry.path, children: entry.children };
              })
              .filter((file) => !file.children && /.(jpg|png|gif|jpeg)$/.test(file.name))
          );
          filesInCurrentFolder.update((files) =>
            files.sort((a, b) => {
              const numberInA = a.name.match(/\d+/g);
              const numberInB = b.name.match(/\d+/g);
              if (numberInA && numberInB) {
                return parseInt(numberInA[0]) - parseInt(numberInB[0]);
              }
              a.name.localeCompare(b.name);
            })
          );

          fileIndex.set($filesInCurrentFolder.findIndex((f) => f.path === file));
        });
      })
      .catch((err) => {
        console.error(err);
        filesInCurrentFolder.set([]);
        fileIndex.set(0);
      });
  };
</script>

<main>
  {#if $filesInCurrentFolder.length === 0}
    <button on:click={openFile}>Open File</button>
  {/if}
  {#if $filesInCurrentFolder.length > 0}
    <img src={$filePath} alt={$filePath} style={$imageStyle} />
  {/if}
</main>

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

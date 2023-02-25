<script lang="ts" context="module">
  import { open } from "@tauri-apps/api/dialog";
  import { get } from "svelte/store";
  import { readDir, BaseDirectory, type FileEntry } from "@tauri-apps/api/fs";
  import { fileIndex, filesInCurrentFolder, parentFolder, folderPath } from "./stores.js";

  const isFileImage = (file) => /.(jpg|png|gif|jpeg)$/.test(file.name);

  const dirList = (entries: FileEntry[], condition: (FileEntry) => boolean) =>
    entries
      .map((entry) => {
        return { name: entry.name, path: entry.path, children: entry.children };
      })
      .filter(condition)
      .sort((a, b) => {
        const numberInA = a.name.match(/\d+/g);
        const numberInB = b.name.match(/\d+/g);
        if (numberInA && numberInB) {
          return parseInt(numberInA[0]) - parseInt(numberInB[0]);
        }
        a.name.localeCompare(b.name);
      });

  export const openFile = () => {
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
          filesInCurrentFolder.set(dirList(entries, (file) => !file.children && isFileImage(file)));
          fileIndex.set(get(filesInCurrentFolder).findIndex((f) => f.path === file));
        });
      })
      .catch((err) => {
        console.error(err);
        filesInCurrentFolder.set([]);
        fileIndex.set(0);
      });
  };

  export const changeFolder = (direction) => {
    readDir(get(parentFolder), { dir: BaseDirectory.AppData, recursive: false }).then((entries) => {
      const folders = dirList(entries, (file) => file.children);
      const currentFolderIndex = folders.findIndex((f) => f.path === get(folderPath));
      const nextFolderIndex = currentFolderIndex + direction;
      if (nextFolderIndex >= 0 && nextFolderIndex < folders.length) {
        const nextFolder = folders[nextFolderIndex];
        readDir(nextFolder.path, { dir: BaseDirectory.AppData, recursive: false }).then(
          (entriesInSubFolder) => {
            filesInCurrentFolder.set(
              dirList(entriesInSubFolder, (file) => !file.children && isFileImage(file))
            );
            fileIndex.set(0);
          }
        );
      }
    });
  };
</script>
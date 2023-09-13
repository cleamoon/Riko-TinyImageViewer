<script lang="ts" context="module">
  import { open, confirm } from "@tauri-apps/api/dialog";
  import { get } from "svelte/store";
  import { readDir, BaseDirectory, removeFile, type FileEntry } from "@tauri-apps/api/fs";
  import { fileIndex, filesInCurrentFolder, parentFolder, folderPath, file } from "./stores.js";
  import { nextFile } from "./Shortcuts.svelte";

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
      .then((file) => ({ file, folderPath: file.split("/").slice(0, -1).join("/") }))
      .then(({ file, folderPath }) => {
        readDir(folderPath, { dir: BaseDirectory.AppData, recursive: false }).then((entries) => {
          filesInCurrentFolder.set(dirList(entries, (file) => !file.children && isFileImage(file)));
          fileIndex.set(get(filesInCurrentFolder).findIndex((f) => f.path === file));
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  export const openFileByPath = (file) => {
    const folderPath = file.split("/").slice(0, -1).join("/");
    readDir(folderPath, { dir: BaseDirectory.AppData, recursive: false }).then((entries) => {
      filesInCurrentFolder.set(dirList(entries, (file) => !file.children && isFileImage(file)));
      fileIndex.set(get(filesInCurrentFolder).findIndex((f) => f.path === file));
    });
  };

  export const changeFolder = (direction) => {
    readDir(get(parentFolder), { dir: BaseDirectory.AppData, recursive: false }).then((entries) => {
      const folders = dirList(entries, (file) => file.children);
      const currentFolderIndex = folders.findIndex((f) => f.path === get(folderPath));
      const nextFolderIndex = currentFolderIndex + direction;

      if (nextFolderIndex < 0) {
        fileIndex.set(0);
        return;
      } else if (nextFolderIndex >= folders.length) {
        fileIndex.set(get(filesInCurrentFolder).length - 1);
        return;
      }

      const nextFolder = folders[nextFolderIndex];
      readDir(nextFolder.path, { dir: BaseDirectory.AppData, recursive: false }).then(
        (entriesInSubFolder) => {
          filesInCurrentFolder.set(
            dirList(entriesInSubFolder, (file) => !file.children && isFileImage(file))
          );
          if (direction > 0) {
            fileIndex.set(0);
          } else {
            fileIndex.set(get(filesInCurrentFolder).length - 1);
          }
        }
      );
    });
  };

  export const deleteFile = () => {
    if (!get(file)) return;

    confirm("Are you sure to delete this file?").then((res) => {
      if (res) {
        removeFile(get(file).path);
        filesInCurrentFolder.update((files) => files.filter((f) => f.path !== get(file).path));
        nextFile();
      }
    });
  };
</script>

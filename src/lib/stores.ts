import { convertFileSrc } from "@tauri-apps/api/tauri";
import { type FileEntry } from "@tauri-apps/api/fs";
import { derived, writable } from "svelte/store";

export const fileIndex = writable(0);
export const filesInCurrentFolder = writable<FileEntry[]>([]);

export const folderSize = derived(
  filesInCurrentFolder,
  ($filesInCurrentFolder) => $filesInCurrentFolder.length
);
export const file = derived([fileIndex, filesInCurrentFolder], ($value) => {
  const [fileIndexValue, filesInCurrentFolder] = $value;
  if (filesInCurrentFolder.length === 0) {
    return "";
  }
  if (fileIndexValue >= filesInCurrentFolder.length) {
    fileIndex.set(0);
  }
  return filesInCurrentFolder[fileIndexValue];
});

export const fileUrl = derived(file, ($file) =>
  convertFileSrc($file?.path)
);


export const parentFolder = derived(file, ($file) =>
  $file?.path?.split("/").slice(0, -2).join("/")
);

export const folderPath = derived(file, ($file) =>
  $file?.path?.split("/").slice(0, -1).join("/")
);

export const scale = writable(1.0);

export const defaultImageStyle = "width: 100%; height: 100%; object-fit: contain;";

export const imageStyle = writable(defaultImageStyle);

export const showFilePath = writable(true);

export const zoomStyle = derived(scale, ($scale) => `width: ${$scale * 100}%; height: ${$scale * 100}%; object-fit: contain; top: 0; left: 0; position: absolute;`);
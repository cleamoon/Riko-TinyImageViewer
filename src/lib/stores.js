import { convertFileSrc } from "@tauri-apps/api/tauri";
import { derived, writable, get } from "svelte/store";

export const fileIndex = writable(0);
export const filesInCurrentFolder = writable([]);

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


export const parentFolder = derived(file, ($file) => {
  console.log($file.path.split("/").slice(0, -2).join("/"));
  return $file.path.split("/").slice(0, -2).join("/");
});

export const folderPath = derived(file, ($file) => {
  return $file.path.split("/").slice(0, -1).join("/");
});

export const scale = writable(1.0);

export const defaultImageStyle = "width: 100%; height: 100%; object-fit: contain;";

export const imageStyle = writable(defaultImageStyle);

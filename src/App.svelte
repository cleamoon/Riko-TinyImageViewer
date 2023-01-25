<script lang="ts">
  import { open } from "@tauri-apps/api/dialog";
  import { convertFileSrc } from "@tauri-apps/api/tauri";
  import { register } from "@tauri-apps/api/globalShortcut";
  import { writable } from "svelte/store";

  const scale = writable(1.0);

  const defaultImageStyle = "width: 100%; height: 100%; object-fit: contain;";

  const imageStyle = writable(defaultImageStyle);

  register("Ctrl+o", () => {
    openFile();
  });

  register("Ctrl+q", () => {
    window.close();
  });

  register("o", () => {
    imageStyle.set("object-fit: scale-down;");
  });

  register("b", () => {
    imageStyle.set(defaultImageStyle);
    scale.set(1.0);
  });

  register("w", () => {
    imageStyle.set("width: 100%; height: auto;");
  });

  register("h", () => {
    imageStyle.set("width: auto; height: 100%;");
  });

  register("=", () => {
    scale.update((n) => n * 1.1);
    imageStyle.update((style) => style + `transform: scale(${scale});`);
  });

  register("-", () => {
    scale.update((n) => n / 1.1);
    imageStyle.set(defaultImageStyle + `transform: scale(${scale});`);
  });

  const assetUrl = writable("");

  const openFile = async () => {
    console.log("Opening file...");
    assetUrl.set(
      await open({
        multiple: false,
        filters: [
          {
            name: "Images",
            extensions: ["jpg", "png", "gif"],
          },
        ],
      })
        .then(convertFileSrc)
        .catch((err) => {
          console.error(err);
          return "";
        })
    );
  };
</script>

<main class="container">
  {#if $assetUrl === ""}
    <button on:click={openFile}>Open File</button>
  {/if}
  {#if $assetUrl !== ""}
    <img src={$assetUrl} alt={$assetUrl} style={$imageStyle} />
  {/if}
</main>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  main {
    margin: 0;
    height: 100vh;
    width: 100vw;
    display: block;
    background-color: #eeeeee;
  }

  .container {
    overflow: scroll;
    user-select: none;
    -webkit-user-select: none;
    position: relative;
    overscroll-behavior-y: none;
    overscroll-behavior-x: none;
    cursor: grab;
  }
</style>

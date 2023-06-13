<main>
  <div class="help">
    <p>Ctrl+o to open a file</p>
    <p>Ctrl+f to toggle fullscreen</p>
    <p>Ctrl+w to fit to width</p>
    <p>Ctrl+h to fit to height</p>
    <p>Ctrl+b to reset zoom</p>
    <p>Ctrl+d to delete file</p>
    <p>Ctrl+q to quit</p>
  </div>
</main>

<style>
  main {
    margin: 0;
    padding: 0;
    height: 99vh;
    width: 99vw;
    align-items: center;
    justify-content: center;
    display: block;
    background-color: #eeeeee;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
    position: relative;
    overscroll-behavior-y: none;
    overscroll-behavior-x: none;
    cursor: grab;
  }

  div.help {
    display: flex;
    flex-direction: column;
    position: absolute;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.5rem;
    color: rgba(0, 0, 0, 0.6);
  }
</style>

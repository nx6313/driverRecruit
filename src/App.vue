<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
  user-select: none;
}

body, html {
  padding: 0;
  margin: 0;
}

div.react-confirm-alert-overlay {
  background: #2c2c2c6c !important;
  div.react-confirm-alert-body {
    width: 70vw !important;
    padding: 10px !important;
    border-radius: 4px !important;
    font-size: 0.6rem;
    h1 {
      font-size: 0.8rem;
    }
  }
}

input {
  outline: none;
  -webkit-appearance: none !important;
  -webkit-tap-highlight-color: transparent;
}
</style>

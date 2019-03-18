<template>
  <div id="app">
    <router-view v-if="isRouterAlive"/>
  </div>
</template>

<script>
export default {
  provide() {
    return {
      reload: this.reload,
      savePageData: this.savePageData,
      getPageData: this.getPageData,
      clearPageData: this.clearPageData
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    savePageData() {
      this.$store.commit('setPageData', {
        data: this.$children[0].$data
      })
    },
    getPageData() {
      return this.$store.state.pageData.data
    },
    clearPageData() {
      this.$store.dispatch('clearPageData')
    }
  }
}
</script>


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
  textarea {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
  }
}

body, html {
  padding: 0;
  margin: 0;
  -webkit-overflow-scrolling: touch;
}

div.react-confirm-alert-overlay {
  background: rgba(61, 61, 61, 0.4) !important;
  div.react-confirm-alert-body {
    width: 80vw !important;
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

::-webkit-scrollbar {
  display: none;
}
::-webkit-scrollbar-thumb {
  border: none;
}

div#__vconsole {
  user-select: none;
  div#__vc_log_default {
    div.vc-log {
      padding-bottom: 0 !important;
    }
  }
}

.wheelpicker {
  .wheelpicker-panel {
    .wheelpicker-actions {
      border-bottom: none;
      button {
        outline: none;
      }
    }
    .wheelpicker-main {
      .wheelpicker-mask-current {
        border-top: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
      }
    }
  }
}
</style>

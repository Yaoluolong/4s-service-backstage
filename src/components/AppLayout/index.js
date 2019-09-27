import AppContainer from './AppContainer'
import AppBlock from './AppBlock'

const AppLayout = {
  install: Vue => {
    Vue.component('AppContainer', AppContainer)
    Vue.component('AppBlock', AppBlock)
  }
}
export default AppLayout

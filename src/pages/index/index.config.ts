export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '金庸人物投票' })
  : { navigationBarTitleText: '金庸人物投票' }

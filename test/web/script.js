const wiki = new window.wiki.SearchClient('http://localhost:7890/v1')

autocomplete({
  minLength: 1,
  input: document.getElementById('country'),
  fetch: async (text, update) => {
    const info = await wiki.suggest('1af5ef342907651bd7ac14f093ac2ec679111df795d87b4993edc07a38167abe', text)
    console.log('info', info)
    const suggestions = info.result.map(item => {
      return {
        label: item.page.relativeUrl,
        value: item.page.relativeUrl,
      }
    })
    text = text.toLowerCase()
    update(suggestions)
  },
  onSelect: item => {
    alert(item.value)
  },
})

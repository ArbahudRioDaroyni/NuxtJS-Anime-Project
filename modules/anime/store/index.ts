export const useAnimeStore = defineStore('anime', {
    state: () => ({
      list: [] as any[],
      selected: null as any
    }),
    actions: {
      async fetchAll() {
        const { data } = await useFetch('/api/anime')
        this.list = data.value || []
      },
      async fetchBySlug(slug: string) {
        const { data } = await useFetch(`/api/anime/${slug}`)
        this.selected = data.value
      }
    }
  })
  
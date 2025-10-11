/**
 * Log any raw data to the console in development mode
 * @param raw - any raw data to log
 */
export const useConsole = (raw: unknown) => {
  if (import.meta.dev) {
    useHead({ 
      script: [
        { innerHTML: `console.log(${JSON.stringify(raw, null, 2)})` }
      ]
    })
  }
}

/**
 * Composable for infinite scroll pagination
 * @param fetchFunction - Function to fetch data that returns ResponseType
 * @param options - Configuration options
 * @returns Object with data, loading state, and trigger ref
 */
export function useInfiniteScroll<T>(
  fetchFunction: (page: number, limit: number) => Promise<{ success: boolean; data?: T[]; meta?: { hasNext?: boolean } }>,
  options: {
    limit?: number
    rootMargin?: string
    enabled?: Ref<boolean>
  } = {}
) {
  const {
    limit = 20,
    rootMargin = '100px',
    enabled = ref(true)
  } = options

  const currentPage = ref(1)
  const allData = ref<T[]>([]) as Ref<T[]>
  const hasMore = ref(true)
  const pending = ref(false)
  const loadMoreTrigger = ref<HTMLElement | null>(null)
  const error = ref<Error | null>(null)

  // Fetch data function
  async function fetchData() {
    if (!hasMore.value || pending.value || !enabled.value) return

    pending.value = true
    error.value = null

    try {
      const response = await fetchFunction(currentPage.value, limit)

      if (response.success && response.data) {
        const newData = response.data as T[]
        allData.value.push(...newData)

        // Check if there are more pages
        hasMore.value = response.meta?.hasNext || false

        if (hasMore.value) {
          currentPage.value++
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Failed to fetch data')
      console.error('Error fetching data:', e)
    } finally {
      pending.value = false
    }
  }

  // Setup intersection observer
  function setupObserver() {
    if (!loadMoreTrigger.value) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting && hasMore.value && !pending.value && enabled.value) {
          fetchData()
        }
      },
      { rootMargin }
    )

    observer.observe(loadMoreTrigger.value)

    // Cleanup
    onUnmounted(() => {
      observer.disconnect()
    })

    return observer
  }

  // Reset function
  function reset() {
    currentPage.value = 1
    allData.value = []
    hasMore.value = true
    pending.value = false
    error.value = null
  }

  // Initial load on mounted
  onMounted(() => {
    fetchData()
    setupObserver()
  })

  return {
    data: allData,
    pending,
    hasMore,
    error,
    loadMoreTrigger,
    fetchData,
    reset,
    currentPage: readonly(currentPage)
  }
}
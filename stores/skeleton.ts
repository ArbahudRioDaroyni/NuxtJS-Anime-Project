export const useSkeletonStore = defineStore('skeleton', () => {
  const isSkeleton = ref(false)
  
  const setSkeletonState = (state: boolean) => {
    isSkeleton.value = state
  }
  
  const enableSkeleton = () => {
    isSkeleton.value = true
  }
  
  const disableSkeleton = () => {
    isSkeleton.value = false
  }
  
  return {
    isSkeleton: isSkeleton,
    setSkeletonState,
    enableSkeleton,
    disableSkeleton
  }
})

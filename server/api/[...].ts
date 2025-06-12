export default defineEventHandler(() => {
  return { 
    message: 'API endpoint is not found',
    status: 404,
    data: null
   }
})
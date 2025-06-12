export default defineEventHandler(async () => {
  const getListData = await $fetch('/api/tag_categories/seed/data',
    {
      method: 'get',
      params: {
        limit: 1000,
        offset: 1,
      }
    }
  );

  const data = getListData.data ?? [];
  const response = await $fetch('/api/tag_categories/store', {
    method: 'post',
    body: data
  });
  return response;
});
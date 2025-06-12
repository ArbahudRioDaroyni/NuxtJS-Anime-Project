export default defineEventHandler(async () => {
  const getListData = await $fetch('/api/character-roles/seed/data',
    {
      method: 'get',
      params: {
        limit: 3,
        offset: 0,
      }
    }
  );

  const data = getListData.data ?? [];
  const response = await $fetch('/api/character-roles/store', {
    method: 'post',
    body: data
  });
  return response;
});
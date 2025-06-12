export default defineEventHandler(async () => {
  const getListData = await $fetch('/api/tags/seed/data',
    {
      method: 'get',
      params: {
        limit: 1000,
        offset: 0,
      }
    }
  );

  type Tags = { pk: number; age?: number | null; is_general_spoiler?: number; };
  const data = ((getListData.data ?? []) as (Tags & { is_general_spoiler?: number })[]).map(({ pk, is_general_spoiler, ...rest }) => ({
    ...rest,
    is_general_spoiler: is_general_spoiler == 0 ? false : true,
  }));
  const response = await $fetch('/api/tags/store', {
    method: 'post',
    body: data
  });
  return response;
});
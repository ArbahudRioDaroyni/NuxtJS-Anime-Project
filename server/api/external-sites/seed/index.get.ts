export default defineEventHandler(async () => {
  const getListData = await $fetch('/api/external-sites/seed/data',
    {
      method: 'get',
      params: {
        limit: 60,
        offset: 0,
      }
    }
  );

  type AnimeTagRelations = {
    pk?: number;
  };

  const data = ((getListData.data ?? []) as (AnimeTagRelations)[])
    .map(({ pk, ...rest }) => ({
      ...rest
    }
  ));
  const response = await $fetch('/api/external-sites/store', {
    method: 'post',
    body: data
  });
  return response;
});
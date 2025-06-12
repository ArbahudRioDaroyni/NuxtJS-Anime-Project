export default defineEventHandler(async () => {
  const getListData = await $fetch('/api/anime-tag-relations/seed/data',
    {
      method: 'get',
      params: {
        limit: 70000,
        offset: 40000,
      }
    }
  );

  type AnimeTagRelations = {
    is_spoiler?: number;
  };

  const data = ((getListData.data ?? []) as (AnimeTagRelations)[])
    .map(({ is_spoiler, ...rest }) => ({
      ...rest,
      is_spoiler: is_spoiler == 0 ? false : true,
    }
  ));
  const response = await $fetch('/api/anime-tag-relations/store', {
    method: 'post',
    body: data
  });
  return response;
});
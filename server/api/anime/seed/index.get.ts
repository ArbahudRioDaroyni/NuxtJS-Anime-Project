export default defineEventHandler(async () => {
  const getListData = await $fetch('/api/anime/seed/data',
    {
      method: 'get',
      params: {
        limit: 5000,
        offset: 15000,
      }
    }
  );

  type Anime = {
    pk: number;
    is_licensed?: number;
    is_adult?: number;
    is_locked?: number;
    media_type_id?: number;
    status_type_id?: number;
  };

  const data = ((getListData.data ?? []) as (Anime)[])
    .map(({ pk, is_licensed, is_adult, is_locked, media_type_id, status_type_id, ...rest }) => ({
      ...rest,
      is_licensed: is_licensed == 0 ? false : true,
      is_adult: is_adult == 0 ? false : true,
      is_locked: is_locked == 0 ? false : true,
      release_media_type_id: media_type_id,
      release_status_type_id: status_type_id
    }
  ));
  const response = await $fetch('/api/anime/store', {
    method: 'post',
    body: data
  });
  return response;
});
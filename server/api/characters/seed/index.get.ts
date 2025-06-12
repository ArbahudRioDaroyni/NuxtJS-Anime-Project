// export default defineEventHandler(async () => {
//     const getListData = await $fetch('/api/characters/seed/data',
//         {
//             method: 'get',
//             params: {
//                 limit: 0,
//                 offset: 0,
//             }
//         }
//     );

//     type Characters = { pk: number; age?: number | null; };
//     const data = ((getListData.data ?? []) as Characters[]).map(({ pk, ...rest }) => ({
//         ...rest,
//         age: rest.age !== undefined && rest.age !== null ? String(rest.age) : null
//     }));
//     const response = await $fetch('/api/characters/store', {
//         method: 'post',
//         body: data
//     });
//     return response;
// });
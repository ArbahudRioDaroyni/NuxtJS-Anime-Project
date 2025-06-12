// export default defineEventHandler(async () => {
//     const getListData = await $fetch('/api/staff/seed/data',
//         {
//             method: 'get',
//             params: {
//                 limit: 0,
//                 offset: 0,
//             }
//         }
//     );

//     type Staff = { pk: number; age?: number | null; };
//     const data = ((getListData.data ?? []) as Staff[]).map(({ pk, ...rest }) => ({
//         ...rest,
//         age: rest.age !== undefined && rest.age !== null ? String(rest.age) : null
//     }));
//     const response = await $fetch('/api/staff/store', {
//         method: 'post',
//         body: data
//     });
//     return response;
// });
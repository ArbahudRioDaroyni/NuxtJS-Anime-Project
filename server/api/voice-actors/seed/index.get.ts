// export default defineEventHandler(async () => {
//     const getListData = await $fetch('/api/voice-actors/seed/data',
//         {
//             method: 'get',
//             params: {
//                 limit: 0,
//                 offset: 0,
//             }
//         }
//     );

//     type VoiceActors = { pk: number; age?: number | null; };
//     const data = ((getListData.data ?? []) as VoiceActors[]).map(({ pk, ...rest }) => ({
//         ...rest,
//         age: rest.age !== undefined && rest.age !== null ? String(rest.age) : null
//     }));
//     const response = await $fetch('/api/voice-actors/store', {
//         method: 'post',
//         body: data
//     });
//     return response;
// });
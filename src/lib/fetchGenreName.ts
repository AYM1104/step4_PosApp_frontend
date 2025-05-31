// const RAKUTEN_APP_ID = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID!;

// type GenreNode = {
//   genreId: number | string;
//   genreName: string;
// };

// type ParentWrapper = {
//   parent: GenreNode;
// };

// export const fetchGenreHierarchy = async (
//   genreId: string
// ): Promise<string[] | null> => {
//   const baseUrl = "https://app.rakuten.co.jp/services/api/IchibaGenre/Search/20140222";
//   const params = new URLSearchParams({
//     applicationId: RAKUTEN_APP_ID,
//     genreId,
//     format: "json",
//   });

//   const url = `${baseUrl}?${params.toString()}`;
//   try {
//     const res = await fetch(url);
//     if (!res.ok) throw new Error(`ジャンル検索API失敗: ${res.status}`);

//     const data = await res.json();
//     console.log("[📦 ジャンル階層データ]", data);

//     // 💡 current（現在のジャンル）確認
//     console.log("[🔍 currentジャンル]", data.genre?.current?.genreName);

//     const parentsRaw = data.genre?.parents as ParentWrapper[] ?? [];
//     const parents: GenreNode[] = parentsRaw.map((item) => item.parent);

//     const current: GenreNode | null = data.genre?.current ?? null;

//     const path = [...parents, ...(current ? [current] : [])]
//       .map((g) => g.genreName)
//       .filter(Boolean);

//     return path.length ? path : null;
//   } catch (error) {
//     console.error("[ジャンル階層取得エラー]", error);
//     return null;
//   }
// };
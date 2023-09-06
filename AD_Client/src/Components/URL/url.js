const API_KEY="0d6641974617e4f7207777904c4d3340";
const URLS={
    fetchTrending: `/trending/all/day?api_key=${API_KEY}`,
    fetchTvShows: `/movie/top_rated?api_key=${API_KEY}`,
    fetchLatest: `/movie/upcoming?api_key=${API_KEY}`,
};
export default URLS;
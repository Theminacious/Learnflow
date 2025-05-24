import axios from 'axios';
export const getUnsplashImages = async (query: string) => {
    const {data}= await axios.get(`https://api.unsplash.com/search/photos?per_page=1&query=${query}&client_id=${process.env.UNSPLASH_API_KEY}`);

    // const imageResponse = await imageResponseRow.json();

    return data.results[0].urls.small_s3;
}
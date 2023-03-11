import axios from 'axios';
export const fetchImages = async(querySearch, page, perPage) =>{
    const BASE_URL = 'https://pixabay.com/api/';
    const params = new URLSearchParams({
      key: '34194604-3f4a6dc1a70b7e3fec66b84c8',
      q: querySearch,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page : page,
      per_page: perPage,
    });
    const response = await axios.get(`${BASE_URL}?${params.toString()}`);
    return response;
    


}


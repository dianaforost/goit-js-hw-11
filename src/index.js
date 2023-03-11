import axios from 'axios';
import Notiflix from 'notiflix';
import { fetchImages } from './js/fetchImages';
import { createGalleryImg } from './js/createGalleryImg';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector(".load-more");
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});


searchForm.addEventListener('submit', onSubmitForm);
loadMoreBtn.addEventListener('click', loadMore);
let page = 1;
let querySearch;
const perPage = 40;

function onSubmitForm(e) {
  e.preventDefault();

  querySearch = e.currentTarget.searchQuery.value.trim();
  console.log(querySearch);
  gallery.innerHTML='';
  page = 1;
  loadMoreBtn.classList.add("hidden")
  render()
  
  
  async function render(){
    try{
      const {data : response} = await fetchImages(querySearch, page, perPage);
      if (querySearch === '') {
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
  if (response.totalHits === 0) {
            return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );}
        else{
          createGalleryImg(response.hits);
                Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
                lightbox.refresh();
                if(response.totalHits > perPage){
                  loadMoreBtn.classList.remove("hidden");
                }
              }
}
catch(error){
  console.log(error);
}
  }

}

async function loadMore(){
  page +=1; 
  try {
    const {data:response} = await fetchImages(querySearch, page, perPage);
    createGalleryImg(response.hits);
    lightbox.refresh();
    const totalPages = Math.ceil(response.totalHits / perPage)
    if(page === totalPages){
          loadMoreBtn.classList.add("hidden");
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
    }
  }
  catch(error){
    console.log(error);
  }
};
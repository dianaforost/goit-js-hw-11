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
  loadMoreBtn.classList.add("hidden")
  
  
  if (querySearch === '') {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  fetchImages(querySearch, page, perPage)
  .then(({ data }) => {
    console.log(data.hits);
    if (data.totalHits === 0) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else{
      createGalleryImg(data.hits);
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      lightbox.refresh();
      if(data.totalHits > perPage){
        loadMoreBtn.classList.remove("hidden");
      }
    }
  })
  .catch(() =>{ return Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
});
}
function loadMore(){
  page +=1; 
  fetchImages(querySearch, page, perPage)
  .then(({data}) =>{
    createGalleryImg(data.hits);
    lightbox.refresh();
    const totalPages = Math.ceil(data.totalHits / perPage)
    if(page > totalPages){
      loadMoreBtn.classList.add("hidden");
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
    }
  })
  .catch(error => console.log(error));
};
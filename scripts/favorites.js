const objectIdURL = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';

const refCount = document.getElementById('reference-count');
const artTitle = document.getElementById('title');
const artDisplayName = document.getElementById('artist-display-name');
const artObjectDate = document.getElementById('object-date');
const artMedium = document.getElementById('medium');
const artDisplayImage = document.getElementById('display-image');
const searchForward = document.getElementById('search-forward');
const searchBack = document.getElementById('search-back');
const removeFavorite = document.getElementById('remove-favorites');

let storedFavorites = JSON.parse(localStorage.getItem('storedfavorites'));

document.addEventListener('DOMContentLoaded', () => {
  let artIdCount = 0;
  let storedFavoritesLength = storedFavorites.length;

  displayArtist(storedFavorites, artIdCount);

  searchForward.addEventListener('click', (event) => {
    event.preventDefault();
    if (storedFavorites && artIdCount < storedFavoritesLength - 1) {
      artIdCount++;
      displayArtist(storedFavorites, artIdCount);
    }
  })

  searchBack.addEventListener('click', (event) => {
    event.preventDefault();
    if (storedFavorites && artIdCount > 0) {
      artIdCount--;
      displayArtist(storedFavorites, artIdCount);
    } else if (storedFavorites && artIdCount == 0) {
      displayArtist(storedFavorites, artIdCount);
    }
  })

  removeFavorite.addEventListener('click', (event) => {
    event.preventDefault();
    storedFavorites.splice(artIdCount, 1);
    artIdCount--;
    displayArtist(storedFavorites, artIdCount);
    localStorage.setItem('storedfavorites', JSON.stringify(storedFavorites));
    alert('Your art piece has been removed from your favorites!');
  })

})

async function displayArtist(idArray, idCount) {
  const artistId = idArray[idCount];
  const currentArtObject = artObjectFetch(artistId);
  artDisplayImage.src = "/images/Spin@1x-1.9s-200px-200px.svg";
  currentArtObject.then((currentArtObject) => {
      let imageURL = currentArtObject.primaryImage
      artDisplayImage.src = imageURL;
      refCount.innerHTML = `${idCount + 1} of ${idArray.length}`;
      artTitle.innerHTML = `Title: ${currentArtObject.title}`;
      artDisplayName.innerHTML = `Artist Display Name: ${currentArtObject.artistDisplayName}`;
      artObjectDate.innerHTML = `Object Date: ${currentArtObject.objectDate}`;
      artMedium.innerHTML = `Medium: ${currentArtObject.medium}`;
   });
}

async function artObjectFetch(objectId) {
  const rawResponse = await fetch(objectIdURL + objectId);
  if (!rawResponse.ok) {
    throw new Error(`No matching data can be found for "${objectId}"`);
  }
  return await rawResponse.json();
}
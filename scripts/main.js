
const searchBaseURL = 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&isPublicDomain=true&q=';
const objectIdURL = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';

const refCount = document.getElementById('reference-count');
const artTitle = document.getElementById('title');
const artDisplayName = document.getElementById('artist-display-name');
const artObjectDate = document.getElementById('object-date');
const artMedium = document.getElementById('medium');
const artDisplayImage = document.getElementById('display-image');
const searchButton = document.getElementById('search');
const searchForward = document.getElementById('search-forward');
const searchBack = document.getElementById('search-back');
const addFavorite = document.getElementById('add-to-favorites');
const artStyle = document.getElementById('art-style-select');

let favorites = JSON.parse(localStorage.getItem('storedfavorites'));

document.addEventListener('DOMContentLoaded', () => {

  let artIdCount = 0;
  let artStyleIdList;
  let artStyleIdListLength;

  searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    const searchArtStyle = artStyle.value;
    artStyleIdList = objectIdList(searchArtStyle);
    artIdCount = 0;
    artStyleIdList.then((idArray) => artStyleIdListLength = idArray.total);
    artStyleIdList.then((idArray) => displayArtist(idArray, artIdCount));
  })

  searchForward.addEventListener('click', (event) => {
    event.preventDefault();
    if (artStyleIdList && artIdCount < artStyleIdListLength - 1) {
      artIdCount++;
      artStyleIdList.then((idArray) => displayArtist(idArray, artIdCount));
    }
  })

  searchBack.addEventListener('click', (event) => {
    event.preventDefault();
    if (artStyleIdList && artIdCount > 0) {
      artIdCount--;
      artStyleIdList.then((idArray) => displayArtist(idArray, artIdCount));
    } else if (artStyleIdList && artIdCount == 0) {
      artStyleIdList.then((idArray) => displayArtist(idArray, artIdCount));
    }
  })

  addFavorite.addEventListener('click', (event) => {
    event.preventDefault();
    artStyleIdList.then((idArray) => {
      favorites.push(idArray.objectIDs[artIdCount]);
      localStorage.setItem('storedfavorites', JSON.stringify(favorites));
    })
    alert('Your art piece has been added to your favorites!');
  })

})

async function displayArtist(idArray, idCount) {
  const artistId = idArray.objectIDs[idCount];
  const currentArtObject = artObjectFetch(artistId);
  artDisplayImage.src = "/images/Spin@1x-1.9s-200px-200px.svg";
  currentArtObject.then((currentArtObject) => {
      let imageURL = currentArtObject.primaryImage
      artDisplayImage.src = imageURL;
      refCount.innerHTML = `${idCount + 1} of ${idArray.objectIDs.length}`;
      artTitle.innerHTML = `Title: ${currentArtObject.title}`;
      artDisplayName.innerHTML = `Artist Display Name: ${currentArtObject.artistDisplayName}`;
      artObjectDate.innerHTML = `Object Date: ${currentArtObject.objectDate}`;
      artMedium.innerHTML = `Medium: ${currentArtObject.medium}`;
   });

}

async function objectIdList(searchArtStyle) {
  const idObject = await objectIdFetch(searchArtStyle);
  return idObject.data;
}

async function objectIdFetch(requestedStyle) {
  const rawResponse = await fetch(searchBaseURL + requestedStyle);
  if (!rawResponse.ok) {
    throw new Error(`No matching data can be found for "${requestedStyle}"`);
  }
  const result = await rawResponse.json();
  return {data: result};
}

async function artObjectFetch(objectId) {
  const rawResponse = await fetch(objectIdURL + objectId);
  if (!rawResponse.ok) {
    throw new Error(`No matching data can be found for "${objectId}"`);
  }
  return await rawResponse.json();
}

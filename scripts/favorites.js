const searchBaseURL = 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&isPublicDomain=true&q=';
const objectIdURL = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/';
const refCount = document.getElementById('reference-count');
const artTitle = document.getElementById('title');
const artDisplayName = document.getElementById('artist-display-name');
const artObjectDate = document.getElementById('object-date');
const artMedium = document.getElementById('medium');
const artDisplayImage = document.getElementById('display-image');

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search');
  const artStyle = document.getElementById('art-style-select');
  let artIdCount = 0;
  const searchForward = document.getElementById('search-forward');
  const searchBack = document.getElementById('search-back');
  const removeFavorite = document.getElementById('remove-favorites');

  let storedFavorites = {
    objectIDs: JSON.parse(localStorage.getItem('storedfavorites'))
  };

  let storedFavoritesLength = storedFavorites.objectIDs.length;

  console.log('storedfavorites:', storedFavorites);

  displayArtist(storedFavorites, artIdCount);

  // searchButton.addEventListener('click', (event) => {
  //   event.preventDefault();
  //   const searchArtStyle = artStyle.value;
  //   // console.log('base + search: ' + searchBaseURL + searchArtStyle);
  //   // console.log(objectIdList(searchArtStyle));
  //   artStyleIdList = objectIdList(searchArtStyle);
  //   // artStyleIdList.then((idArray) => console.log(idArray[0]));
  //   artIdCount = 0;
  //   // const artistId = artStyleIdList.then((idArray) => idArray[artIdCount]);
  //   artStyleIdList.then((idArray) => artStyleIdListLength = idArray.total);
  //   artStyleIdList.then((idArray) => displayArtist(idArray, artIdCount));
  //   // const currentArtObject = artistId.then((artistId) => artObjectFetch(artistId));
  //   // artistId.then((artistId) => console.log('Artist Object:', artObjectFetch(artistId)));
  //   // artistId.then((artistId) => displayArtist(artistId));
  //   // const requestedIds = objectIdFetch(searchArtStyle);
  //   // var artistImage = document.createElement('img');
  //   // artistImage.src = currentArtObject.primaryImage;
  //   // const mainDisplay = document.getElementById('mainWrapper');
  //   // mainDisplay.appendChild(artistImage);
  // })

  searchForward.addEventListener('click', (event) => {
    event.preventDefault();
    // console.log('artStyleIdList length:', artStyleIdListLength);
    if (storedFavorites && artIdCount < storedFavoritesLength) {
      artIdCount++;
      displayArtist(storedFavorites, artIdCount);
    } else if (storedFavorites && artIdCount == storedFavoritesLength - 1) {
      displayArtist(idArray, artIdCount);
    }
    console.log('artIdCount:', artIdCount);
  })

  searchBack.addEventListener('click', (event) => {
    event.preventDefault();
    // console.log('artStyleIdList length:', artStyleIdListLength);
    if (storedFavorites && artIdCount > 0) {
      artIdCount--;
      displayArtist(storedFavorites, artIdCount);
    } else if (storedFavorites && artIdCount == 0) {
      displayArtist(storedFavorites, artIdCount);
    }
    console.log('artIdCount:', artIdCount);
  })

  removeFavorite.addEventListener('click', (event) => {
    event.preventDefault();
    storedFavorites.objectIDs.splice(artIdCount, 1);
    artIdCount--;
    displayArtist(storedFavorites, artIdCount);
    localStorage.setItem('storedfavorites', JSON.stringify(storedFavorites.objectIDs));
  })

})

async function displayArtist(idArray, idCount) {
  console.log('artStyleIdList:', idArray);
  const artistId = idArray.objectIDs[idCount];
  console.log('artistId:', artistId);
  const currentArtObject = artObjectFetch(artistId);
  currentArtObject.then((currentArtObject) => {
      let imageURL = currentArtObject.primaryImage
      // console.log('imageURL:', imageURL)
      // var artistImage = document.createElement('img');
      // artistImage.id = 'display-image';
      // artistImage.maxWidth = '100%';
      // artistImage.height = '500';
      artDisplayImage.src = imageURL;
      // const mainDisplay = document.querySelector('.main-wrapper');
      // const oldDisplayImage = document.getElementById('display-image');
      // mainDisplay.replaceChild(artistImage, oldDisplayImage);
      // console.log('artStyleIdListLength', artStyleIdListLength);
      refCount.innerHTML = `${idCount + 1} of ${idArray.objectIDs.length}`;
      artTitle.innerHTML = `Title: ${currentArtObject.title}`;
      artDisplayName.innerHTML = `Artist Display Name: ${currentArtObject.artistDisplayName}`;
      artObjectDate.innerHTML = `Object Date: ${currentArtObject.objectDate}`;
      artMedium.innerHTML = `Medium: ${currentArtObject.medium}`;
   });
  // imageURL.then((imageURL) => console.log('imageURL:', imageURL));

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
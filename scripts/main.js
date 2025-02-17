const searchBaseURL = 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&isPublicDomain=true&q=';
const objectIdURL = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/'

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search');
  const artStyle = document.getElementById('art-style-select');
  let artIdCount = 0;
  const searchForward = document.getElementById('search-forward');
  const searchBack = document.getElementById('search-back');
  let artStyleIdList;
  let artStyleIdListLenght;

  searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    const searchArtStyle = artStyle.value;
    // console.log('base + search: ' + searchBaseURL + searchArtStyle);
    // console.log(objectIdList(searchArtStyle));
    artStyleIdList = objectIdList(searchArtStyle);
    // artStyleIdList.then((idArray) => console.log(idArray[0]));
    artIdCount = 0;
    // const artistId = artStyleIdList.then((idArray) => idArray[artIdCount]);
    artStyleIdList.then((idArray) => artStyleIdListLenght = idArray.total);
    artStyleIdList.then((idArray) => displayArtist(idArray, artIdCount));
    // const currentArtObject = artistId.then((artistId) => artObjectFetch(artistId));
    // artistId.then((artistId) => console.log('Artist Object:', artObjectFetch(artistId)));
    // artistId.then((artistId) => displayArtist(artistId));
    // const requestedIds = objectIdFetch(searchArtStyle);
    // var artistImage = document.createElement('img');
    // artistImage.src = currentArtObject.primaryImage;
    // const mainDisplay = document.getElementById('mainWrapper');
    // mainDisplay.appendChild(artistImage);
  })

  searchForward.addEventListener('click', (event) => {
    event.preventDefault();
    // console.log('artStyleIdList length:', artStyleIdListLenght);
    if (artStyleIdList && artIdCount < artStyleIdListLenght) {
      artIdCount++;
      artStyleIdList.then((idArray) => displayArtist(idArray, artIdCount));
    } else if (artStyleIdList && artIdCount == artStyleIdListLenght) {
      artStyleIdList.then((idArray) => displayArtist(idArray, artIdCount));
    }
    console.log('artIdCount:', artIdCount);
  })

  searchBack.addEventListener('click', (event) => {
    event.preventDefault();
    // console.log('artStyleIdList length:', artStyleIdListLenght);
    if (artStyleIdList && artIdCount > 0) {
      artIdCount--;
      artStyleIdList.then((idArray) => displayArtist(idArray, artIdCount));
    } else if (artStyleIdList && artIdCount == 0) {
      artStyleIdList.then((idArray) => displayArtist(idArray, artIdCount));
    }
    console.log('artIdCount:', artIdCount);
  })

})

async function displayArtist(idArray, idCount) {
  console.log('artStyleIdList:', idArray);
  const artistId = idArray.objectIDs[idCount];
  // console.log('artistId:', artistId);
  const currentArtObject = artObjectFetch(artistId);
  currentArtObject.then((currentArtObject) => {
      let imageURL = currentArtObject.primaryImage
      // console.log('imageURL:', imageURL)
      var artistImage = document.createElement('img');
      artistImage.id = 'displayImage';
      artistImage.maxWidth = '100%';
      artistImage.height = '500';
      artistImage.src = imageURL;
      const mainDisplay = document.querySelector('.mainWrapper');
      const oldDisplayImage = document.getElementById('displayImage');
      mainDisplay.replaceChild(artistImage, oldDisplayImage);
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
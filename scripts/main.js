const searchBaseURL = 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&isPublicDomain=true&q=';
const objectIdURL = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/'

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search');
  const artStyle = document.getElementById('art-style-select');
  let artIdCount = 0;

  searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    const searchArtStyle = artStyle.value;
    console.log('base + search: ' + searchBaseURL + searchArtStyle);
    console.log(objectIdList(searchArtStyle));
    const artStyleIdList = objectIdList(searchArtStyle);
    // artStyleIdList.then((idArray) => console.log(idArray[0]));
    artIdCount = 0;
    const artistId = artStyleIdList.then((idArray) => idArray[artIdCount]);
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
})

async function displayArtist(idArray, idCount) {
  console.log('artStyleIdList:', idArray);
  const artistId = idArray[idCount];
  console.log('artistId:', artistId);
  const currentArtObject = artObjectFetch(artistId);
  currentArtObject.then((currentArtObject) => {
    if (currentArtObject.primaryImage) {
      let imageURL = currentArtObject.primaryImage
      console.log('imageURL:', imageURL)
      var artistImage = document.createElement('img');
      artistImage.id = 'displayImage';
      artistImage.maxWidth = '100%';
      artistImage.height = '500';
      artistImage.src = imageURL;
      const mainDisplay = document.querySelector('.mainWrapper');
      const oldDisplayImage = document.getElementById('displayImage');
      mainDisplay.replaceChild(artistImage, oldDisplayImage);
    } else {

    }


  });
  // imageURL.then((imageURL) => console.log('imageURL:', imageURL));

}

async function objectIdList(searchArtStyle) {
  const idObject = await objectIdFetch(searchArtStyle);
  return idObject.objectIDs;
}

async function objectIdFetch(requestedStyle) {
  const rawResponse = await fetch(searchBaseURL + requestedStyle);
  if (!rawResponse.ok) {
    throw new Error(`No matching data can be found for "${requestedStyle}"`);
  }
  return await rawResponse.json();
}

async function artObjectFetch(objectId) {
  const rawResponse = await fetch(objectIdURL + objectId);
  if (!rawResponse.ok) {
    throw new Error(`No matching data can be found for "${objectId}"`);
  }
  return await rawResponse.json();
}
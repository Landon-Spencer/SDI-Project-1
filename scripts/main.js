const baseURL = 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&isPublicDomain=true&q=';

document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search');
  const artStyle = document.getElementById('art-style-select');

  searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    const searchArtStyle = artStyle.value;
    console.log('base + search: ' + baseURL + searchArtStyle);
    console.log(objectIdList(searchArtStyle));
    const artStyleIdList = objectIdList(searchArtStyle);
    console.log(artStyleIdList);

    // const requestedIds = objectIdFetch(searchArtStyle);
  })
})

async function objectIdList(searchArtStyle) {
  const idObject = await objectIdFetch(searchArtStyle);
  return idObject.objectIDs;
}

async function objectIdFetch(requestedStyle) {
  const rawResponse = await fetch(baseURL + requestedStyle);
  if (!rawResponse.ok) {
    throw new Error(`No matching data can be found for "${requestedStyle}"`);
  }
  return await rawResponse.json();
}

async function artObjectFetch(objectId) {
  const rawResponse = await fetch(baseURL + objectId);
  if (!rawResponse.ok) {
    throw new Error(`No matching data can be found for "${requestedStyle}"`);
  }
  return await rawResponse.json();
}
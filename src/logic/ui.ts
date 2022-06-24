
export function initSpoilers()
{
  const spoilers = document.querySelectorAll('.spoiler')

  console.log("Init spoilers")

  for (const spoiler of spoilers)
  {
    console.log("added listener")
    spoiler.addEventListener('click', event => {
      console.log('clicked', event);

      spoiler.setAttribute('style', 'background-color: yellow;');
    })
  }
}

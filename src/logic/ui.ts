
export function initSpoilers()
{
  const spoilers = document.querySelectorAll('.spoiler')

  console.log("Init spoilers")

  for (const spoiler of spoilers)
  {
    // Already initialized
    if (spoiler.classList.contains("spoiler-init")) continue
    spoiler.classList.add("spoiler-init")

    // Add event listener
    spoiler.addEventListener('click', event => {
      console.log('clicked', event);

      // If already shown, hide
      if (spoiler.classList.contains("spoiler-visible")) spoiler.classList.remove("spoiler-visible")
      else spoiler.classList.add("spoiler-visible")
    })
  }
}

const finalTraits = JSON.parse(localStorage.getItem('finalTraits')) || [];
const selectedZodiac = localStorage.getItem('selectedZodiac');
const zodiacTraits = JSON.parse(localStorage.getItem('userZodiacTraits')) || [];

Promise.all([
  fetch('anime_char.json').then(res => res.json()),
  fetch('full_zodiac_data.json').then(res => res.json())
])
.then(([animeData, zodiacData]) => {
  const zodiacInfo = zodiacData.find(z => z.zodiac === selectedZodiac);
  const bestMatch = findBestMatch(finalTraits, zodiacTraits, animeData);
  displayMatch(bestMatch, zodiacInfo);
})
.catch(err => console.error("Error loading data:", err));

function findBestMatch(userTraits, zodiacTraits, characters) {
  let bestMatch = null;
  let bestQuizCount = -1;
  let bestTotalScore = -1;

  characters.forEach(character => {
    const sharedTraits = character.traits.filter(trait => userTraits.includes(trait));
    const quizTraitMatches = sharedTraits.filter(trait => !zodiacTraits.includes(trait)).length;
    const totalShared = sharedTraits.length;

    if (
      quizTraitMatches > bestQuizCount ||
      (quizTraitMatches === bestQuizCount && totalShared > bestTotalScore)
    ) {
      bestMatch = { ...character, sharedTraits, score: totalShared, quizMatchCount: quizTraitMatches };
      bestQuizCount = quizTraitMatches;
      bestTotalScore = totalShared;
    }
  });

  return bestMatch;
}

function displayMatch(match, zodiacInfo) {
  const container = document.getElementById('matchResult');

  if (!match) {
    container.innerHTML = `<p>No match found 😭</p>`;
    return;
  }

  container.innerHTML = `
    <div id="shareCard" class="match-card" style="
      background: linear-gradient(to bottom, #1a1a2e, #16213e, #0f3460);
      color: white;
      border-radius: 20px;
      padding: 25px;
      max-width: 400px;
      text-align: center;
      font-family: 'Baloo 2', cursive;
      box-shadow: 0 10px 30px rgba(255,255,255,1);
    ">
      <h2 style="font-size:1.8rem; margin-bottom:10px;">${match.name} <small style="font-size:0.8rem;">(${match.anime})</small></h2>
      <img src="${match.image}" alt="${match.name}" style="
        max-width: 180px;
        border-radius: 50%;
        margin-bottom: 15px;
        border: 4px solid white;
      ">
      <h3>💫 Zodiac Vibe</h3>
      <p style="font-weight:900;">${zodiacInfo.vibe}</p>

      <button id="shareBtn" class="share-button" style="
        margin-top: 20px;
        background: white;
        color: black;
        font-weight: 900;
        padding: 12px 24px;
        border-radius: 30px;
        cursor: pointer;
        border: none;
        transition: background-color 0.3s ease;
      ">Share Your Match</button>
    </div>
  `;

  document.getElementById('shareBtn').addEventListener('click', () => {
    shareMatch();
  });
}

function shareMatch() {
  const shareCard = document.getElementById('shareCard');

  // Load html2canvas from CDN if not loaded
  if (typeof html2canvas === 'undefined') {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
    script.onload = () => captureAndShare(shareCard);
    document.body.appendChild(script);
  } else {
    captureAndShare(shareCard);
  }
}

function captureAndShare(element) {
  const shareBtn = document.getElementById('shareBtn');
  
  // Hide the share button before screenshot
  shareBtn.style.display = 'none';

  html2canvas(element, {backgroundColor: null}).then(canvas => {
    // Show the share button back after screenshot
    shareBtn.style.display = '';

    canvas.toBlob(blob => {
      const file = new File([blob], 'anime-match.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          files: [file],
          title: 'My Anime Personality Match!',
          text: 'Check out my anime personality match!'
        }).catch(err => console.error('Error sharing:', err));
      } else {
        // Fallback: download the image
        const link = document.createElement('a');
        link.download = 'anime-match.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        alert('Image downloaded! You can now share it anywhere.');
      }
    }, 'image/png');
  });
}

let userTraits = [];
let selectedZodiac = localStorage.getItem('selectedZodiac');
console.log("Selected zodiac from storage:", selectedZodiac);

fetch('full_zodiac_data.json')
    .then(res => res.json())
    .then(data => {
        if (selectedZodiac) {
            const match = data.find(
                z => z.zodiac.toLowerCase() === selectedZodiac.toLowerCase()
            );

            if (match) {
                userTraits = [...match.traits];
                console.log("Initial traits from zodiac:", userTraits);
            } else {
                console.warn("Zodiac not found in JSON.");
            }
        } else {
            console.warn("Zodiac not selected.");
        }
    })
    .catch(err => console.error("Failed to load zodiac data:", err));



// Step 2: When user selects something later
function addTraits(newTraits) {
    userTraits.push(...newTraits);
    userTraits = [...new Set(userTraits)]; // ensure uniqueness
    console.log("Updated traits:", userTraits);
}

// Step 3: On submit
document.getElementById('submitQuizBtn').addEventListener('click', () => {
    localStorage.setItem('finalTraits', JSON.stringify(userTraits));
    window.location.href = 'match.html';
});
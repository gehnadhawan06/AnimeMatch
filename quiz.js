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

// Add new traits from quiz
function addTraits(newTraits) {
    userTraits.push(...newTraits);
    userTraits = [...new Set(userTraits)]; // ensure uniqueness
    console.log("Updated traits after quiz selection:", userTraits);
}

// Submit button
document.getElementById('submitQuizBtn').addEventListener('click', (e) => {
    e.preventDefault();

    // Start with zodiac traits - make sure userTraits is defined elsewhere as an array
    let finalTraits = [...userTraits];

    // Collect all chosen radio values (these are your anime trait strings)
    const selectedAnswers = Array.from(document.querySelectorAll('input[type="radio"]:checked'))
        .map(input => input.value.trim());

    // Collect all checked checkboxes for quirks
    const selectedQuirks = Array.from(document.querySelectorAll('input[name="q11"]:checked'))
        .map(input => input.value);

    // Merge everything
    finalTraits.push(...selectedAnswers, ...selectedQuirks);
    finalTraits = [...new Set(finalTraits)];



    console.log("Final traits being saved:", finalTraits);

    localStorage.setItem('finalTraits', JSON.stringify(finalTraits));
    window.location.href = 'match.html';
});


const traitsForm = document.getElementById('traitsForm');
const traitInfo = document.getElementById('traitInfo');

traitsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const personalityTraits = document.getElementById('personalityTraits').value;

    try {
        const response = await fetch('https://example.com/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ traits: personalityTraits })
        });
        const data = await response.json();
        displayTraitInfo(data);
    } catch (error) {
        console.error('Error:', error);
    }
});

function displayTraitInfo(info) {
    traitInfo.innerHTML = '';
    const traitList = document.createElement('ul');
    info.forEach((trait) => {
        const traitItem = document.createElement('li');
        traitItem.textContent = trait;
        traitList.appendChild(traitItem);
    });
    traitInfo.appendChild(traitList);
}

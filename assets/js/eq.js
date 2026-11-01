function calculateEQ() {
    const perceivingEmotions = parseInt(document.getElementById('perceivingEmotions').value);
    const usingEmotions = parseInt(document.getElementById('usingEmotions').value);
    const understandingEmotions = parseInt(document.getElementById('understandingEmotions').value);
    const managingEmotions = parseInt(document.getElementById('managingEmotions').value);

    const total = perceivingEmotions + usingEmotions + understandingEmotions + managingEmotions;
    const averageEQ = total / 4;

    const result = document.getElementById('result');
    result.textContent = `Your average EQ score is: ${averageEQ.toFixed(1)}`;

    if (averageEQ >= 8) {
        result.style.color = 'green';
        result.textContent += ' - Excellent EQ!';
    } else if (averageEQ >= 5) {
        result.style.color = 'orange';
        result.textContent += ' - Good EQ!';
    } else {
        result.style.color = 'red';
        result.textContent += ' - Needs Improvement.';
    }
}

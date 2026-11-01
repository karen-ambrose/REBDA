document.addEventListener('DOMContentLoaded', function() {
    // Handle career form submission
    const career_form = document.getElementById('career');
    if (career_form) {
        career_form.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            // Redirect to success.html
            window.location.href = 'success.html';
        });
    }

    // Handle job form submission
    const form = document.getElementById('jobForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const skills = document.getElementById('skills').value;
            const qualifications = document.getElementById('qualifications').value;
            const goals = document.getElementById('goals') ? document.getElementById('goals').value : '';
            const interests = document.getElementById('interests') ? document.getElementById('interests').value : '';

            const qValues = [];
            for (let i = 1; i <= 20; i++) {
                const answer = document.getElementById(`q${i}`);
                if (answer) {
                    qValues.push(parseInt(answer.value));
                }
            }

            // Ensure we have exactly 20 responses
            if (qValues.length !== 20) {
                throw new Error("Invalid number of responses");
            }

            // Calculate scores based on provided formula
            let e = 0, a = 0, c = 0, n = 0, o = 0;

            qValues.forEach((q, i) => {
                if (!isNaN(q)) {
                    if ([0, 8, 16].includes(i)) {
                        e += parseInt(q);
                    } else if ([4, 12].includes(i)) {
                        e -= parseInt(q);
                    } else if (i === 1) {
                        a -= parseInt(q);
                    } else if ([5, 13].includes(i)) {
                        a += parseInt(q);
                    } else if (i === 2) {
                        c += parseInt(q);
                    } else if ([6, 14].includes(i)) {
                        c -= parseInt(q);
                    } else if (i === 3) {
                        n -= parseInt(q);
                    } else if ([7, 15].includes(i)) {
                        n += parseInt(q);
                    } else if (i === 9) {
                        o += parseInt(q);
                    } else if ([10, 11].includes(i)) {
                        o -= parseInt(q);
                    }
                } else {
                    throw new Error("Invalid response value");
                }
            });

            // Normalize scores to range from 0.0 to 1.0
            const normalizeScore = (score) => (score + 10) / 20;

            // Calculate the normalized scores
            const eScore = normalizeScore(e / 20);
            const aScore = normalizeScore(a / 20);
            const cScore = normalizeScore(c / 20);
            const nScore = normalizeScore(n / 20);
            const oScore = normalizeScore(o / 20);

            // Define feedback object with messages
            const feedback = {
                Extroversion: {
                    core: eScore,
                    feedback: `You tend to be more ${eScore > 0.4 ? 'outgoing' : 'introverted'} in social situations.`
                },
                Agreeableness: {
                    core: aScore,
                    feedback: `You tend to be more ${aScore > 0.4 ? 'altruistic' : 'skeptical'} and cooperative.`
                },
                Conscientiousness: {
                    core: cScore,
                    feedback: `You tend to be more ${cScore > 0.4 ? 'self-disciplined' : 'spontaneous'} and organized.`
                },
                Neuroticism: {
                    core: nScore,
                    feedback: `You tend to be more ${nScore < 0.4 ? 'resilient' : 'anxious'} and emotionally stable.`
                },
                OpennessToExperience: {
                    core: oScore,
                    feedback: `You tend to be more ${oScore > 0.4 ? 'creative' : 'traditional'} and open-minded.`
                }
            };

            // Calculate MSCEIT scores
            let perceivingEmotionsScore = 0;
            let facilitatingThoughtScore = 0;
            let understandingEmotionsScore = 0;
            let managingEmotionsScore = 0;

            perceivingEmotionsScore += 55; // points for perceiving emotions
            facilitatingThoughtScore += 70; // points for facilitating thought
            understandingEmotionsScore += 60; // points for understanding emotions
            managingEmotionsScore += 47; // points for managing emotions

            // Calculate final scores
            perceivingEmotionsScore = Math.min(150, perceivingEmotionsScore);
            facilitatingThoughtScore = Math.min(150, facilitatingThoughtScore);
            understandingEmotionsScore = Math.min(150, understandingEmotionsScore);
            managingEmotionsScore = Math.min(150, managingEmotionsScore);

            // Calculate final MSCEIT score
            const finalMsceitScore = (perceivingEmotionsScore + facilitatingThoughtScore + understandingEmotionsScore + managingEmotionsScore) / 4;

            // Interpret MSCEIT scores
            const interpretScore = (score) => {
                if (score > 115) return "strong";
                if (score < 85) return "struggle";
                return "moderate";
            };

            const msceitInterpretations = {
                perceivingEmotions: interpretScore(perceivingEmotionsScore),
                facilitatingThought: interpretScore(facilitatingThoughtScore),
                understandingEmotions: interpretScore(understandingEmotionsScore),
                managingEmotions: interpretScore(managingEmotionsScore)
            };

            // Store results in sessionStorage
            sessionStorage.setItem('results', JSON.stringify({
                skills,
                qualifications,
                goals,
                interests,
                oceanScores: {
                    openness: oScore.toFixed(2),
                    conscientiousness: cScore.toFixed(2),
                    extraversion: eScore.toFixed(2),
                    agreeableness: aScore.toFixed(2),
                    neuroticism: nScore.toFixed(2)
                },
                oceanFeedback: {
                    extroversion: feedback.Extroversion.feedback,
                    agreeableness: feedback.Agreeableness.feedback,
                    conscientiousness: feedback.Conscientiousness.feedback,
                    neuroticism: feedback.Neuroticism.feedback,
                    opennessToExperience: feedback.OpennessToExperience.feedback
                },
                msceitScores: {
                    perceivingEmotionsScore,
                    facilitatingThoughtScore,
                    understandingEmotionsScore,
                    managingEmotionsScore,
                    finalMsceitScore: finalMsceitScore.toFixed(2),
                    interpretations: msceitInterpretations
                }
            }));

            // Redirect to success.html
            window.location.href = 'success.html';
        });
    }
});

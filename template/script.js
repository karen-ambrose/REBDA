document.addEventListener('DOMContentLoaded', function() {
    const skillsForm = document.getElementById('jobForm');

    skillsForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Define array of predefined skills (example)
        const predefinedSkills = ['python'];

        // Get user input
        const skillsInput = document.getElementById('skills').value.trim().toLowerCase();
        const skillsArray = skillsInput.split(',').map(skill => skill.trim());

        // Fetch CSV file (assuming coursera.csv is in the same directory)
        fetch('Coursera.csv')
            .then(response => response.text())
            .then(data => {
                // Parse CSV data
                const courses = parseCSV(data);

                // Find matching courses based on predefinedSkills and user-inputted skills
                const matchingCourses = courses.filter(course => {
                    const courseSkills = course['Skills'].toLowerCase().split(',').map(skill => skill.trim());
                    return skillsArray.some(skill => predefinedSkills.includes(skill) && courseSkills.includes(skill));
                });

                // Display matching courses on success.html
                if (matchingCourses.length > 0) {
                    const coursesList = matchingCourses.map(course => {
                        return `
                            <li>
                                <h3><a href="${course['Course URL']}" target="_blank">${course['Course Name']}</a></h3>
                                <p>${course['Course Description']}</p>
                            </li>
                        `;
                    }).join('');

                    localStorage.setItem('coursesList', coursesList); // Store coursesList in localStorage for success.html
                    window.location.href = 'success.html'; // Redirect to success.html
                } else {
                    alert('No matching courses found.');
                }
            })
            .catch(error => console.error('Error fetching CSV file:', error));
    });

    // Function to parse CSV data into an array of objects
    function parseCSV(csv) {
        const lines = csv.split('\n');
        const courses = [];
        const headers = lines[0].split(',').map(header => header.trim());

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const course = {};
            for (let j = 0; j < headers.length; j++) {
                course[headers[j]] = values[j].trim();
            }
            courses.push(course);
        }
        return courses;
    }
});
// Function to handle form submission
    document.addEventListener('DOMContentLoaded', function() {
    // Assuming this is for mydata.html


// Define an array of courses with their details
const courses = [
    {
        title: "Write A Feature Length Screenplay For Film Or Television",
        description: "Learn to craft a screenplay suitable for film or television production.",
        url: "https://www.coursera.org/learn/write-a-feature-length-screenplay-for-film-or-television"
    },
    {
        title: "Business Strategy: Business Model Canvas Analysis with Miro",
        description: "Use Miro to analyze business models using the Business Model Canvas.",
        url: "https://www.coursera.org/learn/canvas-analysis-miro"
    },
    {
        title: "Silicon Thin Film Solar Cells",
        description: "Explore the technology behind silicon thin film solar cells.",
        url: "https://www.coursera.org/learn/silicon-thin-film-solar-cells"
    },
    {
        title: "Finance for Managers",
        description: "Gain insights into operational finance for effective management decision-making.",
        url: "https://www.coursera.org/learn/operational-finance"
    },
    {
        title: "Retrieve Data using Single-Table SQL Queries",
        description: "Learn SQL fundamentals to query data efficiently from a single table.",
        url: "https://www.coursera.org/learn/single-table-sql-queries"
    },
    {
        title: "Building Test Automation Framework using Selenium and TestNG",
        description: "Create scalable test automation frameworks using Selenium and TestNG.",
        url: "https://www.coursera.org/learn/building-test-automation-framework-using-selenium-and-testng"
    },
    {
        title: "Doing Business in China Capstone",
        description: "Capstone project focusing on doing business in China, integrating learned concepts.",
        url: "https://www.coursera.org/learn/doing-business-in-china-capstone"
    },
    {
        title: "Programming Languages, Part A",
        description: "Introduction to various programming languages and their key features.",
        url: "https://www.coursera.org/learn/programming-languages"
    },
    {
        title: "The Roles and Responsibilities of Nonprofit Boards of Directors within the Governance Process",
        description: "Understand the governance processes and responsibilities of nonprofit boards.",
        url: "https://www.coursera.org/learn/nonprofit-gov-2"
    },
    {
        title: "Business Russian Communication. Part 3",
        description: "Advance your business communication skills in Russian.",
        url: "https://www.coursera.org/learn/business-russian-communication-3"
    },
    {
        title: "Agile Projects: Developing Tasks with Taiga",
        description: "Learn agile project management techniques using Taiga.",
        url: "https://www.coursera.org/learn/developing-agile-tasks-taiga"
    },
    {
        title: "Esports Management Capstone Project",
        description: "Capstone project focusing on management principles in the esports industry.",
        url: "https://www.coursera.org/learn/esports-management-capstone-project"
    },
    {
        title: "Hacking and Patching",
        description: "Understand cybersecurity threats and how to patch vulnerabilities.",
        url: "https://www.coursera.org/learn/hacking-patching"
    },
    {
        title: "Business Statistics and Analysis Capstone",
        description: "Capstone project on applying statistical analysis techniques in business contexts.",
        url: "https://www.coursera.org/learn/business-statistics-analysis-capstone"
    },
    {
        title: "Grab Data Fast with Vertical and Horizontal LOOKUP",
        description: "Master data retrieval techniques using LOOKUP functions in Google Sheets.",
        url: "https://www.coursera.org/learn/grab-data-fast-with-vertical-and-horizontal-lookup-in-google-sheets"
    },
    {
        title: "Global Health: An Interdisciplinary Overview",
        description: "Explore global health issues from an interdisciplinary perspective.",
        url: "https://www.coursera.org/learn/global-health-overview"
    },
    {
        title: "Python Programming Essentials",
        description: "Fundamentals of programming using Python.",
        url: "https://www.coursera.org/learn/python-programming"
    },
    {
        title: "Creating Dashboards and Storytelling with Tableau",
        description: "Learn to create informative dashboards and tell compelling stories using Tableau.",
        url: "https://www.coursera.org/learn/dataviz-dashboards"
    },
    {
        title: "Parallel programming",
        description: "Introduction to parallel programming concepts and techniques.",
        url: "https://www.coursera.org/learn/parprog1"
    },
    {
        title: "Recommendation Systems with TensorFlow on GCP",
        description: "Build recommendation systems using TensorFlow on Google Cloud Platform.",
        url: "https://www.coursera.org/learn/recommendation-models-gcp"
    },
    {
        title: "The Changing Arctic",
        description: "Explore environmental changes in the Arctic region and their impacts.",
        url: "https://www.coursera.org/learn/changing-arctic"
    },
    {
        title: "COVID-19 - A clinical update",
        description: "Stay updated with clinical insights on COVID-19.",
        url: "https://www.coursera.org/learn/covid19clinicalupdate"
    },
    {
        title: "How to Create Text Effects in GIMP",
        description: "Learn to create visually appealing text effects using GIMP.",
        url: "https://www.coursera.org/learn/how-to-create-text-effects-in-gimp"
    },
    {
        title: "Preparing for the Google Cloud Professional Data Engineer Exam",
        description: "Preparation course for the Google Cloud Professional Data Engineer certification exam.",
        url: "https://www.coursera.org/learn/preparing-cloud-professional-data-engineer-exam"
    },
    {
        title: "Multiple Regression Analysis in Public Health",
        description: "Learn multiple regression analysis techniques in the context of public health.",
        url: "https://www.coursera.org/learn/multiple-regression-analysis-public-health"
    },
    {
        title: "General Pathophysiology",
        description: "Gain foundational knowledge in pathophysiology.",
        url: "https://www.coursera.org/learn/pathophysiology"
    },
    {
        title: "Population Health: Alternative Payment Models",
        description: "Explore alternative payment models in population health management.",
        url: "https://www.coursera.org/learn/alternative-payment-models"
    },
    {
        title: "AWS Elastic Beanstalk: Build & Deploy a Node.js RESTful API",
        description: "Learn to build and deploy a Node.js RESTful API using AWS Elastic Beanstalk.",
        url: "https://www.coursera.org/learn/nodejs-api-aws-elastic-beanstalk"
    },
    {
        title: "Philosophy, Science and Religion: Philosophy and Religion",
        description: "Examine the relationships between philosophy, science, and religion.",
        url: "https://www.coursera.org/learn/philosophy-science-religion-2"
    },
    {
        title: "Poverty & Population: How Demographics Shape Policy",
        description: "Understand how demographics influence poverty-related policies.",
        url: "https://www.coursera.org/learn/poverty-population-demographics-policy"
    },
    {
        title: "Electrodynamics: Analysis of Electric Fields",
        description: "Study electric fields and their analysis in electrodynamics.",
        url: "https://www.coursera.org/learn/electrodynamics-analysis-of-electric-fields"
    },
    {
        title: "The Music of American English Pronunciation",
        description: "Explore the musicality of American English pronunciation.",
        url: "https://www.coursera.org/learn/american-english-pronunciation-music"
    },
    {
        title: "Fundamentals of Management",
        description: "Learn essential management principles and practices.",
        url: "https://www.coursera.org/learn/fundamentals-of-management"
    },
    {
        title: "Advanced Speaking and Listening Project",
        description: "Develop advanced skills in speaking and listening through structured projects.",
        url: "https://www.coursera.org/learn/speaking-listening-capstone"
    },
    {
        title: "Hybrid Cloud Service Mesh with Anthos",
        description: "Learn about hybrid cloud service mesh architecture with Anthos.",
        url: "https://www.coursera.org/learn/hybrid-cloud-service-mesh-anthos"
    },
    {
        title: "Dealing With Missing Data",
        description: "Strategies and techniques for handling missing data in datasets.",
        url: "https://www.coursera.org/learn/missing-data"
    },
    {
        title: "COBOL Programming with VSCode",
        description: "Introduction to COBOL programming using Visual Studio Code.",
        url: "https://www.coursera.org/learn/cobol-programming-vscode"
    },
    {
        title: "Cryptography and Hashing Overview",
        description: "Introduction to cryptography and hashing techniques.",
        url: "https://www.coursera.org/learn/crypto-hashing"
    },
    {
        title: "Postman - Intro to APIs (without coding)",
        description: "Learn to work with APIs using codes",
        url: "https://www.coursera.org/learn/laura-gemmell-intro-postman-apis"
    }]

    // Function to handle form submission
    document.getElementById("jobForm").addEventListener("submit", function(event) {
        event.preventDefault();

        // Get user input from the skills input field
        const userSkills = document.getElementById("skills").value.trim().toLowerCase();
        const userSkillsArray = userSkills.split(",").map(skill => skill.trim());

        // Clear previous results
        const coursesList = document.getElementById("coursesList");
        coursesList.innerHTML = "";

        // Find courses that match user skills
        const matchedCourses = courses.filter(course => {
            const courseKeywords = course.title.toLowerCase().split(" ");
            return userSkillsArray.some(skill => courseKeywords.includes(skill));
        });

        // Display matched courses
        if (matchedCourses.length > 0) {
            matchedCourses.forEach(course => {
                const courseElement = document.createElement("div");
                courseElement.innerHTML = `
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <a href="${course.url}" target="_blank">Learn more</a>
                    <hr>
                `;
                coursesList.appendChild(courseElement);
            });
        } else {
            coursesList.innerHTML = "<p>No courses found matching your skills.</p>";
        }
    });
});

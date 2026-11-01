from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
import pandas as pd
from nltk import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import nltk
import numpy as np
from sklearn.metrics import precision_score, recall_score, f1_score

# Ensure NLTK stopwords are downloaded
nltk.download('stopwords')
nltk.download('punkt')


# Define LemmaTokenizer class for tokenization and lemmatization
class LemmaTokenizer(object):
    def __init__(self):
        self.wnl = WordNetLemmatizer()
        self.stopwords = stopwords.words('english')

    def __call__(self, doc):
        return [self.wnl.lemmatize(t) for t in word_tokenize(doc) if t not in self.stopwords]


# Load the CSV file containing job profiles
data = pd.read_csv('processed_profession-profile.csv')

# Clean up column names by stripping leading and trailing spaces
data.columns = data.columns.str.strip()

# Remove any '|' characters from job_skills
data['job_skills'] = data['job_skills'].str.replace('|', ',')

# Select specific columns of interest
cols_of_interest = ['job_title', 'job_skills', 'Openness', 'Conscientousness', 'Extraversion', 'Agreeableness',
                    'Neuroticism', 'eq_score']
df = data[cols_of_interest]

# Text feature representation using TF-IDF Vectorizer
vectorizer = TfidfVectorizer(tokenizer=LemmaTokenizer(), stop_words='english')
X_text_transformed = vectorizer.fit_transform(df['job_skills'])

# Reduce dimensionality using SVD
svd = TruncatedSVD(n_components=100)  # Adjust n_components as needed
X_text_svd = svd.fit_transform(X_text_transformed)

# Scale numeric features
scaler = StandardScaler()
X_numeric_scaled = scaler.fit_transform(
    df[['Openness', 'Conscientousness', 'Extraversion', 'Agreeableness', 'Neuroticism', 'eq_score']])

# Combine scaled numeric and text features
X_combined = np.hstack((X_numeric_scaled, X_text_svd))

# Encode labels
enc = LabelEncoder()
y_encoded = enc.fit_transform(df['job_title'])


# Compute cosine similarity between user profile and job profiles
def compute_cosine_similarity(user_profile, job_profiles):
    similarities = cosine_similarity(user_profile.reshape(1, -1), job_profiles)
    return similarities.flatten()


# Flask setup

from flask import Flask, render_template
app = Flask(__name__, template_folder='template')


@app.route('/')
def index():
    return render_template('mydata.html')

if __name__ == '__main__':
    app.run(debug=True)

# Define route for recommending jobs
@app.route('/recommend', methods=['POST'])
def recommend_jobs():
    # Get user input from JSON request
    user_input = request.json

    # Extract user skills and scores
    user_skills = user_input['skills']
    user_scores = user_input['scores']
    user_eq_score = user_input['eq_score']

    # Vectorize user input skills using TF-IDF
    user_skills_transformed = vectorizer.transform([user_skills]).toarray()

    # Apply SVD transformation to user input
    user_skills_svd = svd.transform(user_skills_transformed)

    # Scale user input scores
    user_scores_scaled = scaler.transform(
        [[user_scores[0], user_scores[1], user_scores[2], user_scores[3], user_scores[4], user_eq_score]])

    # Combine user input with SVD-transformed and scaled numeric features
    user_profile = np.hstack((user_scores_scaled, user_skills_svd))

    # Compute cosine similarity between user profile and all job profiles
    similarities = compute_cosine_similarity(user_profile, X_combined)

    # Rank job titles based on similarity scores
    top_indices = similarities.argsort()[-5:][::-1]  # Top 5 recommended job titles
    recommended_titles = [enc.inverse_transform(np.array([y_encoded[idx]]))[0] for idx in top_indices]

    # Prepare response
    response = {
        'recommended_titles': recommended_titles
    }

    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)

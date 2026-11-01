import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
from sklearn.model_selection import KFold
from sklearn.metrics import precision_score, recall_score, f1_score
  # For older versions of scikit-learn
from joblib import dump  # For newer versions of scikit-learn

import pandas as pd
from nltk import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import nltk
import numpy as np

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
cols_of_interest = ['job_title', 'job_skills', 'Openness', 'Conscientousness', 'Extraversion', 'Agreeableness', 'Neuroticism', 'eq_score']
df = data[cols_of_interest]

# Text feature representation using TF-IDF Vectorizer
vectorizer = TfidfVectorizer(tokenizer=LemmaTokenizer(), stop_words='english')
X_text_transformed = vectorizer.fit_transform(df['job_skills'])

# Reduce dimensionality using SVD
svd = TruncatedSVD(n_components=100)  # Adjust n_components as needed
X_text_svd = svd.fit_transform(X_text_transformed)

# Scale numeric features
scaler = StandardScaler()
X_numeric_scaled = scaler.fit_transform(df[['Openness', 'Conscientousness', 'Extraversion', 'Agreeableness', 'Neuroticism', 'eq_score']])

# Combine scaled numeric and text features
X_combined = np.hstack((X_numeric_scaled, X_text_svd))

# Encode labels
enc = LabelEncoder()
y_encoded = enc.fit_transform(df['job_title'])

# Compute cosine similarity between user profile and job profiles
def compute_cosine_similarity(user_profile, job_profiles):
    similarities = cosine_similarity(user_profile.reshape(1, -1), job_profiles)
    return similarities.flatten()

# Simulated user input
user_skills = ".NET framework, .NET design"
user_scores = [0.5, 0.7, 0.6, 0.8, 0.4]  # Assuming O, C, E, A, N scores
user_eq_score = 87  # Assuming eq_score

# Vectorize user input skills using TF-IDF
user_skills_transformed = vectorizer.transform([user_skills]).toarray()

# Apply SVD transformation to user input
user_skills_svd = svd.transform(user_skills_transformed)

# Scale user input scores
user_scores_scaled = scaler.transform([[user_scores[0], user_scores[1], user_scores[2], user_scores[3], user_scores[4], user_eq_score]])

# Combine user input with SVD-transformed and scaled numeric features
user_profile = np.hstack((user_scores_scaled, user_skills_svd))

# Compute cosine similarity between user profile and all job profiles
similarities = compute_cosine_similarity(user_profile, X_combined)

# Rank job titles based on similarity scores
top_index = similarities.argmax()  # Index of the top recommended job title
recommended_title = enc.inverse_transform(np.array([y_encoded[top_index]]))

print("\nRecommended Job Title for User:")
print("- " + recommended_title[0])  # Print the first recommended job title

# Evaluate recommendation
def evaluate_recommendation(y_true, y_pred):
    precision = precision_score(y_true, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_true, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_true, y_pred, average='weighted', zero_division=0)
    return precision, recall, f1

# Simulated user input
user_skills = ".NET framework, .NET design"
user_scores = [0.5, 0.7, 0.6, 0.8, 0.4]  # Assuming O, C, E, A, N scores
user_eq_score = 87  # Assuming eq_score

# Vectorize user input skills using TF-IDF
user_skills_transformed = vectorizer.transform([user_skills]).toarray()

# Apply SVD transformation to user input
user_skills_svd = svd.transform(user_skills_transformed)

# Scale user input scores
user_scores_scaled = scaler.transform([[user_scores[0], user_scores[1], user_scores[2], user_scores[3], user_scores[4], user_eq_score]])

# Combine user input with SVD-transformed and scaled numeric features
user_profile = np.hstack((user_scores_scaled, user_skills_svd))

# Compute cosine similarity between user profile and all job profiles
similarities = compute_cosine_similarity(user_profile, X_combined)

# Rank job titles based on similarity scores
top_indices = similarities.argsort()[-5:][::-1]  # Top 5 recommended job titles

# Get recommended job titles
recommended_titles = enc.inverse_transform(y_encoded[top_indices])

# Simulate ground truth job titles (assuming you have it for evaluation)
ground_truth_titles = [df.iloc[index]['job_title'] for index in top_indices]

# Evaluate recommendation
precision, recall, f1 = evaluate_recommendation(ground_truth_titles, recommended_titles)

# Print evaluation metrics
print(f"Precision: {precision:.2f}")
print(f"Recall: {recall:.2f}")
print(f"F1-score: {f1:.2f}")

# Save all models as one
joblib.dump({
    'vectorizer': vectorizer,
    'svd': svd,
    'scaler': scaler,
    'encoder': enc
}, 'recommendation_model.joblib')

print("Model saved successfully.")

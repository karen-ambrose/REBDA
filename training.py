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
from sklearn.metrics import precision_recall_curve, auc, confusion_matrix
import matplotlib.pyplot as plt

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


# Simulated user input
user_skills = ".NET framework, .NET design"
user_scores = [0.5, 0.7, 0.6, 0.8, 0.4]  # Assuming O, C, E, A, N scores
user_eq_score = 87  # Assuming eq_score

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
top_index = similarities.argmax()  # Index of the top recommended job title
recommended_title = enc.inverse_transform(np.array([y_encoded[top_index]]))

print("\nRecommended Job Title for User:")
print("- " + recommended_title[0])  # Print the first recommended job title

# Rank top 5 job titles
top_indices = similarities.argsort()[-5:][::-1]  # Top 5 recommended job titles
recommended_titles = enc.inverse_transform(y_encoded[top_indices])

# Simulate ground truth job titles (assuming you have it for evaluation)
ground_truth_titles = [df.iloc[index]['job_title'] for index in top_indices]


# Evaluate recommendation
def evaluate_recommendation(ground_truth_titles, recommended_titles):
    num_recommended = len(recommended_titles)
    num_ground_truth = len(ground_truth_titles)

    if num_recommended == 0:
        precision = 0.0
    else:
        correct_recommendations = set(ground_truth_titles).intersection(set(recommended_titles))
        precision = len(correct_recommendations) / num_recommended

    recall = len(correct_recommendations) / num_ground_truth if num_ground_truth > 0 else 0.0

    if precision + recall > 0:
        f1 = 2 * (precision * recall) / (precision + recall)
    else:
        f1 = 0.0

    return precision, recall, f1


precision, recall, f1 = evaluate_recommendation(ground_truth_titles, recommended_titles)

# Print evaluation metrics
print(f"Precision: {precision:.2f}")
print(f"Recall: {recall:.2f}")
print(f"F1-score: {f1:.2f}")

# Visualization (example of a bar chart)
plt.figure(figsize=(10, 6))
plt.bar(recommended_titles, similarities[top_indices], color='blue')
plt.xlabel('Job Titles')
plt.ylabel('Cosine Similarity Score')
plt.title('Top Recommended Job Titles and Similarity Scores')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# Visualization - Bar chart for top recommended job titles and similarity scores
plt.figure(figsize=(12, 8))
plt.barh(recommended_titles[::-1], similarities[top_indices][::-1], color='skyblue')
plt.xlabel('Cosine Similarity Score')
plt.title('Top Recommended Job Titles and Similarity Scores')
plt.gca().invert_yaxis()  # Invert y-axis to show highest similarity at the top
plt.show()

# Calculate precision-recall curve
ground_truth_labels = [1 if title in ground_truth_titles else 0 for title in recommended_titles]
precision, recall, _ = precision_recall_curve(ground_truth_labels, similarities[top_indices])

# Calculate area under the curve (AUC) for precision-recall curve
pr_auc = auc(recall, precision)

# Visualization - Precision-Recall Curve
plt.figure(figsize=(8, 6))
plt.plot(recall, precision, color='blue', lw=2, label=f'Precision-Recall Curve (AUC = {pr_auc:.2f})')
plt.xlabel('Recall')
plt.ylabel('Precision')
plt.title('Precision-Recall Curve')
plt.legend(loc='lower left')
plt.grid(True)
plt.show()

# Calculate and print confusion matrix
threshold = 0.5  # Adjust threshold as needed
binary_predictions = (similarities[top_indices] >= threshold).astype(int)
conf_matrix = confusion_matrix(ground_truth_labels, binary_predictions, labels=[0, 1])

TN = conf_matrix[0, 0] if conf_matrix.shape[0] > 1 and conf_matrix.shape[1] > 1 else 0
FP = conf_matrix[0, 1] if conf_matrix.shape[0] > 1 and conf_matrix.shape[1] > 1 else 0
FN = conf_matrix[1, 0] if conf_matrix.shape[0] > 1 and conf_matrix.shape[1] > 1 else 0
TP = conf_matrix[1, 1] if conf_matrix.shape[0] > 1 and conf_matrix.shape[1] > 1 else 0

accuracy = (TP + TN) / (TP + TN + FP + FN)

print("Confusion Matrix:")
print(conf_matrix)
print(f"True Positives: {TP}")
print(f"False Positives: {FP}")
print(f"True Negatives: {TN}")
print(f"False Negatives: {FN}")
print(f"Accuracy: {accuracy:.2f}")

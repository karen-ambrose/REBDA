import pandas as pd
import joblib
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Step 1: Load the test data from test.csv
test_data = pd.read_csv('app_test.csv')

# Step 2: Prepare the features (X_test)
# Assuming 'test.csv' has the same structure as your original data (without the target variable)
# Adjust as per your actual column names
X_test = test_data[['Openness', 'Conscientousness', 'Extraversion', 'Agreeableness', 'Neuroticism', 'eq_score']]

# Step 3: Prepare the labels (y_test)
# Assuming 'test.csv' contains the true labels in a column named 'job_title'
# Adjust as per your actual column names and labels
y_test = test_data['job_title']

# Step 4: Load the trained model from the .joblib file
model = joblib.load('recommendation_model.joblib')

# Step 5: Make predictions on X_test
y_pred = model.predict(X_test)

# Step 6: Evaluate model performance
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='weighted')  # Use 'weighted' for multiclass precision
recall = recall_score(y_test, y_pred, average='weighted')  # Use 'weighted' for multiclass recall
f1 = f1_score(y_test, y_pred, average='weighted')  # Use 'weighted' for multiclass F1-score

# Print evaluation metrics
print(f"Accuracy: {accuracy:.2f}")
print(f"Precision: {precision:.2f}")
print(f"Recall: {recall:.2f}")
print(f"F1-score: {f1:.2f}")

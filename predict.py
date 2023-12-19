import sys
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
def predict_selected_model(model, new_data_scaled):
    return model.predict(new_data_scaled)

if __name__ == "__main__":
    if len(sys.argv) != 7:
        print("Usage: python predict.py <Gender> <Hemoglobin> <MCH> <MCHC> <MCV> <Model>")
        sys.exit(1)

    input_gender, hemoglobin, mch, mchc, mcv, selected_model = sys.argv[1:]
    # print("Received arguments:", sys.argv[1:])

    df = pd.read_csv(r'C:\Users\SAI\Documents\hematology\anemia data from Kaggle.csv', delimiter=',')

    if 'Result' in df.columns:
        X = df[['Gender', 'Hemoglobin', 'MCH', 'MCHC', 'MCV']]
        y = df['Result']
        input_gender_numeric = 1 if input_gender.lower() == 'male' else 0
        X.loc[:, 'Gender'] = input_gender_numeric


        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # Choose the selected model
        if selected_model == 'gnb':
            model = GaussianNB()
        elif selected_model == 'rf':
            model = RandomForestClassifier()
        elif selected_model == 'lr':
            model = LogisticRegression()
        elif selected_model == 'dt':
            model = DecisionTreeClassifier()
        elif selected_model == 'knn':
            model = KNeighborsClassifier()
        elif selected_model =='svm':
            model = SVC()
        else:
            print("Invalid model selection.")
            sys.exit(1)
        model.fit(X_scaled, y)
        new_data = pd.DataFrame({
            'Gender': [int(input_gender.lower() == 'male')],
            'Hemoglobin': [float(hemoglobin)],
            'MCH': [float(mch)],
            'MCHC': [float(mchc)],
            'MCV': [float(mcv)]
        })

        new_data_scaled = scaler.transform(new_data)

        # Making predictions    
        prediction = predict_selected_model(model, new_data_scaled)
        # print(f"{selected_model} prediction:", prediction)
        if prediction == 1:
            print("anemic.")
        elif prediction == 0:
            print("non-anemic.")

    else:
        print("The 'Result' column is not present in the dataset.")

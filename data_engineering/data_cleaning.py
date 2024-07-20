import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

class DataCleaning:
    def __init__(self, df):
        self.df = df

    def count_nulls(self):
        null_counts = self.df.isnull().sum()
        return null_counts

    def plot_nulls(self):
        null_counts = self.count_nulls()

        plt.figure(figsize=(10, 6))
        sns.barplot(x=null_counts.index, y=null_counts.values)
        plt.title('Numero Di Valori Null Per Colonna')
        plt.ylabel('Numero Di Valori Null')
        plt.xlabel('Nome Colonne')
        plt.xticks(rotation=45)

        plt.subplots_adjust(bottom=0.2)
        plt.show()

    def plot_null_distribution(self):
        plt.figure(figsize=(10, 6))
        sns.heatmap(self.df.isnull(), cbar=False, cmap='viridis')
        plt.title('Distribuzione dei Valori Nulli')
        plt.subplots_adjust(bottom=0.2)
        plt.xticks(rotation=45)
        plt.ylabel('Righe Con Valori NULL')
        plt.xlabel('Nome Colonne')
        plt.show()

    def drop_nulls(self):
        self.df = self.df.dropna()
        return self.df

    def save_cleaned_data(self, file_path):
        self.df.to_csv(file_path, index=False)
    
def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))

    file_path = os.path.join(current_dir, '..', 'dataset', 'netflix_titles.csv')

    if os.path.exists(file_path):
        print(f"File found at: {file_path}")
    else:
        print(f"File not found at: {file_path}")

    df = pd.read_csv(file_path)

    cleaner = DataCleaning(df)

    null_counts = cleaner.count_nulls()
    print("Null values per column:")
    print(null_counts)

    cleaner.plot_nulls()
    cleaner.plot_null_distribution()

    df = cleaner.drop_nulls()
    cleaner.save_cleaned_data(os.path.join(current_dir, '..', 'dataset', 'cleaned_netflix_titles.csv'))

if __name__ == '__main__':
    main()
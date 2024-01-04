import json
import os

from azure.identity import DefaultAzureCredential, get_bearer_token_provider
import openai
import dotenv

dotenv.load_dotenv()

# Set up OpenAI client
AZURE_OPENAI_SERVICE = os.getenv("AZURE_OPENAI_SERVICE")
AZURE_OPENAI_EMBEDDING_DEPLOYMENT = os.getenv("AZURE_OPENAI_EMBEDDING_DEPLOYMENT")
azure_credential = DefaultAzureCredential()
token_provider = get_bearer_token_provider(azure_credential, "https://cognitiveservices.azure.com/.default")
openai_client = openai.AzureOpenAI(
    api_version="2023-07-01-preview",
    azure_endpoint=f"https://{AZURE_OPENAI_SERVICE}.openai.azure.com",
    azure_ad_token_provider=token_provider,
)

# Load in words from existing word2vec file
input_words_filename = "data/word2vec_1000.json"
with open(input_words_filename, "r") as f:
    input_word_vectors = json.load(f)
    words = list(input_word_vectors.keys())

# Calculate embeddings using OpenAI in a batch (all words at once)
word_vectors = {}
embeddings_response = openai_client.embeddings.create(model=AZURE_OPENAI_EMBEDDING_DEPLOYMENT, input=words)
for word, embedding_object in zip(words, embeddings_response.data):
    word_vectors[word] = embedding_object.embedding

# Write to file
with open("openai_word_vectors.json", "w") as f:
    json.dump(word_vectors, f, indent=4)
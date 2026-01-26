from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
import os
import json

# ✅ Load environment variables
load_dotenv(".env")
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("❌ OPENAI_API_KEY not found in .env file")
print(f"🔑 Loaded API key: {api_key[:8]}...✅")

# ✅ Load and wrap knowledge base
with open("haulsmart_knowledge_base_turbo.json", "r") as f:
    data = json.load(f)

docs = [Document(page_content=json.dumps(data), metadata={"source": "HaulSmart Europe"})]
embeddings = OpenAIEmbeddings(api_key=api_key)
vectorstore = FAISS.from_documents(docs, embeddings)

# ✅ Setup QA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(api_key=api_key),
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# ✅ Setup FastAPI app
app = FastAPI()

# ✅ CORS settings — All frontend domains listed here
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://haulsmart-europe.com",
        "https://www.haulsmart-europe.com",
        "https://haulsmarteuro.vercel.app",
        "https://eurofreight.exchange",
        "https://globalfreight.exchange"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Request schema
class ChatRequest(BaseModel):
    message: str

# ✅ POST endpoint
@app.post("/chat")
async def chat(req: ChatRequest):
    response = qa_chain.run(req.message)
    return {"response": response}

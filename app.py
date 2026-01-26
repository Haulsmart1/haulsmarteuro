from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import json

# ✅ LangChain Imports (correct for v1.2.7+)
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_community.chains import RetrievalQA  # ✅ CORRECTED import!

# ✅ Load environment variables
load_dotenv(dotenv_path=".env")
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise ValueError("❌ OPENAI_API_KEY not found in .env file")

print(f"🔑 Loaded API key: {api_key[:8]}...✅")

# ✅ Load knowledge base
with open("haulsmart_knowledge_base_turbo.json", "r") as f:
    data = json.load(f)

docs = [Document(page_content=json.dumps(data), metadata={"source": "HaulSmart Europe"})]

# ✅ Embeddings and vector DB
embeddings = OpenAIEmbeddings(api_key=api_key)
vectorstore = FAISS.from_documents(docs, embeddings)

# ✅ QA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(api_key=api_key),
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# ✅ FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Or your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(req: ChatRequest):
    response = qa_chain.run(req.message)
    return {"response": response}

app.mount("/static", StaticFiles(directory=".", html=True), name="static")

@app.get("/")
async def serve_home():
    return FileResponse("index.html")

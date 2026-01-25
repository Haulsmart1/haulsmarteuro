from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import json

from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA

# ✅ Load .env file
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# ✅ Debug: show part of the key
print(f"🔑 Loaded API key: {api_key[:10]}..." if api_key else "❌ OPENAI_API_KEY not found.")

# ✅ Fail early if key not set
if not api_key:
    raise ValueError("❌ OPENAI_API_KEY not found in environment variables")

# ✅ Load JSON knowledge base
with open("haulsmart_knowledge_base_turbo.json", "r") as f:
    data = json.load(f)

docs = [Document(page_content=json.dumps(data), metadata={"source": "HaulSmart Europe"})]

# ✅ Create vector store
embeddings = OpenAIEmbeddings(api_key=api_key)
vectorstore = FAISS.from_documents(docs, embeddings)

# ✅ Create retrieval QA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(api_key=api_key),
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

# ✅ FastAPI app
app = FastAPI()

# ✅ CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to ["https://your-site.com"] in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Input schema
class ChatRequest(BaseModel):
    message: str

# ✅ Chat endpoint
@app.post("/chat")
async def chat(req: ChatRequest):
    response = qa_chain.run(req.message)
    return {"response": response}

# ✅ Serve static frontend (optional)
app.mount("/static", StaticFiles(directory=".", html=True), name="static")

@app.get("/")
async def serve_home():
    return FileResponse("index.html")


# ✅ Main entry for Render/local dev
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))

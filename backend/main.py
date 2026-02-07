from fastapi import FastAPI, Body, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from lib.pet_service import update_pet_growth
from lib.db import get_db_connection
import datetime

app = FastAPI()

# 1. 跨域配置：确保前端 3000 端口通信无阻
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. 定义请求数据模型 (明文传输)
class MessageRequest(BaseModel):
    rid: str      # 房间ID
    sender: str   # 发送者
    content: str  # 消息内容（明文）

# --- API 路由 ---

@app.get("/api/pet/{rid}")
async def get_pet(rid: str):
    """获取宠物当前状态"""
    try:
        return update_pet_growth(rid, xp_gain=0)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取宠物数据失败: {str(e)}")

@app.get("/api/chat/history/{rid}")
async def get_chat_history(rid: str):
    """获取指定房间的明文聊天记录"""
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        # 注意：我们将数据库字段 content 映射为前端期待的 text 字段
        sql = """
            SELECT 
                id, 
                'message' as type, 
                content as text, 
                created_at as createdAt 
            FROM chat_messages 
            WHERE relationship_id = %s 
            ORDER BY created_at ASC
        """
        cursor.execute(sql, (rid,))
        history = cursor.fetchall()
        
        # 格式化时间，防止 JSON 报错
        for item in history:
            if isinstance(item['createdAt'], datetime.datetime):
                item['createdAt'] = item['createdAt'].strftime("%Y-%m-%d %H:%M:%S")
                
        return history
    except Exception as e:
        print(f"❌ 读取历史失败: {e}")
        raise HTTPException(status_code=500, detail="无法读取聊天历史记录")
    finally:
        cursor.close()
        conn.close()

@app.post("/api/chat/send")
async def send_message(data: MessageRequest):
    """接收明文消息，存入数据库并触发宠物成长"""
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # 存入数据库
        sql = "INSERT INTO chat_messages (relationship_id, sender_id, content) VALUES (%s, %s, %s)"
        cursor.execute(sql, (data.rid, data.sender, data.content))
        conn.commit()
        
        # 联动：消息发送成功后，宠物增加 5 点经验 (XP)
        new_pet_status = update_pet_growth(data.rid, xp_gain=5)
        
        return {
            "status": "success",
            "message": "已发送",
            "pet": new_pet_status
        }
    except Exception as e:
        print(f"❌ 发送失败: {e}")
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"数据库写入失败: {str(e)}")
    finally:
        cursor.close()
        conn.close()

@app.post("/api/pet/{rid}/feed")
async def feed_pet(rid: str):
    """手动喂食：经验 +20，消耗 1 零食"""
    try:
        return update_pet_growth(rid, xp_gain=20, use_snack=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # 确保运行在 8000 端口
    uvicorn.run(app, host="0.0.0.0", port=8000)
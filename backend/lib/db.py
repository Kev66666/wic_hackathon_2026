import mysql.connector
from mysql.connector import pooling
import time

# 配置数据库连接池
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "mcwics", # 务必替换为你的真实密码
    "database": "wic_pet_chat",
    # 关键修改 1: 强制使用 utf8mb4，确保能存储复杂的加密 Base64 字符串
    "charset": "utf8mb4", 
    "collation": "utf8mb4_unicode_ci"
}

try:
    # 关键修改 2: 增加 pool_reset_session，确保每次从池子拿出的连接都是干净的
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="pet_pool",
        pool_size=10, # 稍微增加连接池大小，应对前端的高频轮询
        pool_reset_session=True, 
        **db_config
    )
except Exception as e:
    print(f"❌ 数据库连接池初始化失败: {e}")
    # Hackathon 期间如果数据库没开，这里会直接崩溃，建议增加提示
    connection_pool = None

def get_db_connection():
    """获取数据库连接，增加简单的重试逻辑"""
    if connection_pool is None:
        raise Exception("数据库连接池未初始化，请检查 MySQL 服务是否启动")
    
    try:
        return connection_pool.get_connection()
    except Exception as e:
        # 如果连接池满了或挂了，尝试等待一下再试
        print(f"⚠️ 连接池获取失败，尝试重连: {e}")
        time.sleep(0.5)
        return connection_pool.get_connection()
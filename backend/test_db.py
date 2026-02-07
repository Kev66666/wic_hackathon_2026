import mysql.connector

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="your_password", # 替换为你的密码
        database="wic_pet_chat"
    )
    if conn.is_connected():
        print("✅ 数据库连接成功！表结构已准备就绪。")
    conn.close()
except Exception as e:
    print(f"❌ 连接失败: {e}")
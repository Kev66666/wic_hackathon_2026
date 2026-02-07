from .db import get_db_connection

def update_pet_growth(relationship_id, xp_gain=0, use_snack=False):
    """
    更新宠物状态的通用函数
    :param xp_gain: 增加的经验值
    :param use_snack: 是否是在执行喂食操作
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # 1. 获取当前状态（如果没有则初始化）
        cursor.execute("SELECT * FROM pet_stats WHERE relationship_id = %s", (relationship_id,))
        pet = cursor.fetchone()
        
        if not pet:
            cursor.execute("INSERT INTO pet_stats (relationship_id) VALUES (%s)", (relationship_id,))
            pet = {"xp": 0, "level": 1, "snacks": 5, "size_multiplier": 1.0, "skin": "default"}

        # 2. 计算新数值
        new_xp = pet['xp'] + xp_gain
        new_snacks = pet['snacks'] - 1 if use_snack else pet['snacks']
        
        # 升级逻辑：每 100 XP 一级
        new_level = (new_xp // 100) + 1
        
        # 体型逻辑：基础 1.0 + 等级加成 + 额外经验微调
        new_size = 1.0 + (new_level - 1) * 0.1 + (new_xp % 100) / 500
        
        # 进化逻辑：5 级换皮肤
        new_skin = "evolved" if new_level >= 5 else "default"

        # 3. 写回数据库
        sql = """
            UPDATE pet_stats 
            SET xp = %s, level = %s, snacks = %s, size_multiplier = %s, skin = %s 
            WHERE relationship_id = %s
        """
        cursor.execute(sql, (new_xp, new_level, new_snacks, new_size, new_skin, relationship_id))
        conn.commit()
        
        return {"xp": new_xp, "level": new_level, "snacks": new_snacks, "size_multiplier": new_size, "skin": new_skin}
    finally:
        cursor.close()
        conn.close()
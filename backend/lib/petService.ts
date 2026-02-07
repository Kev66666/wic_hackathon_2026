/**
 * 宠物状态接口定义
 */
export interface PetStatus {
  xp: number;          // 当前经验值
  level: number;       // 等级
  snacks: number;      // 零食库存
  sizeMultiplier: number; // 缩放比例（变大）
  skin: string;        // 皮肤 ID
}

// 初始状态
let petState: PetStatus = {
  xp: 0,
  level: 1,
  snacks: 5,
  sizeMultiplier: 1.0,
  skin: 'default'
};

/**
 * 【关键：给其他程序员的接口】
 * 当用户发送消息时，调用此函数增加宠物进度
 * @param messageLength 消息长度，可以根据长度奖励不同经验
 */
export const onUserMessageSent = (messageLength: number) => {
  // 逻辑：每发一条消息增加 5 点 XP，每 10 条消息奖励 1 个零食
  petState.xp += 5;
  
  if (petState.xp % 50 === 0) {
    petState.snacks += 1;
    console.log("获得奖励：零食 +1");
  }

  checkLevelUp();
  return petState;
};

/**
 * 喂食逻辑
 * 喂食会显著增加 XP，并触发体型变化
 */
export const feedPet = () => {
  if (petState.snacks > 0) {
    petState.snacks -= 1;
    petState.xp += 20;
    
    // 喂食后的反馈：宠物微量变大
    petState.sizeMultiplier += 0.05;
    
    checkLevelUp();
    return { success: true, state: petState };
  }
  return { success: false, message: "零食不够了" };
};

/**
 * 等级与进化检查
 */
const checkLevelUp = () => {
  const nextLevelXp = petState.level * 100;
  
  if (petState.xp >= nextLevelXp) {
    petState.level += 1;
    
    // 进化逻辑：达到 5 级改变皮肤
    if (petState.level === 5) {
      petState.skin = 'mega-beast';
      petState.sizeMultiplier += 0.5; // 进化时显著变大
    }
    
    console.log(`升级了！当前等级: ${petState.level}`);
  }
};

export const getPetState = () => petState;
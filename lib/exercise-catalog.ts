import { CARDIO_GUIDES } from "./cardio-catalog.ts";
// Catalog v2. Original IDs are intentionally stable for existing training history.
export interface ExerciseGuide {
 id: string; name: string; group: "胸部" | "肩部" | "背部" | "腿部" | "手臂" | "其他";
 slug: string; englishName: string; equipment: string; target: string;
 steps: string[]; sourceUrl: string;
}
export const CATALOG_VERSION = 2;
export const EXERCISE_CATALOG: ExerciseGuide[] = [
  {
    "id": "exercise-0-0",
    "name": "平板杠铃卧推",
    "group": "胸部",
    "slug": "bench-press",
    "englishName": "Bench Press",
    "equipment": "杠铃",
    "target": "胸肌",
    "steps": [
      "肩胛后收下沉，双脚踩稳。",
      "杠铃受控下降到胸部附近，手腕保持中立。",
      "沿稳定轨迹推起，不借胸部反弹。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/bench-press/"
  },
  {
    "id": "exercise-0-1",
    "name": "上斜杠铃卧推",
    "group": "胸部",
    "slug": "incline-bench-press",
    "englishName": "Incline Bench Press",
    "equipment": "杠铃",
    "target": "胸肌",
    "steps": [
      "上斜凳设为约30–45度，肩胛贴稳靠垫。",
      "杠铃下降至上胸附近，前臂大致垂直。",
      "向上推起，避免耸肩和腰部过度反弓。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/incline-bench-press/"
  },
  {
    "id": "exercise-0-2",
    "name": "哑铃卧推",
    "group": "胸部",
    "slug": "dumbbell-bench-press",
    "englishName": "Dumbbell Bench Press",
    "equipment": "哑铃",
    "target": "胸肌",
    "steps": [
      "仰卧平凳，双脚踩稳，哑铃位于胸部两侧。",
      "控制下放至舒适幅度，手腕与前臂对齐。",
      "双侧同时推起，避免顶端碰撞哑铃。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/dumbbell-bench-press/"
  },
  {
    "id": "exercise-0-3",
    "name": "上斜哑铃卧推",
    "group": "胸部",
    "slug": "incline-dumbbell-press",
    "englishName": "Incline Dumbbell Press",
    "equipment": "哑铃",
    "target": "胸肌",
    "steps": [
      "靠稳上斜凳，哑铃位于上胸两侧。",
      "肘部沿身体斜下方缓慢下降。",
      "胸部发力推起，保持双侧同步。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/incline-dumbbell-press/"
  },
  {
    "id": "exercise-0-4",
    "name": "双杠臂屈伸",
    "group": "胸部",
    "slug": "chest-dip",
    "englishName": "Chest Dip",
    "equipment": "自重",
    "target": "胸肌",
    "steps": [
      "双手撑稳双杠，身体略前倾。",
      "屈肘受控下降到肩部舒适范围。",
      "保持前倾推回，避免快速下坠或耸肩。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/chest-dip/"
  },
  {
    "id": "exercise-0-5",
    "name": "绳索夹胸",
    "group": "胸部",
    "slug": "cable-fly",
    "englishName": "Cable Fly",
    "equipment": "绳索",
    "target": "胸肌",
    "steps": [
      "双脚前后站稳，肘部保留轻微弯曲。",
      "沿弧线将双手合拢到胸前。",
      "受控展开，不让肩膀过度向后拉伸。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/cable-fly/"
  },
  {
    "id": "exercise-decline-bench-press",
    "name": "下斜杠铃卧推",
    "group": "胸部",
    "slug": "decline-bench-press",
    "englishName": "Decline Bench Press",
    "equipment": "杠铃",
    "target": "胸肌",
    "steps": [
      "固定双腿并稳定躺在下斜凳上。",
      "杠铃受控下降至下胸附近。",
      "推回起始位，训练前确认安全挡杆或保护者。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/decline-bench-press/"
  },
  {
    "id": "exercise-decline-dumbbell-press",
    "name": "下斜哑铃卧推",
    "group": "胸部",
    "slug": "decline-dumbbell-press",
    "englishName": "Decline Dumbbell Press",
    "equipment": "哑铃",
    "target": "胸肌",
    "steps": [
      "固定身体，哑铃稳定置于胸部两侧。",
      "双肘缓慢下放至舒适幅度。",
      "双侧同步推起，避免扭转手腕。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/decline-dumbbell-press/"
  },
  {
    "id": "exercise-machine-chest-press",
    "name": "器械推胸",
    "group": "胸部",
    "slug": "machine-chest-press",
    "englishName": "Machine Chest Press",
    "equipment": "器械",
    "target": "胸肌",
    "steps": [
      "调节座椅，使把手与胸部大致同高。",
      "背部贴垫，向前推开把手。",
      "缓慢返回，避免配重片撞击。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/machine-chest-press/"
  },
  {
    "id": "exercise-pec-deck",
    "name": "蝴蝶机夹胸",
    "group": "胸部",
    "slug": "pec-deck",
    "englishName": "Pec Deck",
    "equipment": "器械",
    "target": "胸肌",
    "steps": [
      "调节座椅，保持手肘与肩大致同高。",
      "胸部发力将两臂合拢。",
      "控制回程，肩部不向前顶出。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/pec-deck/"
  },
  {
    "id": "exercise-dumbbell-fly",
    "name": "哑铃飞鸟",
    "group": "胸部",
    "slug": "dumbbell-fly",
    "englishName": "Dumbbell Fly",
    "equipment": "哑铃",
    "target": "胸肌",
    "steps": [
      "仰卧平凳，哑铃位于胸上方，肘微屈。",
      "沿弧线展开至肩部舒适幅度。",
      "保持肘角基本不变，合拢双臂。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/dumbbell-fly/"
  },
  {
    "id": "exercise-smith-machine-bench-press",
    "name": "史密斯卧推",
    "group": "胸部",
    "slug": "smith-machine-bench-press",
    "englishName": "Smith Machine Bench Press",
    "equipment": "器械",
    "target": "胸肌",
    "steps": [
      "调整凳位，使杠铃下降时位于胸部上方。",
      "肩胛贴稳，受控下降。",
      "推起并保持手腕中立，先设好安全限位。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/smith-machine-bench-press/"
  },
  {
    "id": "exercise-push-up",
    "name": "标准俯卧撑",
    "group": "胸部",
    "slug": "push-up",
    "englishName": "Push-up",
    "equipment": "自重",
    "target": "胸肌",
    "steps": [
      "双手略宽于肩，头、躯干和腿保持一线。",
      "屈肘下降，胸部接近地面。",
      "整体推起，避免塌腰和头部前探。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/push-up/"
  },
  {
    "id": "exercise-incline-push-up",
    "name": "上斜俯卧撑",
    "group": "胸部",
    "slug": "incline-push-up",
    "englishName": "Incline Push-up",
    "equipment": "自重",
    "target": "胸肌",
    "steps": [
      "双手撑在稳定高台上，身体保持直线。",
      "屈肘让胸部靠近支撑面。",
      "推回起始位，不耸肩。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/incline-push-up/"
  },
  {
    "id": "exercise-knee-push-up",
    "name": "跪姿俯卧撑",
    "group": "胸部",
    "slug": "knee-push-up",
    "englishName": "Knee Push-up",
    "equipment": "自重",
    "target": "胸肌",
    "steps": [
      "双膝支撑，肩到膝保持一线。",
      "核心收紧，屈肘下降。",
      "双手推地返回，避免只抬上身。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/knee-push-up/"
  },
  {
    "id": "exercise-decline-push-up",
    "name": "下斜俯卧撑",
    "group": "胸部",
    "slug": "decline-push-up",
    "englishName": "Decline Push-up",
    "equipment": "自重",
    "target": "胸肌",
    "steps": [
      "双脚放在稳定高台，双手撑地。",
      "核心收紧，身体整体下降。",
      "平稳推起，避免腰部下沉。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/decline-push-up/"
  },
  {
    "id": "exercise-1-0",
    "name": "杠铃推肩",
    "group": "肩部",
    "slug": "overhead-press",
    "englishName": "Overhead Press",
    "equipment": "杠铃",
    "target": "三角肌",
    "steps": [
      "双脚站稳，杠铃置于上胸，核心收紧。",
      "杠铃贴近面部向上推，头部适当让位。",
      "顶端保持肋骨收住，缓慢回到上胸。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/overhead-press/"
  },
  {
    "id": "exercise-1-1",
    "name": "哑铃推肩",
    "group": "肩部",
    "slug": "seated-dumbbell-press",
    "englishName": "Dumbbell Seated Shoulder Press",
    "equipment": "哑铃",
    "target": "三角肌",
    "steps": [
      "坐稳靠凳，哑铃位于肩部两侧。",
      "向上推举，不让腰部过度反弓。",
      "缓慢下放至舒适幅度，双侧保持同步。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/seated-dumbbell-press/"
  },
  {
    "id": "exercise-1-2",
    "name": "阿诺德推举",
    "group": "肩部",
    "slug": "arnold-press",
    "englishName": "Arnold Press",
    "equipment": "哑铃",
    "target": "三角肌",
    "steps": [
      "坐稳，掌心朝向身体，哑铃位于脸前。",
      "向上推举的同时逐渐转为掌心向前。",
      "逆向旋转下放，动作过程保持平稳。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/arnold-press/"
  },
  {
    "id": "exercise-1-3",
    "name": "哑铃侧平举",
    "group": "肩部",
    "slug": "lateral-raise",
    "englishName": "Lateral Raise",
    "equipment": "哑铃",
    "target": "三角肌",
    "steps": [
      "站稳并轻屈肘，哑铃置于身体两侧。",
      "沿身体侧前方抬臂至接近肩高。",
      "受控下降，避免借躯干摆动或耸肩。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/lateral-raise/"
  },
  {
    "id": "exercise-1-4",
    "name": "绳索侧平举",
    "group": "肩部",
    "slug": "cable-lateral-raise",
    "englishName": "Cable Lateral Raise",
    "equipment": "绳索",
    "target": "三角肌",
    "steps": [
      "身体侧对低位滑轮，保持核心稳定。",
      "肘部微屈，手臂向侧前方抬起。",
      "慢慢回程，不让配重牵动身体。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/cable-lateral-raise/"
  },
  {
    "id": "exercise-1-5",
    "name": "反向飞鸟",
    "group": "肩部",
    "slug": "rear-delt-fly",
    "englishName": "Rear Delt Fly",
    "equipment": "哑铃",
    "target": "三角肌后束",
    "steps": [
      "髋部后移俯身，背部保持自然中立。",
      "双臂向两侧展开，肘部轻微弯曲。",
      "缓慢合拢，避免甩动腰背。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/rear-delt-fly/"
  },
  {
    "id": "exercise-front-raise",
    "name": "哑铃前平举",
    "group": "肩部",
    "slug": "front-raise",
    "englishName": "Front Raise",
    "equipment": "哑铃",
    "target": "三角肌",
    "steps": [
      "站稳，哑铃置于大腿前方，肘微屈。",
      "手臂向前抬至接近肩高。",
      "受控下放，不用后仰借力。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/front-raise/"
  },
  {
    "id": "exercise-reverse-pec-deck",
    "name": "反向蝴蝶机",
    "group": "肩部",
    "slug": "reverse-pec-deck",
    "englishName": "Reverse Pec Deck",
    "equipment": "器械",
    "target": "三角肌后束",
    "steps": [
      "面向靠垫坐稳，把手调至肩部附近高度。",
      "双臂向两侧后方展开。",
      "缓慢返回，避免耸肩和挺腰。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/reverse-pec-deck/"
  },
  {
    "id": "exercise-face-pull",
    "name": "绳索面拉",
    "group": "肩部",
    "slug": "face-pull",
    "englishName": "Face Pull",
    "equipment": "绳索",
    "target": "上背 / 斜方肌",
    "steps": [
      "滑轮调到面部附近，握住绳索两端。",
      "向面部拉动，肘部向两侧展开。",
      "肩胛平稳活动，受控伸臂回程。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/face-pull/"
  },
  {
    "id": "exercise-machine-shoulder-press",
    "name": "器械推肩",
    "group": "肩部",
    "slug": "machine-shoulder-press",
    "englishName": "Machine Shoulder Press",
    "equipment": "器械",
    "target": "三角肌",
    "steps": [
      "调节座椅，使把手位于肩部附近。",
      "背部贴稳靠垫，向上推举。",
      "缓慢下放，不锁死手肘或猛烈碰撞配重。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/machine-shoulder-press/"
  },
  {
    "id": "exercise-standing-dumbbell-press",
    "name": "站姿哑铃推肩",
    "group": "肩部",
    "slug": "standing-dumbbell-press",
    "englishName": "Standing Dumbbell Press",
    "equipment": "哑铃",
    "target": "三角肌",
    "steps": [
      "双脚站稳，哑铃置于肩部两侧。",
      "收紧腹部，双侧同时向上推。",
      "缓慢回程，不借助下肢弹动。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/standing-dumbbell-press/"
  },
  {
    "id": "exercise-push-press",
    "name": "借力推举",
    "group": "肩部",
    "slug": "push-press",
    "englishName": "Push Press",
    "equipment": "杠铃",
    "target": "三角肌",
    "steps": [
      "杠铃置于上胸，躯干保持直立。",
      "浅屈膝后蹬地，将力量传递到杠铃。",
      "手臂完成推举，受控回到前架位。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/push-press/"
  },
  {
    "id": "exercise-machine-lateral-raise",
    "name": "器械侧平举",
    "group": "肩部",
    "slug": "machine-lateral-raise",
    "englishName": "Machine Lateral Raise",
    "equipment": "器械",
    "target": "三角肌",
    "steps": [
      "调节座椅，肘臂稳定贴合支撑垫。",
      "上臂向外抬起至舒适高度。",
      "慢慢返回，保持肩颈放松。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/machine-lateral-raise/"
  },
  {
    "id": "exercise-cable-front-raise",
    "name": "绳索前平举",
    "group": "肩部",
    "slug": "cable-front-raise",
    "englishName": "Cable Front Raise",
    "equipment": "绳索",
    "target": "三角肌",
    "steps": [
      "背对低位滑轮，站稳并收紧核心。",
      "双臂或单臂向前抬至肩高附近。",
      "受控下放，避免后仰借力。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/cable-front-raise/"
  },
  {
    "id": "exercise-plate-front-raise",
    "name": "杠铃片前平举",
    "group": "肩部",
    "slug": "plate-front-raise",
    "englishName": "Plate Front Raise",
    "equipment": "杠铃片",
    "target": "三角肌",
    "steps": [
      "双手稳握杠铃片，置于大腿前方。",
      "保持肘微屈，将杠铃片向前抬起。",
      "下降至起始位，肩颈不耸起。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/plate-front-raise/"
  },
  {
    "id": "exercise-cable-rear-delt-fly",
    "name": "绳索反向飞鸟",
    "group": "肩部",
    "slug": "cable-rear-delt-fly",
    "englishName": "Cable Rear Delt Fly",
    "equipment": "绳索",
    "target": "三角肌后束",
    "steps": [
      "双手交叉握住对侧绳索，稳定站姿。",
      "双臂向两侧展开，肘角基本保持不变。",
      "缓慢返回，不借用躯干晃动。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/cable-rear-delt-fly/"
  },
  {
    "id": "exercise-2-0",
    "name": "引体向上",
    "group": "背部",
    "slug": "pull-up",
    "englishName": "Pull-up",
    "equipment": "自重",
    "target": "背阔肌",
    "steps": [
      "正握单杠，肩部稳定，核心收紧。",
      "以背部带动身体上拉，避免踢腿摆动。",
      "受控下放，保留肩部主动控制。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/pull-up/"
  },
  {
    "id": "exercise-2-1",
    "name": "高位下拉",
    "group": "背部",
    "slug": "lat-pulldown",
    "englishName": "Lat Pulldown",
    "equipment": "绳索",
    "target": "背阔肌",
    "steps": [
      "坐稳并固定大腿，正握横杆。",
      "胸部挺起，将横杆拉向上胸。",
      "慢慢伸臂回程，避免大幅后仰。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/lat-pulldown/"
  },
  {
    "id": "exercise-2-2",
    "name": "杠铃划船",
    "group": "背部",
    "slug": "barbell-row",
    "englishName": "Barbell Row",
    "equipment": "杠铃",
    "target": "背部",
    "steps": [
      "髋部后移俯身，背部自然中立。",
      "杠铃拉向腹部，手肘沿身体两侧移动。",
      "受控下放，躯干角度基本保持稳定。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/barbell-row/"
  },
  {
    "id": "exercise-2-3",
    "name": "坐姿划船",
    "group": "背部",
    "slug": "seated-row",
    "englishName": "Seated Cable Row",
    "equipment": "绳索",
    "target": "背部",
    "steps": [
      "双脚撑稳，坐骨坐稳，背部保持中立。",
      "把手拉向腹部，肘部向后移动。",
      "控制伸臂回程，不前后猛烈摇摆。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/seated-row/"
  },
  {
    "id": "exercise-2-4",
    "name": "单臂哑铃划船",
    "group": "背部",
    "slug": "one-arm-dumbbell-row",
    "englishName": "One-Arm Dumbbell Row",
    "equipment": "哑铃",
    "target": "背部",
    "steps": [
      "一手一膝支撑平凳，背部保持稳定。",
      "哑铃拉向髋部附近，肘贴近身体。",
      "受控下降，不让躯干旋转借力。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/one-arm-dumbbell-row/"
  },
  {
    "id": "exercise-t-bar-row",
    "name": "T杠划船",
    "group": "背部",
    "slug": "t-bar-row",
    "englishName": "T-Bar Row",
    "equipment": "器械",
    "target": "背部",
    "steps": [
      "站稳或贴稳支撑垫，背部保持中立。",
      "把手向腹部拉动，肘部后移。",
      "慢慢回程，不用腰部甩动重量。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/t-bar-row/"
  },
  {
    "id": "exercise-chest-supported-row",
    "name": "胸托划船",
    "group": "背部",
    "slug": "chest-supported-row",
    "englishName": "Chest Supported Row",
    "equipment": "器械",
    "target": "背部",
    "steps": [
      "胸部贴稳支撑垫，双脚固定。",
      "向后拉动把手，肩胛自然收拢。",
      "缓慢伸臂返回，胸部不离开支撑。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/chest-supported-row/"
  },
  {
    "id": "exercise-machine-row",
    "name": "器械划船",
    "group": "背部",
    "slug": "machine-row",
    "englishName": "Machine Row",
    "equipment": "器械",
    "target": "背部",
    "steps": [
      "调节座椅并贴稳胸垫。",
      "向后拉动把手，保持肩颈放松。",
      "受控回到起始位，不撞击配重片。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/machine-row/"
  },
  {
    "id": "exercise-close-grip-lat-pulldown",
    "name": "窄握高位下拉",
    "group": "背部",
    "slug": "close-grip-lat-pulldown",
    "englishName": "Close-Grip Lat Pulldown",
    "equipment": "绳索",
    "target": "背阔肌",
    "steps": [
      "坐稳，双手窄握或对握把手。",
      "手肘向身体两侧下方移动，把手拉向上胸。",
      "控制回程，不用后仰带动重量。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/close-grip-lat-pulldown/"
  },
  {
    "id": "exercise-straight-arm-pulldown",
    "name": "直臂下压",
    "group": "背部",
    "slug": "straight-arm-pulldown",
    "englishName": "Straight-Arm Pulldown",
    "equipment": "绳索",
    "target": "背阔肌",
    "steps": [
      "面向高位滑轮，髋部轻微后移。",
      "保持肘微屈，将把手向大腿方向压下。",
      "慢慢抬臂返回，不改变躯干位置。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/straight-arm-pulldown/"
  },
  {
    "id": "exercise-assisted-pull-up",
    "name": "辅助引体向上",
    "group": "背部",
    "slug": "assisted-pull-up",
    "englishName": "Assisted Pull-up",
    "equipment": "器械",
    "target": "背阔肌",
    "steps": [
      "设置合适辅助重量，稳定放置膝盖或脚部。",
      "背部发力上拉，保持身体平稳。",
      "受控下降，注意机器的上下机安全。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/assisted-pull-up/"
  },
  {
    "id": "exercise-weighted-pull-up",
    "name": "负重引体向上",
    "group": "背部",
    "slug": "weighted-pull-up",
    "englishName": "Weighted Pull-up",
    "equipment": "自重",
    "target": "背阔肌",
    "steps": [
      "固定额外负重后握稳单杠。",
      "核心收紧，上拉时避免摆荡。",
      "控制回程，结束后先稳定移除负重。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/weighted-pull-up/"
  },
  {
    "id": "exercise-chin-up",
    "name": "反握引体向上",
    "group": "背部",
    "slug": "chin-up",
    "englishName": "Chin-up",
    "equipment": "自重",
    "target": "肱二头肌",
    "steps": [
      "掌心朝向自己握杠，肩部保持稳定。",
      "屈肘上拉，不用下肢摆动借力。",
      "缓慢下降，肩肘活动保持舒适。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/chin-up/"
  },
  {
    "id": "exercise-shrug",
    "name": "杠铃耸肩",
    "group": "背部",
    "slug": "shrug",
    "englishName": "Barbell Shrug",
    "equipment": "杠铃",
    "target": "上背 / 斜方肌",
    "steps": [
      "双手握杠站稳，手臂自然下垂。",
      "双肩向上抬起，不绕肩旋转。",
      "受控下降，头颈保持中立。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/shrug/"
  },
  {
    "id": "exercise-pendlay-row",
    "name": "潘德雷划船",
    "group": "背部",
    "slug": "pendlay-row",
    "englishName": "Pendlay Row",
    "equipment": "杠铃",
    "target": "背部",
    "steps": [
      "俯身接近水平，杠铃每次从地面开始。",
      "核心收紧，将杠铃拉向上腹。",
      "受控放回地面，避免腰背代偿。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/pendlay-row/"
  },
  {
    "id": "exercise-inverted-row",
    "name": "反向划船",
    "group": "背部",
    "slug": "inverted-row",
    "englishName": "Inverted Row",
    "equipment": "自重",
    "target": "背部",
    "steps": [
      "握稳固定横杆，身体保持直线。",
      "胸部向横杆靠近，肘部后移。",
      "控制下降，髋部不下沉。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/inverted-row/"
  },
  {
    "id": "exercise-single-arm-cable-row",
    "name": "单臂绳索划船",
    "group": "背部",
    "slug": "single-arm-cable-row",
    "englishName": "Single-Arm Cable Row",
    "equipment": "绳索",
    "target": "背部",
    "steps": [
      "面对滑轮站稳或坐稳，单手握把。",
      "把手拉向身体侧腰，躯干保持正直。",
      "缓慢伸臂回程，避免明显转体。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/single-arm-cable-row/"
  },
  {
    "id": "exercise-back-extension",
    "name": "背部伸展",
    "group": "背部",
    "slug": "back-extension",
    "englishName": "Back Extension",
    "equipment": "自重",
    "target": "竖脊肌",
    "steps": [
      "调整支撑垫至髋部附近，固定双脚。",
      "以髋为轴缓慢折叠身体。",
      "回到身体一线即可，不向后过度挺腰。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/back-extension/"
  },
  {
    "id": "exercise-3-0",
    "name": "杠铃深蹲",
    "group": "腿部",
    "slug": "squat",
    "englishName": "Squat",
    "equipment": "杠铃",
    "target": "股四头肌",
    "steps": [
      "杠铃稳定放在上背，双脚站稳并收紧核心。",
      "髋膝同时屈曲，膝盖沿脚尖方向移动。",
      "在可控深度蹲下后蹬地站起，避免膝盖内扣。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/squat/"
  },
  {
    "id": "exercise-3-1",
    "name": "腿举",
    "group": "腿部",
    "slug": "leg-press",
    "englishName": "Leg Press",
    "equipment": "器械",
    "target": "股四头肌",
    "steps": [
      "背部和骨盆贴稳靠垫，双脚平放平台。",
      "屈膝下降至骨盆不卷起的范围。",
      "推起平台，避免顶端猛烈锁膝。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/leg-press/"
  },
  {
    "id": "exercise-3-2",
    "name": "罗马尼亚硬拉",
    "group": "腿部",
    "slug": "romanian-deadlift",
    "englishName": "Romanian Deadlift",
    "equipment": "杠铃",
    "target": "腘绳肌",
    "steps": [
      "双膝微屈，杠铃贴近大腿。",
      "髋部向后推，沿腿部下放杠铃。",
      "感受腿后侧张力后伸髋站起，不弓腰。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/romanian-deadlift/"
  },
  {
    "id": "exercise-3-3",
    "name": "腿屈伸",
    "group": "腿部",
    "slug": "leg-extension",
    "englishName": "Leg Extension",
    "equipment": "器械",
    "target": "股四头肌",
    "steps": [
      "调整座椅使膝关节与机器转轴对齐。",
      "伸膝抬起滚垫，过程保持平稳。",
      "缓慢屈膝返回，不摆动上身。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/leg-extension/"
  },
  {
    "id": "exercise-3-4",
    "name": "腿弯举",
    "group": "腿部",
    "slug": "leg-curl",
    "englishName": "Leg Curl",
    "equipment": "器械",
    "target": "腘绳肌",
    "steps": [
      "调整机器转轴和脚踝滚垫，稳定躯干。",
      "屈膝将脚跟拉向臀部。",
      "控制回程，髋部不离开支撑面。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/leg-curl/"
  },
  {
    "id": "exercise-3-5",
    "name": "提踵",
    "group": "腿部",
    "slug": "standing-calf-raise",
    "englishName": "Standing Calf Raise",
    "equipment": "器械",
    "target": "小腿",
    "steps": [
      "站稳器械，脚前掌固定，足跟可控下降。",
      "踮起足跟，保持踝部稳定。",
      "慢慢落下，不用弹跳借力。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/standing-calf-raise/"
  },
  {
    "id": "exercise-3-6",
    "name": "传统硬拉",
    "group": "腿部",
    "slug": "deadlift",
    "englishName": "Deadlift",
    "equipment": "杠铃",
    "target": "臀部 / 腿后侧",
    "steps": [
      "杠铃位于脚掌中部上方，屈髋屈膝握杠。",
      "核心收紧，蹬地伸髋，杠铃贴近腿部。",
      "站直即可，屈髋屈膝受控还原。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/deadlift/"
  },
  {
    "id": "exercise-front-squat",
    "name": "杠铃前蹲",
    "group": "腿部",
    "slug": "front-squat",
    "englishName": "Front Squat",
    "equipment": "杠铃",
    "target": "股四头肌",
    "steps": [
      "杠铃稳定置于前肩，手肘向前抬。",
      "躯干尽量直立，髋膝同时屈曲。",
      "脚掌踩稳站起，保持前架位不塌落。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/front-squat/"
  },
  {
    "id": "exercise-hack-squat",
    "name": "哈克深蹲",
    "group": "腿部",
    "slug": "hack-squat",
    "englishName": "Hack Squat",
    "equipment": "器械",
    "target": "股四头肌",
    "steps": [
      "背肩贴稳器械，双脚平放平台。",
      "受控下降，膝盖沿脚尖方向移动。",
      "推起时全脚掌发力，避免锁膝冲击。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/hack-squat/"
  },
  {
    "id": "exercise-bulgarian-split-squat",
    "name": "保加利亚分腿蹲",
    "group": "腿部",
    "slug": "bulgarian-split-squat",
    "englishName": "Bulgarian Split Squat",
    "equipment": "哑铃",
    "target": "股四头肌",
    "steps": [
      "后脚搭在稳定凳面，前脚站稳。",
      "前腿屈膝屈髋下降，骨盆保持平稳。",
      "以前脚蹬地站起，左右分别完成。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/bulgarian-split-squat/"
  },
  {
    "id": "exercise-walking-lunge",
    "name": "哑铃行走弓步",
    "group": "腿部",
    "slug": "walking-lunge",
    "englishName": "Walking Lunge",
    "equipment": "哑铃",
    "target": "股四头肌",
    "steps": [
      "双手持哑铃，站直并收紧核心。",
      "向前跨步下蹲，前脚掌踩稳。",
      "蹬地向前换腿，不让膝盖明显内扣。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/walking-lunge/"
  },
  {
    "id": "exercise-step-up",
    "name": "哑铃登阶",
    "group": "腿部",
    "slug": "step-up",
    "englishName": "Step-Up",
    "equipment": "哑铃",
    "target": "股四头肌",
    "steps": [
      "选择稳固台阶，将一只脚完整踩上。",
      "上方腿发力站上台阶，骨盆保持水平。",
      "受控下台，避免后脚大幅蹬地借力。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/step-up/"
  },
  {
    "id": "exercise-seated-leg-curl",
    "name": "坐姿腿弯举",
    "group": "腿部",
    "slug": "seated-leg-curl",
    "englishName": "Seated Leg Curl",
    "equipment": "器械",
    "target": "腘绳肌",
    "steps": [
      "坐稳并固定大腿，调整脚踝滚垫。",
      "屈膝将滚垫拉向座椅下方。",
      "缓慢还原，不让臀部滑动。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/seated-leg-curl/"
  },
  {
    "id": "exercise-hip-thrust",
    "name": "杠铃臀推",
    "group": "腿部",
    "slug": "hip-thrust",
    "englishName": "Hip Thrust",
    "equipment": "杠铃",
    "target": "臀肌",
    "steps": [
      "上背靠稳平凳，杠铃放在髋部并加垫保护。",
      "双脚踩地伸髋，顶端让躯干与大腿接近一线。",
      "收住肋骨后下降，不靠腰部过伸抬高。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/hip-thrust/"
  },
  {
    "id": "exercise-glute-bridge",
    "name": "自重臀桥",
    "group": "腿部",
    "slug": "glute-bridge",
    "englishName": "Glute Bridge",
    "equipment": "自重",
    "target": "臀肌",
    "steps": [
      "仰卧屈膝，双脚平放地面。",
      "收紧臀部，抬髋至躯干与大腿接近一线。",
      "缓慢下放，避免腰部过度反弓。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/glute-bridge/"
  },
  {
    "id": "exercise-good-morning",
    "name": "杠铃早安式",
    "group": "腿部",
    "slug": "good-morning",
    "englishName": "Good Morning",
    "equipment": "杠铃",
    "target": "腘绳肌",
    "steps": [
      "杠铃稳放上背，膝盖微屈。",
      "以髋部为轴向后折叠，背部保持中立。",
      "臀腿发力伸髋站起，先用轻重量练习。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/good-morning/"
  },
  {
    "id": "exercise-seated-calf-raise",
    "name": "坐姿提踵",
    "group": "腿部",
    "slug": "seated-calf-raise",
    "englishName": "Seated Calf Raise",
    "equipment": "器械",
    "target": "小腿",
    "steps": [
      "坐稳并固定大腿，脚前掌踩在踏板上。",
      "踮起足跟，保持脚踝方向稳定。",
      "缓慢下放足跟，避免快速弹震。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/seated-calf-raise/"
  },
  {
    "id": "exercise-goblet-squat",
    "name": "高脚杯深蹲",
    "group": "腿部",
    "slug": "goblet-squat",
    "englishName": "Goblet Squat",
    "equipment": "哑铃",
    "target": "股四头肌",
    "steps": [
      "双手抱稳哑铃于胸前，双脚站稳。",
      "髋膝同时屈曲，膝盖沿脚尖移动。",
      "脚掌蹬地站起，保持躯干稳定。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/goblet-squat/"
  },
  {
    "id": "exercise-smith-machine-squat",
    "name": "史密斯深蹲",
    "group": "腿部",
    "slug": "smith-machine-squat",
    "englishName": "Smith Machine Squat",
    "equipment": "器械",
    "target": "股四头肌",
    "steps": [
      "调整站位与安全限位，杠铃置于上背。",
      "在器械轨迹内受控下蹲。",
      "全脚掌发力站起，不让骨盆失去控制。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/smith-machine-squat/"
  },
  {
    "id": "exercise-sumo-deadlift",
    "name": "相扑硬拉",
    "group": "腿部",
    "slug": "sumo-deadlift",
    "englishName": "Sumo Deadlift",
    "equipment": "杠铃",
    "target": "臀部 / 腿后侧",
    "steps": [
      "双脚宽站，脚尖外展，双手在两腿之间握杠。",
      "收紧核心，膝盖沿脚尖打开后蹬地。",
      "杠铃贴近身体站起，受控放回。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/sumo-deadlift/"
  },
  {
    "id": "exercise-trap-bar-deadlift",
    "name": "六角杠硬拉",
    "group": "腿部",
    "slug": "trap-bar-deadlift",
    "englishName": "Trap Bar Deadlift",
    "equipment": "杠铃",
    "target": "臀部 / 腿后侧",
    "steps": [
      "站在六角杠中央，双手握稳侧把。",
      "收紧核心，屈髋屈膝后蹬地站起。",
      "保持背部中立，控制下降。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/trap-bar-deadlift/"
  },
  {
    "id": "exercise-dumbbell-romanian-deadlift",
    "name": "哑铃罗马尼亚硬拉",
    "group": "腿部",
    "slug": "dumbbell-romanian-deadlift",
    "englishName": "Dumbbell Romanian Deadlift",
    "equipment": "哑铃",
    "target": "腘绳肌",
    "steps": [
      "双手持哑铃于大腿前方，膝微屈。",
      "臀部向后移，哑铃贴近腿部下降。",
      "腿后侧有张力后伸髋站起，避免弓腰。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/dumbbell-romanian-deadlift/"
  },
  {
    "id": "exercise-hip-abduction-machine",
    "name": "器械髋外展",
    "group": "腿部",
    "slug": "hip-abduction-machine",
    "englishName": "Hip Abduction Machine",
    "equipment": "器械",
    "target": "臀肌",
    "steps": [
      "坐稳靠垫，双腿贴合支撑垫。",
      "在骨盆稳定的前提下向外打开双腿。",
      "控制合拢，不用身体前后弹动借力。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/hip-abduction-machine/"
  },
  {
    "id": "exercise-hip-adduction-machine",
    "name": "器械髋内收",
    "group": "腿部",
    "slug": "hip-adduction-machine",
    "englishName": "Hip Adduction Machine",
    "equipment": "器械",
    "target": "大腿内收肌",
    "steps": [
      "坐稳并将支撑垫调整到舒适幅度。",
      "双腿受控向中间合拢。",
      "缓慢打开，避免髋部被过度牵拉。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/hip-adduction-machine/"
  },
  {
    "id": "exercise-4-0",
    "name": "杠铃弯举",
    "group": "手臂",
    "slug": "ez-bar-curl",
    "englishName": "EZ-Bar Curl",
    "equipment": "杠铃",
    "target": "肱二头肌",
    "steps": [
      "示范使用EZ曲杆，站稳并握住舒适角度。",
      "上臂贴近身体，屈肘抬起杠铃。",
      "缓慢伸肘回程，不后仰甩动。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/ez-bar-curl/"
  },
  {
    "id": "exercise-4-1",
    "name": "哑铃弯举",
    "group": "手臂",
    "slug": "bicep-curl",
    "englishName": "Bicep Curl",
    "equipment": "哑铃",
    "target": "肱二头肌",
    "steps": [
      "站稳，掌心向前或在抬起时逐渐转向上方。",
      "上臂保持相对固定，屈肘抬起哑铃。",
      "慢慢下放，避免躯干晃动。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/bicep-curl/"
  },
  {
    "id": "exercise-4-2",
    "name": "锤式弯举",
    "group": "手臂",
    "slug": "hammer-curl",
    "englishName": "Hammer Curl",
    "equipment": "哑铃",
    "target": "肱二头肌",
    "steps": [
      "双手持哑铃，掌心始终相对。",
      "肘部贴近身体，平稳屈肘抬起。",
      "受控下降，手腕不前后折弯。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/hammer-curl/"
  },
  {
    "id": "exercise-4-3",
    "name": "绳索下压",
    "group": "手臂",
    "slug": "tricep-pushdown",
    "englishName": "Tricep Pushdown",
    "equipment": "绳索",
    "target": "肱三头肌",
    "steps": [
      "面对高位滑轮，上臂贴近身体。",
      "伸肘将把手向下压，手腕保持稳定。",
      "缓慢屈肘返回，肩部不大幅前后移动。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/tricep-pushdown/"
  },
  {
    "id": "exercise-4-4",
    "name": "仰卧臂屈伸",
    "group": "手臂",
    "slug": "skull-crusher",
    "englishName": "Skull Crusher",
    "equipment": "杠铃",
    "target": "肱三头肌",
    "steps": [
      "仰卧平凳，杠铃稳定置于上方。",
      "上臂保持相对固定，屈肘下放至头部附近。",
      "伸肘推回，选择可完全控制的重量。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/skull-crusher/"
  },
  {
    "id": "exercise-preacher-curl",
    "name": "牧师凳弯举",
    "group": "手臂",
    "slug": "preacher-curl",
    "englishName": "Preacher Curl",
    "equipment": "器械",
    "target": "肱二头肌",
    "steps": [
      "上臂贴稳支撑垫，腋下靠近垫缘。",
      "屈肘将把手或重量抬起。",
      "慢慢下降，不在底端猛烈伸直肘部。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/preacher-curl/"
  },
  {
    "id": "exercise-cable-curl",
    "name": "绳索弯举",
    "group": "手臂",
    "slug": "cable-curl",
    "englishName": "Cable Curl",
    "equipment": "绳索",
    "target": "肱二头肌",
    "steps": [
      "面向低位滑轮，站稳并固定上臂。",
      "屈肘将把手拉向肩部方向。",
      "控制伸肘还原，保持绳索张力。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/cable-curl/"
  },
  {
    "id": "exercise-reverse-curl",
    "name": "反握杠铃弯举",
    "group": "手臂",
    "slug": "reverse-curl",
    "englishName": "Reverse Curl",
    "equipment": "杠铃",
    "target": "前臂",
    "steps": [
      "掌心朝下握杠，双肘贴近身体。",
      "屈肘抬起，手腕保持中立。",
      "缓慢下放，避免耸肩借力。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/reverse-curl/"
  },
  {
    "id": "exercise-wrist-curl",
    "name": "杠铃腕弯举",
    "group": "手臂",
    "slug": "wrist-curl",
    "englishName": "Wrist Curl",
    "equipment": "杠铃",
    "target": "前臂",
    "steps": [
      "前臂稳放在大腿或凳面，掌心向上。",
      "只通过手腕弯曲抬起杠铃。",
      "慢慢展开手腕，不用整个前臂抬动。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/wrist-curl/"
  },
  {
    "id": "exercise-overhead-tricep-extension",
    "name": "绳索过顶臂屈伸",
    "group": "手臂",
    "slug": "overhead-tricep-extension",
    "englishName": "Overhead Tricep Extension",
    "equipment": "绳索",
    "target": "肱三头肌",
    "steps": [
      "背对滑轮站稳，把手位于头后上方。",
      "保持上臂方向，伸肘将把手向上前方推。",
      "缓慢屈肘还原，核心不松散。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/overhead-tricep-extension/"
  },
  {
    "id": "exercise-close-grip-bench-press",
    "name": "窄握杠铃卧推",
    "group": "手臂",
    "slug": "close-grip-bench-press",
    "englishName": "Close-Grip Bench Press",
    "equipment": "杠铃",
    "target": "肱三头肌",
    "steps": [
      "仰卧平凳，双手使用接近肩宽的握距。",
      "双肘沿身体侧方受控下降。",
      "平稳推起，避免握距过窄导致手腕不适。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/close-grip-bench-press/"
  },
  {
    "id": "exercise-dip",
    "name": "三头肌双杠臂屈伸",
    "group": "手臂",
    "slug": "dip",
    "englishName": "Dip",
    "equipment": "自重",
    "target": "肱三头肌",
    "steps": [
      "双手撑稳双杠，身体尽量保持直立。",
      "屈肘下降至舒适范围，肘部不过度外张。",
      "伸肘撑起，避免向下快速坠落。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/dip/"
  },
  {
    "id": "exercise-assisted-dip",
    "name": "辅助双杠臂屈伸",
    "group": "手臂",
    "slug": "assisted-dip",
    "englishName": "Assisted Dip",
    "equipment": "器械",
    "target": "肱三头肌",
    "steps": [
      "设置合适辅助重量并稳定支撑身体。",
      "受控屈肘下降，肩部保持稳定。",
      "伸肘推回，结束时按器械要求安全下机。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/assisted-dip/"
  },
  {
    "id": "exercise-incline-dumbbell-curl",
    "name": "上斜哑铃弯举",
    "group": "手臂",
    "slug": "incline-dumbbell-curl",
    "englishName": "Incline Dumbbell Curl",
    "equipment": "哑铃",
    "target": "肱二头肌",
    "steps": [
      "背靠上斜凳，双臂自然垂在身体侧后方。",
      "上臂相对固定，屈肘抬起哑铃。",
      "慢慢下降，不用肩膀前移带动。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/incline-dumbbell-curl/"
  },
  {
    "id": "exercise-concentration-curl",
    "name": "集中弯举",
    "group": "手臂",
    "slug": "concentration-curl",
    "englishName": "Concentration Curl",
    "equipment": "哑铃",
    "target": "肱二头肌",
    "steps": [
      "坐稳，单侧上臂内侧轻靠大腿。",
      "屈肘抬起哑铃，手腕保持稳定。",
      "缓慢下降，避免躯干转动。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/concentration-curl/"
  },
  {
    "id": "exercise-spider-curl",
    "name": "蜘蛛弯举",
    "group": "手臂",
    "slug": "spider-curl",
    "englishName": "Spider Curl",
    "equipment": "哑铃",
    "target": "肱二头肌",
    "steps": [
      "胸部贴稳上斜凳，双臂自然下垂。",
      "固定上臂，屈肘抬起哑铃。",
      "受控伸肘还原，胸部不离开靠垫。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/spider-curl/"
  },
  {
    "id": "exercise-rope-tricep-pushdown",
    "name": "绳索绳把下压",
    "group": "手臂",
    "slug": "rope-tricep-pushdown",
    "englishName": "Rope Tricep Pushdown",
    "equipment": "绳索",
    "target": "肱三头肌",
    "steps": [
      "握住绳索两端，上臂贴近身体。",
      "伸肘下压，末端双手自然向外分开。",
      "缓慢回程，避免耸肩或用体重压绳。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/rope-tricep-pushdown/"
  },
  {
    "id": "exercise-tricep-kickback",
    "name": "哑铃后踢臂屈伸",
    "group": "手臂",
    "slug": "tricep-kickback",
    "englishName": "Tricep Kickback",
    "equipment": "哑铃",
    "target": "肱三头肌",
    "steps": [
      "俯身并稳定支撑，上臂保持在躯干旁。",
      "只通过伸肘将哑铃向后推。",
      "缓慢屈肘还原，不甩动上臂。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/tricep-kickback/"
  },
  {
    "id": "exercise-crunch",
    "name": "仰卧卷腹",
    "group": "其他",
    "slug": "crunch",
    "englishName": "Crunch",
    "equipment": "自重",
    "target": "腹部 / 核心",
    "steps": [
      "仰卧屈膝，双脚踩稳，不用手拉头。",
      "腹部卷起，使肩胛缓慢离地。",
      "控制回落，避免用髋部猛烈摆动。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/crunch/"
  },
  {
    "id": "exercise-reverse-crunch",
    "name": "反向卷腹",
    "group": "其他",
    "slug": "reverse-crunch",
    "englishName": "Reverse Crunch",
    "equipment": "自重",
    "target": "腹部 / 核心",
    "steps": [
      "仰卧，双膝弯曲并抬起。",
      "腹部发力让骨盆轻轻卷离地面。",
      "控制下降，不把双腿用力甩向头部。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/reverse-crunch/"
  },
  {
    "id": "exercise-bicycle-crunch",
    "name": "自行车卷腹",
    "group": "其他",
    "slug": "bicycle-crunch",
    "englishName": "Bicycle Crunch",
    "equipment": "自重",
    "target": "腹部 / 核心",
    "steps": [
      "仰卧，双手轻放头侧，双腿抬起。",
      "交替将一侧肩部转向对侧膝盖。",
      "缓慢换侧，避免拉扯颈部。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/bicycle-crunch/"
  },
  {
    "id": "exercise-hanging-leg-raise",
    "name": "悬垂举腿",
    "group": "其他",
    "slug": "hanging-leg-raise",
    "englishName": "Hanging Leg Raise",
    "equipment": "自重",
    "target": "腹部 / 核心",
    "steps": [
      "握稳单杠，肩部主动稳定，身体不摆动。",
      "腹部收紧，平稳抬起双腿。",
      "受控下降，不借惯性甩腿。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/hanging-leg-raise/"
  },
  {
    "id": "exercise-cable-crunch",
    "name": "绳索卷腹",
    "group": "其他",
    "slug": "cable-crunch",
    "englishName": "Cable Crunch",
    "equipment": "绳索",
    "target": "腹部 / 核心",
    "steps": [
      "跪在高位滑轮前，绳索置于头部两侧。",
      "以腹部卷曲带动躯干向下。",
      "缓慢伸展回程，避免只用髋部前后折叠。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/cable-crunch/"
  },
  {
    "id": "exercise-ab-wheel",
    "name": "健腹轮前滚",
    "group": "其他",
    "slug": "ab-wheel",
    "englishName": "Ab Wheel Rollout",
    "equipment": "自重",
    "target": "腹部 / 核心",
    "steps": [
      "跪姿握稳健腹轮，收紧腹部和臀部。",
      "缓慢向前滚动至能保持腰背稳定的位置。",
      "腹部发力收回，不追求失控的最大幅度。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/ab-wheel/"
  },
  {
    "id": "exercise-dead-bug",
    "name": "死虫式",
    "group": "其他",
    "slug": "dead-bug",
    "englishName": "Dead Bug",
    "equipment": "自重",
    "target": "腹部 / 核心",
    "steps": [
      "仰卧，髋膝约90度，双臂伸向上方。",
      "保持腰背稳定，缓慢伸展对侧手脚。",
      "回到起始位后换侧，不让腰部明显拱起。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/dead-bug/"
  },
  {
    "id": "exercise-bird-dog",
    "name": "鸟狗式",
    "group": "其他",
    "slug": "bird-dog",
    "englishName": "Bird Dog",
    "equipment": "自重",
    "target": "腹部 / 核心",
    "steps": [
      "四点跪撑，肩在手腕上方，髋在膝上方。",
      "缓慢伸出对侧手脚，骨盆保持平稳。",
      "受控收回并换侧，不抬高到腰部塌陷。"
    ],
    "sourceUrl": "https://bryllim.github.io/workout-guide/exercises/bird-dog/"
  }
];
export const guideById = (id?: string) => [...EXERCISE_CATALOG, ...CARDIO_GUIDES].find(e => e.id === id);

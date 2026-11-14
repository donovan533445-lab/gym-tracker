import type { ExerciseGuide } from './exercise-catalog';
export const CARDIO_TYPES = ['treadmill-incline-walk','stair-climber','running','walking','cycling','elliptical','rowing','jump-rope','assault-bike','skierg','swimming','hiking'] as const;
export const CARDIO_ACTIVITIES = [
 {id:'treadmill-incline-walk',name:'爬坡机 / 跑步机爬坡',equipment:'跑步机',incline:true,speed:true,level:false,steps:['设置适合自己的速度与坡度，先低强度热身。','身体自然直立，保持步态稳定，不持续悬挂在扶手上。','结束前逐步降低坡度和速度，再安全下机。']},
 {id:'stair-climber',name:'楼梯机 / 登阶机',equipment:'楼梯机',incline:false,speed:false,level:true,steps:['站稳踏板，从较低档位开始。','脚掌稳定踩踏，身体保持直立，扶手用于平衡。','逐步降低档位，机器停稳后再下机。']},
 {id:'running',name:'跑步',equipment:'跑步机 / 户外',incline:true,speed:true,level:false,steps:['先慢走或慢跑热身，再进入目标节奏。','保持自然步幅，肩颈放松，避免过度跨步。','结束前减速慢走，记录实际距离和时间。']},
 {id:'walking',name:'快走',equipment:'户外 / 跑步机',incline:false,speed:true,level:false,steps:['从舒适步速开始，逐渐提高节奏。','自然摆臂，保持躯干稳定与呼吸顺畅。','结束前放慢步速，再记录本次数据。']},
 {id:'cycling',name:'动感单车 / 骑行',equipment:'单车',incline:false,speed:true,level:true,steps:['调整座椅高度，使踩踏到底时膝盖仍微屈。','保持膝盖与脚尖方向大致一致，平稳踩踏。','降低阻力慢骑放松，停稳后再下车。']},
 {id:'elliptical',name:'椭圆机',equipment:'椭圆机',incline:false,speed:true,level:true,steps:['踩稳踏板，握住扶手，从低阻力开始。','保持身体稳定，手脚协调推动。','降低速度与阻力，踏板停稳后再下机。']},
 {id:'rowing',name:'划船机',equipment:'划船机',incline:false,speed:false,level:true,steps:['固定双脚，背部保持自然中立。','按腿部蹬伸、髋部打开、手臂后拉的顺序发力。','回程先伸臂，再前倾屈膝，保持节奏平顺。']},
 {id:'jump-rope',name:'跳绳',equipment:'跳绳',incline:false,speed:false,level:false,steps:['选择合适绳长与平整防滑场地。','手腕带动绳子，小幅跳起并轻柔落地。','保持呼吸与节奏，分段训练可累计实际运动时间。']},
 {id:'assault-bike',name:'风阻单车',equipment:'风阻单车',incline:false,speed:true,level:false,steps:['调整座椅高度，脚掌稳定踩踏。','双臂推拉与腿部踩踏协调配合。','逐渐降低发力，等待车轮减速后下车。']},
 {id:'skierg',name:'滑雪机',equipment:'SkiErg',incline:false,speed:false,level:true,steps:['站稳并握住把手，核心保持稳定。','髋膝轻屈，配合躯干与手臂向下拉动。','受控回到起始位，避免过度弓腰或猛拉。']},
 {id:'swimming',name:'游泳',equipment:'泳池',incline:false,speed:false,level:false,steps:['在适合自己能力的泳道中先做轻松热身。','选择熟悉泳姿，保持动作与呼吸协调。','记录实际游动时间与距离，休息时间单独说明。']},
 {id:'hiking',name:'户外徒步',equipment:'户外',incline:false,speed:true,level:false,steps:['按路线与体能选择合适节奏。','上下坡保持步态稳定，注意补水和脚下路面。','结束后记录时间、距离及设备显示的热量。']},
] as const;
export const cardioActivity = (id: string) => CARDIO_ACTIVITIES.find(a=>a.id===id)!;
export const CARDIO_GUIDES: ExerciseGuide[] = CARDIO_ACTIVITIES.map(a=>({id:`cardio-${a.id}`,slug:a.id,name:a.name,group:'其他',englishName:a.id.replaceAll('-',' '),equipment:a.equipment,target:'心肺耐力',steps:[...a.steps],sourceUrl:`https://bryllim.github.io/workout-guide/exercises/${a.id}/`}));

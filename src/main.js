let config = {
    type: Phaser.WEBGL,
    width: 1280,
    height: 720,
    scene: [Preload, Play, Pause],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        min: {
          width: 300,
          height: 225,
        },
  
        max: {
          width: 1280,
          height: 720
        },
    },
    parent: "game_container",
    debug: true
  }

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyUP, keyDOWN, keyLEFT, keyRIGHT, keySPACE, keyESC;
let key0, key1, key2, key3, key4, key5, key6, key7, key8, key9;
let textConfig;

//All between-turns feedback here
let outputQueue = []

/*

BELOW HERE, I DEFINE ALL ABILITIES AS GLOBAL VARIABLES.

*/

/**
 * @type {Ability}
 */
 let basicAttack = {};
 basicAttack.name = "BasicAttack";
 basicAttack.text = "Deal 3 damage.";
 basicAttack.requirement = function(){return true};
 basicAttack.effect = function(target,self){
   target.takeDamage(self, 3)
  };
 basicAttack.multitarget = false;
 basicAttack.allies = false;
 basicAttack.selftarget = false;

 /**
 * @type {Ability}
 */
  let basicHeal = {};
  basicHeal.name = "BasicHeal";
  basicHeal.text = "Heal 3 damage.";
  basicHeal.requirement = function(){return true};
  basicHeal.effect = function(target,self){
    target.hp = Math.min(target.hp + 3, target.maxHP)
  };
  basicHeal.multitarget = false;
  basicHeal.allies = true;
  basicHeal.selftarget = false;

  /**
 * @type {Ability}
 */
   let groupAttack = {};
   groupAttack.name = "GroupAttack";
   groupAttack.text = "Deal 1 damage to all enemies.";
   groupAttack.requirement = function(){return true};
   groupAttack.effect = function(target, self){
     target.takeDamage(self, 1)
    };
   groupAttack.multitarget = true;
   groupAttack.allies = false;
   groupAttack.selftarget = false;

    /**
 * @type {Ability}
 */
  let groupHeal = {};
  groupHeal.name = "Group Heal";
  groupHeal.text = "Heal 1 Damage to all allies.";
  groupHeal.requirement = function(){return true};
  groupHeal.effect = function(target,self){
    target.hp = Math.min(target.hp + 1, target.maxHP)
  };
  groupHeal.multitarget = true;
  groupHeal.allies = true;
  groupHeal.selftarget = false;
 
/**
 * @type {Ability}
 */
 let heavyAttack = {};
 heavyAttack.name = "heavyAttack";
 heavyAttack.text = "Deal 8 damage.";
 heavyAttack.requirement = function(){return true};
 heavyAttack.effect = function(target, self){
   target.takeDamage(self, 8)
  };
 heavyAttack.multitarget = false;
 heavyAttack.allies = false;
 heavyAttack.selftarget = false;
 
 /**
 * @type {Ability}
 */
  let selfHeal = {};
  selfHeal.name = "selfHeal";
  selfHeal.text = "Heal 5 damage.";
  selfHeal.requirement = function(){return true};
  selfHeal.effect = function(target,self){
    target.hp = Math.min(target.hp + 5, target.maxHP)
  };
  selfHeal.multitarget = false;
  selfHeal.allies = false;
  selfHeal.selftarget = true;

  //Actual attacks
  
/**
 * @type {Ability}
 */
let drone = {};
drone.name = "Drone";
drone.text = "Give ally Regeneration 3.";
drone.requirement = function(caster, castee){return true};
drone.effect = function(target,self){
  console.log(self.name+" used "+drone.name+" on "+target.name);
  outputQueue.push(self.name+" used "+drone.name+" on "+target.name)
  target.applyStatus("Regen", 3)
};
drone.multitarget = false;
drone.allies = true;
drone.selftarget = false;

/**
 * @type {Ability}
 */
 let flareGun = {};
 flareGun.name = "Flare Gun";
 flareGun.text = "Hit enemy for 1 damage and 50% chance to inflict Burn.";
 flareGun.requirement = function(caster, castee){return true};
 flareGun.effect = function(target, self){
  console.log(self.name+" used "+flareGun.name+" on "+target.name);
  outputQueue.push(self.name+" used "+flareGun.name+" on "+target.name);
  target.takeDamage(self, 1);
  if(Math.random() >= 0.5) target.applyStatus("Burn", 3)
 };
 flareGun.multitarget = false;
 flareGun.allies = false;
 flareGun.selftarget = false;

/**
 * @type {Ability}
 */
let cure = {};
cure.name = "Cure";
cure.text = "Remove Ally Debuffs.";
cure.requirement = function(caster, castee){return true};
cure.effect = function(target,self){
  console.log(self.name+" used "+cure.name+" on "+target.name);
  outputQueue.push(self.name+" used "+cure.name+" on "+target.name);
  if(target.statuses.debuff.status != "None"){
    console.log(target.name+" was cured of "+target.statuses.debuff.status);
    outputQueue.push(target.name+" was cured of "+target.statuses.debuff.status);
    target.statuses.debuff.status = "None";
  }
  if(target.statuses.health.status == "Burn"){
    console.log(target.name+" was cured of "+target.statuses.health.status);
    outputQueue.push(target.name+" was cured of "+target.statuses.health.status);
    target.statuses.health.status = "None";
  }
};
cure.multitarget = false;
cure.allies = true;
cure.selftarget = false;

/**
 * @type {Ability}
 */
let assault = {};
assault.name = "Assault";
assault.text = "Hit enemy for damage based off your speed.";
assault.requirement = function(caster, castee){return true};
assault.effect = function(target, self){
  console.log(self.name+" used "+assault.name+" on "+target.name);
  outputQueue.push(self.name+" used "+assault.name+" on "+target.name);
  target.takeDamage(self, 3 + Math.ceil(self.queuedAction.speed/2))
};
assault.multitarget = false;
assault.allies = false;
assault.selftarget = false;

/**
 * @type {Ability}
 */
let feint = {};
feint.name = "Feint";
feint.text = "Flinch an enemy.";
feint.requirement = function(caster, castee){return true};
feint.effect = function(target,self){
  console.log(self.name+" used "+feint.name+" on "+target.name);
  outputQueue.push(self.name+" used "+feint.name+" on "+target.name);
  target.applyStatus("Flinch", 1)
};
feint.multitarget = false;
feint.allies = false;
feint.selftarget = false;

/**
 * @type {Ability}
 */
let enhance = {};
enhance.name = "Enhance";
enhance.text = "Give self Haste 3 for 3 turns.";
enhance.requirement = function(caster, castee){return true};
enhance.effect = function(target,self){
  console.log(self.name+" used "+enhance.name+" on themself");
  outputQueue.push(self.name+" used "+enhance.name+" on themself");
  self.applyStatus("Haste", 3, 3)
};
enhance.multitarget = true;
enhance.allies = false;
enhance.selftarget = false;

/**
 * @type {Ability}
 */
let swipe = {};
swipe.name = "Swipe";
swipe.text = "Hit all enemies for 2 damage.";
swipe.requirement = function(caster, castee){return true};
swipe.effect = function(target, self){
  console.log(self.name+" used "+swipe.name+" on enemy team");
  outputQueue.push(self.name+" used "+swipe.name+" on enemy team");
  target.takeDamage(self, 2);
};
swipe.multitarget = true;
swipe.allies = false;
swipe.selftarget = false;

/**
 * @type {Ability}
 */
let bulwark = {};
bulwark.name = "Bulwark";
bulwark.text = "Give all allies Aegis 1.";
bulwark.requirement = function(caster, castee){return true};
bulwark.effect = function(target,self){
  console.log(self.name+" used "+bulwark.name+" on "+target.name);
  outputQueue.push(self.name+" used "+bulwark.name+" on "+target.name);
  target.applyStatus("Aegis", 1)
};
bulwark.multitarget = true;
bulwark.allies = true;
bulwark.selftarget = false;

/**
 * @type {Ability}
 */
let bullrush = {};
bullrush.name = "Bullrush";
bullrush.text = "Deal 8 damage to a target and 4 damage to self.";
bullrush.requirement = function(caster, castee){return true};
bullrush.effect = function(target, self){
  console.log(self.name+" used "+bullrush.name+" on "+target.name);
  outputQueue.push(self.name+" used "+bullrush.name+" on "+target.name);
  target.takeDamage(self, 8)
  self.hp = Math.min(self.hp-4., self.maxHP)
};
bullrush.multitarget = false;
bullrush.allies = false;
bullrush.selftarget = false;

/**
 * @type {Ability}
 */
let soothe = {};
soothe.name = "Soothe";
soothe.text = "Heal ally for 6 damage.";
soothe.requirement = function(caster, castee){return true};
soothe.effect = function(target,self){
  console.log(self.name+" used "+soothe.name+" on "+target.name);
  outputQueue.push(self.name+" used "+soothe.name+" on "+target.name);
  target.healSelf(6);
};
soothe.multitarget = false;
soothe.allies = true;
soothe.selftarget = false;

/**
 * @type {Ability}
 */
let invigorate = {};
invigorate.name = "Invigorate";
invigorate.text = "Give ally Enrage 1.";
invigorate.requirement = function(caster, castee){return true};
invigorate.effect = function(target,self){
  console.log(self.name+" used "+invigorate.name+" on "+target.name);
  outputQueue.push(self.name+" used "+invigorate.name+" on "+target.name);
  target.applyStatus("Enrage", 1)
};
invigorate.multitarget = false;
invigorate.allies = true;
invigorate.selftarget = false;

/**
 * @type {Ability}
 */
let panicAttack = {};
panicAttack.name = "Panic Attack";
panicAttack.text = "Deal 2 damage to targeted enemy and inflict Strung Out 1.";
panicAttack.requirement = function(caster, castee){return true};
panicAttack.effect = function(target, self){
  console.log(self.name+" used "+panicAttack.name+" on "+target.name);
  outputQueue.push(self.name+" used "+panicAttack.name+" on "+target.name);
  target.takeDamage(self, 2)
  target.applyStatus("StrungOut", 1)
};
panicAttack.multitarget = false;
panicAttack.allies = false;
panicAttack.selftarget = false;

/**
 * @type {Ability}
 */
let shoot = {};
shoot.name = "Shoot";
shoot.text = "Deal 10 damage. If you have more than 1 fatigue, 30% accuracy.";
shoot.requirement = function(caster, castee){return true};
shoot.effect = function(target, self){
  console.log(self.name+" shot at "+target.name);
  outputQueue.push(self.name+" shot at "+target.name);
  if(self.fatigue <= 1 || Math.random() <= 0.3){
    console.log(target.name+" was hit")
    outputQueue.push(target.name+" was hit")
    target.takeDamage(self, 10);}
  else{console.log(self.name+" missed");
    outputQueue.push(self.name+" missed")}  
};
shoot.multitarget = false;
shoot.allies = false;
shoot.selftarget = false;

/**
 * @type {Ability}
 */
let flashBang = {};
flashBang.name = "Flash Bang";
flashBang.text = "Targets all enemies, 50% chance to Flinch.";
flashBang.requirement = function(caster, castee){return true};
flashBang.effect = function(target,self){
  if(Math.random() <= 0.5){
    console.log(self.name+" hit "+target.name+" with "+flashBang.name);
    outputQueue.push(self.name+" hit "+target.name+" with "+flashBang.name);
    target.applyStatus("Flinch", 1)
  }else{console.log(target.name+" avoided the "+flashBang.name)
    outputQueue.push(target.name+" avoided the "+flashBang.name);}
};
flashBang.multitarget = true;
flashBang.allies = false;
flashBang.selftarget = false;

/**
 * @type {Ability}
 */
let pinpoint = {};
pinpoint.name = "Pinpoint";
pinpoint.text = "Afflicts one targeted enemy with Distracted 2.";
pinpoint.requirement = function(caster, castee){return true};
pinpoint.effect = function(target,self){
  console.log(self.name+" used "+pinpoint.name+" on "+target.name);
  outputQueue.push(self.name+" used "+pinpoint.name+" on "+target.name);
  target.applyStatus("Distracted", 2)
};
pinpoint.multitarget = false;
pinpoint.allies = false;
pinpoint.selftarget = false;

/**
 * @type {Ability}
 */
let rally = {};
rally.name = "Rally";
rally.text = "Grants Random effect (Enrage 1, Aegis 1, Haste 2,2)to all allies including self.";
rally.requirement = function(caster, castee){return true};
rally.effect = function(target,self){
  let rng = Math.random();
  if(rng <= 0.33){
    console.log(self.name+"'s "+rally.name+" gave "+target.name+" Aegis 1");
    outputQueue.push(self.name+"'s "+rally.name+" gave "+target.name+" Aegis 1");
    target.applyStatus("Aegis", 1);
  }
  else if(rng <= 0.66){
    console.log(self.name+"'s "+rally.name+" gave "+target.name+" Enrage 1");
    outputQueue.push(self.name+"'s "+rally.name+" gave "+target.name+" Enrage 1");
    target.applyStatus("Enrage", 1);
  }
  else {
    console.log(self.name+"'s "+rally.name+" gave "+target.name+" Haste 2,2");
    outputQueue.push(self.name+"'s "+rally.name+" gave "+target.name+" Haste 2,2");
    target.applyStatus("Haste",2,2);
  }
};
rally.multitarget = true;
rally.allies = true;
rally.selftarget = false;

/**
 * @type {Ability}
 */
let devastation = {};
devastation.name = "Devastation";
devastation.text = "Deal 5 damage to all active enemies.";
devastation.requirement = function(caster, castee){
  if(caster.enemyArray[0].hp <=0 && caster.enemyArray[2].hp <=0){
    return true
  }else{return false}
};
devastation.effect = function(target,self){
  console.log(self.name+"'s "+devastation.name+" hit "+target.name);
  outputQueue.push(self.name+"'s "+devastation.name+" hit "+target.name);
  target.takeDamage(self, 5);
};
devastation.multitarget = true;
devastation.allies = false;
devastation.selftarget = false;

/**
 * @type {Ability}
 */
let ruin = {};
ruin.name = "Ruin";
ruin.text = "Deal 10 damage to targeted enemy.";
ruin.requirement = function(caster, castee){
  if(caster.enemyArray[0].hp <=0 && caster.enemyArray[2].hp <=0){
    return true
  }else{return false}
};
ruin.effect = function(target,self){
  target.takeDamage(self, 10);
  console.log(self.name+" used "+ruin.name+" on "+target.name);
  outputQueue.push(self.name+" used "+ruin.name+" on "+target.name);
};
ruin.multitarget = false;
ruin.allies = false;
ruin.selftarget = false;

/**
 * @type {Ability}
 */
let wince = {};
wince.name = "Wince";
wince.text = "Hit Targeted enemy for 2 damage, inflict Flinch.";
wince.requirement = function(caster, castee){return true};
wince.effect = function(target,self){
  console.log(self.name+" used "+wince.name+" on "+target.name);
  outputQueue.push(self.name+" used "+wince.name+" on "+target.name);
  target.takeDamage(self, 2);
  target.applyStatus("Flinch", 1);
};
wince.multitarget = false;
wince.allies = false;
wince.selftarget = false;

/**
 * @type {Ability}
 */
let lash = {};
lash.name = "Lash";
lash.text = "Hit targeted enemy for 8 damage, if enemy has Aegis Active, deal 16 damage instead.";
lash.requirement = function(caster, castee){return true};
lash.effect = function(target,self){  
  console.log(self.name+" used "+lash.name+" on "+target.name);
  outputQueue.push(self.name+" used "+lash.name+" on "+target.name);
  if(target.statuses.buff.status == "Aegis"){target.takeDamage(self, 16);}
  else {target.takeDamage(self, 8);}
};
lash.multitarget = false;
lash.allies = false;
lash.selftarget = false;

/**
 * @type {Ability}
 */
let flurry = {};
flurry.name = "Flurry";
flurry.text = "50% chance to hit all enemies for 6 damage.";
flurry.requirement = function(caster, castee){return true};
flurry.effect = function(target,self){
  if(Math.random()>0.5){
    console.log(self.name+" hit "+target.name+" in a "+flurry.name);
    outputQueue.push(self.name+" hit "+target.name+" in a "+flurry.name);
    target.takeDamage(self, 6);
  }
  else {console.log(self.name+"'s "+flurry.name+" missed "+target.name);
  outputQueue.push(self.name+"'s "+flurry.name+" missed "+target.name);}
};
flurry.multitarget = true;
flurry.allies = false;
flurry.selftarget = false;
      
/**
 * @type {Ability}
 */
let fortify = {};
fortify.name = "Fortify";
fortify.text = "deal 10 damage to self and heal ally for 10 damage.";
fortify.requirement = function(caster, castee){
  if(castee.hp <= castee.maxHP - 10 && castee.hp > 0&&caster.hp >10){return true}
  else {return false}
};
fortify.effect = function(target, self){
  console.log(self.name+" used "+fortify.name+" on "+target.name+" and took 10 damage");
  outputQueue.push(self.name+" used "+fortify.name+" on "+target.name+" and took 10 damage");
  self.hp = Math.max(self.hp-10, 0)
  target.healSelf(10);
};
fortify.multitarget = false;
fortify.allies = true;
fortify.selftarget = false;

/**
 * @type {Ability}
 */
let exhaust = {};
exhaust.name = "Exhaust";
exhaust.text = "Hit targeted enemy for 2 damage and inflict Encumbered.";
exhaust.requirement = function(caster, castee){return true};
exhaust.effect = function(target,self){
  console.log(self.name+" used "+exhaust.name+" on "+target.name);
  outputQueue.push(self.name+" used "+exhaust.name+" on "+target.name);
  target.takeDamage(self, 2);
  target.applyStatus("Encumbered",999);
};
exhaust.multitarget = false;
exhaust.allies = false;
exhaust.selftarget = false;

/**
 * @type {Ability}
 */
let raze = {};
raze.name = "Raze";
raze.text = "Hit all enemies for 1 damage and 50% chance to inflict Burn 5.";
raze.requirement = function(caster, castee){return true};
raze.effect = function(target,self){
  console.log(self.name+"'s "+raze.name+" hit "+target.name);
  outputQueue.push(self.name+"'s "+raze.name+" hit "+target.name)
  target.takeDamage(self, 1);
  if(Math.random()>0.5){target.applyStatus("Burn", 5);}
};
raze.multitarget = true;
raze.allies = false;
raze.selftarget = false;

    

  
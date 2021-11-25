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

/*

BELOW HERE, I DEFINE ALL ABILITIES AS GLOBAL VARIABLES.

*/

/**
 * @type {Ability}
 */
 let basicAttack = {};
 basicAttack.name = "BasicAttack";
 basicAttack.text = "Deal 3 damage";
 basicAttack.requirement = function(){return true};
 basicAttack.effect = function(target){
   target.hp -= 3
  };
 basicAttack.multitarget = false;
 basicAttack.allies = false;
 basicAttack.selftarget = false;

 /**
 * @type {Ability}
 */
  let basicHeal = {};
  basicHeal.name = "BasicHeal";
  basicHeal.text = "Heal 3 damage";
  basicHeal.requirement = function(){return true};
  basicHeal.effect = function(target){
    target.hp += 3
  };
  basicHeal.multitarget = false;
  basicHeal.allies = true;
  basicHeal.selftarget = false;

  /*
 * @type {Ability}
 */
   let groupAttack = {};
   groupAttack.name = "GroupAttack";
   groupAttack.text = "Deal 1 damage to all enemies";
   groupAttack.requirement = function(){return true};
   groupAttack.effect = function(target){
     target.hp -= 1
    };
   groupAttack.multitarget = true;
   groupAttack.allies = false;
   groupAttack.selftarget = false;

    /*
 * @type {Ability}
 */
  let groupHeal = {};
  groupHeal.name = "Group Heal";
  groupHeal.text = "Heal 1 Damage to all allies";
  groupHeal.requirement = function(){return true};
  groupHeal.effect = function(target){
    target.hp += 1;
  };
  groupHeal.multitarget = true;
  groupHeal.allies = true;
  groupHeal.selftarget = false;
 
/**
 * @type {Ability}
 */
 let heavyAttack = {};
 heavyAttack.name = "heavyAttack";
 heavyAttack.text = "Deal 8 damage";
 heavyAttack.requirement = function(){return true};
 heavyAttack.effect = function(target){
   target.hp -= 8
  };
 heavyAttack.multitarget = false;
 heavyAttack.allies = false;
 heavyAttack.selftarget = false;
 
 /**
 * @type {Ability}
 */
  let selfHeal = {};
  selfHeal.name = "selfHeal";
  selfHeal.text = "Heal 5 damage";
  selfHeal.requirement = function(){return true};
  selfHeal.effect = function(target){
    target.hp += 5
  };
  selfHeal.multitarget = false;
  selfHeal.allies = false;
  selfHeal.selftarget = true;
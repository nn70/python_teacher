const EXTRA_LEVELS = [
  {
    icon:"🗝️", name:"迷宮鑰匙", goal:"進階關卡：拿到鑰匙、避開牆壁，再開門逃出去。把狀態變數、碰撞與函式組合起來。",
    tasks:["四方向控制 hero","撞到牆要退回原位置","碰到 key_item 後 has_key=True","只有有鑰匙時碰門才過關","把 4 個函式串起來"],
    lesson:`<b>今天學：布林值狀態 + 函式參數 + 碰撞回復</b><pre>has_key = False\n\ndef hit_wall(wall, old_x, old_y):\n    if hero.touched(wall):\n        hero.x = old_x\n        hero.y = old_y</pre><p>遊戲常需要記住「現在有沒有鑰匙」。<code>True / False</code> 就是最常見的狀態。</p>`,
    hints:["先完成 move_player()。上下左右分別改 x / y。","撞牆後不是把牆移走，而是把 hero.x / hero.y 改回 old_x / old_y。","pickup_key() 改 has_key；open_door() 要同時檢查 has_key 和 hero.touched(door)。"],
    starter:`has_key = False\nwins = 0\nspeed = 7\n\ndef move_player():\n    pass\n\ndef hit_wall(wall, old_x, old_y):\n    pass\n\ndef pickup_key():\n    global has_key\n    pass\n\ndef open_door():\n    global wins\n    pass\n`,
    setup:`hero=Sprite(35,330,28,28)\nkey_item=Sprite(440,55,24,24)\ndoor=Sprite(455,325,38,50)\nwalls=[Sprite(90,260,300,18),Sprite(90,120,18,158),Sprite(180,40,18,150),Sprite(280,180,18,160),Sprite(370,75,18,205)]`,
    engine:`def __engine_step():\n    old_x,old_y=hero.x,hero.y\n    move_player()\n    hero.x=max(0,min(492,hero.x));hero.y=max(0,min(372,hero.y))\n    for wall in walls:\n        hit_wall(wall,old_x,old_y)\n    pickup_key()\n    open_door()\ndef __state():\n    return json.dumps({"hero":[hero.x,hero.y],"key":[key_item.x,key_item.y,key_item.hidden],"door":[door.x,door.y],"walls":[[w.x,w.y,w.w,w.h] for w in walls],"has_key":has_key,"wins":wins})`
  },
  {
    icon:"👹", name:"Boss 戰", goal:"進階關卡：移動、距離、攻擊、Boss AI、冷卻時間全部自己組起來。打倒 Boss。",
    tasks:["左右控制 player","寫 distance(a,b) 回傳距離","Space 靠近時攻擊 Boss","Boss 自動追玩家","Boss 靠近時攻擊並使用 cooldown","Boss HP 歸零過關"],
    lesson:`<b>今天學：return、函式參數、cooldown</b><pre>def distance(a, b):\n    return abs(a.x - b.x)\n\nif cooldown > 0:\n    cooldown -= 1</pre><p><code>return</code> 會把函式算出的答案送回去。cooldown 可以避免每一幀都連續扣血。</p>`,
    hints:["distance(a,b) 只要回傳 abs(a.x-b.x)。","player_attack() 要同時檢查 key.space、距離和 player_cd == 0。","boss_move() 比較 boss.x 和 player.x；boss_attack() 靠近時扣血並把 boss_cd 設成一個正數。"],
    starter:`player_hp = 10\nboss_hp = 16\nspeed = 7\ndamage = 2\nplayer_cd = 0\nboss_cd = 0\n\ndef distance(a, b):\n    pass\n\ndef move_player():\n    pass\n\ndef player_attack():\n    global boss_hp, player_cd\n    pass\n\ndef boss_move():\n    pass\n\ndef boss_attack():\n    global player_hp, boss_cd\n    pass\n\ndef cooldown_step():\n    global player_cd, boss_cd\n    pass\n`,
    setup:`player=Sprite(70,315,40,45)\nboss=Sprite(410,300,55,60)`,
    engine:`def __engine_step():\n    move_player()\n    player.x=max(0,min(480,player.x))\n    boss_move()\n    boss.x=max(0,min(465,boss.x))\n    player_attack()\n    boss_attack()\n    cooldown_step()\ndef __state():\n    return json.dumps({"player":[player.x,player.y],"boss":[boss.x,boss.y],"player_hp":player_hp,"boss_hp":boss_hp,"player_cd":player_cd,"boss_cd":boss_cd})`
  },
  {
    icon:"🐍", name:"貪食蛇", goal:"進階關卡：真正管理一個 list。吃到 5 顆食物就過關，撞牆或撞自己失敗。",
    tasks:["方向鍵改 direction，不能直接反向","用 list 建立新的蛇頭","每次移動 pop() 掉尾巴","吃到食物時讓蛇變長","檢查撞牆與撞自己","5 分過關"],
    lesson:`<b>今天學：list、insert()、pop()、切片</b><pre>snake.insert(0, [new_x, new_y])\nsnake.pop()\n\nif snake[0] in snake[1:]:\n    game_over = True</pre><p>蛇不是一個物件，而是一串座標。這一關開始真的在管理資料結構。</p>`,
    hints:["change_direction() 先處理方向，而且 right 時不能直接變 left。","move_snake() 先取得 snake[0]，算出新座標，再 insert(0,...)，最後 pop()。","吃到食物時可以在移動後 append 一個尾巴位置，並重新設定 food.x / food.y。"],
    starter:`import random\n\ndirection = "right"\nscore = 0\ngame_over = False\n\ndef change_direction():\n    global direction\n    pass\n\ndef move_snake():\n    pass\n\ndef eat_food():\n    global score\n    pass\n\ndef hit_check():\n    global game_over\n    pass\n`,
    setup:`snake=[[260,200],[240,200],[220,200]]\nfood=Sprite(360,200,18,18)\n__snake_tick=0`,
    engine:`def __engine_step():\n    global __snake_tick\n    change_direction()\n    __snake_tick += 1\n    if __snake_tick >= 3 and not game_over:\n        __snake_tick=0\n        move_snake()\n        eat_food()\n        hit_check()\ndef __state():\n    return json.dumps({"snake":snake,"food":[food.x,food.y],"score":score,"game_over":game_over})`
  },
  {
    icon:"🏹", name:"塔防小隊", goal:"進階關卡：用 list + for 同時管理敵人與子彈。守住基地並擊倒 8 個敵人。",
    tasks:["for 迴圈移動所有 enemies","敵人碰基地要扣 base_hp 並重生","find_target() 找一個還活著的敵人","Space 發射 bullet 並 append 到 bullets","移動所有 bullets","子彈碰敵人時得分並重生敵人"],
    lesson:`<b>今天學：list 裡放物件 + for + append()</b><pre>for enemy in enemies:\n    enemy.x -= enemy_speed\n\nbullets.append(Sprite(tower.x, tower.y, 8, 8))</pre><p>真正的遊戲通常不是只有一個敵人。這關要一次管理很多物件。</p>`,
    hints:["move_enemies() 用 for enemy in enemies。碰到 x<20 就扣基地血並把 enemy.x 放回右邊。","find_target() 可以 return 第一個 enemy。shoot() 裡如果按 Space 且 cooldown==0，就新增一顆子彈。","hit_check() 需要雙層 for：每顆 bullet 檢查每個 enemy。碰到後把 bullet.hidden=True。"],
    starter:`import random\n\nbase_hp = 10\nscore = 0\nenemy_speed = 2\nshot_cd = 0\n\ndef move_enemies():\n    global base_hp\n    pass\n\ndef find_target():\n    pass\n\ndef shoot(target):\n    global shot_cd\n    pass\n\ndef move_bullets():\n    pass\n\ndef hit_check():\n    global score\n    pass\n\ndef cooldown_step():\n    global shot_cd\n    pass\n`,
    setup:`tower=Sprite(55,185,35,35)\nenemies=[Sprite(500,70,32,32),Sprite(610,160,32,32),Sprite(720,250,32,32)]\nbullets=[]`,
    engine:`def __engine_step():\n    move_enemies()\n    target=find_target()\n    shoot(target)\n    move_bullets()\n    hit_check()\n    cooldown_step()\ndef __state():\n    return json.dumps({"tower":[tower.x,tower.y],"enemies":[[e.x,e.y] for e in enemies],"bullets":[[b.x,b.y,b.hidden] for b in bullets],"score":score,"base_hp":base_hp,"shot_cd":shot_cd})`
  },
  {
    icon:"🧗", name:"救援平台", goal:"終極組合關：重力、跳躍、平台碰撞、蒐集寶石與出口條件全部放在一起。拿 3 顆寶石再到出口。",
    tasks:["左右移動 player","重力讓 vy 不斷增加","只有 on_ground 時才能跳","落在平台上要停住並設 on_ground=True","for 迴圈檢查 3 顆 gems","拿滿 3 顆才能從 exit 過關"],
    lesson:`<b>今天學：把狀態、重力、for、碰撞整合成完整系統</b><pre>vy += gravity\nplayer.y += vy\n\nif on_ground and key.up:\n    vy = -jump_power</pre><p>這關沒有單一新語法，重點是把前面學過的東西組成一個完整遊戲系統。</p>`,
    hints:["move_player() 處理左右；跳躍一定要加 on_ground 條件。gravity_step() 處理 vy 和 player.y。","platform_check(platform) 只在 vy>=0 且碰到平台時把 player 放到平台上面，vy=0、on_ground=True。","collect_gems() 用 for；exit_check() 要同時檢查 gems_collected>=3 和 player.touched(exit_door)。"],
    starter:`gravity = 0.45\njump_power = 10\nmove_speed = 6\nvy = 0\non_ground = False\ngems_collected = 0\nwins = 0\n\ndef move_player():\n    global vy, on_ground\n    pass\n\ndef gravity_step():\n    global vy, on_ground\n    pass\n\ndef platform_check(platform):\n    global vy, on_ground\n    pass\n\ndef collect_gems():\n    global gems_collected\n    pass\n\ndef exit_check():\n    global wins\n    pass\n`,
    setup:`player=Sprite(35,320,28,32)\nplatforms=[Sprite(0,365,520,20),Sprite(80,285,120,12),Sprite(260,230,120,12),Sprite(390,155,110,12),Sprite(210,90,110,12)]\ngems=[Sprite(145,250,20,20),Sprite(330,195,20,20),Sprite(435,120,20,20)]\nexit_door=Sprite(240,35,42,55)`,
    engine:`def __engine_step():\n    move_player()\n    gravity_step()\n    for platform in platforms:\n        platform_check(platform)\n    collect_gems()\n    exit_check()\n    player.x=max(0,min(492,player.x))\n    if player.y>420:\n        player.x=35;player.y=320\ndef __state():\n    return json.dumps({"player":[player.x,player.y],"platforms":[[p.x,p.y,p.w,p.h] for p in platforms],"gems":[[g.x,g.y,g.hidden] for g in gems],"exit":[exit_door.x,exit_door.y],"gems_collected":gems_collected,"wins":wins,"vy":vy,"on_ground":on_ground})`
  }
];

function checkExtraGoal(i,s){
  if(i===7 && s.wins>=1) win(i);
  if(i===8){ if(s.boss_hp<=0) win(i); else if(s.player_hp<=0) lose(i); }
  if(i===9){ if(s.score>=5) win(i); else if(s.game_over) lose(i); }
  if(i===10){ if(s.score>=8) win(i); else if(s.base_hp<=0) lose(i); }
  if(i===11 && s.wins>=1) win(i);
}

function drawExtra(i,s,x){
  if(i===7){
    x.fillStyle="#7289a6";s.walls.forEach(w=>x.fillRect(w[0],w[1],w[2],w[3]));
    x.font="28px serif";x.fillText("🧑",s.hero[0],s.hero[1]+27);if(!s.key[2])x.fillText("🗝️",s.key[0],s.key[1]+24);x.font="40px serif";x.fillText(s.has_key?"🚪":"🔒",s.door[0],s.door[1]+42);
    x.fillStyle="#fff";x.font="bold 16px system-ui";x.fillText(`鑰匙 ${s.has_key?"✅":"❌"}`,12,24);
  }
  if(i===8){
    x.fillStyle="#fff";x.font="bold 17px system-ui";x.fillText(`玩家 HP ${s.player_hp}   Boss HP ${s.boss_hp}`,12,24);x.font="42px serif";x.fillText("🧙",s.player[0],s.player[1]+42);x.font="58px serif";x.fillText("👹",s.boss[0],s.boss[1]+55);
  }
  if(i===9){
    x.fillStyle="#fff";x.font="bold 17px system-ui";x.fillText(`食物 ${s.score}/5`,12,24);x.fillStyle="#63d471";s.snake.forEach(p=>x.fillRect(p[0],p[1],18,18));x.font="24px serif";x.fillText("🍎",s.food[0],s.food[1]+20);
  }
  if(i===10){
    x.fillStyle="#fff";x.font="bold 17px system-ui";x.fillText(`擊倒 ${s.score}/8   基地 HP ${s.base_hp}`,12,24);x.font="42px serif";x.fillText("🏰",25,220);x.fillText("🏹",s.tower[0],s.tower[1]+35);x.font="30px serif";s.enemies.forEach(e=>x.fillText("👾",e[0],e[1]+28));x.fillStyle="#ffd166";s.bullets.forEach(b=>{if(!b[2])x.fillRect(b[0],b[1],8,8)});
  }
  if(i===11){
    x.fillStyle="#87a8c0";s.platforms.forEach(p=>x.fillRect(p[0],p[1],p[2],p[3]));x.font="28px serif";x.fillText("🧗",s.player[0],s.player[1]+28);s.gems.forEach(g=>{if(!g[2])x.fillText("💎",g[0],g[1]+22)});x.font="38px serif";x.fillText("🚪",s.exit[0],s.exit[1]+42);x.fillStyle="#fff";x.font="bold 17px system-ui";x.fillText(`寶石 ${s.gems_collected}/3`,12,24);
  }
}

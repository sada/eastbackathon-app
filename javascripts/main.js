enchant();

window.onload = function() {
  var result = {
    'correctAnswer': 0,
    'hitCount':0,

    'distance': 0,

    'backgroundLevel': 0
  };
  var game_ = new Game(320, 480);
  game_.fps = 24;
  var imagePaths = [
    Config['startTitleImagePath'],
    Config['startBackgroundImagePath'],
    Config['correctAnswerImagePath'],
    Config['gameOverImagePath'],
    Config['charactorImagePath'],
    Config['enemyImagePath']
  ];
  Config['backgroundImagePaths'].forEach(function(backgroundImagePath) {
    imagePaths.push(backgroundImagePath);
  });
  questionData.forEach(function(data) {
    imagePaths.push('./images/' + data['question']);
  });
  imagePaths.forEach(function(imagePath) {
   game_.preload(imagePath);
  });

  game_.onload = function() {
    var createStartScene = function() {
      var scene = new Scene();
      scene.backgroundColor = '#fcc800';

      var startBackgroundImage = new Sprite(320, 480);
      startBackgroundImage.image = game_.assets[Config['startBackgroundImagePath']];
      startBackgroundImage.x = 0;
      startBackgroundImage.y = 0;
      scene.addChild(startBackgroundImage);

      var startTitleImage = new Sprite(236, 48);
      startTitleImage.image = game_.assets[Config['startTitleImagePath']];
      startTitleImage.x = 42;
      startTitleImage.y = 50;
      scene.addChild(startTitleImage);

      var description = createLabel('タッチするとゲームがはじまるよ', 180);
      scene.addChild(description);

      startBackgroundImage.addEventListener(Event.TOUCH_START, function(e) {
          game_.replaceScene(createGameScene());
      });

      return scene;
    };

    var createLabel = function(text, y) {
      var label = new Label(text);
      label.width = 320;
      label.textAlign = 'center';
      label.color = '#ffffff';
      label.x = 0;
      label.y = y || 284;
      label.font = '14px sans-serif';
      return label;
    };

    var createScoreLabel = function(scene) {
      var label = createLabel('正解数（せいかいすう）: ' + result['correctAnswer'], 200);
      scene.addChild(label);
      label = createLabel('走った距離（はしったきょり）: ' + result['distance'] + '㍍', 220);
      scene.addChild(label);
      label = createLabel('敵（てき）にぶつかった回数（かいすう）: ' + result['hitCount'] + '回', 240);
      scene.addChild(label);
    };

    var getBackgroundImagePath = function() {
      return Config['backgroundImagePaths'][result['backgroundLevel'] % Config['backgroundImagePaths'].length];
    };

    var updateBackgroundLevel = function() {
      if (result['distance'] > result['backgroundLevel'] * Config['backgroundNextLevelPoint']) {
        result['backgroundLevel'] += 1;
        result['backgroundLevel'] = result['backgroundLevel'] % Config['backgroundImagePaths'].length;
      }
    };

    var createGameScene = function() {
        var scroll = 0;

        var SCROLL_SPEED = 5;
        var BETWEEN_Q_A = 100;

        var scene = new Scene();
        scene.backgroundColor = '#8cc820';

        var bg1 = new Sprite(1280, 480);
        bg1.image = game_.assets[getBackgroundImagePath()];
        bg1.x = 0;
        bg1.y = 0;
        scene.addChild(bg1);

        var questionDataIndex = Math.floor(Math.random() * 10 % questionData.length);
        var selectedQuestionData = questionData[questionDataIndex];

        //問題イメージオブジェクト設定
       var question = new Sprite(92, 92);
       question.image = game_.assets['./images/' + selectedQuestionData["question"]];
       question.x = -question.width;
       question.y = 120;
       scene.addChild(question);

        var charactor = new Charactor(game_.assets[Config['charactorImagePath']]);
        scene.addChild(charactor);

        var charactorHit = new Sprite(1, 1);
        charactorHit.x = charactor.x + charactor.width / 2;
        charactorHit.y = charactor.y + charactor.height / 2;
        scene.addChild(charactorHit);

        var scoreLabel = new Label("");            // ラベルをつくる
        scoreLabel.color = '#fff';                 // 白色に設定
        scoreLabel.x = scene.wight / 2;
        scene.addChild(scoreLabel);                // シーンに追加

        //お邪魔キャラの設定
        var enemy = new Sprite(32, 32);          // スプライトをつくる
        enemy.image = game_.assets[Config['enemyImagePath']]; // 画像を設定
        enemy.x = -enemy.width;
        enemy.y = 50;
        scene.addChild(enemy);                    // シーンに追加

        //お邪魔キャラ当たり判定ウェイト用フラグ
        var wightFlg = new Boolean(false);
//        scene.addChild(wightFlg);

        var answers = [];
        for(var i = 0; i < 3; i++) {
        var answer = new Label(selectedQuestionData["answer" + (i + 1)]);
          answer.width = 100;
          answer.height = 32;
          answer.backgroundColor = '#000';
          answer.textAlign = 'center';
          answer.color = '#ffffff';
          answer.x = -answer.width;
          answer.y = 50 + (i * 100);
          answer.font = '14px sans-serif';
          if (selectedQuestionData['ans_number'] - 1 == i) {
            answer.correct = true;

          }
          else {
            answer.correct = false;
          }
          answers.push(answer);
          scene.addChild(answer);
        }

        scene.addEventListener(Event.ENTER_FRAME, function(){
        	
            scroll += SCROLL_SPEED;
            result['distance'] += SCROLL_SPEED;
            scoreLabel.text = scroll.toString()+'㍍走破'; // スコア表示を更新

            if (scroll == 350) {
              question.x = 350;
            }
            if (scroll == 840) {
              for(var i = 0; i < 3; i++) {
                answers[i].x = 850;
              }
            }

            question.x -= SCROLL_SPEED;
            for(var i = 0; i < 3; i++) {
              answers[i].x -= SCROLL_SPEED;
              if (answers[i].intersect(charactorHit)) {
                if (answers[i].correct) {
                  result['correctAnswer'] += 1
                  game_.pushScene(createCorrectAnswerScene(scroll));
                }
                else {
                  charactor.frame = 3;
                  game_.pushScene(createGameoverScene(scroll));
                }
              }
            }

            //お邪魔キャラ出現
            if( scroll % 400 === 0){
            enemy.x = 320;
            }
            if (enemy.x > -enemy.width) {
              enemy.x -= SCROLL_SPEED;
              if (enemy.intersect(charactorHit)) { // お邪魔キャラと自機がぶつかったとき
                  if(!wightFlg){
                    result['hitCount'] += 1;
                    wightFlg = true;
                  }
              }else{
                wightFlg = false;
              }
            }


            charactor.updateFrame();

            charactorHit.x = charactor.x + charactor.width/2;
            charactorHit.y = charactor.y + charactor.height/2;

            bg1.x -= SCROLL_SPEED;

            if (bg1.x <= -640) {
                bg1.x = 0;
            }
        });

        scene.addEventListener(Event.TOUCH_START, function(e){
          if (charactor.position == 0) {
            charactor.tl.moveTo(80, 50, 12);
          }
          else if (charactor.position == 1) {
            charactor.tl.moveTo(80, 150, 12);
          }
          else if (charactor.position == 2) {
            charactor.tl.moveTo(80, 250, 12);
          }
          charactor.position += 1;
          charactor.position = charactor.position % 3;
        });

        return scene;
    }

    var createCorrectAnswerScene = function(scroll) {
      var scene = new Scene();
      scene.backgroundColor = 'rgba(0, 0, 0, 0.5)';

      var correctAnswerImage = new Sprite(236, 48);
      correctAnswerImage.image = game_.assets[Config['correctAnswerImagePath']];
      correctAnswerImage.x = 42;
      correctAnswerImage.y = 50;
      scene.addChild(correctAnswerImage);

      updateBackgroundLevel();
      createScoreLabel(scene);

      var retryLabel = createLabel('もう一度（いちど）挑戦（ちょうせん）する', 284);
      scene.addChild(retryLabel);

      var buttonRetry = new Sprite(320, 32);
      buttonRetry.x = 0;
      buttonRetry.y = 284;
      scene.addChild(buttonRetry);

      buttonRetry.addEventListener(Event.TOUCH_END, function(){
        game_.popScene();
        game_.replaceScene(createGameScene());
      });

      return scene;
    };

    var createGameoverScene = function(scroll) {
      var scene = new Scene();
      scene.backgroundColor = 'rgba(0, 0, 0, 0.5)';

      var gameoverImage = new Sprite(189, 97);
      gameoverImage.image = game_.assets['./javascripts/enchant_js-0.8.3/images/gameover.png'];
      gameoverImage.x = 66;
      gameoverImage.y = 50;
      scene.addChild(gameoverImage);

      updateBackgroundLevel();
      createScoreLabel(scene);

      var retryLabel = createLabel('もう一度（いちど）挑戦（ちょうせん）する', 284);
      scene.addChild(retryLabel);

      var buttonRetry = new Sprite(320, 32);
      buttonRetry.x = 0;
      buttonRetry.y = 284;
      scene.addChild(buttonRetry);

      buttonRetry.addEventListener(Event.TOUCH_END, function(){
        game_.popScene();
        game_.replaceScene(createGameScene());
      });

      return scene;
    };

    game_.replaceScene(createStartScene());
  }

  game_.start();
}

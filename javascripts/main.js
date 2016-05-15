enchant();

window.onload = function() {
  var result = {
    'correctAnswer': 0,

    'incorrectAnswer': 0,

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
    Config['gameOverImagePath']
  ];
  Config['charactorImagePaths'].forEach(function(charactorImagePath) {
    imagePaths.push(charactorImagePath);
  });
  Config['enemyImagePaths'].forEach(function(enemyImagePath) {
    imagePaths.push(enemyImagePath);
  });
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

      var description1 = createLabel('説明：キャラクターが走るところをタッチで変(か)えて写真（しゃしん）と同（おな）じ文字（もじ）のところへキャラクターを走らせよう', 180);
      scene.addChild(description1);
      var description2 = createLabel('タッチするとゲームがはじまるよ', 250);
      scene.addChild(description2);

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
      var label = createLabel('正解数（せいかいすう）: ' + result['correctAnswer'], 180);
      scene.addChild(label);
      var label = createLabel('不正解数（ふせいかいすう）: ' + result['incorrectAnswer'], 200);
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

    var createEnemy = function(image) {
      var enemy = new Sprite(image.width, image.height);
      enemy.image = image;
      enemy.x = -enemy.width;
      enemy.y = [50, 150, 250][Math.floor(Math.random() * 10) % 3] - (image.height / 2);
      return enemy;
    };

    var getCharactorImagePath = function() {
      return Config['charactorImagePaths'][result['backgroundLevel'] % (Config['charactorImagePaths'].length)];
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

        var charactor = new Charactor(game_.assets[getCharactorImagePath()]);
        scene.addChild(charactor);

        var charactorHit = new Sprite(1, 1);
        charactorHit.x = charactor.x + charactor.width / 2;
        charactorHit.y = charactor.y + charactor.height / 2;
        scene.addChild(charactorHit);

        var scoreLabel = new Label("");            // ラベルをつくる
        scoreLabel.color = '#fff';                 // 白色に設定
        scoreLabel.x = scene.wight / 2;
        scene.addChild(scoreLabel);                // シーンに追加

        // お邪魔キャラの設定
        var enemies = [];
        for(var i = 0; i < (result['backgroundLevel'] + 1 * 5); i++) {
          var enemyImagePaths = Config['enemyImagePaths'][result['backgroundLevel'] % Config['enemyImagePaths'].length];
          var enemy = createEnemy(game_.assets[enemyImagePaths[i % enemyImagePaths.length]]);
          scene.addChild(enemy);
          enemies.push(enemy);
        }

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
                  result['incorrectAnswer'] += 1
                  game_.pushScene(createGameoverScene(scroll));
                }
              }
            }

            //お邪魔キャラ出現
            if (scroll == 50) {
              enemies.forEach(function(enemy, index) {
                enemy.x = game_.width + index * 200;
              });
            }

            enemies.forEach(function(enemy, index) {
              if (enemy.x > -enemy.width) {
                enemy.x -= SCROLL_SPEED;
                if (enemy.intersect(charactorHit)) { // お邪魔キャラと自機がぶつかったとき
                    if(!enemy.wightFlg){
                      result['hitCount'] += 1;
                      enemy.wightFlg = true;
                    }
                }else{
                  enemy.wightFlg = false;
                }
              }
            });

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

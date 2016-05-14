enchant();

window.onload = function() {
  var game_ = new Game(320, 320);
  game_.fps = 24;
  [
    Config['startImagePath'],
    Config['correctAnswerImagePath'],
    Config['gameOverImagePath'],
    Config['charactorImagePath'],
    Config['backgroundImagePath1'],
    Config['backgroundImagePath2'],
    './images/Q1.png'
  ].forEach(function(imagePath) {
   game_.preload(imagePath);
  });

  game_.onload = function() {
    var createStartScene = function() {
      var scene = new Scene();
      scene.backgroundColor = '#fcc800';

      var startImage = new Sprite(236, 48);
      startImage.image = game_.assets['./javascripts/enchant_js-0.8.3/images/start.png'];
      startImage.x = 42;
      startImage.y = 50;
      scene.addChild(startImage);
      
      // ステージ選択ラベル設定
      var selectStage1 = new Label('ステージA'); // ラベルを作る
      selectStage1.width = 320;
      selectStage1.textAlign = 'center';                 // 文字を中央寄せ
      selectStage1.color = '#ffffff';                    // 文字を白色に
      selectStage1.x = 0;                                // 横位置調整
      selectStage1.y = 222;                              // 縦位置調整
      selectStage1.font = '14px sans-serif';             // 28pxのゴシック体にする
      scene.addChild(selectStage1);                      // シーンに追加


      selectStage1.addEventListener(Event.TOUCH_START, function(e) {
          game_.replaceScene(createGameScene());
      });

      return scene;
    };

    var createGameScene = function() {
        var scroll = 0;

        var SCROLL_SPEED = 5;

        var scene = new Scene();
        scene.backgroundColor = '#8cc820';

        var bg1 = new Sprite(320, 320);
        bg1.image = game_.assets['./images/bg1.png'];
        bg1.x = 0;
        bg1.y = 0;
        scene.addChild(bg1);

        var bg2 = new Sprite(320, 320);
        bg2.image = game_.assets['./images/bg2.png'];
        bg2.x = 320;
        bg2.y = 0;
        scene.addChild(bg2);

        //問題イメージオブジェクト設定
       var question = new Sprite(92, 92);
       question.image = game_.assets['./images/' + questionData[0]["question"]];
       question.x = -question.width;
       question.y = 120;
       scene.addChild(question);

        var charactor = new Charactor(game_.assets['./javascripts/enchant_js-0.8.3/images/chara1.png']);
        scene.addChild(charactor);

        var charactorHit = new Sprite(1, 1);
        charactorHit.x = charactor.x + charactor.width / 2;
        charactorHit.y = charactor.y + charactor.height / 2;
        scene.addChild(charactorHit);

        var answers = [];
        for(var i = 0; i < 3; i++) {
        var answer = new Label(questionData[0]["answer" + (i + 1)]);
          answer.width = 100;
          answer.height = 32;
          answer.backgroundColor = '#000';
          answer.textAlign = 'center';
          answer.color = '#ffffff';
          answer.x = -answer.width;
          answer.y = 50 + (i * 100);
          answer.font = '14px sans-serif';
          if (questionData[0]['ans_number'] - 1 == i) {
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

            if (scroll % 640 === 0) {
              for(var i = 0; i < 3; i++) {
                answers[i].x = 320;
              }
            }

            for(var i = 0; i < 3; i++) {
              if (answers[i].x > -answers[i].width) {
                answers[i].x -= SCROLL_SPEED;
                if (answers[i].intersect(charactorHit)) {
                  if (answers[i].correct) {
                    game_.pushScene(createCorrectAnswerScene(scroll));
                  }
                  else {
                    charactor.frame = 3;
                    game_.pushScene(createGameoverScene(scroll));
                  }
                }
              }
            }
            
            if (scroll % 400 === 0) {
              question.x = 320;
            }
            if (question.x > -question.width) {
              question.x -= SCROLL_SPEED;
            }
            

            charactor.updateFrame();

            charactorHit.x = charactor.x + charactor.width/2;
            charactorHit.y = charactor.y + charactor.height/2;

            bg1.x -= SCROLL_SPEED;
            bg2.x -= SCROLL_SPEED;

            if (bg1.x <= -320) {
                bg1.x = 320;
            }
            if (bg2.x <= -320) {
                bg2.x = 320;
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

      var retryLabel = new Label('リトライ');
      retryLabel.width = 320;
      retryLabel.textAlign = 'center';
      retryLabel.color = '#ffffff';
      retryLabel.x = 0;
      retryLabel.y = 284;
      retryLabel.font = '24px sans-serif';
      scene.addChild(retryLabel);

      var buttonRetry = new Sprite(320, 32);
      buttonRetry.x = 0;
      buttonRetry.y = 284;
      scene.addChild(buttonRetry);

      buttonRetry.addEventListener(Event.TOUCH_END, function(){
        game_.popScene();
        game_.replaceScene(createStartScene());
      });

      return scene;
    };

    var createGameoverScene = function(scroll) {
      var scene = new Scene();
      scene.backgroundColor = 'rgba(0, 0, 0, 0.5)';

      var gameoverImage = new Sprite(189, 97);
      gameoverImage.image = game_.assets['./javascripts/enchant_js-0.8.3/images/gameover.png'];
      gameoverImage.x = 66;
      gameoverImage.y = 170;
      scene.addChild(gameoverImage);

      var retryLabel = new Label('リトライ');
      retryLabel.width = 320;
      retryLabel.textAlign = 'center';
      retryLabel.color = '#ffffff';
      retryLabel.x = 0;
      retryLabel.y = 284;
      retryLabel.font = '24px sans-serif';
      scene.addChild(retryLabel);

      var buttonRetry = new Sprite(320, 32);
      buttonRetry.x = 0;
      buttonRetry.y = 284;
      scene.addChild(buttonRetry);

      buttonRetry.addEventListener(Event.TOUCH_END, function(){
        game_.popScene();
        game_.replaceScene(createStartScene());
      });

      return scene;
    };

    game_.replaceScene(createStartScene());
  }

  game_.start();
}

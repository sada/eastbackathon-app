var Charactor = enchant.Class.create(enchant.Sprite, {
  initialize: function(image, type = 'bear') {
    enchant.Sprite.call(this, 32, 32);
    this.image = image;
    this.x = 80;
    this.y = 250 - this.height;
    this.type = type;
    if (type == 'bear') {
      this.frame = 0;
    }
    else if (type == 'whitebear') {
      this.frame = 5;
    }
    else if (type == 'female') {
      this.frame = 9;
    }
  },

  updateFrame: function() {
    this.frame ++;
    if (this.type == 'bear') {
      if (this.frame > 2) {
        this.frame = 0;
      }
    }
    else if (this.type == 'whitebear') {
      if (this.frame > 7) {
        this.frame = 5;
      }
    }
    else if (this.type == 'female') {
      if (this.frame > 11) {
        this.frame = 9;
      }
    }
  },

  dead: function() {
    if (this.type == 'bear') {
      this.frame = 3;
    }
    else if (this.type == 'whitebear') {
      this.frame = 8;
    }
    else if (this.type == 'female') {
      this.frame = 12;
    }
  }
});

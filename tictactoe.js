
(function() {
  $(function() {
    var Tic;
    Tic = {
      data: {
        turns: 0,
        x: {},
        o: {},
        gameOver: false
      },
      initialize: function() {
        this.data.gameOver = false;
        this.setPlayerNames();
        this.retrieveStats();
        this.assignRoles();
        this.prepareBoard();
        this.updateNotifications();
        return this.addListeners();
      },
      setPlayerNames: function() {
        this.data.player1 = $("input[name='pl-1']").val();
        return this.data.player2 = $("input[name='pl-2']").val();
      },
      retrieveStats: function() {
        this.data.p1stats = localStorage[this.data.player1] || {
          wins: 0,
          loses: 0
        };
        if (typeof this.data.p1stats === "string") {
          this.data.p1stats = JSON.parse(this.data.p1stats);
        }
        this.data.p2stats = localStorage[this.data.player2] || {
          wins: 0,
          loses: 0
        };
        if (typeof this.data.p2stats === "string") {
          return this.data.p2stats = JSON.parse(this.data.p2stats);
        }
      },
      getPlayerName: function(symbol) {
        var name;
        name = this.data.rolep1 === symbol ? this.data.player1 : this.data.player2;
        return name;
      },
      prepareBoard: function() {
        var i, results, square;
        $("form").hide();
        $("#board").empty();
        $(".alerts").removeClass("welcome").show();
        $(".alerts").text((this.getPlayerName("X")) + " Goes First");
        results = [];
        for (square = i = 0; i <= 8; square = ++i) {
          results.push($("<div>", {
            "class": "square"
          }).appendTo("#board"));
        }
        return results;
      },
      assignRoles: function() {
        var roles;
        roles = ["X", "O"].sort(function() {
          return 0.5 - Math.random();
        });
        this.data.rolep1 = roles[0];
        return this.data.rolep2 = roles[1];
      },
      updateNotifications: function() {
        $(".notifications").empty().show();
        this.addNotification(this.data.player1 + " is playing " + this.data.rolep1);
        this.addNotification(this.data.player2 + " is playing " + this.data.rolep2);
        this.addNotification(this.data.player1 + " has " + this.data.p1stats.wins + " wins and " + this.data.p1stats.loses + " loses");
        return this.addNotification(this.data.player2 + " has " + this.data.p2stats.wins + " wins and " + this.data.p2stats.loses + " loses");
      },
      addNotification: function(msg) {
        return $(".notifications").append($("<p>", {
          text: msg
        }));
      },
      addListeners: function() {
        return $(".square").click(function() {
          if (Tic.data.gameOver === false && !$(this).text().length) {
            if (Tic.data.turns % 2 === 0) {
              $(this).html("X").addClass("x moved");
            } else if (Tic.data.turns % 2 !== 0) {
              $(this).html("O").addClass("o moved");
            }
            Tic.data.turns++;
            Tic.checkEnd();
            if (Tic.data.gameOver !== true && $(".moved").length >= 9) {
              return Tic.addToScore("none");
            }
          }
        });
      },
      checkEnd: function() {
        var col, column, diagonal, diagonals, end, i, j, k, l, len, len1, middle, ref, ref1, results, row, start;
        this.data.x = {};
        this.data.o = {};
        diagonals = [[0, 4, 8], [2, 4, 6]];
        for (i = 0, len = diagonals.length; i < len; i++) {
          diagonal = diagonals[i];
          for (j = 0, len1 = diagonal.length; j < len1; j++) {
            col = diagonal[j];
            this.checkField(col, 'diagonal');
          }
          this.checkWin();
          this.emptyStorageVar('diagonal');
        }
        results = [];
        for (row = k = 0; k <= 2; row = ++k) {
          start = row * 3;
          end = (row * 3) + 2;
          middle = (row * 3) + 1;
          this.checkField(start, 'start');
          this.checkField(middle, 'middle');
          this.checkField(end, 'end');
          this.checkWin();
          for (column = l = ref = start, ref1 = end; ref <= ref1 ? l <= ref1 : l >= ref1; column = ref <= ref1 ? ++l : --l) {
            this.checkField(column, 'horizontal');
          }
          this.checkWin();
          results.push(this.emptyStorageVar('horizontal'));
        }
        return results;
      },
      checkField: function(field, storageVar) {
        if ($(".square").eq(field).hasClass("x")) {
          if (this.data.x[storageVar] != null) {
            return this.data.x[storageVar]++;
          } else {
            return this.data.x[storageVar] = 1;
          }
        } else if ($(".square").eq(field).hasClass("o")) {
          if (this.data.o[storageVar] != null) {
            return this.data.o[storageVar]++;
          } else {
            return this.data.o[storageVar] = 1;
          }
        }
      },
      checkWin: function() {
        var key, ref, ref1, results, value;
        ref = this.data.x;
        for (key in ref) {
          value = ref[key];
          if (value >= 3) {
            localStorage.x++;
            this.showAlert((this.getPlayerName("X")) + " wins");
            this.data.gameOver = true;
            this.addToScore("X");
          }
        }
        ref1 = this.data.o;
        results = [];
        for (key in ref1) {
          value = ref1[key];
          if (value >= 3) {
            localStorage.o++;
            this.showAlert((this.getPlayerName("O")) + " wins");
            this.data.gameOver = true;
            results.push(this.addToScore("O"));
          } else {
            results.push(void 0);
          }
        }
        return results;
      },
      addToScore: function(winningParty) {
        this.data.turns = 0;
        this.data.x = {};
        this.data.o = {};
        this.data.gameOver = true;
        if (winningParty === "none") {
          this.showAlert("TIE!!!!!");
        } else {
          if (this.data.rolep1 === winningParty) {
            ++this.data.p1stats.wins;
          } else {
            ++this.data.p1stats.loses;
          }
          if (this.data.rolep2 === winningParty) {
            ++this.data.p2stats.wins;
          } else {
            ++this.data.p2stats.loses;
          }
          localStorage[this.data.player1] = JSON.stringify(this.data.p1stats);
          localStorage[this.data.player2] = JSON.stringify(this.data.p2stats);
        }
        this.updateNotifications();
        return $(".notifications").append("<a class='play-again'>Play Again?</a>");
      },
      emptyStorageVar: function(storageVar) {
        this.data.x[storageVar] = null;
        return this.data.o[storageVar] = null;
      },
      showAlert: function(msg) {
        return $(".alerts").text(msg).slideDown();
      }
    };
    $("form").on("submit", function(evt) {
      var $inputs, namesIndentical, namesNotEntered;
      evt.preventDefault();
      $inputs = $("input[type='text']");
      namesNotEntered = $inputs.filter(function() {
        return this.value.trim() !== "";
      }).length !== 2;
      namesIndentical = $inputs[0].value === $inputs[1].value;
      if (namesNotEntered) {
        return Tic.showAlert("Player names cannot be empty");
      } else if (namesIndentical) {
        return Tic.showAlert("Player names cannot be identical");
      } else {
        return Tic.initialize();
      }
    });
    return $("body").on("click", ".play-again", function() {
      return Tic.initialize();
    });
  });

}).call(this);
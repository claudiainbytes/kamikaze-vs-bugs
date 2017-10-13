Kamikaze Vs. Bugs
===============================

The purpose of this project is customize a classic frogger arcade game according to the lessons that I learned about Javascript Intermediate in Udacity Front-End Nanodegree Program.

![alt kamikazevsbugs](https://github.com/claudiainbytes/kamikaze-vs-bugs/blob/master/about/screenshot.png)

## Functionality

In this game you have a Player and Enemies (Bugs). The goal of the player is to reach the water, without colliding into any one of the enemies.

The player can move left, right, up and down. The enemies move in varying speeds on the paved block portion of the scene.

The player must confront rocks as obstacles so, he cannot move next to any rock.

Once a the player collides with an enemy, the game is reset and the player moves back to the start square.

The player has three chances to play, if the player loses his lifes, the game shows a message that says "Game Over, to play again press Enter".

Once the player reaches the water the level changes, showing obstacles and gems randomly across the road surface. Also the score increases, if the player reach the water or pick gems.

The game has a finite number of levels, in which level defines the number of obstacles and the number of gems.

If the player has completed all levels, the game shows a message that says "Congratulations, to play again press Enter".

When the player press ENTER, a new game is initialized.

Additionaly, the game offers a dashboard in the button of the canvas area.

 - **Star**: Indicates the score of the game.
 - **Heart**: Indicates the chances to play.
 - **Rocket**: Indicates the level of the game.

## How to install

Clone this game in your local machine, go into the folder, and open index.html to play:
```
  git clone https://github.com/claudiainbytes/kamikaze-vs-bugs

```

## More info how to get started in Canvas 2D Games

[Frogger Game: Getting Started](https://docs.google.com/document/d/1v01aScPjSWCCWQLIpFqvg3-vXLH2e8_SZQKC8jNO0Dc/pub?embedded=true).

[Making Sprite based Games with Canvas](http://jlongster.com/Making-Sprite-based-Games-with-Canvas)
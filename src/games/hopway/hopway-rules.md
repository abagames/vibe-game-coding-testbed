# Hopway Game Rules

## Objective

The player controls a character ('P') and must safely cross multiple lanes of a busy highway to reach the top safe zone on the other side, earning points for each successful crossing.

## Gameplay

- The game screen is divided into several sections:

  - **Bottom Safe Zone:** The player's starting area.
  - **Bottom Half Traffic Lanes:** Cars ('#') move from left to right at varying speeds.
  - **Center Median Strip:** Two rows that act as a safe zone where the player can rest.
  - **Top Half Traffic Lanes:** Cars ('#') move from right to left at varying speeds.
  - **Top Safe Zone:** The player's goal for each crossing.

- All safe zones (top, bottom, and median) are marked with a '=' character, but are colored differently (green for top/bottom, yellow for the median).
- The player starts at the bottom safe zone.
- The player must navigate their character one cell at a time across the lanes of traffic, avoiding collisions with cars.
- After successfully reaching the top safe zone, the player is reset to the bottom safe zone to attempt another crossing.

### Car Behavior

- Cars ('#') move at speeds determined by `minCarSpeed` and `maxCarSpeed` settings.
- **Slow Cars (Trucks):** The game can be configured to spawn slow-moving trucks ('T'). When a truck appears, a regular car is often spawned immediately behind it, creating a potential traffic disruption. This feature is off by default.
- **Car Following:** Cars attempt to maintain a minimum distance (`minCarFollowingDistance`) from the car directly in front of them in the same lane, slowing down if necessary.
- **Lane Changing:**
  - If a car is significantly slowed by traffic ahead, it may attempt to change to an adjacent valid lane (up or down).
  - Before changing, a car will signal its intent by displaying a turn signal ('^' for up, 'v' for down) for a short duration (`LANE_CHANGE_SIGNAL_DURATION_TICKS`).
  - A lane change is only executed if the target lane is clear enough.
  - After a lane change attempt, there's a cooldown (`LANE_CHANGE_COOLDOWN_TICKS`) before another can be initiated.
- **Spawning and Despawning:**
  - Cars that drive off the screen are removed.
  - New cars are spawned at regular intervals from the entry edges of lanes.

## Special Road Events

The game features several random events that temporarily alter traffic conditions, adding variety and challenge.

- **Traffic Jams:**

  - For a short period, the game drastically increases the probability of slow-moving trucks ('T') appearing, which in turn causes more cars to spawn behind them.
  - This leads to heavy congestion and makes crossing significantly more difficult.

- **Broken Down Vehicle:**

  - **Description:** A car ('B') suddenly stops in a lane with hazard lights (e.g., blinking character/color).
  - **Effect:** Becomes a temporary static obstacle. AI cars change lanes or stop, causing congestion.

- **Road Construction / Lane Closures:**

  - **Description:** One or more lanes are temporarily closed (e.g., cones 'A').
  - **Effect:** Cars merge, increasing density and slowdowns. Closed lanes become obstacles.
  - **Variation:** Could be a moving construction zone.

- **Emergency Vehicle Passage:**

  - An emergency vehicle ('E') appears in a random lane, moving at a special speed.
  - Other AI cars in the same lane will attempt to slow down and move out of its way, creating dynamic changes in traffic patterns.
  - The player must also avoid the emergency vehicle.

- **AI Car Collisions (Accidents):**

  - Two or more AI cars might collide due to specific conditions (e.g., sudden stops, failed lane changes in dense traffic, or as part of a scripted event).
  - Collided cars become temporary static obstacles on the road for a duration.
  - May cause secondary traffic jams as other cars navigate around the accident.

- **Wrong-Way Driver:**

  - **Description:** A rogue car ('W') appears, driving at high speed against the normal flow of traffic in its lane.
  - **Effect:** Presents a sudden and highly dangerous obstacle. Other AI cars do not react to the wrong-way driver, leading to potential chaos. The event includes a flashing "!! WRONG WAY !!" warning at the top of the screen.
  - **Trigger:** This is a rare, random event.

- **Sudden Debris / Obstacles:**

  - **Description:** An object suddenly appears in a lane (e.g., lost tire 'O', fallen box 'B').
  - **Effect:** Acts as a small, temporary static obstacle. Cars might swerve or slow down/stop.
  - **Trigger:** A "clumsy" cargo truck could drop debris.

- **Weather Conditions (Visual/Minor Gameplay Impact):**

  - **Description:** Rain ('`') or Fog ('~').
  - **Effect (Rain):** Slightly reduces car speeds/increases follow distance. Visual effects.
  - **Effect (Fog):** Reduces AI car "visibility" (slower reaction). Player visibility might be obscured.

- **Speed Traps / Police Presence:**

  - **Description:** A police car ('P') parks nearby.
  - **Effect:** Adjacent AI cars might temporarily slow to "legal speeds," causing bunching.

- **Escorting a VIP / Slow-Moving Procession:**

  - **Description:** A group of cars moves very slowly in one or more lanes, perhaps with "escort" cars ('E').
  - **Effect:** Creates a slow, wide obstacle, significantly impacting traffic flow.

- **Oil Slick / Slippery Patch:**

  - **Description:** A patch of road becomes slippery (visual cue, e.g., different background tile or ':').
  - **Effect:** AI cars might briefly swerve or alter speed. Player frog movement could also be affected.

- **Rush Hour:**

  - **Description:** Timed event with significantly increased car density and more aggressive AI car behavior.
  - **Effect:** Greatly increases general difficulty and chaos for a short period.

- **Animal Crossing:**

  - **Description:** An animal (e.g., Deer 'D', Turtle 't') attempts to cross lanes.
  - **Effect:** Deer might be fast/erratic, turtles slow. AI cars might react. Adds unpredictable obstacles.

- **Power Outage / Dark Zone:**
  - **Description:** A section of the road temporarily becomes "dark."
  - **Effect:** Car characters in this zone are not drawn or drawn faintly. Player perception challenge.

## Controls

- **Movement:** Arrow Keys or WASD.
- **Restart Game:** 'R' key (when game is over).

## Scoring

- **Successful Crossing:** +100 points each time the player reaches the top safe zone.
- **High Score:** The game tracks the highest score achieved.

## Game Over

- If the player's character ('P') collides with a car ('#') or an obstacle.
- The player has a set number of lives (typically 3).
- Each collision results in losing a life.
- If a collision occurs and the player still has lives remaining, the player is reset to the starting position in the bottom safe zone.
- The game ends completely when the player runs out of lives.

// A damped spring gives pointer interaction inertia without storing frame history.
export function createAttractor() {
  const position = [-10000, -10000],
    velocity = [0, 0];
  let target = [...position],
    desired = 0,
    strength = 0;
  return {
    position,
    velocity,
    get strength() {
      return strength;
    },
    move(x, y, immediate = false) {
      if (position[0] < -9000 || immediate) {
        position[0] = x;
        position[1] = y;
        velocity.fill(0);
      }
      target = [x, y];
      desired = 1;
      if (immediate) strength = 1;
    },
    release(immediate = false) {
      desired = 0;
      if (immediate) {
        strength = 0;
        velocity.fill(0);
      }
    },
    update(dt) {
      strength += (desired - strength) * (1 - Math.exp(-dt * 4));
      for (let axis = 0; axis < 2; axis++) {
        velocity[axis] +=
          ((target[axis] - position[axis]) * 38 - velocity[axis] * 11) * dt;
        velocity[axis] = Math.max(-1400, Math.min(1400, velocity[axis]));
        position[axis] += velocity[axis] * dt;
      }
    },
  };
}

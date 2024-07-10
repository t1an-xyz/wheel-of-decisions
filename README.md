# Wheel of Decisions
A website where you can spin the wheel to pick between options.

This website was built using HTML, CSS, and JavaScript. The wheel was made by animating a JavaScript canvas. Decisions are made by selecting a random angle between $10\pi$ and $12\pi$ using a uniform distribution, thus ensuring that each option has an equal likelihood of being chosen.

On each frame, which occurs around 60 Hz, while the angular velocity is less than $6\pi \ rad/s$ or (3 Hz), a constant angular acceleration of $0.01/60\ rad/s^2$ is applied. The wheel then spins at a constant $6\pi\ rad/s$ until the randomly-decided stopping point is reached, at which point a constant decceleration of $-0.0005/60\ rad/s^2$ is applied until the velocity reaches 0.

To determine which option was selected, the following equation is used

$$ -1\times\frac{\left(displacement - \frac{slice\ angle}{2}\right)\mathrm{mod}\ 2\pi}{slice\ angle}+length\ of\ choices-1 $$

First, we mut subtract $\frac{slice\ angle}{2}$ to account for the distance between the center of the slice and the edges. We take the modulus with $2\pi$ to limit the function to $[0, 2\pi)$. We then divide by the slice angle to get an index, we which we then must reverse to get the option the wheel has landed on.
## Next Steps
- [ ] Implement option weights, which would let you make some options more likely than others
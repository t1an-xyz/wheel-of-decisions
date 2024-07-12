# Wheel of Decisions
A website where you can spin the wheel to pick between options.

This website was built using HTML, CSS, and JavaScript. The wheel was made by animating a JavaScript canvas. Decisions are made by selecting a random angle between $10\pi$ and $12\pi$ using a uniform distribution, thus ensuring that each option has an equal likelihood of being chosen.

On each frame, which occurs around 60 Hz, while the angular velocity is less than $6\pi \ rad/s$ or (3 Hz), a constant angular acceleration of $0.6\ rad/s^2$ is applied. The wheel then spins at a constant $6\pi\ rad/s$ until the randomly-decided stopping point is reached, at which point a constant decceleration of $-0.03\ rad/s^2$ is applied until the velocity reaches 0.

Weights were implemented by first taking the sum of total weights, than distributing the angles using the formula $\frac{weight}{total\ weight}\times 2\pi$. To determine which option was landed on, the offset value (which is between $0$ and $2\pi$) is compared to the intervals stored in the `choices` array.

Confetti was added using the [js-confetti](https://github.com/loonywizard/js-confetti) package.

Sound obtained from [jsfxr](https://sfxr.me/#34T6Pkyi2uuow5EkMFwPekkMihkpm8Rii4gNc3C7f44KzCtHjTvbcDnkTfdGPPGymo5mPvEELm24oLafWCck3CXtTHqwGgESTP1r7fJ55zmdcXHZYnFQmCvfR)
## Next Steps
- [X] Implement option weights, which would let you make some options more likely than others

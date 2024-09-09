Contribute
==========

Any pull request will be apreciated. You can start coding on this project following this steps :
 + Fork the project
 + Clone your repository
 + run ```npm install```
 + run ```npm start``` in the main folder to launch a development webserver.
 + Enjoy the rythm.

Adding new dance type
---------

In v2.2.x adding a new dance type is pretty easy
+ Create a new file in `src\dances`
+ This file must export your custom dance type function
+ This file must export a reset function

For example, here is the content of `jump.js file`

```js
/* The function signature is :
 * @elem: The HTML element target you want to apply your effect to
 * @value: The current pulse ratio (percentage between 0 and 1)
 * @options: The option object user can give as last argument of addRythm function
 */
export default (elem, value, options = {}) => {
  const max = options.max || 30
  const min = options.min || 0
  const jump = (max - min) * value
  elem.style.transform = `translateY(${-jump}px)`
}

/* The reset function signature is :
 * @elem: The element to reset
 */
export const reset = elem => {
  elem.style.transform = ''
}
```
+ Import it and register it into the constructor of `Dancer.js` file
```js
import jump, { reset as resetJump } from './dances/jump.js'
class Dancer {
  constructor() {
    this.registerDance('jump', jump, resetJump)
  }
}
```

+ Commit it and create a PR. Then look at everyone enjoying your contribution :) !

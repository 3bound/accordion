## Description

Generate an animated accordion from a set of HTML header elements and associated panels.

## Usage

HTML

    <ul>
      <li>
        <div class="js-header" data-header-id="1">Header 1</div>
        <div class="panel js-panel" data-panel-id="1">Contents 1</div>
      </li>
      <li>
        <div class="js-header" data-header-id="2">Header 2</div>
        <div class="panel js-panel" data-panel-id="2">Contents 2</div>
      </li>
      <li>
        <div class="js-header" data-header-id="3">Header 3</div>
        <div class="panel js-panel" data-panel-id="3">Contents 3</div>
      </li>
    </ul>

CSS

    .panel {
      display:none;
      overflow:hidden;
    }

JS

    const accordion = require('accordion');

    accordion('js-header')('js-panel')('data-header-id')('data-panel-id')(300);

## Dependencies

[Velocity.js](http://velocityjs.org/)\
[Ramda](https://ramdajs.com/)\
[Folktale](https://folktale.origamitower.com/)\
[funTools](https://github.com/3bound/funTools)

## License

MIT

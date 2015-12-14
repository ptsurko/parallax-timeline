
(function($) {
  'use strict';
  //TODO: Review Bootstrap 4 JS code for styling and organization.
  var TIMELINE_DATA = 'timeline';

  function Timeline(element, options) {
      this.element_ = element;
      this.progressDoneElement_ = this.element_.getElementsByClassName('timeline__progress-done')[0];
      // Expose defaults object to be public
      this.options_ = extend({
        offsetBottom: 100
      }, options);

      this.animationRequestId_ = null;
      this.doneProgress_ = 0;
      this.init_();
  }

  Timeline.prototype.init_ = function() {
    this.animationRequestId_ = window.requestAnimationFrame(
        this.animateTimeline_.bind(this));
  };

  Timeline.prototype.animateTimeline_ = function() {
    var timelineTop = this.element_.offsetTop;
    var windowHeight = window.innerHeight;
    var windowScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var offsetBottom = this.options_.offsetBottom;
    var progress = windowHeight + windowScrollTop - timelineTop - offsetBottom;

    if (this.doneProgress_ != progress) {
      var modifications = [];

      var anchorElements = this.element_.querySelectorAll('.timeline__anchor');
      Array.prototype.forEach.call(anchorElements, function(anchorEl){
        var anchorParentEl = anchorEl.parentElement;
        var anchorTop = hasClass(anchorEl, 'timeline__anchor--first') ?
            0 : anchorEl.offsetTop - anchorEl.offsetHeight / 2;
        var anchorOffset = windowHeight + windowScrollTop -
            (offset(anchorParentEl).top + anchorTop);

        if (anchorOffset > offsetBottom) {
          if (!hasClass(anchorEl, 'timeline__anchor--done')) {
            modifications.push(function() {
              addClass(anchorEl, 'timeline__anchor--done');
              addClass(anchorParentEl, 'timeline__row--animate');
            });
          }
        } else if (hasClass(anchorEl, 'timeline__anchor--done')) {
          modifications.push(function() {
            removeClass(anchorEl, 'timeline__anchor--done');
            removeClass(anchorParentEl, 'timeline__row--animate');
          });
        }
      });

      this.doneProgress_ = progress;
      this.progressDoneElement_.style.height = progress + 'px';
      modifications.forEach(function(modification) {
        modification();
      });
    }

    this.animationRequestId_ = window.requestAnimationFrame(
        this.animateTimeline_.bind(this));
  };

  Timeline.prototype.destroy = function() {
    window.cancelAnimationFrame(this.animationRequestId_);
    this.element_ = null;
  };

  function hasClass(element, className) {
    if (element.classList) {
      return element.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
    }
  }

  function addClass(element, className) {
    if (element.classList) {
      element.classList.add(className);
    } else {
      element.className += ' ' + className;
    }
  }

  function removeClass(element, className) {
    if (element.classList) {
      element.classList.remove(className);
    } else {
      element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  }

  function offset(element) {
    var rect = element.getBoundingClientRect();
    return {
      top: rect.top + (document.body.scrollTop || document.documentElement.scrollTop),
      left: rect.left + (document.body.scrollLeft || document.documentElement.scrollLeft)
    };
  }

  function extend(out) {
    out = out || {};

    for (var i = 1; i < arguments.length; i++) {
      if (!arguments[i])
        continue;

      for (var key in arguments[i]) {
        if (arguments[i].hasOwnProperty(key))
          out[key] = arguments[i][key];
      }
    }

    return out;
  };

  /**
   *
   * @return {!jQuery} jQuery object.
   */
  $.fn.timeline = function(options) {
    return this.each(function() {
      var data = $(this).data(TIMELINE_DATA);

      if (!data) {
        data = new Timeline($(this)[0], options);
        $(this).data(TIMELINE_DATA, data);
      }
    });
  };
})(jQuery);

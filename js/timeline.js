
(function($) {
  'use strict';

  var TIMELINE_DATA = 'timeline';

  function Timeline(element, options) {
      this.element_ = element;
      // Expose defaults object to be public
      this.options_ = $.extend({
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
    var timelineTop = this.element_.offset().top;
    var windowHeight = $(window).height();
    var windowScrollTop = $(window).scrollTop();
    var offsetBottom = this.options_.offsetBottom;
    var progress = windowHeight + windowScrollTop - timelineTop - offsetBottom;

    if (this.doneProgress_ != progress) {
      var modifications = [];
      $('.timeline__anchor', this.element_).each(function() {
        var anchorEl = $(this);
        var anchorTop = anchorEl.hasClass('timeline__anchor--first') ?
            0 : anchorEl.position().top;
        var anchorParentEl = anchorEl.parent();
        var currentOffset = windowHeight + windowScrollTop -
            (anchorParentEl.offset().top + anchorTop);

        if (currentOffset > offsetBottom) {
          if (!anchorEl.hasClass('timeline__anchor--done')) {
            modifications.push(function() {
              anchorEl.addClass('timeline__anchor--done');
              anchorParentEl.addClass('timeline__row--animate');
            });
          }
        } else if (anchorEl.hasClass('timeline__anchor--done')) {
          modifications.push(function() {
            anchorEl.removeClass('timeline__anchor--done');
            anchorParentEl.removeClass('timeline__row--animate');
          });
        }
      });
      this.doneProgress_ = progress;
      $('.timeline__progress-done', this.element_).height(progress);
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

  /**
   *
   * @return {!jQuery} jQuery object.
   */
  $.fn.timeline = function(options) {
    return this.each(function() {
      var data = $(this).data(TIMELINE_DATA);

      if (!data) {
        data = new Timeline($(this), options);
        $(this).data(TIMELINE_DATA, data);
      }
    });
  };
})(jQuery);

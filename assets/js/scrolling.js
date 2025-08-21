(function($) {
    "use strict";
    $(document).ready(function() {
        // Scroll back to top progress indicator
        var $progressPath = $('.progress-wrap path');
        var pathLength = $progressPath[0].getTotalLength();

        $progressPath.css({
            'transition': 'none',
            'stroke-dasharray': pathLength + ' ' + pathLength,
            'stroke-dashoffset': pathLength
        });

        // force reflow
        $progressPath[0].getBoundingClientRect();

        $progressPath.css({
            'transition': 'stroke-dashoffset 10ms linear'
        });

        function updateProgress() {
            var scroll = $(window).scrollTop();
            var height = $(document).height() - $(window).height();
            var progress = pathLength - (scroll * pathLength / height);
            $progressPath.css('stroke-dashoffset', progress);
        }

        updateProgress();
        $(window).on('scroll', updateProgress);

        var offset = 50;
        var duration = 550;

        $(window).on('scroll', function() {
            if ($(this).scrollTop() > offset) {
                $('.progress-wrap').addClass('active-progress');
            } else {
                $('.progress-wrap').removeClass('active-progress');
            }
        });

        $('.progress-wrap').on('click', function(event) {
            event.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, duration);
            return false;
        });
    });
})(jQuery);
/* main.js --- Own tweaks for Project 1
  Commentary:
     It uses JQuery 2.x

 Code:
 */

// Thanks to http://aleembawany.com/2009/01/20/disable-selction-on-menu-items-with-this-jquery-extension/
jQuery.fn.extend({
    disableSelection : function() {
        return this.each(function() {
            this.onselectstart = function() { return false; };
            this.unselectable = "on";
            jQuery(this).css('user-select', 'none');
            jQuery(this).css('-o-user-select', 'none');
            jQuery(this).css('-moz-user-select', 'none');
            jQuery(this).css('-khtml-user-select', 'none');
            jQuery(this).css('-webkit-user-select', 'none');
        });
    }
});

// Don't show "In Progress" when loading
$('.disabled picture').addClass('visible');

$('.disabled').disableSelection();
// Disable focus by tab on disabled elements
$('.disabled > a').attr('tabindex', '-1');

// Polyfill for IE9 that remove pointer events on disabled elements
$(document).ready(function(){
    PointerEventsPolyfill.initialize({});
});

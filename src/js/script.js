/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
    timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
    timezoneClip = /[^-+\dA-Z]/g,
    pad = function (val, len) {
      val = String(val);
      len = len || 2;
      while (val.length < len) val = "0" + val;
      return val;
    };

  // Regexes and supporting functions are cached through closure
  return function (date, mask, utc) {
    var dF = dateFormat;

    // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
    if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
      mask = date;
      date = undefined;
    }

    // Passing date through Date applies Date.parse, if necessary
    date = date ? new Date(date) : new Date;
    if (isNaN(date)) throw SyntaxError("invalid date");

    mask = String(dF.masks[mask] || mask || dF.masks["default"]);

    // Allow setting the utc argument via the mask
    if (mask.slice(0, 4) == "UTC:") {
      mask = mask.slice(4);
      utc = true;
    }

    var _ = utc ? "getUTC" : "get",
      d = date[_ + "Date"](),
      D = date[_ + "Day"](),
      m = date[_ + "Month"](),
      y = date[_ + "FullYear"](),
      H = date[_ + "Hours"](),
      M = date[_ + "Minutes"](),
      s = date[_ + "Seconds"](),
      L = date[_ + "Milliseconds"](),
      o = utc ? 0 : date.getTimezoneOffset(),
      flags = {
        d:    d,
        dd:   pad(d),
        ddd:  dF.i18n.dayNames[D],
        dddd: dF.i18n.dayNames[D + 7],
        m:    m + 1,
        mm:   pad(m + 1),
        mmm:  dF.i18n.monthNames[m],
        mmmm: dF.i18n.monthNames[m + 12],
        yy:   String(y).slice(2),
        yyyy: y,
        h:    H % 12 || 12,
        hh:   pad(H % 12 || 12),
        H:    H,
        HH:   pad(H),
        M:    M,
        MM:   pad(M),
        s:    s,
        ss:   pad(s),
        l:    pad(L, 3),
        L:    pad(L > 99 ? Math.round(L / 10) : L),
        t:    H < 12 ? "a"  : "p",
        tt:   H < 12 ? "am" : "pm",
        T:    H < 12 ? "A"  : "P",
        TT:   H < 12 ? "AM" : "PM",
        Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
        o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
        S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
      };

    return mask.replace(token, function ($0) {
      return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
    });
  };
}();

// Some common format strings
dateFormat.masks = {
  "default":      "ddd mmm dd yyyy HH:MM:ss",
  shortDate:      "m/d/yy",
  mediumDate:     "mmm d, yyyy",
  longDate:       "mmmm d, yyyy",
  fullDate:       "dddd, mmmm d, yyyy",
  shortTime:      "h:MM TT",
  mediumTime:     "h:MM:ss TT",
  longTime:       "h:MM:ss TT Z",
  isoDate:        "yyyy-mm-dd",
  isoTime:        "HH:MM:ss",
  isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
  dayNames: [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  monthNames: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
  return dateFormat(this, mask, utc);
};

function eventCache() {
  function renderEvent(event) {
    var time = new Date(event.time).format("h:MM TT"),
        date = new Date(event.time).format("dddd, mmmm dS, yyyy"),
        venue = event.venue;

    if(event.name !== null) {
      if(venue !== null) {
        $('#next-meetup .meetup').html('<h3><a href="' + event.event_url + '">' + event.name + '</a></h3><p class="meetup-deets">' + time + '<br />' + date + '<br />' + '<a href="http://google.ca/maps?q=' + venue.name + "+"+ venue.address_1 + '">' + venue.name + ', ' + venue.address_1 + '</a></p>').fadeIn();
        $('#next-meetup .meetup').after('<a class="sign-up btn btn-chevron" href="' + event.event_url + '">Sign Up Now</a>');
      } else {
        $('#next-meetup .meetup').html('<h3><a href="' + event.event_url + '">' + event.name + '</a></h3><p class="meetup-deets">' + time + '<br />' + date + '</p>').fadeIn();
        $('#next-meetup .meetup').after('<a class="sign-up btn btn-chevron" href="' + event.event_url + '">Sign Up Now</a>');
      }
    }
  }
  function isCacheValid(c){
    var nowDate = new Date();
    var cacheDate = new Date(c);
    if((nowDate-cacheDate) >= 86400000) {
      return false;
    }
    return true;
  }

  if(typeof(Storage)!=="undefined") {
    if(localStorage.event && isCacheValid(localStorage.eventCacheDate)) {
      renderEvent(JSON.parse(localStorage.event));
    } else {
      $.getJSON("http://api.meetup.com/2/events?status=upcoming&_=1340331595000&order=time&group_urlname=secrethandshake&desc=false&offset=0&format=json&page=1&fields=&sig_id=11518245&sig=842ec88019c16dae46ccc7e01ff55a11aae99ad9&callback=?", function(data){
        localStorage.event = JSON.stringify(data.results[0]);
        localStorage.eventCacheDate = new Date();
        renderEvent(JSON.parse(localStorage.event));
      });
    }
  } else {
    $.getJSON("http://api.meetup.com/2/events?status=upcoming&_=1340331595000&order=time&group_urlname=secrethandshake&desc=false&offset=0&format=json&page=1&fields=&sig_id=11518245&sig=842ec88019c16dae46ccc7e01ff55a11aae99ad9&callback=?", function(data){
      renderEvent(data.results[0]);
    });
  }
}

function Testimonials(interval, fadeDuration) {
  var self = this;

  self.quotes = [
    {
      quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ipsum justo, eget condimentum nulla mollis sagittis.",
      author: "Laura Collins",
      title: "Web Designer"
    },
    {
      quote: "Atqui reperies, inquit, in hoc quidem pertinacem.",
      author: "Ann Campbell",
      title: "Illustrator"
    },
    {
      quote: "Vestibulum vitae ullamcorper turpis, vitae euismod turpis. Suspendisse interdum nibh in ipsum euismod, et feugiat ante convallis.",
      author: "Daniel Bradley",
      title: "Photographer"
    },
    {
      quote: "Etiam dictum sagittis magna aliquet suscipit.",
      author: "Douglas Reed",
      title: "Graphic Artist"
    }
  ];

  self.current = 0;
  self.totalQuotes = self.quotes.length;

  self.showQuote = function(index) {
    $('#testimonials blockquote').fadeOut(fadeDuration, function() {
      $('#testimonials .quote').text('"' + self.quotes[index].quote + '"');
      $('#testimonials .author').text(self.quotes[index].author);

      $('#testimonials blockquote').fadeIn(fadeDuration);
    });
  };

  self.nextQuote = function() {
    self.current++;

    // Reset to 0
    if (self.current > self.totalQuotes - 1) {
      self.current = 0;
    }

    self.showQuote(self.current);
  };

  // Show the first quote
  self.showQuote(0);

  // Cycle through the quotes based on interval
  setInterval(function() {
    self.nextQuote();
  }, interval);
}

$.fn.parallax = function(e) {
  var self = this,
      event = event || window.event,
      mouse = {
        x: Math.floor(event.pageX),
        y: Math.floor(event.pageY)
      },
      translation = {
        x: -34 + (mouse.x * -0.02),
        y: -34 + (mouse.y * -0.02) 
      };

  $(self).css({
    "-webkit-transform": "translate3d(" + translation.x + "px," + translation.y + "px,0px)",
    "-moz-transform":    "translate3d(" + translation.x + "px," + translation.y + "px,0px)",
    "transform":         "translate3d(" + translation.x + "px," + translation.y + "px,0px)"
  });
};


$(document).ready(function(){
  eventCache();

  var pcw = $('.photos-content').width() / $('.photos-bg').width();

  $('.photos-content').on('scroll', function(){
    var sl = $(this).scrollLeft() * -pcw;
    $('.photos-bg').css("left", "" + sl + "px");
  });

  var one = "hello", two = "secrethandshake", three = "@", four = "mail";
  // $('#goodwork .next .col12').append('<a class="button button-signup" href="' + four + 'to:'+one+three+two+'.ca" title="Sign Up Now">Sign Up Now</a>');
  $('#main-footer .social').append('<li><a href="' + four + 'to:'+one+three+two+'.ca" title="Email Secret Handshake">Email</a></li>');

  // Create new instance of testimonials
  var t = new Testimonials(6000, 400);
});

$(window).on("mousemove", function() {
  if ($(this).width() >= 1200) {
    $("#hero #hero-stripes").parallax();
  }
});